import Link from "next/link";
import { SplitText, Rise } from "@/components/motion/SplitText";
import { shop, BOOK_LABEL } from "@/lib/content";

/**
 * Apache serves this file for any URL that is not a route — `ErrorDocument
 * 404 /404.html` in public/.htaccess. Without it the export ships Next's stock
 * page, which is centred, unstyled and in English, on a site that is otherwise
 * entirely Russian.
 *
 * A espresso slab carrying `data-tone="ink"`, like every other opening slab on
 * the site, so the fixed header reads the right colour against it instead of
 * going white on espresso.
 */
export default function NotFound() {
  return (
    <section
      data-tone="paper"
      className="relative flex min-h-svh flex-col justify-center lamp bg-espresso text-paper"
    >
      <div className="edge py-[clamp(6rem,14vh,10rem)]">
        <p className="label">Ошибка 404</p>

        <SplitText
          as="h1"
          animateOnMount
          stagger={0.05}
          className="display mt-6 max-w-[16ch] text-hero"
          segments={[
            { text: "Такой страницы" },
            { text: "у нас нет.", italic: true },
          ]}
        />

        {/* Two ways out and nothing else: the way back to the top of the site,
            and the one thing the shop actually sells. */}
        <Rise animateOnMount delay={0.5} className="mt-[clamp(3rem,7vw,5rem)]">
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            <Link
              href="/"
              className="ui tap-reach group inline-flex items-center gap-3 border-b border-current/30 pb-2 transition-colors duration-300 hover:text-brass"
            >
              На главную
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
              >
                →
              </span>
            </Link>

            <Link
              href="/book"
              className="ui tap-reach group inline-flex items-center gap-3 border-b border-current/30 pb-2 transition-colors duration-300 hover:text-brass"
            >
              {BOOK_LABEL}
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>

          <p className="note mt-10 max-w-[36ch] opacity-75">
            Или позвоните: {shop.phone}
          </p>
        </Rise>
      </div>
    </section>
  );
}
