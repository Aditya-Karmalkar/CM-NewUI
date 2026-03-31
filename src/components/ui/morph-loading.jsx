"use client"

import React from 'react';
import { cn } from "src/lib/utils"

/**
 * UniqueLoading component with blue morphing blocks.
 * @param {Object} props
 * @param {"morph"} [props.variant="morph"]
 * @param {"sm" | "md" | "lg"} [props.size="md"]
 * @param {string} [props.className]
 */
export default function UniqueLoading({
  variant = "morph",
  size = "md",
  className,
}) {
  const containerSizes = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }

  if (variant === "morph") {
    return (
      <div className={cn("relative", containerSizes[size], className)}>
        <div className="absolute inset-0 flex items-center justify-center">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute w-4 h-4 bg-[#3b82f6] dark:bg-[#60a5fa]"
              style={{
                animation: `morph-${i} 2s infinite ease-in-out`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  return null
}
