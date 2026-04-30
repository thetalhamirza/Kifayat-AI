"use client"

import * as React from "react"

export interface GradientBackgroundProps extends React.ComponentProps<"div"> {
  transition?: {
    duration?: number
    ease?: string
    repeat?: number
  }
}

export const GradientBackground = ({
  transition = { duration: 15, ease: 'easeInOut', repeat: Infinity },
  className,
  children,
  ...props
}: GradientBackgroundProps) => {
  return (
    <div
      className={`relative w-full min-h-screen ${className || ''}`}
      {...props}
    >
      <div className="gradient-bg" aria-hidden="true" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
