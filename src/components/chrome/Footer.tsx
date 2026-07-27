import Image from "next/image";
import Link from "next/link";
import { shop, nav, locations } from "@/lib/content";
import { SplitText } from "@/components/motion/SplitText";

/**
 * Full-bleed photograph, links laid over it, and the closing line
 * sitting on the bottom edge at the largest size on the site.
 */
export function Footer() {
  return (
    <footer
      data-tone="paper"
      className="relative isolate flex min-h-[92svh] flex-col justify-between overflow-hidden bg-ink text-paper"
    >
      <Image
        src="/img/interior-wide.jpg"
        alt="The Saint-Denis room after close"
        fill
        sizes="100vw"
        className="-z-10 object-cover opacity-70"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/40 to-ink/60" />

      <div className="edge grid gap-12 pt-32 md:grid-cols-[1fr_auto_auto] md:gap-16 md:pt-40">
        <div className="max-w-xs">
          <p className="label opacity-70">
            {shop.name} — {shop.city}, {shop.province}
          </p>
          <a
            href={`mailto:${shop.email}`}
            className="mt-4 block text-lg underline-offset-4 hover:underline"
          >
            {shop.email}
          </a>
          <a
            href={shop.phoneHref}
            className="mt-1 block text-lg underline-offset-4 hover:underline"
          >
            {shop.phone}
          </a>
        </div>

        <nav className="flex flex-col gap-3">
          {[...nav, { label: "Book", href: "/book" }].map((item) => (
            <Link key={item.href} href={item.href} className="ui opacity-80 hover:opacity-100">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          {["Instagram", "Facebook", "Google"].map((s) => (
            <a
              key={s}
              href={shop.instagram}
              target="_blank"
              rel="noreferrer"
              className="ui opacity-80 hover:opacity-100"
            >
              {s}
            </a>
          ))}
        </div>
      </div>

      <div className="edge mt-16 grid gap-8 md:grid-cols-3">
        {locations.map((l) => (
          <div key={l.id}>
            <p className="ui mb-2">{l.name}</p>
            <p className="label opacity-70">
              {l.address}
              <br />
              {l.city}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-20">
        <SplitText
          as="p"
          className="display px-[var(--gutter)] text-[clamp(2.75rem,11.5vw,12rem)]"
          segments={[{ text: "Your chair is" }, { text: "waiting.", italic: true }]}
          stagger={0.07}
        />
        {/* The sticky Book pill is ~76px off the bottom edge; without the
            extra padding it lands on top of this line, which is the one place
            on the site where content is guaranteed to sit under it. */}
        <div className="edge mt-8 flex flex-wrap items-center justify-between gap-4 pb-28 md:pb-10">
          <p className="label opacity-60">
            © {shop.founded}—2026 {shop.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="label opacity-60">Privacy</span>
            <span className="label opacity-60">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
