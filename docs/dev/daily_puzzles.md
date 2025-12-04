## Daily Puzzles Functions

```javascript
// 前端代码示例
async function getDailyPuzzle(userLocalTime) {
  // userLocalTime 格式: "2025-11-27"
  const response = await fetch(`https://your-worker.workers.dev/game/daily?variant=octordle&date=${userLocalTime}`);
  
  if (!response.ok) {
     // 处理错误，比如加载备用题目
     console.error("Failed to load puzzle");
     return;
  }
  
  const data = await response.json();
  console.log(data.solution); // -> ["APPLE", "GHOST", ...]
}

```