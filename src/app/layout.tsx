import type { Metadata } from "next";
import "./globals.css";
import { display, sans, typewriter } from "@/lib/fonts";
import { shop } from "@/lib/content";
import { Header } from "@/components/chrome/Header";
import { Footer } from "@/components/chrome/Footer";
import { StickyBook } from "@/components/chrome/StickyBook";
import { MotionProvider } from "@/components/motion/MotionProvider";

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
    images: ["/img/hero-chair.jpg"],
  },
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml," +
          encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 24"><rect width="28" height="24" fill="#0a0908"/><g fill="#ff5a1f"><rect x="1" y="4" width="4.5" height="16"/><rect x="8" y="4" width="3.2" height="16"/><rect x="13.6" y="4" width="2.2" height="16"/><rect x="18.2" y="4" width="1.4" height="16"/><rect x="22" y="4" width="0.8" height="16"/></g></svg>`
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
        </MotionProvider>
      </body>
    </html>
  );
}
