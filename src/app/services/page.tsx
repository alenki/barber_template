import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { services, combos, shop, type Service } from "@/lib/content";
import { SplitText, Rise } from "@/components/motion/SplitText";
import { Frame } from "@/components/motion/Frame";
import { count, money, plural, spell } from "@/lib/words";

/* ------------------------------------------------------------------
   Derived locally: content.ts owns the words, this file owns the maths.
   Everything here is pure and deterministic: same output on the server
   and the client, no dates, no randomness.
   ------------------------------------------------------------------ */


const prices = [...services.map((s) => s.price), ...combos.map((c) => c.price)];
const minutes = [...services.map((s) => s.minutes), ...combos.map((c) => c.minutes)];

const LOW = Math.min(...prices);
const HIGH = Math.max(...prices);
const SHORTEST = Math.min(...minutes);
const LONGEST = Math.max(...minutes);

/**
 * Alt text for the six service photographs. content.ts carries the paths,
 * not the descriptions, so the descriptions live here, one real sentence
 * per photograph, never "фото, на котором".
 */
const ALT: Record<string, string> = {
  "signature-cut":
    "Мастер стрижёт ножницами над расчёской, прядь зажата между двумя пальцами над ухом",
  "skin-fade":
    "Машинка идёт вверх по затылку клиента, самый короткий участок сведён в ноль",
  "beard-sculpt":
    "Опасная бритва ведёт линию скулы на густой бороде, лезвие держат плашмя к коже",
  "hot-towel-shave":
    "Парящее полотенце сложено на челюсти откинувшегося клиента перед первым проходом бритвы",
  "wash-and-style":
    "Голова клиента откинута в раковину, пена прорабатывается по волосам под струёй воды",
  "le-petit":
    "Мальчик сидит прямо в барберском кресле, пеньюар застёгнут, и смотрит на себя в зеркало",
};

const altFor = (s: Service) => ALT[s.id] ?? `«${s.name}» в «${shop.name}»`;

/**
 * The four notes on the ink slab. House voice: flat, unapologetic, a little
 * dry. Written here because they are policy, not catalogue.
 */
const POLICIES = [
  {
    n: "01",
    title: "Отмена",
    body: "Перенести или отменить бесплатно можно не позже чем за шесть часов. Внутри шести часов или при неявке мы списываем половину стоимости услуги. Кресло держали для вас, и занять его не мог никто другой.",
  },
  {
    n: "02",
    title: "Без записи",
    body: "Всегда пожалуйста, если есть свободное кресло. Запись гарантирует мастера и время. Без записи вы попадаете к тому, кто свободен, а в субботу днём это может быть никто.",
  },
  {
    n: "03",
    title: "Оплата",
    body: "Карта, СБП или наличные. Онлайн-запись ничего не списывает заранее: рассчитываетесь в кресле, когда всё готово. Чаевых никогда не ждут и всегда замечают.",
  },
  {
    n: "04",
    title: "Опоздание",
    body: "После пятнадцати минут нам, возможно, придётся сократить услугу или перенести запись. Позвоните до того, как приедете. В пробках на Садовом никто не виноват.",
  },
] as const;

/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: "Услуги",
  description: `Все услуги «${shop.name}» ${shop.cityIn} целиком: ${count(
    services.length,
    "услуга",
    "услуги",
    "услуг"
  )} и ${count(
    combos.length,
    "комбинация",
    "комбинации",
    "комбинаций"
  )}, от ${money(LOW)}. Стрижки, фейды, форма бороды и королевское бритьё, с длительностью и ценой каждой.`,
};

