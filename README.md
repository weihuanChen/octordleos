## OctordleOS

**Language**: **[English](./README.md)** | **[简体中文](./README.zh-CN.md)**

---

### Overview

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

### Project Structure

Key game‑related modules:

- `app/page.tsx`: main OctordleOS page and game logic (state, keyboard handling, boot animation, result modal).
- `components/game-grid.tsx`: single board component (cells, rows, animations, lock overlay).
- `components/keyboard.tsx`: bottom control‑deck virtual keyboard, dispatching `onKeyPress`.
- `components/tactical-module.tsx`: tactical protocol modal (sequences, execute button).
- `components/archive-log.tsx`: history panel for submitted guesses.
- `hooks/use-sound-effects.ts`: encapsulated sound effects (click, error, success, boot, win, data input/process).
- `puzzles_data/import_d1.json`: local dictionary (fields like `word`, `length`, `is_common`) used as fallback puzzle source.
- `puzzles_data/DICTIONARY_TABLE.md`: schema design for dictionary and daily puzzle tables.

---

### Local Development

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

### Cloudflare Integration

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

---

### Contributing

- Ideas around:
  - Game feel (input pacing, animation timing, sounds)
  - New tactical protocols (opening word sequences)
  - UI / animation polish (more CRT flavor, themes)
  - New variants (Quordle, Blind, etc.)
  are all welcome via issues / PRs.

- When adding or changing features:
  - Prefer putting UI in `components/` and keep the **terminal OS aesthetic** consistent (colors, borders, fonts).
  - Reuse `hooks/use-sound-effects.ts` instead of managing audio directly in components.
  - If you change puzzle logic or data shapes, please also update `puzzles_data/DICTIONARY_TABLE.md`.

---

### License

(Add your project License here if needed.)


