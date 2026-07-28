import Image from "next/image";
import Link from "next/link";
import { shop, nav, locations, BOOK_LABEL } from "@/lib/content";
import { SplitText } from "@/components/motion/SplitText";

/* A server component, so this is stamped at build time and never differs
   between the server and the client. */
const YEAR = new Date().getFullYear();

/** Where a Moscow shop actually lives. Instagram is not one of them. */
const SOCIAL = [
  { label: "Telegram", href: shop.telegram },
  { label: "VK", href: shop.vk },
  { label: "Яндекс Карты", href: shop.maps },
] as const;

/**
 * Full-bleed photograph, links laid over it, and the closing line
 * sitting on the bottom edge at the largest size on the site.
 *
 * Everything here is small type on a photograph, so nothing is allowed to sit
 * at low opacity: the scrim does the contrast work, and the links stay solid.
 */
export function Footer() {
  return (
    <footer
      data-tone="paper"
      className="relative isolate flex min-h-[92svh] flex-col justify-between overflow-hidden bg-ink text-paper"
    >
      <Image
        src="/img/interior-wide.jpg"
        alt={`Зал «${locations[0].name}» после закрытия`}
        fill
        sizes="100vw"
        className="-z-10 object-cover opacity-65"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/55 to-ink/65" />

      <div className="edge grid gap-12 pt-32 md:grid-cols-[minmax(0,1fr)_auto_auto] md:gap-16 md:pt-40">
        <div>
          <p className="label text-paper/70">
            {shop.name} · {shop.city}, {shop.country}
          </p>
          {/* Contact is data, not display: it stays in the UI face and is
              never allowed to break a phone number across two lines. */}
          <a
            href={`mailto:${shop.email}`}
            className="mt-4 -my-1 block w-fit py-1 text-[clamp(1.1rem,1.9vw,1.6rem)] leading-[1.25] whitespace-nowrap underline-offset-[6px] transition-colors duration-500 hover:text-ember hover:underline"
          >
            {shop.email}
          </a>
          <a
            href={shop.phoneHref}
            className="-my-1 block w-fit py-1 text-[clamp(1.1rem,1.9vw,1.6rem)] leading-[1.25] whitespace-nowrap underline-offset-[6px] transition-colors duration-500 hover:text-ember hover:underline"
          >
            {shop.phone}
          </a>
        </div>

        <nav className="flex flex-col gap-1">
          {[...nav, { label: BOOK_LABEL, href: "/book" }].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="ui w-fit py-1.5 transition-colors duration-500 hover:text-ember"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-1">
          {SOCIAL.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              /* min-w: "VK" is two letters and would otherwise be a 19px-wide
                 target. Nothing is drawn around it, so the extra hit area is
                 invisible. */
              className="ui w-fit min-w-12 py-1.5 transition-colors duration-500 hover:text-ember"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <div className="edge mt-16 grid gap-8 md:grid-cols-3">
        {locations.map((l) => (
          <div key={l.id}>
            <p className="ui mb-2">{l.name}</p>
            <p className="label text-paper/75">
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
          segments={[{ text: "Ваше кресло" }, { text: "уже ждёт.", italic: true }]}
          stagger={0.07}
        />
        {/* The Book pill owns the bottom-right corner of every screen, so the
            legal line runs left-to-right out of that corner rather than into
            it, and keeps a pill's worth of clearance underneath. */}
        <div className="edge mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 pb-28 md:pb-14">
          <p className="label text-paper/65">
            © {shop.founded}-{YEAR} {shop.name}. Все права защищены.
          </p>
          <span className="label text-paper/65">Конфиденциальность</span>
          <span className="label text-paper/65">Условия</span>
        </div>
      </div>
    </footer>
  );
}
