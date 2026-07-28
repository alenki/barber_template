"use client";

import { motion } from "motion/react";
import { hero, locations, shop } from "@/lib/content";
import { SplitText, Rise } from "@/components/motion/SplitText";
import { Frame } from "@/components/motion/Frame";

export function Hero() {
  return (
    <section
      data-tone="ink"
      className="relative bg-ember text-ink pt-[22vh] md:pt-[26vh]"
    >
      <div className="edge">
        <SplitText
          as="h1"
          animateOnMount
          delay={0.3}
          stagger={0.05}
          className="display mx-auto max-w-[19ch] text-center text-hero"
          segments={[{ text: hero.roman }, { text: hero.italic, italic: true }]}
        />

        <Rise
          animateOnMount
          delay={1.25}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 md:mt-16 md:justify-between md:gap-x-10"
        >
          {hero.meta.map((m) => (
            <span key={m} className="label">
              {m}
            </span>
          ))}
        </Rise>
      </div>

      <div className="edge mt-12 md:mt-16">
        <Frame
          src="/img/hero-chair.jpg"
          alt={`Зал «${shop.name}» на ${locations[0].address}`}
          priority
          animateOnMount
          delay={1.15}
          parallax={8}
          sizes="100vw"
          className="h-[62svh] w-full md:h-[78svh]"
          objectPosition="center 35%"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
        className="edge flex items-center justify-between py-6"
      >
        <span className="label">Листайте</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="label"
          aria-hidden="true"
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  );
}
