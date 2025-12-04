"use client"

import { useEffect } from "react"

interface ArchiveLogProps {
  isOpen: boolean
  onClose: () => void
  history: string[]
}

export function ArchiveLog({ isOpen, onClose, history }: ArchiveLogProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#1a1d24] border-4 border-amber-500 shadow-[0_0_30px_rgba(251,191,36,0.2)] relative flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="bg-amber-500 p-2 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-[#0f1014] font-bold text-lg tracking-widest uppercase">Archive_Record // LOGS</h2>
          <button
            onClick={onClose}
            className="bg-[#0f1014] text-amber-500 px-2 hover:bg-amber-600 hover:text-[#0f1014] transition-colors font-bold"
          >
            [X]
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto text-amber-500 font-mono flex-1">
          <div className="border-b border-amber-500/30 pb-4 mb-4">
            <p className="text-sm text-amber-500/70 mb-2">{"> ACCESSING DECRYPTION LOGS..."}</p>
            <p className="text-sm text-amber-500/70">{"> TOTAL ENTRIES: " + history.length}</p>
          </div>

          {history.length === 0 ? (
            <div className="text-amber-500/40 italic text-center py-8">
              {"> NO DATA FOUND."}
              <br />
              {"> SYSTEM AWAITING INPUT."}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-[auto_1fr] gap-4 text-sm text-amber-500/50 border-b border-amber-500/20 pb-2 mb-2 font-bold">
                <span>ID</span>
                <span>DATA_STRING</span>
              </div>
              {history.map((word, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[auto_1fr] gap-4 hover:bg-amber-500/10 p-1 transition-colors items-center group"
                >
                  <span className="text-amber-500/60 font-mono">{String(idx + 1).padStart(2, "0")}</span>
                  <span className="font-bold tracking-[0.2em] text-glow-amber group-hover:text-amber-400">{word}</span>
                </div>
              ))}
            </div>
          )}

          <div className="text-xs text-amber-500/40 border-t border-amber-500/30 pt-4 mt-8">END OF RECORD</div>
        </div>
      </div>
    </div>
  )
}
