import Link from "next/link"

const EFFECTIVE_DATE = "November 27, 2025"
const SITE_NAME = "octordle.cc"
const CONTACT_EMAIL = "shendongloving123@gmail.com"

export default function UserServicePage() {
  return (
    <div className="min-h-screen bg-[#0f1014] text-amber-400 font-mono relative selection:bg-amber-500/30">
      <div className="scanlines" />
      <div className="noise" />

      <div className="relative max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-8">
        <header className="border-b-4 border-amber-500 bg-[#1a1d24] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
          <p className="text-sm text-amber-500/70 tracking-[0.2em] uppercase">{"// USER_SERVICE_AGREEMENT"}</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-amber-400 text-glow-amber tracking-widest">
            User Service Agreement
          </h1>
          <p className="text-xs text-amber-500/70 mt-2">
            Effective Date: {EFFECTIVE_DATE} | Site: {SITE_NAME}
          </p>
        </header>

        <section className="space-y-3 bg-[#1a1d24] border-2 border-amber-500/60 p-6 shadow-[0_0_30px_rgba(251,191,36,0.12)]">
          <p className="text-sm text-amber-100/90 leading-relaxed">
            Welcome to {SITE_NAME} ("the Website", "We", "Us", or "Our"). Before using our services, please read and
            understand this Agreement. Accessing or using any part of the service means you agree to these terms.
          </p>
        </section>

        <section className="space-y-3 bg-[#1a1d24] border-2 border-amber-500/60 p-6 shadow-[0_0_30px_rgba(251,191,36,0.12)]">
          <h2 className="text-lg font-bold text-amber-300 tracking-[0.12em]">1. Agreement and Modifications</h2>
          <ul className="space-y-2 text-sm text-amber-100/90 leading-relaxed list-disc list-inside">
            <li>This Agreement governs your use of the services and supersedes prior terms.</li>
            <li>
              We may modify the Agreement at any time by posting updates on the Website. Continued use means acceptance of
              the new terms.
            </li>
          </ul>
        </section>

        <section className="space-y-3 bg-[#1a1d24] border-2 border-amber-500/60 p-6 shadow-[0_0_30px_rgba(251,191,36,0.12)]">
          <h2 className="text-lg font-bold text-amber-300 tracking-[0.12em]">2. Description of Services</h2>
          <ul className="space-y-2 text-sm text-amber-100/90 leading-relaxed list-disc list-inside">
            <li>
              The Website provides online tools and content, including the Octordle-style puzzle experience and related
              network services.
            </li>
            <li>We may change, suspend, or discontinue any aspect of the Services without notice.</li>
            <li>Content and results are provided for informational or entertainment purposes without guarantees.</li>
          </ul>
        </section>

        <section className="space-y-3 bg-[#1a1d24] border-2 border-amber-500/60 p-6 shadow-[0_0_30px_rgba(251,191,36,0.12)]">
          <h2 className="text-lg font-bold text-amber-300 tracking-[0.12em]">3. User Responsibilities</h2>
          <ul className="space-y-2 text-sm text-amber-100/90 leading-relaxed list-disc list-inside">
            <li>Use the Services lawfully and follow applicable regulations.</li>
            <li>
              Do not submit content that is illegal, defamatory, obscene, violent, or infringes intellectual property or
              privacy rights.
            </li>
            <li>
              Do not disrupt the Services, attempt unauthorized access, distribute malware, or overload the infrastructure.
            </li>
            <li>You are responsible for content you submit and agree to indemnify the Website against related claims.</li>
          </ul>
        </section>

        <section className="space-y-3 bg-[#1a1d24] border-2 border-amber-500/60 p-6 shadow-[0_0_30px_rgba(251,191,36,0.12)]">
          <h2 className="text-lg font-bold text-amber-300 tracking-[0.12em]">4. Privacy and Data</h2>
          <ul className="space-y-2 text-sm text-amber-100/90 leading-relaxed list-disc list-inside">
            <li>We are committed to protecting your privacy. See our Privacy Policy for details.</li>
            <li>We may collect limited data (e.g., IP, browser type, device info) for security and analytics.</li>
            <li>Cookies may be used to enhance experience and analytics.</li>
          </ul>
        </section>

        <section className="space-y-3 bg-[#1a1d24] border-2 border-amber-500/60 p-6 shadow-[0_0_30px_rgba(251,191,36,0.12)]">
          <h2 className="text-lg font-bold text-amber-300 tracking-[0.12em]">5. Disclaimers</h2>
          <ul className="space-y-2 text-sm text-amber-100/90 leading-relaxed list-disc list-inside">
            <li>The Services are provided "as is" and "as available" without warranties.</li>
            <li>Use of information or results is at your own risk; we are not liable for data loss or errors.</li>
            <li>Third-party links are for convenience; we are not responsible for their content or practices.</li>
          </ul>
        </section>

        <section className="space-y-3 bg-[#1a1d24] border-2 border-amber-500/60 p-6 shadow-[0_0_30px_rgba(251,191,36,0.12)]">
          <h2 className="text-lg font-bold text-amber-300 tracking-[0.12em]">6. Limitation of Liability</h2>
          <ul className="space-y-2 text-sm text-amber-100/90 leading-relaxed list-disc list-inside">
            <li>
              To the fullest extent allowed by law, the Website is not liable for direct, indirect, incidental, punitive,
              or consequential damages arising from use or inability to use the Services.
            </li>
            <li>
              If liability is found, the total amount is limited to the lesser of USD 100 or the fees paid (if any) in the
              six months before the claim.
            </li>
          </ul>
        </section>

        <section className="space-y-3 bg-[#1a1d24] border-2 border-amber-500/60 p-6 shadow-[0_0_30px_rgba(251,191,36,0.12)]">
          <h2 className="text-lg font-bold text-amber-300 tracking-[0.12em]">7. Intellectual Property</h2>
          <ul className="space-y-2 text-sm text-amber-100/90 leading-relaxed list-disc list-inside">
            <li>All content on the Website is owned by the Website or its licensors and is protected by law.</li>
            <li>
              You receive a limited, non-transferable license to access and use the Services. Do not copy, modify, sell,
              rent, distribute, reverse engineer, or decompile any part without permission.
            </li>
          </ul>
        </section>

        <section className="space-y-3 bg-[#1a1d24] border-2 border-amber-500/60 p-6 shadow-[0_0_30px_rgba(251,191,36,0.12)]">
          <h2 className="text-lg font-bold text-amber-300 tracking-[0.12em]">8. Governing Law and Jurisdiction</h2>
          <ul className="space-y-2 text-sm text-amber-100/90 leading-relaxed list-disc list-inside">
            <li>This Agreement is governed by the laws of the People&apos;s Republic of China.</li>
            <li>Disputes should first be negotiated in good faith; if unresolved, submit to courts in Hangzhou, China.</li>
            <li>The English version controls in case of translation differences.</li>
          </ul>
        </section>

        <section className="space-y-3 bg-[#1a1d24] border-2 border-amber-500/60 p-6 shadow-[0_0_30px_rgba(251,191,36,0.12)]">
          <h2 className="text-lg font-bold text-amber-300 tracking-[0.12em]">9. Contact Information</h2>
          <p className="text-sm text-amber-100/90 leading-relaxed">
            If you have questions about this Agreement, contact us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline text-amber-200">
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
