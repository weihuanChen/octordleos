import Link from "next/link"

const LAST_UPDATED = "November 27, 2025"
const SITE_NAME = "octordle.cc"
const CONTACT_EMAIL = "shendongloving123@gmail.com"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0f1014] text-amber-400 font-mono relative selection:bg-amber-500/30">
      <div className="scanlines" />
      <div className="noise" />

      <div className="relative max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-8">
        <header className="border-b-4 border-amber-500 bg-[#1a1d24] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
          <p className="text-sm text-amber-500/70 tracking-[0.2em] uppercase">{"// PRIVACY_POLICY"}</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-amber-400 text-glow-amber tracking-widest">
            Privacy Policy
          </h1>
          <p className="text-xs text-amber-500/70 mt-2">
            Last updated: {LAST_UPDATED} | Domain: {SITE_NAME}
          </p>
        </header>

        <section className="space-y-4 bg-[#1a1d24] border-2 border-amber-500/60 p-6 shadow-[0_0_30px_rgba(251,191,36,0.12)]">
          <h2 className="text-xl font-bold text-amber-300 tracking-[0.12em]">1. Introduction</h2>
          <p className="text-sm text-amber-100/90 leading-relaxed">
            Welcome to {SITE_NAME} ("we", "our", or "us"). We respect your privacy and are committed to protecting your
            personal data. This policy explains how we look after your data when you use our site and details your
            rights.
          </p>
        </section>

        <section className="space-y-4 bg-[#1a1d24] border-2 border-amber-500/60 p-6 shadow-[0_0_30px_rgba(251,191,36,0.12)]">
          <h2 className="text-xl font-bold text-amber-300 tracking-[0.12em]">2. Data We Collect</h2>
          <ul className="space-y-2 text-sm text-amber-100/90 leading-relaxed list-disc list-inside">
            <li>
              Usage Data: anonymized analytics about how you use the website (e.g., page views, device/browser info).
            </li>
            <li>Cookies: small files to improve your experience and remember preferences.</li>
            <li>Diagnostics: limited error logs to keep services stable.</li>
          </ul>
        </section>

        <section className="space-y-4 bg-[#1a1d24] border-2 border-amber-500/60 p-6 shadow-[0_0_30px_rgba(251,191,36,0.12)]">
          <h2 className="text-xl font-bold text-amber-300 tracking-[0.12em]">3. How We Use Your Data</h2>
          <ul className="space-y-2 text-sm text-amber-100/90 leading-relaxed list-disc list-inside">
            <li>Provide, maintain, and improve the gameplay experience.</li>
            <li>Monitor performance and detect, prevent, or fix technical issues.</li>
            <li>Enhance security and prevent abuse.</li>
          </ul>
        </section>

        <section className="space-y-4 bg-[#1a1d24] border-2 border-amber-500/60 p-6 shadow-[0_0_30px_rgba(251,191,36,0.12)]">
          <h2 className="text-xl font-bold text-amber-300 tracking-[0.12em]">4. Third-Party Services</h2>
          <p className="text-sm text-amber-100/90 leading-relaxed">
            We may use trusted third-party services (e.g., Vercel Analytics, Cloudflare) to operate and analyze the site.
            These providers process limited data under their own privacy terms.
          </p>
        </section>

        <section className="space-y-4 bg-[#1a1d24] border-2 border-amber-500/60 p-6 shadow-[0_0_30px_rgba(251,191,36,0.12)]">
          <h2 className="text-xl font-bold text-amber-300 tracking-[0.12em]">5. Contact</h2>
          <p className="text-sm text-amber-100/90 leading-relaxed">
            Questions or requests? Email us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-amber-300 underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

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
