import Link from "next/link"

import { PageHeader } from "@/components/page-header"

const COLOR_LEGEND = [
  { label: "CORRECT", description: "Letter is correct and in the right slot", className: "bg-green-900/30 border-green-400 text-green-400" },
  { label: "PRESENT", description: "Letter exists in the word but wrong slot", className: "bg-amber-900/30 border-amber-500 text-amber-400" },
  { label: "ABSENT", description: "Letter is not in the solution", className: "bg-gray-900/40 border-gray-600 text-gray-400" },
  { label: "PENDING", description: "Not submitted yet / currently typing", className: "bg-[#0f1014] border-gray-700 text-gray-300" },
]

const FAQ_ENTRIES = [
  {
    question: "How do I play?",
    answer: "Decrypt eight 5-letter words at the same time. Each submission is sent to every unlocked board. You get 13 total attempts; any solved board locks in.",
  },
  {
    question: "How do I enter guesses?",
    answer: "Use your physical keyboard or tap the on-screen keys. ENTER submits. BACKSPACE deletes the last character. Mobile taps work fast; long-press is supported.",
  },
  {
    question: "What counts as a valid word?",
    answer: "Any real 5-letter English word. If it is not in the dictionary you will see ERROR and the attempt is not spent.",
  },
  {
    question: "Can I review past guesses?",
    answer: "Press LOGS at any time to see every submission in this run. After the game, choose VIEW_RECORDS in the result panel.",
  },
  {
    question: "Reset & daily puzzle?",
    answer: "Each launch loads the daily puzzle. To reroll a challenge, hit FLUSH_MEMORY / INITIATE_REBOOT to draw a fresh offline set.",
  },
]

const PRO_TIPS = [
  "Cover vowels (A/E/I/O/U) and common consonants (R/S/T/L/N) early to collapse the search space fast.",
  "Boards share the queue; solved boards lock but others still take input, so check remaining slots before submitting.",
  "If guesses left <= 2 and unresolved nodes >= 4, the UI warns overheating - switch to aggressive probes.",
  "TACTICAL_DATABASE lets you auto-run opener sequences (e.g., STARE / DOILY / PUNCH) for quick scouting.",
  "Color feedback always comes from the last submitted row; the active typing row is just a placeholder.",
]

