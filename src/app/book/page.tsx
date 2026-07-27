import type { Metadata } from "next";
import { Suspense } from "react";
import { locations, services, shop } from "@/lib/content";
import { BookingFlow } from "@/components/book/BookingFlow";
import { count, money } from "@/lib/words";

export const metadata: Metadata = {
  title: "Запись",
  description: `Забронировать кресло в «${shop.name}» ${shop.cityIn}. Пять шагов: зал, услуга, мастер, время и ваше имя. ${count(
    services.length,
    "услуга",
    "услуги",
    "услуг"
  )} в ${count(locations.length, "зале", "залах", "залах")}, от ${money(
    Math.min(...services.map((s) => s.price))
  )}.`,
};

/**
 * A thin wrapper. The flow reads `?barber=` with `useSearchParams`, which
 * needs a Suspense boundary above it — the fallback is the same ember slab
 * carrying the same `data-tone`, so the fixed header never flickers.
 */
export default function BookPage() {
  return (
    <Suspense fallback={<BookingFallback />}>
      <BookingFlow />
    </Suspense>
  );
}

function BookingFallback() {
  return (
    <section
      data-tone="ink"
      className="relative min-h-svh bg-ember text-ink"
      aria-busy="true"
    >
      <div className="edge pt-[clamp(6.5rem,17svh,11rem)]">
        <div className="border-t border-current/20 pt-4">
          <p className="label">Шаг 01 / 05 — Зал</p>
        </div>
      </div>
    </section>
  );
}
