import Link from "next/link"

const CONTACT_EMAIL = "shendongloving123@gmail.com"
const SITE_NAME = "octordle.cc"

export default function SupportFeedbackPage() {
  return (
    <div className="min-h-screen bg-[#0f1014] text-amber-400 font-mono relative selection:bg-amber-500/30">
      <div className="scanlines" />
      <div className="noise" />

      <div className="relative max-w-3xl mx-auto px-4 md:px-8 py-12 space-y-8">
        <header className="border-b-4 border-amber-500 bg-[#1a1d24] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
          <p className="text-sm text-amber-500/70 tracking-[0.2em] uppercase">{"// SUPPORT_FEEDBACK"}</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-amber-400 text-glow-amber tracking-widest">
            Support & Feedback
          </h1>
          <p className="text-xs text-amber-500/70 mt-2">Independent project by {SITE_NAME}</p>
        </header>

        <section className="space-y-3 bg-[#1a1d24] border-2 border-amber-500/60 p-6 shadow-[0_0_30px_rgba(251,191,36,0.12)]">
          <p className="text-sm text-amber-100/90 leading-relaxed">
            Thanks for playing! I run {SITE_NAME} solo. Found a bug, need a feature, or just want to say hi? I would
            love to hear from you.
          </p>
          <ul className="space-y-2 text-sm text-amber-100/90 leading-relaxed">
            <li>
              <span className="font-bold text-amber-300">Email: </span>
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline text-amber-200">
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <span className="font-bold text-amber-300">Response time: </span>
              usually within 24-48 hours.
            </li>
            <li>
              <span className="font-bold text-amber-300">Languages: </span>
              English or Chinese are both welcome.
            </li>
          </ul>
        </section>

        <section className="space-y-3 bg-[#1a1d24] border-2 border-amber-500/60 p-6 shadow-[0_0_30px_rgba(251,191,36,0.12)]">
          <h2 className="text-lg font-bold text-amber-300 tracking-[0.12em]">Reporting a Bug</h2>
          <p className="text-sm text-amber-100/90 leading-relaxed">To help fix issues faster, please include:</p>
          <ol className="space-y-2 text-sm text-amber-100/90 leading-relaxed list-decimal list-inside">
            <li>Device & browser (e.g., iPhone / Chrome on Windows).</li>
            <li>Screenshot or short description of what happened.</li>
          </ol>
        </section>

        <section className="space-y-3 bg-[#1a1d24] border-2 border-amber-500/60 p-6 shadow-[0_0_30px_rgba(251,191,36,0.12)]">
          <h2 className="text-lg font-bold text-amber-300 tracking-[0.12em]">Feature Requests</h2>
          <p className="text-sm text-amber-100/90 leading-relaxed">
            Many features come from player ideas. Share what would make {SITE_NAME} better or more fun.
          </p>
        </section>

        <p className="text-xs text-amber-500/60">
          Your email is only used to reply to your inquiry and will not be shared.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="px-4 py-2 border-2 border-amber-500 bg-amber-500/10 hover:bg-amber-500 hover:text-[#0f1014] transition-colors font-bold tracking-[0.18em] text-xs"
          >
            [ RETURN_TO_CONSOLE ]
          </Link>
        </div>
      </div>
    </div>
  )
}
