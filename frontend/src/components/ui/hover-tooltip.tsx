"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface HoverTooltipProps {
  content: ReactNode
  children: ReactNode
  className?: string
  contentClassName?: string
}

export function HoverTooltip({ content, children, className, contentClassName }: HoverTooltipProps) {
  return (
    <span className={cn("group/tooltip relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-72 -translate-x-1/2 translate-y-1 rounded-md border border-border bg-popover px-2.5 py-2 text-xs text-popover-foreground shadow-md opacity-0 transition-all duration-150 group-hover/tooltip:translate-y-0 group-hover/tooltip:opacity-100 group-focus-within/tooltip:translate-y-0 group-focus-within/tooltip:opacity-100",
          contentClassName
        )}
      >
        {content}
      </span>
    </span>
  )
}
