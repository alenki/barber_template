"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { nav, shop, locations } from "@/lib/content";
import { Wordmark } from "./Wordmark";
import { useChromeTone } from "./useChromeTone";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Header() {
  const tone = useChromeTone();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const color = open ? "text-ink" : tone === "paper" ? "text-paper" : "text-ink";

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-50 edge flex items-center justify-between py-6 transition-colors duration-500 ${color}`}
      >
        <Link
          href="/"
          onClick={() => setOpen(false)}
          aria-label={`${shop.name} — home`}
          className="relative z-10"
        >
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="ui group relative">
              {item.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="ui relative z-10 md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? "Close" : "Menu"}
        </button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.75, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ember text-ink edge pt-28 pb-10 md:hidden"
          >
            <nav className="flex flex-col">
              {[...nav, { label: "Book", href: "/book" }].map((item, i) => (
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
                  {l.name} — {l.address}
                </span>
              ))}
              <a href={shop.phoneHref} className="mt-3 underline underline-offset-4">
                {shop.phone}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
