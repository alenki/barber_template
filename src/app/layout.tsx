import type { Metadata, Viewport } from "next";
import "./globals.css";
import { display, sans, typewriter } from "@/lib/fonts";
import { shop } from "@/lib/content";
import { Header } from "@/components/chrome/Header";
import { Footer } from "@/components/chrome/Footer";
import { StickyBook } from "@/components/chrome/StickyBook";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

/**
 * `cover` because every slab on this site is a flat, full-bleed colour: with
 * the default `contain`, a notched phone held sideways draws two black bars
 * down the sides of a espresso page. Covering the display means the espresso runs
 * under the cutout, and `--gutter` in globals.css carries the matching
 * `env(safe-area-inset-*)` so no type ever ends up beneath it.
 *
 * `themeColor` dresses the browser's own chrome to match. Every route on the
 * site opens on the espresso slab, so one colour is right for all of them.
 *
 * Deliberately no `maximumScale`/`userScalable`: pinch-zoom is the only way
 * some readers get through a page, and locking it is a WCAG 1.4.4 failure.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#241d17",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://millimetr.ru"),
  title: {
    default: `${shop.name} · барбершоп, ${shop.city}`,
    template: `%s · ${shop.name}`,
  },
  description: shop.description,
  openGraph: {
    title: `${shop.name} · барбершоп, ${shop.city}`,
    description: shop.description,
    type: "website",
    locale: "ru_RU",
    /* Rendered at 1200x630 by scripts/generate-images.mjs. This used to point
       at the hero, which is a 1920x2875 portrait, so every platform cropped
       its own arbitrary band out of the middle. */
    images: [{ url: "/img/og.jpg", width: 1200, height: 630 }],
  },
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml," +
          encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 24"><rect width="28" height="24" fill="#141210"/><g fill="#c2a06b"><rect x="1" y="4" width="4.5" height="16"/><rect x="8" y="4" width="3.2" height="16"/><rect x="13.6" y="4" width="2.2" height="16"/><rect x="18.2" y="4" width="1.4" height="16"/><rect x="22" y="4" width="0.8" height="16"/></g></svg>`
          ),
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${display.variable} ${sans.variable} ${typewriter.variable}`}
    >
      <body>
        <MotionProvider>
          <SmoothScroll>
            <a
              href="#main"
              className="ui sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:rounded-full focus:bg-ink focus:px-6 focus:py-3 focus:text-paper"
            >
              К содержимому
            </a>
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <StickyBook />
          </SmoothScroll>
        </MotionProvider>
      </body>
    </html>
  );
}
