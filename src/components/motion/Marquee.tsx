import type { ReactNode } from "react";

/**
 * CSS-only infinite ticker. The track holds the content twice and slides
 * exactly -50%, so the loop point is invisible. No JS, no rAF, no jank.
 */
export function Marquee({
  children,
  duration = 42,
  className = "",
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="marquee-track"
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0">{children}</div>
      </div>
    </div>
  );
}
