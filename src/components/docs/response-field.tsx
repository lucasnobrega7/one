import type React from "react"
interface ResponseFieldProps {
  name: string
  type: string
  children?: React.ReactNode
}

export function ResponseField({ name, type, children }: ResponseFieldProps) {
  return (
    <div className="mb-4 rounded-lg border p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-sm">{name}</span>
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">{type}</span>
      </div>
      {children && <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">{children}</div>}
    </div>
  )
}
