"use client"

import Link from "next/link"

const FOOTER_LINKS = [
  { label: "HELP FILES", href: "/help-files" },
  { label: "PRIVACY POLICY", href: "/privacy-policy" },
  { label: "SUPPORT & FEEDBACK", href: "/support-feedback" },
  { label: "USER SERVICE", href: "/user-service" },
]

export function Footer() {
  return (
    <footer className="max-w-5xl mx-auto px-4 md:px-8 mt-10">
      <div className="bg-[#1a1d24] border-2 border-amber-500 shadow-[0_0_30px_rgba(251,191,36,0.15)] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-amber-500/40 text-xs uppercase tracking-[0.3em] text-amber-500/80">
          {"> SYSTEM ACCESS LINKS"}
        </div>
        <div className="p-4 flex flex-wrap justify-center gap-3">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="group">
              <span className="inline-flex items-center gap-2 px-4 py-2 border-2 border-amber-500 bg-amber-500/10 text-amber-400 font-bold tracking-widest text-[11px] hover:bg-amber-500 hover:text-[#0f1014] transition-colors">
                <span className="h-2 w-2 rounded-full bg-amber-500 group-hover:bg-[#0f1014] shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                {`[ ${link.label} ]`}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
