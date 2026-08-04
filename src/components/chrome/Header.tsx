"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { nav, shop, locations, BOOK_LABEL } from "@/lib/content";
import { Wordmark } from "./Wordmark";
import { useChromeSlab } from "./useChromeTone";
import { useChromeReveal } from "./useChromeReveal";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * A transparent bar floating over enormous display type is illegible the
 * moment anything scrolls under it. So the header leaves on the way down and
 * comes back on the way up, and when it comes back mid-page it brings the
 * slab's own colour with it, which is the only way small nav type survives
 * over a mega title or a photograph.
 */
export function Header() {
  const { tone, bg } = useChromeSlab();
  const { atTop, up } = useChromeReveal();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  const toggleRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    /* Smooth scrolling runs off its own target position, which a locked body
       does nothing to stop: the target would keep travelling behind the
       overlay and the page would snap to wherever it ended up on close. */
    if (open) lenis?.stop();
    else lenis?.start();
    /* The Book pill lives outside this component and sits a layer above the
       overlay. globals.css hides it off this flag rather than either component
       having to know about the other. */
    document.body.dataset.menu = open ? "open" : "";

    /* Locking the scroll is not enough: without `inert` the tab order walks
       straight off the overlay and into the page underneath it, which is
       covered and unreadable. */
    const behind = [
      document.getElementById("main"),
      document.querySelector("footer"),
    ].filter(Boolean) as HTMLElement[];

    for (const el of behind) {
      if (open) el.setAttribute("inert", "");
      else el.removeAttribute("inert");
    }

    return () => {
      document.body.style.overflow = "";
      document.body.dataset.menu = "";
      lenis?.start();
      for (const el of behind) el.removeAttribute("inert");
    };
  }, [open, lenis]);

  /* Opening a dialog that never takes focus leaves the reader's caret parked
     on a button behind a full-screen overlay. */
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) overlayRef.current?.focus();
    else if (wasOpen.current) toggleRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const hidden = !open && !atTop && !up;
  /* Opaque while the menu is open, too. The panel underneath scrolls on a
     short screen, and this bar floats over it at z-50 so the reader can always
     reach «Закрыть» — which meant the display links slid straight through the
     wordmark on the way past. Espresso on espresso, so nothing reads as a bar;
     it just stops being see-through. */
  const barred = open || !atTop;
  const barBg = open ? "var(--color-espresso)" : bg;
  const color = open || tone === "paper" ? "text-paper" : "text-ink";

  return (
    <>
      <motion.header
        initial={{ y: -96, opacity: 0 }}
        animate={{ y: hidden ? -96 : 0, opacity: 1 }}
        transition={{
          y: { duration: 0.55, ease: EASE },
          opacity: { duration: 0.9, delay: 0.15, ease: EASE },
        }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${color}`}
      >
        {/* The slab's own colour, faded in only once the page has moved. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 transition-opacity duration-500 ease-out-expo"
          style={{ background: barBg, opacity: barred ? 1 : 0 }}
        />
        {/* No rule inside the menu: there is nothing on the other side of it
            to divide, and it would draw a line across an unbroken espresso field. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-px bg-current transition-opacity duration-500"
          style={{ opacity: barred && !open ? 0.18 : 0 }}
        />

        <div className="edge flex items-center justify-between py-5 md:py-6">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            aria-label={`«${shop.name}», на главную`}
            /* The wordmark is the way back to the top of the site from every
               page, and at its own cap height it was a 31px target. The extra
               height is taken back out of the flow so the bar keeps its
               measurements. */
            className="tap relative z-10 -my-2"
          >
            <Wordmark />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {nav.map((item) => {
              const on = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={on ? "page" : undefined}
                  /* `tap-reach`, not `tap`: this breakpoint starts at 768px,
                     which is an iPad held upright — a thumb, not a cursor — but
                     the link draws its own underline at `-bottom-1`, and giving
                     the box a 44px height would drop that rule away from the
                     word it belongs to. The band goes over the top instead. */
                  className="ui tap-reach group relative -my-1.5 py-1.5"
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-current transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full group-focus-visible:w-full ${
                      on ? "w-full" : "w-0"
                    }`}
                  />
                </Link>
              );
            })}

            {/* Booking is the only thing this business sells, so it is in the
                nav rather than parked in a floating pill the top of the page
                never shows. Outlined in currentColor, which reads on all three
                slab colours and never competes with the solid pill. */}
            <Link
              href="/book"
              aria-current={pathname === "/book" ? "page" : undefined}
              /* The pill is drawn, so it takes the height rather than a band:
                 three pixels, and it now matches the floor everything else
                 in the bar is held to. */
              className="ui tap ml-1 justify-center rounded-full border border-current/40 px-5 transition-colors duration-500 ease-out-expo hover:border-current"
            >
              {BOOK_LABEL}
            </Link>
          </nav>

          {/* The only way to reach navigation on a phone: negative margins keep
              the word optically on the gutter while the padding gives it a
              44px target. `tap` rather than `py-3`, which measured 43. */}
          <button
            ref={toggleRef}
            onClick={() => setOpen((v) => !v)}
            className="ui tap relative z-10 -my-3 -mr-3 px-3 md:hidden"
            aria-expanded={open}
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
          >
            {open ? "Закрыть" : "Меню"}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="Меню"
            tabIndex={-1}
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.75, ease: EASE }}
            /* Four display links and three addresses do not fit a phone held
               sideways: at 740x360 the stack measures 588px and the telephone
               number — the one thing on here a reader is in a hurry for — sat
               228px below the fold of a panel that could not scroll, with the
               page behind it locked. So the panel scrolls.
               `justify-between` is safe above `overflow-y-auto` because it
               puts the first child at flex-start; `justify-center` is the one
               that clips its own top when the content outgrows the box.
               `overscroll-contain` stops a flick at either end of the list
               from being handed to the document underneath.
               `gap-8` is the most that can be asked for without making the
               panel scroll on a 320x568 phone, where it currently fits to the
               pixel; it only has anything to do once the panel does overflow,
               and then it keeps the addresses off the last nav item. */
            className="fixed inset-0 z-40 flex flex-col justify-between gap-8 overflow-y-auto overscroll-contain lamp bg-espresso text-paper edge pt-28 pb-[max(2.5rem,env(safe-area-inset-bottom))] outline-none md:hidden"
          >
            <nav className="flex flex-col">
              {[...nav, { label: BOOK_LABEL, href: "/book" }].map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.12 + i * 0.06, ease: EASE }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="display block py-2 text-[clamp(2.75rem,15vw,5rem)]"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="label flex flex-col gap-1"
            >
              {locations.map((l) => (
                <span key={l.id}>
                  {l.name}, {l.address}
                </span>
              ))}
              <a
                href={shop.phoneHref}
                className="tap -mx-2 mt-1 w-fit px-2 underline underline-offset-4"
              >
                {shop.phone}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
