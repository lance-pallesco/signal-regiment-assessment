import React from "react"
import {
  CheckCircle2,
  Info,
  Loader2,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-right"
      icons={{
        success: <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />,
        info: <Info className="h-4 w-4 text-blue-600 shrink-0" />,
        warning: <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />,
        error: <XCircle className="h-4 w-4 text-rose-600 shrink-0" />,
        loading: <Loader2 className="h-4 w-4 animate-spin text-emerald-600 shrink-0" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "w-full flex items-start gap-3 p-4 rounded-xl border border-slate-200/90 bg-white text-slate-900 shadow-lg shadow-slate-200/50 text-sm pointer-events-auto",
          title: "font-semibold text-slate-900 text-[13px] leading-tight",
          description: "text-slate-500 text-xs mt-0.5 leading-relaxed",
          actionButton:
            "bg-emerald-800 text-white text-xs px-2.5 py-1 rounded-md hover:bg-emerald-700 font-medium",
          cancelButton:
            "bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md hover:bg-slate-200",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
