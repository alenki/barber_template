"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
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

  const toggleRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
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
      for (const el of behind) el.removeAttribute("inert");
    };
  }, [open]);

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
  const barred = !open && !atTop;
  const color = open ? "text-ink" : tone === "paper" ? "text-paper" : "text-ink";

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
          style={{ background: bg, opacity: barred ? 1 : 0 }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-px bg-current transition-opacity duration-500"
          style={{ opacity: barred ? 0.18 : 0 }}
        />

        <div className="edge flex items-center justify-between py-5 md:py-6">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            aria-label={`«${shop.name}», на главную`}
            className="relative z-10 -my-2 py-2"
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
                  className="ui group relative -my-1.5 py-1.5"
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
              className="ui ml-1 rounded-full border border-current/40 px-5 py-2.5 transition-colors duration-500 ease-out-expo hover:border-current"
            >
              {BOOK_LABEL}
            </Link>
          </nav>

          {/* The only way to reach navigation on a phone: negative margins keep
              the word optically on the gutter while the padding gives it a
              44px target. */}
          <button
            ref={toggleRef}
            onClick={() => setOpen((v) => !v)}
            className="ui relative z-10 -my-3 -mr-3 px-3 py-3 md:hidden"
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
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ember text-ink edge pt-28 pb-10 outline-none md:hidden"
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
                className="-mx-2 mt-1 inline-block w-fit px-2 py-3 underline underline-offset-4"
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
