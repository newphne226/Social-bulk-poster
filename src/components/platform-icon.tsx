"use client";

import { PLATFORMS } from "@/lib/platforms";

interface PlatformIconProps {
  platform: string;
  className?: string;
  size?: number;
}

/**
 * Renders a simple, recognizable brand badge for each social platform.
 * Uses the platform's brand color and a short label as fallback when SVG paths
 * are not provided. Designed to be theme-safe (works on light/dark backgrounds).
 */
export function PlatformIcon({ platform, className = "", size = 20 }: PlatformIconProps) {
  const p = PLATFORMS[platform];
  if (!p) {
    return (
      <div
        className={`rounded-md bg-muted text-muted-foreground flex items-center justify-center font-bold ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        ?
      </div>
    );
  }

  return (
    <div
      className={`rounded-md flex items-center justify-center font-bold text-white ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: p.color,
        fontSize: size * 0.4,
      }}
      title={p.name}
    >
      {p.icon}
    </div>
  );
}
