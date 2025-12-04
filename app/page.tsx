"use client"

import Link from "next/link"
import { useState, useEffect, memo } from "react"
import { GameGrid } from "@/components/game-grid"
import { Keyboard } from "@/components/keyboard"
import { TacticalModule } from "@/components/tactical-module"
import { ArchiveLog } from "@/components/archive-log"
import { Footer } from "@/components/footer"
import { useSoundEffects } from "@/hooks/use-sound-effects"
import fallbackDictionary from "@/puzzles_data/import_d1.json"

const BOOT_LOGS = [
  "> SYSTEM BOOT...",
  "> CHECKING MEMORY INTEGRITY...",
  "> LOADING DICTIONARY MODULE (15KB)...",
  "> CONNECTING TO NODE 1-8...",
  "> CALIBRATING CRT DISPLAY...",
  "> ESTABLISHING SECURE CONNECTION...",
  "> READY.",
]

const ScrewHead = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`opacity-70 ${className}`}
  >
    <circle cx="12" cy="12" r="10" fill="#1a1d24" stroke="#374151" strokeWidth="2" />
    <path d="M8 12H16" stroke="#52525b" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 8L12 16" stroke="#52525b" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const MAX_GUESSES = 13 // Increased max guesses from 6 to 13 as requested for Octordle rules
const WORD_LENGTH = 5
const PUZZLE_SIZE = 8
const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL ?? process.env.WORKER_URL

type LetterState = "correct" | "present" | "absent" | "empty"

interface CellData {
  letter: string
  state: LetterState
}

interface DictionaryEntry {
  word: string
  length: number
  is_common: number
}

interface WorkerPuzzleResponse {
  solution?: string[]
}

const FALLBACK_COMMON_WORDS = (fallbackDictionary as DictionaryEntry[])
  .filter((entry) => entry.is_common === 1 && entry.length === WORD_LENGTH)
  .map((entry) => entry.word.toUpperCase())

const getLocalDateString = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const getRandomFallbackSolutions = (count = PUZZLE_SIZE) => {
  const pool = [...FALLBACK_COMMON_WORDS]

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }

  return pool.slice(0, count)
}

const normalizeWorkerSolutions = (solutions?: string[]) => {
  if (!Array.isArray(solutions)) return []

  return solutions
    .map((word) => (typeof word === "string" ? word.trim().toUpperCase() : ""))
    .filter((word) => word.length === WORD_LENGTH)
}

const MemoizedKeyboard = memo(Keyboard)

