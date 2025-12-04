## OctordleOS

OctordleOS 是一个带有 **复古终端 / CRT 仿真风格** 的 Octordle（一次解 8 个 5 字母英文单词）网页版小游戏，基于 **Next.js App Router** 构建，并通过 **Cloudflare Worker** 提供每日谜题数据。

- **在线预览**：[`https://octordle.cc`](https://octordle.cc)
- **技术栈**：Next.js 16（App Router）、React、TypeScript、Tailwind CSS、Cloudflare Workers

---

## 游戏规则 & 风格说明

- **核心玩法**
  - 一局中你需要同时猜出 **8 个 5 字母英文单词**。
  - 共有 **13 次猜测机会**（比 Wordle 多，符合 Octordle 玩法）。
  - 每次输入的同一个单词，会同时提交到 8 个棋盘上。
  - 单元格颜色含义：
    - 绿色：该字母在正确位置（`correct`）
    - 黄色：该字母存在于答案中但在错误位置（`present`）
    - 灰色：该字母不在答案中（`absent`）

- **界面风格**
  - 整体 UI 模拟老式 **操作系统控制台 / 机房终端**：
    - 启动时有 **BOOT_LOGS 启动自检** 动画（`> SYSTEM BOOT...` 等日志滚动）。
    - 背景叠加 `scanlines`、`noise`、过热时的 **红色叠加闪烁** 效果。
    - 每个词盘是一个 `NODE_01 ~ NODE_08` 的独立终端模块，锁定后显示 `[ LOCKED ]`。
    - 底部为带标签的 `[ CONTROL DECK ]` 屏幕键盘。
  - 游戏结束时会弹出结果面板：
    - 全部 8 盘解出：显示 `MISSION_LOG`、绿色圆形校验图标、成功日志。
    - 未全部解出：显示 `SYSTEM_FAILURE`、警告图标和错误日志。

- **战术模块（Tactical Module）**
  - 通过右上角/移动端按钮 `[ LOAD_TACTICS ]` 打开。
  - 内置若干 **起手策略协议**，例如：
    - `PROTOCOL_ALPHA (BALANCED)`：`["STARE", "DOILY", "PUNCH"]`
    - `PROTOCOL_BETA (AGGRESSIVE)`：`["EARLS", "DIGHT", "POUNC", "WYNS"]`
  - 点击 `[ EXECUTE_PROTOCOL ]` 会自动以高速键入这些单词并提交，适合作为多盘开局探测。

- **档案日志（Archive Log）**
  - 通过 `[ LOGS ]` 按钮查看本局所有提交过的单词历史，用于分析自己的解题路径。

---

## 项目结构概览

主要目录与文件（仅列出与游戏相关的部分）：

- `app/page.tsx`：OctordleOS 主页面和游戏逻辑入口（状态管理、键盘监听、Boot 动画、结果弹窗等）。
- `components/game-grid.tsx`：单个棋盘组件（显示格子、行列、动画及锁定遮罩）。
- `components/keyboard.tsx`：底部控制台样式虚拟键盘，负责调用 `onKeyPress`。
- `components/tactical-module.tsx`：战术协议弹窗组件（策略序列、执行按钮）。
- `components/archive-log.tsx`：提交历史记录面板。
- `hooks/use-sound-effects.ts`：各种点击 / 错误 / 胜利 / 启动等音效封装。
- `puzzles_data/import_d1.json`：本地字典数据（含 `word`, `length`, `is_common` 等字段），在 Worker 不可用时作为谜题兜底来源。
- `puzzles_data/DICTIONARY_TABLE.md`：字典与每日谜题表的数据库结构设计文档。

---

## 本地开发

### 环境要求

- Node.js（建议 20+）
- npm（使用仓库自带的 `package-lock.json`）

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

浏览器打开 `http://localhost:3000` 即可看到 OctordleOS。

---

## 游戏实现细节

### 核心常量与数据源

- 每局固定：
  - `WORD_LENGTH = 5`
  - `PUZZLE_SIZE = 8`（8 个并行棋盘）
  - `MAX_GUESSES = 13`
- 谜题来源优先级：
  1. 当环境变量中存在 `WORKER_URL` / `NEXT_PUBLIC_WORKER_URL` 时：
     - 客户端会请求：`<WORKER_URL>/game/daily?variant=octordle&date=YYYY-MM-DD`
     - 返回数据结构约定为：
       - `{"solution": ["APPLE", "GHOST", ...]}`（至少 8 个 5 字母单词）
  2. 当 Worker 不可用或返回异常时：
     - 从 `import_d1.json` 中按 `is_common === 1 && length === 5` 过滤出常用词，并随机抽取 8 个作为当日答案。

### 输入 & 判定逻辑简述

- 玩家输入通过两种方式触发：
  - 物理键盘监听：`window.addEventListener("keydown", ...)`。
  - 屏幕键盘组件 `Keyboard` 的 `onKeyPress` 回调。
- 输入流程：
  - 字母键：在所有未锁定的棋盘当前行追加该字母。
  - `BACKSPACE`：删除所有未锁定棋盘当前行最后一个字母。
  - `ENTER`：
    - 若当前行长度不足 5：触发错误音效 + 短暂“故障抖动”效果。
    - 若长度满足：对每个未锁定棋盘，将当前单词与对应答案对比：
      - 首先标记位置完全相同的字母为 `correct`。
      - 然后再根据剩余字母标记 `present` / `absent`。
    - 维护全局键盘的 `keyStates`（字母最高优先级状态：`correct` > `present` > `absent`）。
    - 若某个棋盘的当前行等于其答案，则将该棋盘标记为已解锁。

- 结束判定：
  - 当：
    - 8 个棋盘全部被标记为已解锁，**或**
    - 所有棋盘的行数都已用尽（已解或已用完 13 行）
  - 触发 `gameOver = true`，并打开结果面板：
    - 全部解出 → `gameWon = true`，播放胜利音效。
    - 否则 → 显示系统失败提示。

### 过热 & 系统状态表现

- 通过 `currentRows` 和 `solvedBoards` 计算：
  - 剩余总机会 `guessesRemaining` 与未解出的棋盘数量 `unsolvedCount`。
  - 当 `guessesRemaining <= 2` 且 `unsolvedCount >= 4` 时视为过热状态：
    - 顶部状态显示 `WARNING: SYSTEM OVERHEAT`，闪烁红色条。
    - 页面叠加红色闪烁遮罩，营造“系统告急”的紧张感。

### 战术队列执行

- 战术模块会将要执行的若干单词加入 `tacticalQueue`。
- `useEffect` 监听该队列：
  - 若当前不在处理状态且谜题已加载完成，则逐个取出单词：
    - 以极短的延时依次“自动输入”到所有未解锁棋盘。
    - 构造 `guessesToSubmit` 提交给统一的 `processGuessSubmission`。
    - 使用专门的数据处理音效来和普通提交音效区分。

---

## Cloudflare 部署说明

本项目前端为 Next.js 应用，结合 Cloudflare Worker 提供的每日谜题 API 使用。下面是一个推荐的部署流程示意：

### 1. 准备 Cloudflare 环境

1. 安装 Wrangler CLI：

```bash
npm install -g wrangler
```

2. 登录 Cloudflare：

```bash
wrangler login
```

3. 根据仓库中 `wrangler.jsonc` 的配置（例如 Worker 名称、路由等）确认 / 调整你的命名空间。

> 详细的 Worker 逻辑与路由结构请结合你自己的 Workers 代码仓库；本项目只依赖一个暴露 `/game/daily` 接口的 Worker。

### 2. 部署每日谜题 Worker（示意）

Worker 需实现类似下面的接口约定：

- 路径：`/game/daily`
- 查询参数：
  - `variant=octordle`
  - `date=YYYY-MM-DD`
- 响应示例：

```json
{
  "solution": ["APPLE", "GHOST", "WORLD", "TRACE", "POINT", "SHIFT", "CABLE", "NODES"]
}
```

可以参考 `puzzles_data/DICTIONARY_TABLE.md` 中的建表 SQL，为 Worker 提供底层的字典与每日谜题数据源。

### 3. 配置前端环境变量

在 Next.js 项目根目录创建 `.env.local`（不要提交到 Git）：

```bash
NEXT_PUBLIC_WORKER_URL="https://your-worker.your-subdomain.workers.dev"
```

应用中会自动通过：

- `process.env.NEXT_PUBLIC_WORKER_URL`
- 或回退到 `process.env.WORKER_URL`

来拼接请求地址：`<WORKER_URL>/game/daily?variant=octordle&date=YYYY-MM-DD`。

### 4. 构建并部署前端

1. 本地构建：

```bash
npm run build
```

2. 使用你偏好的方式部署 Next.js 前端（例如 Cloudflare Pages, Vercel, 传统 Node 主机等），只要前端能访问上一步配置的 `WORKER_URL` 即可。

当部署完成并将 DNS 指向对应服务后，即可通过：

- `https://octordle.cc`

访问线上版本。

---

## 贡献 & 开发建议

- 任何关于：
  - 游戏手感（输入节奏、动画时长、声音）
  - 新战术协议（更多开局单词组合）
  - UI / 动效（例如增加更多 CRT 效果、主题皮肤）
  - 新变体玩法（如 Quordle / Blind 模式）
的想法都欢迎在 Issue / PR 中提出。

- 推荐的开发流程：
  - 修改或新增组件时，优先放在 `components/` 下，并保持 **终端风格一致性**（色板、边框、字体）。
  - 尝试复用 `hooks/use-sound-effects.ts` 中的音效封装，避免在组件中直接管理 Audio 对象。
  - 若调整谜题逻辑或数据结构，请同步更新 `puzzles_data/DICTIONARY_TABLE.md` 方便后续 Worker 和 Agent 协作。

---

## 许可证

（如有需要，请在此处补充项目的 License 信息。）

---

## English Overview

### OctordleOS

OctordleOS is a **retro terminal / CRT–styled** Octordle web game where you try to solve **8 different 5‑letter English words at once**.  
It is built with **Next.js App Router**, **React**, **TypeScript**, and styled with Tailwind CSS. Daily puzzles are served via a **Cloudflare Worker API**.

- **Live Preview**: [`https://octordle.cc`](https://octordle.cc)  
- **Stack**: Next.js 16 (App Router), React, TypeScript, Tailwind CSS, Cloudflare Workers

---

### Gameplay & Style

- **Core rules**
  - You play on **8 boards in parallel**, each hiding a different 5‑letter word.
  - You have **13 guesses** in total, shared across all boards (Octordle‑style).
  - Each guess is a single 5‑letter word and is applied to all unsolved boards.
  - Tile colors:
    - Green: letter is in the correct position (`correct`)
    - Yellow: letter exists in the solution but in a different position (`present`)
    - Gray: letter is not in the word (`absent`)

- **Visual style**
  - The UI mimics an old **control room / OS console**:
    - Boot sequence with **system logs** like `> SYSTEM BOOT...`, CRT noise and scanlines.
    - Each board is a `NODE_01 ~ NODE_08` module; solved nodes show `[ LOCKED ]`.
    - A fixed bottom `[ CONTROL DECK ]` with a virtual keyboard for input.
  - End‑of‑game panel:
    - All 8 words solved → `MISSION_LOG` with green success visuals and logs.
    - Otherwise → `SYSTEM_FAILURE` with warning icon and failure logs.

- **Tactical Module**
  - Opened via `[ LOAD_TACTICS ]` / `[ TACTICS ]` button.
  - Ships with a few built‑in **opening protocols**, e.g.:
    - `PROTOCOL_ALPHA (BALANCED)`: `["STARE", "DOILY", "PUNCH"]`
    - `PROTOCOL_BETA (AGGRESSIVE)`: `["EARLS", "DIGHT", "POUNC", "WYNS"]`
  - Clicking `[ EXECUTE_PROTOCOL ]` will auto‑type and submit those words in sequence, useful as high‑coverage openers.

- **Archive Log**
  - The `[ LOGS ]` button opens an archive of all submitted guesses in the current run, so you can review your solving path.

---

### Implementation Highlights

- **Core constants**
  - `WORD_LENGTH = 5`
  - `PUZZLE_SIZE = 8` (8 parallel boards)
  - `MAX_GUESSES = 13`

- **Puzzle sources**
  1. If `WORKER_URL` or `NEXT_PUBLIC_WORKER_URL` is defined:
     - The client fetches:  
       `GET <WORKER_URL>/game/daily?variant=octordle&date=YYYY-MM-DD`
     - Expected response:

       ```json
       {
         "solution": ["APPLE", "GHOST", "WORLD", "TRACE", "..."]
       }
       ```

  2. If the worker is unreachable/invalid:
     - The app falls back to `puzzles_data/import_d1.json`, filtering entries with `is_common === 1` and `length === 5`, then randomly picking 8 words.

- **Input & judging**
  - Input comes from:
    - Physical keyboard (`keydown` listener).
    - On‑screen `Keyboard` component via `onKeyPress`.
  - Logic:
    - Letter keys append to all unsolved boards’ current row.
    - `BACKSPACE` removes the last letter from all unsolved boards’ current row.
    - `ENTER` submits the current word:
      - If the word is shorter than 5 letters: play error sound + glitch effect.
      - Otherwise:
        - Compare each letter to the solution for that board (first pass for exact matches, second pass for present/absent).
        - Update per‑board cells and global keyboard `keyStates`.
        - Mark the board as solved when the row equals its solution.
  - Game is over when:
    - All boards are solved, or
    - All boards have either been solved or used up all 13 rows.

- **Overheat state**
  - The UI computes:
    - `guessesRemaining` (max used row across boards vs `MAX_GUESSES`).
    - `unsolvedCount` (boards not yet solved).
  - If `guessesRemaining <= 2` and `unsolvedCount >= 4`, the system enters an “overheat” mode:
    - Header displays `WARNING: SYSTEM OVERHEAT`.
    - A red pulsing overlay is rendered on top of the screen.

- **Tactical queue**
  - Tactical words selected in the module are queued in `tacticalQueue`.
  - A `useEffect` processes the queue:
    - Auto‑types each word across all unsolved boards with short delays.
    - Submits via a shared `processGuessSubmission(..., true)` function, using a distinct “data process” sound.

---

### Local Development (English)

- **Requirements**
  - Node.js (20+ recommended)
  - npm (use the provided `package-lock.json`)

- **Install dependencies**

  ```bash
  npm install
  ```

- **Start dev server**

  ```bash
  npm run dev
  ```

  Visit `http://localhost:3000` in your browser.

---

### Cloudflare Integration (English)

The app expects a Cloudflare Worker that exposes a `/game/daily` endpoint:

- Example contract:
  - Path: `/game/daily`
  - Query:
    - `variant=octordle`
    - `date=YYYY-MM-DD`
  - Response:

    ```json
    {
      "solution": ["APPLE", "GHOST", "WORLD", "TRACE", "POINT", "SHIFT", "CABLE", "NODES"]
    }
    ```

Configure your worker according to `wrangler.jsonc` (name, routes, etc.), then set the frontend env var:

```bash
NEXT_PUBLIC_WORKER_URL="https://your-worker.your-subdomain.workers.dev"
```

The Next.js app will use `NEXT_PUBLIC_WORKER_URL` (or fallback `WORKER_URL`) to build the daily‑game request URL.