export default function HelpFilesPage() {
  return (
    <div className="min-h-screen bg-[#0f1014] text-amber-400 font-mono relative selection:bg-amber-500/30">
      <div className="scanlines" />
      <div className="noise" />

      <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-12 space-y-10">
        <PageHeader
          eyebrow="// HELP_FILES / FAQ"
          title="OCTORDLE_OS FIELD MANUAL"
          subtitle="Quick reference for new operators: core rules, color legend, controls, and FAQs."
          actions={
            <>
              <Link
                href="/"
                className="px-4 py-2 border-2 border-amber-500 bg-amber-500/10 hover:bg-amber-500 hover:text-[#0f1014] transition-colors font-bold tracking-[0.18em] text-xs"
              >
                [ RETURN_TO_CONSOLE ]
              </Link>
              <a
                href="#faq"
                className="px-4 py-2 border-2 border-amber-500/60 bg-[#0f1014] hover:bg-amber-500/10 transition-colors font-bold tracking-[0.18em] text-xs"
              >
                [ JUMP_TO_FAQ ]
              </a>
            </>
          }
        />

        <section className="grid gap-6 md:grid-cols-2">
          <div className="bg-[#1a1d24] border-2 border-amber-500/60 p-6 shadow-[0_0_30px_rgba(251,191,36,0.12)]">
            <p className="text-sm text-amber-500/70 mb-2">{"> CORE PARAMETERS"}</p>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>{"- Objective: Unlock 8 nodes (8 words) simultaneously."}</p>
              <p>{"- Word length: 5 letters."}</p>
              <p>{"- Shared attempts: 13 submissions in total across all boards."}</p>
              <p>{"- Data source: Load daily puzzle first; offline mode pulls random local words."}</p>
            </div>
          </div>

          <div className="bg-[#1a1d24] border-2 border-amber-500/60 p-6 shadow-[0_0_30px_rgba(251,191,36,0.12)]">
            <p className="text-sm text-amber-500/70 mb-2">{"> BASIC LOOP"}</p>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>{"1) Type a 5-letter word."}</p>
              <p>{"2) Press ENTER to sync-submit to every unlocked node."}</p>
              <p>{"3) Adjust using color feedback until all nodes lock or you spend 13 attempts."}</p>
            </div>
          </div>
        </section>

        <section className="bg-[#15171c] border-2 border-[#27272a] p-6 rounded-lg shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-[0.18em] text-amber-400">COLOR FEEDBACK</h2>
            <span className="text-xs text-amber-500/70">{"// State legend"}</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {COLOR_LEGEND.map((item) => (
              <div
                key={item.label}
                className={`p-4 border-2 ${item.className} shadow-[0_0_15px_rgba(0,0,0,0.35)] flex flex-col gap-2`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold tracking-[0.18em]">{item.label}</span>
                  <div className="w-4 h-4 border border-current" />
                </div>
                <p className="text-xs text-amber-200/80">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-[#1a1d24] border-2 border-amber-500/60 p-6 space-y-4 shadow-[0_0_30px_rgba(251,191,36,0.12)]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold tracking-[0.15em] text-amber-400">CONTROLS</h3>
              <span className="text-xs text-amber-500/60 uppercase">{"// Input & actions"}</span>
            </div>
            <ul className="space-y-2 text-sm leading-relaxed">
              <li>{"- Keyboard input: type directly or tap the on-screen keyboard."}</li>
              <li>{"- Submit: ENTER sync-writes to all unlocked boards."}</li>
              <li>{"- Delete: BACKSPACE removes the last letter in the current row."}</li>
              <li>{"- Touch: mobile on-screen keys support quick taps."}</li>
              <li>{"- Audio: submit / error / win events play cues (allow audio in your browser)."}</li>
            </ul>
          </div>

          <div className="bg-[#1a1d24] border-2 border-amber-500/60 p-6 space-y-4 shadow-[0_0_30px_rgba(251,191,36,0.12)]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold tracking-[0.15em] text-amber-400">MODULES</h3>
              <span className="text-xs text-amber-500/60 uppercase">{"// Quick utilities"}</span>
            </div>
            <ul className="space-y-2 text-sm leading-relaxed">
              <li>
                <span className="font-bold text-amber-300">TACTICAL_DATABASE:</span>
                {"Click [LOAD_TACTICS] in-game to auto-run opener sequences (e.g., STARE / DOILY / PUNCH)."}
              </li>
              <li>
                <span className="font-bold text-amber-300">ARCHIVE_RECORD:</span>
                {"Tap [LOGS] to review every guess in the current run."}
              </li>
              <li>
                <span className="font-bold text-amber-300">SYSTEM_STATUS:</span>
                {"Wins show MISSION_LOG; failures show SYSTEM_FAILURE. Choose FLUSH_MEMORY to reboot."}
              </li>
            </ul>
          </div>
        </section>

        <section className="bg-[#15171c] border-2 border-[#27272a] p-6 rounded-lg shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold tracking-[0.15em] text-amber-400">PROTOCOL TIPS</h3>
            <span className="text-xs text-amber-500/60 uppercase">{"// Fast-win strategy"}</span>
          </div>
          <ul className="space-y-2 text-sm leading-relaxed list-disc list-inside text-amber-200/90">
            {PRO_TIPS.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </section>

        <section id="faq" className="bg-[#1a1d24] border-2 border-amber-500/60 p-6 rounded-lg shadow-[0_0_30px_rgba(251,191,36,0.12)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold tracking-[0.15em] text-amber-400">FAQ</h3>
            <span className="text-xs text-amber-500/60 uppercase">{"// Frequently asked"}</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {FAQ_ENTRIES.map((item) => (
              <div key={item.question} className="border border-amber-500/30 p-4 bg-[#0f1014]/50 space-y-2">
                <p className="text-sm font-bold tracking-[0.12em] text-amber-300">{item.question}</p>
                <p className="text-sm text-amber-100/80 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#1a1d24] border-2 border-green-500/50 p-6 rounded-lg shadow-[0_0_30px_rgba(74,222,128,0.18)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-green-300/80 tracking-[0.18em] uppercase">{"// READY TO DEPLOY"}</p>
            <p className="text-lg font-bold text-green-400 text-glow-green">Head back to console and keep cracking all 8 nodes!</p>
          </div>
          <Link
            href="/"
            className="px-5 py-3 border-2 border-green-400 bg-green-500/10 text-green-200 hover:bg-green-400 hover:text-[#0f1014] transition-colors font-bold tracking-[0.2em] text-xs text-center"
          >
            [ BACK_TO_GAME ]
          </Link>
        </section>
      </div>
    </div>
  )
}
