interface CellData {
  letter: string
  state: "correct" | "present" | "absent" | "empty"
}

interface GameGridProps {
  boardNumber: number
  board: CellData[][]
  currentGuess: string
  currentRow: number
  isSolved: boolean
  maxGuesses: number
  wordLength: number
}

export function GameGrid({
  boardNumber,
  board,
  currentGuess,
  currentRow,
  isSolved,
  maxGuesses,
  wordLength,
}: GameGridProps) {
  return (
    <div className="relative w-fit mx-auto">
      {/* Node header */}
      <div className="bg-[#1a1d24] border-2 border-amber-500 p-2 mb-2 flex items-center justify-between">
        <span className="text-amber-500 text-sm font-bold tracking-wider">
          {`NODE_${boardNumber.toString().padStart(2, "0")}`}
        </span>
        {isSolved && <span className="text-green-400 text-glow-green text-xs font-bold">{"[ LOCKED ]"}</span>}
      </div>

      {/* Grid container */}
      <div
        className={`relative p-3 md:p-4 bg-[#252932] border-8 border-[#1a1d24] shadow-[inset_0_0_20px_rgba(0,0,0,0.8),0_0_0_1px_#374151] ${isSolved ? "opacity-50" : ""}`}
      >
        {/* Screws for the chassis */}
        <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-[#0f1014] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center">
          <div className="w-full h-[1px] bg-[#374151] rotate-45 transform" />
          <div className="absolute w-full h-[1px] bg-[#374151] -rotate-45 transform" />
        </div>
        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#0f1014] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center">
          <div className="w-full h-[1px] bg-[#374151] rotate-45 transform" />
          <div className="absolute w-full h-[1px] bg-[#374151] -rotate-45 transform" />
        </div>
        <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-[#0f1014] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center">
          <div className="w-full h-[1px] bg-[#374151] rotate-45 transform" />
          <div className="absolute w-full h-[1px] bg-[#374151] -rotate-45 transform" />
        </div>
        <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-[#0f1014] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center">
          <div className="w-full h-[1px] bg-[#374151] rotate-45 transform" />
          <div className="absolute w-full h-[1px] bg-[#374151] -rotate-45 transform" />
        </div>

        <div className="grid gap-1">
          {board.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-1 justify-center">
              {row.map((cell, cellIdx) => {
                const isCurrentRow = rowIdx === currentRow
                const currentLetter = isCurrentRow && cellIdx < currentGuess.length ? currentGuess[cellIdx] : ""
                const displayLetter = cell.letter || currentLetter

                // Only animate if the cell has a state (meaning it was submitted) and is not the current typing row
                const isSubmittedRow = rowIdx < currentRow || isSolved
                // Calculate delay: 200ms per cell
                const animationDelay = isSubmittedRow && cell.state !== "empty" ? `${cellIdx * 200}ms` : "0ms"
                const shouldAnimate = isSubmittedRow && cell.state !== "empty"

                const isCursor =
                  !isSolved && isCurrentRow && cellIdx === currentGuess.length && currentGuess.length < wordLength

                return (
                  <div
                    key={cellIdx}
                    style={{ animationDelay }}
                    className={`
                      w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 flex items-center justify-center
                      font-bold text-lg md:text-xl border-2 font-mono relative
                      ${shouldAnimate ? "animate-scan-cell" : ""}
                      ${cell.state === "correct" ? "bg-green-900/20 border-green-400 text-green-400 text-glow-green border-glow-green" : ""}
                      ${cell.state === "present" ? "bg-amber-900/20 border-amber-500 text-amber-500 text-glow-amber border-glow-amber" : ""}
                      ${cell.state === "absent" ? "bg-gray-800/30 border-gray-600 text-gray-500" : ""}
                      ${cell.state === "empty" && !displayLetter ? "bg-[#0f1014] border-gray-700" : ""}
                      ${cell.state === "empty" && displayLetter ? "bg-[#0f1014] border-gray-600 text-gray-300" : ""}
                      transition-all duration-150
                    `}
                  >
                    {displayLetter.toUpperCase()}
                    {isCursor && <div className="absolute inset-0 bg-amber-500/60 animate-pulse pointer-events-none" />}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Solved overlay */}
      {isSolved && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-[#0f1014]/80 border-4 border-green-400 px-6 py-3">
            <span className="text-green-400 text-glow-green font-bold text-xl">{"[ LOCKED ]"}</span>
          </div>
        </div>
      )}
    </div>
  )
}
