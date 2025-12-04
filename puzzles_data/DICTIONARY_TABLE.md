```node
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

### 设置机密环境变量
AUTH_KEY=your_secret_key

### 字典表

```sql
-- 创建字典表
CREATE TABLE IF NOT EXISTS dictionary (
    word TEXT PRIMARY KEY,
    length INTEGER,             -- 5, 6, 7...
    is_common BOOLEAN DEFAULT 0, -- 1=常用词(做谜底), 0=仅做猜测词
    difficulty TEXT,            -- 'normal', 'hard'
    tags TEXT                   -- JSON 或逗号分隔: 'food,tech' (方便 Agent 选题)
);

-- 建立索引以便加速 Agent 筛选 (例如: 选出 5 个字母的常用词)
CREATE INDEX idx_dict_filter ON dictionary(length, is_common);

-- 创建每日谜题表
CREATE TABLE IF NOT EXISTS daily_puzzles (
    date TEXT,                  -- 例如 '2025-11-24'
    variant_id TEXT,            -- 核心区分字段：'classic', 'quordle', 'octordle', 'blind'
    puzzle_data TEXT,           -- JSON 字符串。
                                -- Classic 存: '["APPLE"]'
                                -- Octordle 存: '["APPLE", "GHOST", ... 8个词]'
    difficulty TEXT,            -- 'normal', 'hard'
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    
    -- 设置联合主键：确保"同一天"的"同一个游戏"只有一条记录
    PRIMARY KEY (date, variant_id)
);


```