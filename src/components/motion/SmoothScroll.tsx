"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState, type ReactNode } from "react";

/**
 * The page glides rather than steps. Lenis intercepts the wheel, accumulates
 * the delta into a target and eases the real `window.scrollY` toward it, so
 * `position: sticky`, the fixed header and every `useScroll` transform in
 * `Frame` keep reading a genuine scroll position — the transform-a-wrapper
 * approach would have broken all three.
 *
 * `root` mounts it on the window and renders no wrapper element of its own,
 * which is what keeps the layout untouched.
 *
 * Touch is deliberately left native: iOS momentum is already tuned, and
 * `syncTouch` re-implements it badly enough to feel like lag on a phone.
 *
 * `allowNestedScroll` hands the wheel back to whatever scrollable element sits
 * under the cursor — the mobile menu panel is the one on this site — until it
 * hits its own end.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  /* Server-rendered as `false`: the preference is unknowable until the client
     runs, and guessing `true` would strand a first-paint reader without any
     scrolling behaviour at all. */
  const [still, setStill] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setStill(query.matches);
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);

  return (
    <ReactLenis
      root
      /* Changing this object tears the instance down and builds a new one, so
         it has to stay a plain literal of primitives — no easing function,
         which is what `lerp` avoids needing. */
      options={{
        /* Weight of the glide. 0.1 is the library's default and settles a
           touch too eagerly for slabs this tall; below ~0.07 the page starts
           to feel like it is dragging behind the hand. */
        lerp: 0.085,
        smoothWheel: !still,
        syncTouch: false,
        allowNestedScroll: true,
        /* The skip link is the anchor that matters. Lenis does not
           `preventDefault`, so the browser still moves focus to `#main` and
           only the travel is eased; `scroll-mt-*` is honoured. */
        anchors: still ? { immediate: true } : true,
        /* Leaving for another route with momentum still unwinding lands the
           new page mid-glide. */
        stopInertiaOnNavigate: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
