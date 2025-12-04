"use client"

type LetterState = "correct" | "present" | "absent" | "empty"

interface KeyboardProps {
  onKeyPress: (key: string) => void
  keyStates: Record<string, LetterState>
}

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
]

export function Keyboard({ onKeyPress, keyStates }: KeyboardProps) {
  const getKeyClassName = (key: string) => {
    const state = keyStates[key]
    const baseClasses = `
      px-3 py-4 font-bold text-sm font-mono border-2 border-b-4
      transition-all duration-100 active:translate-y-1 active:border-b-0
      cursor-pointer select-none
    `

    if (state === "correct") {
      return `${baseClasses} bg-green-900/40 border-green-400 text-green-400 text-glow-green border-glow-green`
    }
    if (state === "present") {
      return `${baseClasses} bg-amber-900/40 border-amber-500 text-amber-500 text-glow-amber border-glow-amber`
    }
    if (state === "absent") {
      return `${baseClasses} bg-gray-800/30 border-gray-700 text-gray-600 opacity-50`
    }
    return `${baseClasses} bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700`
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a1d24] border-t-4 border-amber-500 p-4 shadow-inner">
      <div className="max-w-3xl mx-auto">
        {/* Control deck label */}
        <div className="text-center mb-3">
          <span className="text-amber-500 text-sm font-bold tracking-wider">{"[ CONTROL DECK ]"}</span>
        </div>

        {/* Keyboard rows */}
        <div className="space-y-2">
          {KEYBOARD_ROWS.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-1 justify-center">
              {row.map((key) => {
                const isSpecial = key === "ENTER" || key === "BACKSPACE"
                return (
                  <button
                    key={key}
                    onClick={() => onKeyPress(key)}
                    className={`
                      ${getKeyClassName(key)}
                      ${isSpecial ? "px-4 md:px-6" : "w-8 md:w-10"}
                    `}
                  >
                    {key === "BACKSPACE" ? "⌫" : key}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
