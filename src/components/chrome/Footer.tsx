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
 * Shared by both link columns so the two answer identically — they read as one
 * block of navigation across a gap, and a difference between them would show.
 * `w-fit` so the box is the word: at full column width the target would start
 * a screen-width away from the type it belongs to.
 */
const LINK =
  "ui tap w-fit origin-left transition-transform duration-300 ease-out-expo hover:scale-[1.08] focus-visible:scale-[1.08]";

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
              never allowed to break a phone number across two lines.

              The column is the point. `tap` sets `display: inline-flex` to hold
              the 44px floor, which left both links on one line running into
              each other — «privet@millimetr.ru+7 (495) 123-45-67» — because
              `w-fit` and a top margin do nothing to an inline box. Making the
              wrapper the flex container puts them back on their own lines and
              keeps the tap targets; `items-start` is what stops each link
              stretching its underline to the full column. */}
          <div className="mt-3 flex flex-col items-start">
            <a
              href={`mailto:${shop.email}`}
              className="tap text-[clamp(1.1rem,1.9vw,1.6rem)] leading-[1.25] whitespace-nowrap underline-offset-[6px] transition-colors duration-500 hover:text-brass hover:underline"
            >
              {shop.email}
            </a>
            <a
              href={shop.phoneHref}
              className="tap text-[clamp(1.1rem,1.9vw,1.6rem)] leading-[1.25] whitespace-nowrap underline-offset-[6px] transition-colors duration-500 hover:text-brass hover:underline"
            >
              {shop.phone}
            </a>
          </div>
        </div>

        {/* Both columns are set in the 13px UI face, so on a phone every one of
            these was a 31px-tall target stacked 4px from the next one — the
            single densest patch of mistappable links on the site. `tap` takes
            each to the 44px floor, which also opens the rhythm of the column
            enough that the gap between them can come out.

            Hover is a step forward rather than the half-second fade to brass
            these used to do: over a photograph a small type colour change is
            most of a second of nothing much, where a scale answers on contact.
            `origin-left` is what keeps the word growing off its own left edge
            instead of drifting away from the column it is set in. */}
        <nav className="flex flex-col">
          {[...nav, { label: BOOK_LABEL, href: "/book" }].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={LINK}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col">
          {SOCIAL.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              /* min-w: "VK" is two letters and would otherwise be a 19px-wide
                 target. Nothing is drawn around it, so the extra hit area is
                 invisible. */
              className={`${LINK} min-w-12`}
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
        {/* pb clears the Book pill, which owns this corner; the inset is added
            on top so the last line is not tucked behind the home indicator. */}
        <div className="edge mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 pb-[calc(7rem+env(safe-area-inset-bottom))] md:pb-[calc(3.5rem+env(safe-area-inset-bottom))]">
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