export default function OctordlePage() {
  const { playClick, playError, playSuccess, playWin, playBoot, playKeystroke, playDataInput, playDataProcess } =
    useSoundEffects()

  const [bootStep, setBootStep] = useState(0)
  const [isBooting, setIsBooting] = useState(true)
  const [isRebooting, setIsRebooting] = useState(false) // Add rebooting state
  const [showGame, setShowGame] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false) // Add processing state to block input
  const [isGlitching, setIsGlitching] = useState(false) // Added state for glitch effect
  const [showTactics, setShowTactics] = useState(false) // New state for tactics modal
  const [showArchive, setShowArchive] = useState(false) // New state for archive modal
  const [tacticalQueue, setTacticalQueue] = useState<string[]>([]) // Added queue for tactical words
  const [history, setHistory] = useState<string[]>([]) // Added history tracking
  const [showResultModal, setShowResultModal] = useState(false) // Track visibility of end-state modal

  const [boards, setBoards] = useState<CellData[][][]>(
    Array(PUZZLE_SIZE)
      .fill(null)
      .map(() =>
        Array(MAX_GUESSES)
          .fill(null)
          .map(() =>
            Array(WORD_LENGTH)
              .fill(null)
              .map(() => ({ letter: "", state: "empty" })),
          ),
      ),
  )
  const [currentGuesses, setCurrentGuesses] = useState<string[]>(Array(PUZZLE_SIZE).fill(""))
  const [currentRows, setCurrentRows] = useState<number[]>(Array(PUZZLE_SIZE).fill(0))
  const [solvedBoards, setSolvedBoards] = useState<boolean[]>(Array(PUZZLE_SIZE).fill(false))
  const [keyStates, setKeyStates] = useState<Record<string, LetterState>>({})
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false) // Add explicit win state
  const [solutions, setSolutions] = useState<string[]>([])
  const [isLoadingPuzzle, setIsLoadingPuzzle] = useState(true)

  useEffect(() => {
    const loadDailyPuzzle = async () => {
      const fallbackSolutions = getRandomFallbackSolutions()

      if (!WORKER_URL) {
        setSolutions(fallbackSolutions)
        setIsLoadingPuzzle(false)
        return
      }

      try {
        const today = getLocalDateString()
        const response = await fetch(`${WORKER_URL}/game/daily?variant=octordle&date=${today}`)

        if (!response.ok) {
          setSolutions(fallbackSolutions)
          return
        }

        const data = (await response.json()) as WorkerPuzzleResponse
        const workerSolutions = normalizeWorkerSolutions(data.solution)

        if (workerSolutions.length >= PUZZLE_SIZE) {
          setSolutions(workerSolutions.slice(0, PUZZLE_SIZE))
        } else {
          setSolutions(fallbackSolutions)
        }
      } catch (error) {
        console.error("Failed to load daily puzzle", error)
        setSolutions(fallbackSolutions)
      } finally {
        setIsLoadingPuzzle(false)
      }
    }

    loadDailyPuzzle()
  }, [])

  const maxCurrentRow = Math.max(...currentRows)
  const guessesRemaining = MAX_GUESSES - maxCurrentRow
  const unsolvedCount = solvedBoards.filter((s) => !s).length
  const isOverheating = !gameOver && !gameWon && guessesRemaining <= 2 && unsolvedCount >= 4

  useEffect(() => {
    const processQueue = async () => {
      if (tacticalQueue.length === 0 || isProcessing || gameOver || isLoadingPuzzle) return

      const word = tacticalQueue[0]
      setIsProcessing(true) // Lock input

      // Type the word
      for (let i = 0; i < word.length; i++) {
        playDataInput()
        const char = word[i]
        setCurrentGuesses((prev) =>
          prev.map((guess, boardIdx) => {
            if (solvedBoards[boardIdx] || guess.length >= WORD_LENGTH) return guess
            return guess + char
          }),
        )
        await new Promise((resolve) => setTimeout(resolve, 30)) // Fast typing
      }

      // Construct the guesses for submission explicitly based on the word we just typed
      // This avoids stale closure issues with currentGuesses
      const guessesToSubmit = solvedBoards.map((solved, idx) => (solved ? "" : word))

      // Submit with tactical flag
      await processGuessSubmission(guessesToSubmit, true)

      // Remove processed word from queue
      setTacticalQueue((prev) => prev.slice(1))
      // Note: processGuessSubmission sets isProcessing to false, allowing the next iteration
    }

    processQueue()
  }, [tacticalQueue, isProcessing, gameOver, solvedBoards, playDataInput, isLoadingPuzzle])

  useEffect(() => {
    const runBootSequence = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      playBoot()

      for (let i = 0; i < BOOT_LOGS.length; i++) {
        setBootStep(i)
        playKeystroke()
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 400 + 200))
      }

      await new Promise((resolve) => setTimeout(resolve, 800))
      setIsBooting(false)
      setShowGame(true)
    }

    runBootSequence()
  }, [])

  const handleReboot = async () => {
    playClick()
    setIsRebooting(true)
    setShowResultModal(false)
    setTacticalQueue([]) // Clear queue on reboot
    setHistory([]) // Clear history on reboot

    // Wait for animation (CRT power off)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Reset states
    setGameOver(false)
    setGameWon(false)
    setBoards(
      Array(PUZZLE_SIZE)
        .fill(null)
        .map(() =>
          Array(MAX_GUESSES)
            .fill(null)
            .map(() =>
              Array(WORD_LENGTH)
                .fill(null)
                .map(() => ({ letter: "", state: "empty" })),
            ),
        ),
    )
    setCurrentGuesses(Array(PUZZLE_SIZE).fill(""))
    setCurrentRows(Array(PUZZLE_SIZE).fill(0))
    setSolvedBoards(Array(PUZZLE_SIZE).fill(false))
    setKeyStates({})
    setIsBooting(true)
    setShowGame(false)
    setIsRebooting(false)
    setBootStep(0)

    // Re-trigger boot sequence
    playBoot()
    for (let i = 0; i < BOOT_LOGS.length; i++) {
      setBootStep(i)
      playKeystroke()
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 400 + 200))
    }

    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsBooting(false)
    setShowGame(true)
  }

  const handleExecuteProtocol = (words: string[]) => {
    setShowTactics(false)
    if (isProcessing || isLoadingPuzzle) return
    setTacticalQueue(words) // Just add to queue, effect handles the rest
  }

  const handleCloseResult = () => {
    playClick()
    setShowResultModal(false)
  }

  const handleShowResult = () => {
    playClick()
    setShowResultModal(true)
  }

  const handleKeyPress = (key: string) => {
    if (gameOver || solvedBoards.every((solved) => solved) || isProcessing || isLoadingPuzzle || solutions.length < PUZZLE_SIZE)
      return // Block input when processing or loading puzzles

    if (key === "ENTER") {
      handleSubmitGuess()
    } else if (key === "BACKSPACE") {
      playClick()
      handleBackspace()
    } else if (key.length === 1 && /^[A-Z]$/.test(key)) {
      playClick()
      handleLetterInput(key)
    }
  }

  const handleLetterInput = (letter: string) => {
    setCurrentGuesses((prev) =>
      prev.map((guess, boardIdx) => {
        if (solvedBoards[boardIdx] || guess.length >= WORD_LENGTH) return guess
        return guess + letter
      }),
    )
  }

  const handleBackspace = () => {
    setCurrentGuesses((prev) =>
      prev.map((guess, boardIdx) => {
        if (solvedBoards[boardIdx]) return guess
        return guess.slice(0, -1)
      }),
    )
  }

  const processGuessSubmission = async (guessesToSubmit: string[], isTactical = false) => {
    const activeBoards = guessesToSubmit
      .map((guess, idx) => (!solvedBoards[idx] && guess.length === WORD_LENGTH ? idx : -1))
      .filter((idx) => idx !== -1)

    if (activeBoards.length === 0) {
      if (!isTactical) {
        playError()
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 150)
      }
      setIsProcessing(false) // Ensure we unlock if we return early
      return
    }

    if (isLoadingPuzzle || solutions.length < PUZZLE_SIZE) {
      playError()
      setIsProcessing(false)
      return
    }

    // Capture the guess word for history before processing
    // All active guesses are the same word, so we take the first valid one
    const submittedWord = guessesToSubmit.find((g) => g.length === WORD_LENGTH)
    if (submittedWord) {
      setHistory((prev) => [...prev, submittedWord])
    }

    setIsProcessing(true)

    if (isTactical) {
      playDataProcess()
    } else {
      playSuccess()
    }

    // We update state immediately, but the UI will animate with delays
    // We wait for the animation to "technically" finish before allowing new input
    await new Promise((resolve) => setTimeout(resolve, WORD_LENGTH * 200 + 300))

    const newBoards = [...boards]
    const newCurrentRows = [...currentRows]
    const newSolvedBoards = [...solvedBoards]
    const newKeyStates = { ...keyStates }

    activeBoards.forEach((boardIdx) => {
      const guess = guessesToSubmit[boardIdx].toUpperCase()
      const solution = solutions[boardIdx]
      const row = currentRows[boardIdx]

      if (row >= MAX_GUESSES) return

      const newRow: CellData[] = []
      const solutionLetters = solution.split("")
      const guessLetters = guess.split("")

      const remainingLetters = [...solutionLetters]
      guessLetters.forEach((letter, i) => {
        if (letter === solutionLetters[i]) {
          newRow[i] = { letter, state: "correct" }
          remainingLetters[i] = ""
          newKeyStates[letter] = "correct"
        } else {
          newRow[i] = { letter, state: "absent" }
        }
      })

      guessLetters.forEach((letter, i) => {
        if (newRow[i].state === "absent") {
          const letterIndex = remainingLetters.indexOf(letter)
          if (letterIndex !== -1) {
            newRow[i] = { letter, state: "present" }
            remainingLetters[letterIndex] = ""
            if (newKeyStates[letter] !== "correct") {
              newKeyStates[letter] = "present"
            }
          } else {
            if (!newKeyStates[letter]) {
              newKeyStates[letter] = "absent"
            }
          }
        }
      })

      newBoards[boardIdx][row] = newRow
      newCurrentRows[boardIdx]++

      if (guess === solution) {
        newSolvedBoards[boardIdx] = true
      }
    })

    setBoards(newBoards)
    setCurrentRows(newCurrentRows)
    setSolvedBoards(newSolvedBoards)
    setKeyStates(newKeyStates)
    setCurrentGuesses((prev) => prev.map((_, idx) => (newSolvedBoards[idx] ? _ : "")))

    if (
      newSolvedBoards.every((solved) => solved) ||
      newCurrentRows.every((row, idx) => row >= MAX_GUESSES || newSolvedBoards[idx])
    ) {
      setGameOver(true)
      setShowResultModal(true)
      if (newSolvedBoards.every((solved) => solved)) {
        setGameWon(true) // Set win state
        setTimeout(playWin, 500)
      }
    }

    setIsProcessing(false) // End processing
  }

  const handleSubmitGuess = () => {
    processGuessSubmission(currentGuesses)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return

      if (e.key === "Enter") {
        e.preventDefault()
        handleKeyPress("ENTER")
      } else if (e.key === "Backspace") {
        e.preventDefault()
        handleKeyPress("BACKSPACE")
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault()
        handleKeyPress(e.key.toUpperCase())
      }
    }

    if (showGame && !isLoadingPuzzle) {
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentGuesses, currentRows, solvedBoards, gameOver, showGame, isLoadingPuzzle])

  if (isBooting) {
    return (
      <div className="min-h-screen bg-[#0f1014] text-green-500 font-mono p-8 relative overflow-hidden">
        <div className="scanlines" />
        <div className="noise" />
        <div className="max-w-2xl mx-auto mt-20 space-y-2">
          {BOOT_LOGS.slice(0, bootStep + 1).map((log, idx) => (
            <div key={idx} className="typing-effect text-lg md:text-xl text-glow-green">
              {log}
              {idx === bootStep && <span className="animate-pulse">_</span>}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen bg-[#0f1014] text-foreground font-mono relative selection:bg-amber-500/30 ${isRebooting ? "animate-crt-off" : ""} origin-center`}
    >
      <div className="scanlines" />
      <div
        className={`noise transition-all duration-1000 ${isOverheating ? "opacity-20 mix-blend-hard-light" : "opacity-[0.03]"}`}
      />
      <div
        className={`fixed inset-0 pointer-events-none z-[9990] transition-opacity duration-1000 bg-red-500/10 mix-blend-overlay ${isOverheating ? "opacity-100 animate-pulse" : "opacity-0"}`}
      />

      <div className={`flex-1 pb-96 ${isGlitching ? "animate-jitter" : ""}`}>
        <header className="border-b-4 border-amber-500 bg-[#1a1d24] p-4 shadow-inner relative z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-amber-500 w-1/3">
              <span className={isOverheating ? "text-red-500 font-bold animate-pulse" : ""}>
                {isOverheating ? "WARNING: SYSTEM OVERHEAT" : "SYSTEM: ONLINE"}
              </span>
              <span className={`blink ${isOverheating ? "text-red-500" : ""}`}>{"▊"}</span>
              <Link
                href="/help-files"
                className="hidden md:inline-flex items-center justify-center px-3 py-1 border-2 border-amber-500 bg-amber-500/10 hover:bg-amber-500 hover:text-[#0f1014] transition-colors text-[11px] font-bold active:translate-y-[2px]"
              >
                [ HELP_FILES ]
              </Link>
            </div>
            <div className="flex flex-col items-center w-1/3">
              <h1 className="text-2xl md:text-3xl font-bold text-amber-500 text-glow-amber tracking-wider whitespace-nowrap">
                {"OCTORDLE_OS v1.0"}
              </h1>
            </div>
            <div className="text-sm text-amber-500 w-1/3 flex justify-end items-center gap-2 md:gap-4">
              <button
                onClick={() => setShowArchive(true)}
                className="hidden md:block px-3 py-1 border-2 border-amber-500 bg-amber-500/10 hover:bg-amber-500 hover:text-[#0f1014] transition-colors text-[11px] font-bold active:translate-y-[2px]"
              >
                [ LOGS ]
              </button>
              <button
                onClick={() => setShowTactics(true)}
                disabled={isProcessing || gameOver}
                className="hidden md:block px-3 py-1 border-2 border-amber-500 bg-amber-500/10 hover:bg-amber-500 hover:text-[#0f1014] transition-colors text-[11px] font-bold active:translate-y-[2px]"
              >
                [ LOAD_TACTICS ]
              </button>
              <div className="flex flex-col items-end">
                <span>{"CPU: "}</span>
                {isOverheating ? (
                  <span className="text-red-500 text-glow-red animate-pulse">{"█████"}</span>
                ) : (
                  <>
                    <span className="text-green-400 text-glow-green">{"█████"}</span>
                    <span className="text-gray-600">{"░░░░░"}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* Mobile Tactics Button */}
          <div className="md:hidden mt-2 flex justify-center gap-2">
            <button
              onClick={() => setShowArchive(true)}
              className="flex-1 px-4 py-2 border-2 border-amber-500 bg-amber-500/10 hover:bg-amber-500 hover:text-[#0f1014] transition-colors text-[11px] font-bold"
            >
              [ LOGS ]
            </button>
            <Link
              href="/help-files"
              className="flex-1 px-4 py-2 border-2 border-amber-500 bg-amber-500/10 hover:bg-amber-500 hover:text-[#0f1014] transition-colors text-[11px] font-bold text-center"
            >
              [ HELP_FILES ]
            </Link>
            <button
              onClick={() => setShowTactics(true)}
              disabled={isProcessing || gameOver}
              className="flex-1 px-4 py-2 border-2 border-amber-500 bg-amber-500/10 hover:bg-amber-500 hover:text-[#0f1014] transition-colors text-[11px] font-bold"
            >
              [ TACTICS ]
            </button>
          </div>
        </header>

        <main className="max-w-[95vw] mx-auto p-4 md:p-8 relative">
          {isLoadingPuzzle && (
            <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
              <div className="px-4 py-2 border-2 border-amber-500 bg-[#0f1014] text-amber-400 shadow-lg">
                [ INITIALIZING DAILY PUZZLE... ]
              </div>
            </div>
          )}

          <div className="relative bg-[#15171c] p-6 rounded-xl border-2 border-[#27272a] shadow-2xl">
            <ScrewHead className="absolute top-3 left-3" />
            <ScrewHead className="absolute top-3 right-3" />
            <ScrewHead className="absolute bottom-3 left-3" />
            <ScrewHead className="absolute bottom-3 right-3" />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-8 mb-4 place-items-center">
              {boards.map((board, boardIdx) => (
                <GameGrid
                  key={boardIdx}
                  boardNumber={boardIdx + 1}
                  board={board}
                  currentGuess={currentGuesses[boardIdx]}
                  currentRow={currentRows[boardIdx]}
                  isSolved={solvedBoards[boardIdx]}
                  maxGuesses={MAX_GUESSES}
                  wordLength={WORD_LENGTH}
                />
              ))}
            </div>
          </div>

          <TacticalModule
            isOpen={showTactics}
            onClose={() => setShowTactics(false)}
            onExecute={handleExecuteProtocol}
          />

          <ArchiveLog isOpen={showArchive} onClose={() => setShowArchive(false)} history={history} />

          {gameOver && showResultModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div
                className={`max-w-lg w-full p-8 border-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative ${
                  gameWon
                    ? "bg-[#1a1d24] border-green-500 shadow-[0_0_30px_rgba(74,222,128,0.2)]"
                    : "bg-[#1a1d24] border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
                }`}
              >
                <ScrewHead className="absolute top-4 left-4" />
                <ScrewHead className="absolute top-4 right-4" />
                <ScrewHead className="absolute bottom-4 left-4" />
                <ScrewHead className="absolute bottom-4 right-4" />
                <button
                  onClick={handleCloseResult}
                  className="absolute top-2 right-2 text-xs text-amber-400 border-2 border-amber-500 px-2 py-1 bg-amber-500/10 hover:bg-amber-500 hover:text-[#0f1014] transition-colors font-bold"
                >
                  [ CLOSE_PANEL ]
                </button>

                <div className="text-center space-y-6">
                  {gameWon ? (
                    <>
                      <div className="text-green-500 text-6xl mb-4">
                        <svg
                          className="w-20 h-20 mx-auto animate-pulse"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-green-400 text-glow-green tracking-widest">
                        MISSION_LOG
                      </h2>
                      <div className="space-y-2 text-green-300/80 font-mono text-xs border-y-2 border-green-500/30 py-4">
                        <p>{"> DECRYPTING DATA STREAMS..."}</p>
                        <p>{"> VERIFYING CHECKSUMS..."}</p>
                        <p>{"> ACCESS GRANTED."}</p>
                        <p className="text-green-400 font-bold mt-2">DATA DECRYPTED SUCCESSFULLY.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-red-500 text-6xl mb-4">
                        <svg
                          className="w-20 h-20 mx-auto animate-pulse"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-red-500 text-glow-red tracking-widest">
                        SYSTEM_FAILURE
                      </h2>
                      <div className="space-y-2 text-red-300/80 font-mono text-xs border-y-2 border-red-500/30 py-4">
                        <p>{"> ERROR: BUFFER OVERFLOW"}</p>
                        <p>{"> MEMORY CORRUPTION DETECTED"}</p>
                        <p>{"> CONNECTION LOST."}</p>
                        <p className="text-red-500 font-bold mt-2">CRITICAL ERROR.</p>
                      </div>
                    </>
                  )}

                  <div className="pt-4">
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest">
                      {gameWon ? "System secure. Ready for reboot." : "System unstable. Hard reset required."}
                    </p>
                    <div
                      className={`grid gap-3 justify-items-center ${gameWon ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}
                    >
                      <button
                        onClick={handleReboot}
                        className={`
                        w-full sm:w-auto min-w-[220px] px-6 py-4 font-bold border-b-4 whitespace-nowrap text-center
                        transition-all active:border-b-0 active:translate-y-1
                        ${
                          gameWon
                            ? "bg-green-500 text-[#0f1014] border-green-700 hover:bg-green-400"
                            : "bg-red-500 text-[#0f1014] border-red-700 hover:bg-red-400"
                        }
                      `}
                      >
                        {gameWon ? "[ INITIATE_REBOOT ]" : "[ FLUSH_MEMORY ]"}
                      </button>
                      {!gameWon && (
                        <button
                          onClick={handleCloseResult}
                          className="w-full sm:w-auto min-w-[220px] px-6 py-4 font-bold border-2 border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-[#0f1014] transition-all whitespace-nowrap text-center"
                        >
                          [ VIEW_RECORDS ]
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>

      {gameOver && !showResultModal && (
        <div className="fixed bottom-4 right-4 z-40 space-y-2">
          <button
            onClick={handleShowResult}
            className="w-full px-4 py-2 border-2 border-amber-500 bg-amber-500/10 text-amber-400 font-bold hover:bg-amber-500 hover:text-[#0f1014] transition-colors"
          >
            [ OPEN_SYSTEM_STATUS ]
          </button>
          <button
            onClick={handleReboot}
            className="w-full px-4 py-2 border-2 border-red-500 bg-red-500 text-[#0f1014] font-bold hover:bg-red-400 transition-colors"
          >
            [ FLUSH_MEMORY ]
          </button>
        </div>
      )}

      <MemoizedKeyboard onKeyPress={handleKeyPress} keyStates={keyStates} />
    </div>
  )
}
