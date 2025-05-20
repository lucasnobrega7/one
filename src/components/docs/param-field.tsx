import type React from "react"
interface ParamFieldProps {
  name?: string
  path?: string
  header?: string
  query?: string
  body?: string
  type?: string
  required?: boolean
  default?: string | number | boolean
  children?: React.ReactNode
}

export function ParamField({
  name,
  path,
  header,
  query,
  body,
  type,
  required,
  default: defaultValue,
  children,
}: ParamFieldProps) {
  const paramName = name || path || header || query || body || ""

  return (
    <div className="mb-4 rounded-lg border p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-sm">{paramName}</span>
        {type && <span className="rounded-md bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">{type}</span>}
        {required && <span className="rounded-md bg-red-100 px-2 py-1 text-xs dark:bg-red-900">Obrigatório</span>}
        {defaultValue !== undefined && (
          <span className="rounded-md bg-blue-100 px-2 py-1 text-xs dark:bg-blue-900">
            Padrão: {defaultValue.toString()}
          </span>
        )}
      </div>
      {children && <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">{children}</div>}
    </div>
  )
}
