import type { ReactNode } from "react"

type PageHeaderProps = {
  eyebrow: string
  title: string
  subtitle?: ReactNode
  actions?: ReactNode
  className?: string
}

export function PageHeader({ eyebrow, title, subtitle, actions, className }: PageHeaderProps) {
  const hasActions = Boolean(actions)

  return (
    <header
      className={`border-b-4 border-amber-500 bg-[#1a1d24] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)] flex flex-col gap-4 ${hasActions ? "md:flex-row md:items-center md:justify-between" : ""} ${className ?? ""}`.trim()}
    >
      <div>
        <p className="text-sm text-amber-500/70 tracking-[0.2em] uppercase">{eyebrow}</p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-amber-400 text-glow-amber tracking-widest">{title}</h1>
        {subtitle ? <p className="text-xs text-amber-500/70 mt-2 max-w-2xl">{subtitle}</p> : null}
      </div>
      {hasActions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </header>
  )
}