export default function ServicesPage() {
  return (
    <>
      {/* ---------------- Ember: the title ---------------- */}
      <section data-tone="ink" className="relative bg-ember text-ink">
        <div className="edge pt-[32svh] pb-[clamp(5rem,11vw,12rem)] md:pt-[36svh]">
          <Rise className="border-t border-current/20 pt-4">
            <p className="label">Услуги и цены</p>
          </Rise>

          <SplitText
            as="h1"
            className="display mt-8 max-w-[15ch] text-hero md:mt-12"
            segments={[
              {
                text: `${spell(services.length, "f")} ${plural(
                  services.length,
                  "услуга",
                  "услуги",
                  "услуг"
                )}.`,
              },
              { text: "Одна из них ваша.", italic: true },
            ]}
          />

          <Rise
            delay={0.2}
            className="mt-[14svh] flex flex-wrap items-baseline gap-x-10 gap-y-2 border-t border-current/20 pt-5 md:mt-[20svh]"
          >
            <span className="label">
              {count(services.length, "услуга", "услуги", "услуг")}
            </span>
            <span className="label">
              {count(combos.length, "комбинация", "комбинации", "комбинаций")}
            </span>
            <span className="label whitespace-nowrap">
              {money(LOW)}-{money(HIGH)}
            </span>
            <span className="label">
              {SHORTEST}-{LONGEST} минут
            </span>
          </Rise>

          <Rise delay={0.3} className="mt-10 flex md:mt-14 md:justify-end">
            <p className="note max-w-[34ch] md:text-right">
              В каждую цену входит консультация, горячее полотенце и ровно
              столько времени, сколько нужно. Ничего на этой странице не
              навязывается сверху.
            </p>
          </Rise>
        </div>
      </section>

      {/* ---------------- Paper: the six, in full ---------------- */}
      <section data-tone="ink" className="slab bg-paper text-ink">
        <div className="flex items-center justify-between gap-6 border-t border-current/20 pt-4">
          <span className="label">
            {services[0].index}-{services[services.length - 1].index}
          </span>
          <span
            className="display flex size-[clamp(2.6rem,4.6vw,4.75rem)] shrink-0 items-center justify-center rounded-full bg-ember text-[clamp(1.1rem,2vw,2.1rem)] text-ink italic"
            aria-hidden="true"
          >
            {services.length}
          </span>
        </div>

        <ul className="m-0 mt-16 list-none p-0 md:mt-24">
          {services.map((service, i) => (
            <ServiceRow key={service.id} service={service} imageLeft={i % 2 === 0} />
          ))}
        </ul>
      </section>

      {/* ---------------- Ember: combinations ---------------- */}
      <section data-tone="ink" className="relative bg-ember text-ink">
        <div className="edge py-[clamp(5rem,11vw,12rem)]">
          <div className="flex items-baseline justify-between gap-6 border-t border-current/20 pt-4">
            <span className="label">Комбинации</span>
            <span className="label">
              {count(combos.length, "вариант", "варианта", "вариантов")}
            </span>
          </div>

          {/* "Вместе" measures 2.85em wide in Playfair italic at the mega
              tracking, so the column's own inline size divided by 2.88 runs it
              gutter to gutter at every width. `cqw` rather than `vw` because a
              desktop scrollbar is part of `vw` and left the word 90px short. */}
          <div
            style={{ containerType: "inline-size" }}
            className="mt-6 overflow-x-clip md:mt-10"
          >
            <div style={{ "--text-mega": "calc(100cqw / 2.88)" } as CSSProperties}>
              <SplitText
                as="h2"
                className="mega block"
                segments={[{ text: "Вместе" }]}
              />
            </div>
          </div>

          <Rise delay={0.15} className="mt-10 flex md:mt-16 md:justify-end">
            <p className="note max-w-[32ch] md:text-right">
              Две услуги, одна посадка, одна цена. Бронируются как одна запись,
              так что никто никого не ждёт.
            </p>
          </Rise>

          <ul className="m-0 mt-16 list-none p-0 md:mt-24">
            {combos.map((combo, i) => (
              <li
                key={combo.name}
                className="border-t border-current/20 py-6 md:py-9"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="label">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="label">{combo.minutes} мин</span>
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-6 md:mt-5">
                  <h3 className="display text-lg italic">{combo.name}</h3>
                  <span className="display shrink-0 text-lg whitespace-nowrap">
                    {money(combo.price)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- Ink: good to know ---------------- */}
      <section data-tone="paper" className="slab bg-ink text-paper">
        <div className="flex items-baseline justify-between gap-6 border-t border-current/20 pt-4">
          <span className="label">Полезно знать</span>
          <span className="label opacity-60">
            {count(POLICIES.length, "заметка", "заметки", "заметок")}
          </span>
        </div>

        <SplitText
          as="h2"
          className="display mt-8 max-w-[15ch] text-hero md:mt-12"
          segments={[
            { text: "Четыре вещи, которые" },
            { text: "стоит знать заранее.", italic: true },
          ]}
        />

        <div className="mt-16 grid grid-cols-1 gap-x-16 gap-y-14 md:mt-28 md:grid-cols-2 md:gap-x-24 md:gap-y-24">
          {POLICIES.map((p, i) => (
            <Rise
              key={p.n}
              delay={i * 0.06}
              className="border-t border-current/20 pt-5"
            >
              <span className="label opacity-60">{p.n}</span>
              <h3 className="display mt-5 text-lg italic">{p.title}</h3>
              <p className="note mt-5 max-w-[34ch] opacity-80">{p.body}</p>
            </Rise>
          ))}
        </div>
      </section>

      {/* ---------------- Paper: the close ---------------- */}
      <section data-tone="ink" className="slab bg-paper text-ink">
        <div className="flex items-baseline justify-between gap-6 border-t border-current/20 pt-4">
          <span className="label">Бронь</span>
          <span className="label text-ash">Две минуты, без звонков</span>
        </div>

        <Link href="/book" className="group mt-10 block rounded-[10px] md:mt-16">
          <SplitText
            as="p"
            stagger={0.06}
            className="display text-[clamp(2.75rem,9vw,9.5rem)]"
            segments={[
              { text: "Теперь выберите свою." },
              { text: "Кресло уже держим.", italic: true },
            ]}
          />

          {/* Sticker on the left, like the one on the home page: the
              bottom-right corner belongs to the Book pill, and two booking
              circles stacked in it read as one broken control. */}
          <Rise
            delay={0.2}
            className="mt-12 flex items-center justify-between gap-6 md:mt-20"
          >
            <span
              className="display flex size-[clamp(5.5rem,10vw,9rem)] shrink-0 items-center justify-center rounded-full bg-ember text-[clamp(1.05rem,1.8vw,1.75rem)] text-ink italic transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[14deg]"
              aria-hidden="true"
            >
              Запись
            </span>
            <span className="ui text-right">Услуга, кресло, время</span>
          </Rise>
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */

/**
 * One service, one generous row. Odd rows put the photograph on the left,
 * even rows on the right, so the eye zig-zags down the slab instead of
 * running a list. Both cells are pinned to row 1 explicitly; with only a
 * column start, grid auto-placement would push the second cell down a row.
 */
function ServiceRow({
  service,
  imageLeft,
}: {
  service: Service;
  imageLeft: boolean;
}) {
  const textPlace = imageLeft
    ? "md:col-start-7 md:col-span-6 md:row-start-1"
    : "md:col-start-1 md:col-span-6 md:row-start-1";
  const imagePlace = imageLeft
    ? "md:col-start-1 md:col-span-5 md:row-start-1"
    : "md:col-start-8 md:col-span-5 md:row-start-1";

  return (
    <li
      id={service.id}
      /* scroll-mt keeps the fixed header off the anchor when the home page
         deep-links here with /services#skin-fade */
      className="scroll-mt-28 border-t border-current/20 pt-5 pb-20 md:pt-7 md:pb-32 lg:pb-40"
    >
      <div className="grid grid-cols-1 gap-y-10 md:grid-cols-12 md:items-start md:gap-x-6 lg:gap-x-8">
        <div className={textPlace}>
          <span className="label">{service.index}</span>

          <SplitText
            as="h2"
            className="display mt-4 text-xl md:mt-6"
            segments={[{ text: service.name, italic: true }]}
          />

          {/* The blurb and the price share one 46ch measure. `ch` resolves
              against the font-size of the box it is written on, so the measure
              is set once here; put it on both children and the two right
              edges land in different places. */}
          <div className="mt-7 max-w-[46ch] text-md md:mt-10">
            <Rise delay={0.12}>
              <p className="font-sans leading-[1.38]">{service.blurb}</p>
            </Rise>

            <Rise delay={0.2} className="mt-8 md:mt-12">
              <div className="flex items-baseline justify-between gap-6 border-t border-current/20 pt-4">
                <span className="display text-lg">{service.minutes} мин</span>
                <span className="display text-lg italic whitespace-nowrap">
                  {money(service.price)}
                </span>
              </div>
            </Rise>
          </div>
        </div>

        <div className={imagePlace}>
          <Frame
            src={service.image}
            alt={altFor(service)}
            parallax={8}
            sizes="(min-width: 768px) 42vw, 100vw"
            className="aspect-[4/3] w-full"
            objectPosition="center 40%"
          />
        </div>
      </div>
    </li>
  );
}
