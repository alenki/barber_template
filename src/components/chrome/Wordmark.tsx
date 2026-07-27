import { shop } from "@/lib/content";

/**
 * The mark is a fade, drawn literally: five bars stepping from solid to hairline.
 * It is the only illustration on the site, and it means something.
 */
export function FadeMark({ className = "" }: { className?: string }) {
  const bars = [
    { x: 0, w: 5.5 },
    { x: 8, w: 4 },
    { x: 14.5, w: 2.75 },
    { x: 19.75, w: 1.75 },
    { x: 24, w: 1 },
    { x: 27.25, w: 0.5 },
  ];
  return (
    <svg
      viewBox="0 0 28 24"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {bars.map((b) => (
        <rect key={b.x} x={b.x} y="0" width={b.w} height="24" fill="currentColor" />
      ))}
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <FadeMark className="h-[0.95em] w-auto shrink-0" />
      <span className="ui text-[0.82rem] leading-none tracking-[0.14em] whitespace-nowrap">
        {shop.name}
      </span>
    </span>
  );
}
