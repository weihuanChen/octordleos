"use client"

import { useEffect, useState } from "react"

interface TacticalModuleProps {
  isOpen: boolean
  onClose: () => void
  onExecute: (words: string[]) => void
}

const PROTOCOLS = [
  {
    id: "ALPHA",
    name: "PROTOCOL_ALPHA (BALANCED)",
    sequence: ["STARE", "DOILY", "PUNCH"],
    description: "Standard decryption pattern. Optimized for vowel coverage.",
  },
  {
    id: "BETA",
    name: "PROTOCOL_BETA (AGGRESSIVE)",
    sequence: ["EARLS", "DIGHT", "POUNC", "WYNS"],
    description: "High-velocity consonant sweep. Maximum data throughput.",
  },
]

export function TacticalModule({ isOpen, onClose, onExecute }: TacticalModuleProps) {
  const [activeProtocol, setActiveProtocol] = useState<string | null>(null)

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
      <div className="w-full max-w-2xl bg-[#1a1d24] border-4 border-amber-500 shadow-[0_0_30px_rgba(251,191,36,0.2)] relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-amber-500 p-2 flex items-center justify-between">
          <h2 className="text-[#0f1014] font-bold text-lg tracking-widest">TACTICAL_DATABASE // v2.4</h2>
          <button
            onClick={onClose}
            className="bg-[#0f1014] text-amber-500 px-2 hover:bg-amber-600 hover:text-[#0f1014] transition-colors font-bold"
          >
            [X]
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto text-amber-500 font-mono space-y-8">
          <div className="border-b border-amber-500/30 pb-4">
            <p className="text-sm text-amber-500/70 mb-2">{"> ACCESSING STRATEGY GUIDE..."}</p>
            <p className="text-sm text-amber-500/70">{"> SELECT OPTIMAL OPENING SEQUENCE:"}</p>
          </div>

          <div className="space-y-6">
            {PROTOCOLS.map((protocol) => (
              <div
                key={protocol.id}
                className="group border border-amber-500/30 p-4 hover:bg-amber-500/5 transition-colors relative"
              >
                <div className="absolute top-0 right-0 bg-amber-500/20 text-xs px-2 py-1 text-amber-500">
                  ID: {protocol.id}
                </div>
                <h3 className="text-xl font-bold text-glow-amber mb-2">{protocol.name}</h3>
                <p className="text-sm text-amber-500/60 mb-4 max-w-md">{protocol.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {protocol.sequence.map((word, idx) => (
                    <span key={idx} className="bg-[#0f1014] border border-amber-500/50 px-2 py-1 text-amber-400">
                      {word}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => onExecute(protocol.sequence)}
                  className="flex items-center gap-2 bg-amber-500/10 border border-amber-500 px-4 py-2 hover:bg-amber-500 hover:text-[#0f1014] transition-all active:translate-y-1 w-full md:w-auto justify-center group-hover:shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                >
                  <span className="animate-pulse mr-2">▶</span>[ EXECUTE_PROTOCOL ]
                </button>
              </div>
            ))}
          </div>

          <div className="text-xs text-amber-500/40 border-t border-amber-500/30 pt-4">
            WARNING: AUTOMATED ENTRY MAY TRIGGER SECURITY ALERTS. USE WITH CAUTION.
          </div>
        </div>
      </div>
    </div>
  )
}
