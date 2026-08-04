"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useLenis } from "lenis/react";
import Image from "next/image";
import { barbers, locations, services, shop } from "@/lib/content";
import { SplitText, Rise } from "@/components/motion/SplitText";
import { OptionRow } from "./OptionRow";
import { SummaryBar, SummaryRail, type SummaryRow } from "./Summary";
import { TimeStep } from "./TimeStep";
import { DetailsForm, type Details } from "./DetailsForm";
import { Confirmation, type Booking } from "./Confirmation";
import {
  ANY_CHAIR,
  buildDays,
  clock,
  dayLabel,
  referenceCode,
  serverSnapshot,
  spell,
  subscribeNever,
  todaySnapshot,
  type Day,
} from "./schedule";
import { money, plural } from "@/lib/words";

const EASE = [0.16, 1, 0.3, 1] as const;
const EASE_CLASS = "ease-[cubic-bezier(0.16,1,0.3,1)]";

const STEP_COUNT = 5;
const DONE = STEP_COUNT + 1;

/* ------------------------------------------------------------------
   The words on this screen that are not a name, a price or an hour.
   content.ts owns the shop; this file owns the questions it asks.
   ------------------------------------------------------------------ */

/**
 * Each step asks one question and says nothing else. The paragraph of
 * typewriter copy that used to sit under every one of these was answering
 * questions nobody had reached yet; the ones worth keeping are in the FAQ on
 * the home page, and the only one that changes a decision here (nothing is
 * charged now) survives on the last step.
 */
const STEPS = [
  {
    eyebrow: "Зал",
    roman: `${spell(locations.length, "m")} ${plural(
      locations.length,
      "зал",
      "зала",
      "залов"
    )}.`,
    italic: "Выберите один.",
  },
  {
    eyebrow: "Услуга",
    roman: "Что будем",
    italic: "делать?",
  },
  {
    eyebrow: "Кресло",
    roman: "В чьи",
    italic: "руки?",
  },
  {
    eyebrow: "Время",
    roman: "Когда вам",
    italic: "удобно сесть?",
  },
  {
    eyebrow: "Вы",
    roman: "Для кого",
    italic: "держим кресло?",
    note: "Сейчас ничего не списывается — рассчитаетесь в кресле.",
  },
] as const;

const SUBMIT_LABEL = "Держим кресло";

/* "Барбер · Мастер бритья" reads badly mid-sentence in alt text. */
const readableRole = (role: string) => role.replace(" · ", ", ");

/* ------------------------------------------------------------------ */

type Chosen = {
  location: string | null;
  service: string | null;
  barber: string | null;
  date: string | null;
  /** Minutes from midnight, so the end of the appointment is arithmetic. */
  time: number | null;
};

const EMPTY: Chosen = {
  location: null,
  service: null,
  barber: null,
  date: null,
  time: null,
};

export function BookingFlow() {
  const params = useSearchParams();

  /* /barbers links in with ?barber=artem; honour it, but still ask for the
     room and the service first. */
  const preset = params.get("barber");
  const presetBarber =
    preset && (preset === ANY_CHAIR.id || barbers.some((b) => b.id === preset))
      ? preset
      : null;

  const [step, setStep] = useState(1);
  const [chosen, setChosen] = useState<Chosen>(() => ({
    ...EMPTY,
    barber: presetBarber,
  }));
  const [booking, setBooking] = useState<Booking | null>(null);

  /* The only real date on the page. Read through useSyncExternalStore so the
     server renders `null` and the client renders today's date, so no hydration
     mismatch, and no setState cascading out of an effect. `todaySnapshot` is
     memoised at module scope because getSnapshot must be referentially stable. */
  const startISO = useSyncExternalStore(
    subscribeNever,
    todaySnapshot,
    serverSnapshot
  );
  const days: Day[] = useMemo(
    () => (startISO ? buildDays(startISO) : []),
    [startISO]
  );

  const room = locations.find((l) => l.id === chosen.location) ?? null;
  const service = services.find((s) => s.id === chosen.service) ?? null;
  const barber = barbers.find((b) => b.id === chosen.barber) ?? null;
  const chairName =
    chosen.barber === ANY_CHAIR.id ? ANY_CHAIR.name : barber?.name ?? null;
  const day = days.find((d) => d.iso === chosen.date) ?? null;

  /* ------------------------------------------------------- transitions */

  /**
   * `mode="wait"` means the incoming step is not in the document until the
   * outgoing one has finished leaving, so focus is moved by a callback ref
   * when the new panel actually mounts rather than on the state change.
   */
  const mounted = useRef(false);
  const wantsFocus = useRef(false);
  const lenis = useLenis();

  const stepPanel = useCallback((node: HTMLDivElement | null) => {
    if (node && wantsFocus.current) {
      wantsFocus.current = false;
      node.focus({ preventScroll: true });
    }
  }, []);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    wantsFocus.current = true;
    /* Through Lenis rather than `window.scrollTo`: a step advanced while the
       smooth scroll was still settling would have had its jump overwritten by
       the next frame of the glide, and the new step would open mid-page. */
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, [step, lenis]);

  const pickLocation = (id: string) => {
    /* Hours differ room to room, so a held time cannot survive the move. */
    setChosen((c) => ({ ...c, location: id, date: null, time: null }));
    setStep(2);
  };

  const pickService = (id: string) => {
    /* The slot grid is cut from the service length: drop the hour, keep the day. */
    setChosen((c) => ({ ...c, service: id, time: null }));
    setStep(3);
  };

  const pickBarber = (id: string) => {
    setChosen((c) => ({ ...c, barber: id }));
    setStep(4);
  };

  const pickDay = useCallback((iso: string) => {
    setChosen((c) => (c.date === iso ? c : { ...c, date: iso, time: null }));
  }, []);

  const pickTime = (minutes: number) => {
    setChosen((c) => ({ ...c, time: minutes }));
    setStep(5);
  };

  const submit = (details: Details) => {
    if (!room || !service || !day || chosen.time === null) return;
    setBooking({
      room: room.name,
      roomAddress: `${room.address}, ${room.city}`,
      roomImage: room.image,
      service: service.name,
      chair: chairName ?? ANY_CHAIR.name,
      dateLabel: dayLabel(day),
      start: chosen.time,
      price: service.price,
      minutes: service.minutes,
      reference: referenceCode([
        room.id,
        service.id,
        chosen.barber,
        day.iso,
        chosen.time,
        details.name,
      ]),
      details,
    });
    setStep(DONE);
  };

  const restart = () => {
    setBooking(null);
    setChosen({ ...EMPTY, barber: presetBarber });
    setStep(1);
  };

  /* Jumping back from the rail must never leave a stale hour behind. */
  const jump = (target: number) => {
    if (target >= step || step === DONE) return;
    setStep(target);
  };

  /* ------------------------------------------------------------ summary */

  const rows: SummaryRow[] = [
    { key: "room", label: "Зал", value: room?.name ?? null, step: 1 },
    { key: "service", label: "Услуга", value: service?.name ?? null, step: 2 },
    { key: "chair", label: "Кресло", value: chairName, step: 3 },
    { key: "day", label: "День", value: day ? dayLabel(day) : null, step: 4 },
    {
      key: "time",
      label: "Время",
      value: chosen.time === null ? null : clock(chosen.time),
      step: 4,
    },
  ];

  const total = service ? service.price : null;

  const done = step === DONE;
  const current = STEPS[Math.min(step, STEP_COUNT) - 1];

  return (
    <section
      data-tone="paper"
      className="relative min-h-svh lamp bg-espresso text-paper"
    >
      <div className="edge pt-[clamp(6.5rem,17svh,11rem)] pb-[clamp(4.5rem,10vw,9rem)]">
        {/* ----------------------------------------------- progress head */}
        <div className="flex items-baseline justify-between gap-6 border-t border-current/20 pt-4">
          <p className="label" role="status" aria-live="polite">
            {done
              ? "Готово"
              : `Шаг ${String(step).padStart(2, "0")} / ${String(
                  STEP_COUNT
                ).padStart(2, "0")} · ${current.eyebrow}`}
          </p>

          {done ? (
            <span className="label opacity-75">{shop.city}</span>
          ) : step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="ui tap-reach group inline-flex items-center gap-2 border-b border-current/30 pb-1 transition-opacity duration-500 hover:opacity-60"
            >
              <span
                aria-hidden="true"
                className={`inline-block transition-transform duration-500 ${EASE_CLASS} group-hover:-translate-x-1`}
              >
                ←
              </span>
              Назад
            </button>
          ) : (
            <span className="label opacity-75">{shop.city}</span>
          )}
        </div>

        {/* The five-segment rule that used to sit here said the same thing as
            "Шаг 03 / 05" directly above it, one inch lower and in a different
            language. One counter is a counter; two are decoration. */}

        {!done && <SummaryBar rows={rows} total={total} />}

        {/* ----------------------------------------------------- the step */}
        <div className="mt-[clamp(2.5rem,6vw,5rem)] grid grid-cols-1 gap-y-[clamp(3rem,6vw,5rem)] md:grid-cols-12 md:gap-x-[clamp(1.5rem,3vw,3.5rem)]">
          <div className={done ? "md:col-span-12" : "md:col-span-7"}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: EASE }}
                ref={stepPanel}
                tabIndex={-1}
                className="outline-none"
              >
                {done && booking ? (
                  <Confirmation booking={booking} onRestart={restart} />
                ) : (
                  <>
                    {/* h1, not h2: the step question is the only heading on
                        the page, and /book was the one route without one. */}
                    <SplitText
                      as="h1"
                      animateOnMount
                      stagger={0.04}
                      duration={0.85}
                      className="display text-[clamp(2.6rem,6.6vw,6.75rem)]"
                      segments={[
                        { text: current.roman },
                        { text: current.italic, italic: true },
                      ]}
                    />

                    {"note" in current ? (
                      <Rise
                        animateOnMount
                        delay={0.08}
                        y={16}
                        duration={0.55}
                        className="mt-[clamp(1.5rem,3vw,2.5rem)]"
                      >
                        <p className="note max-w-[40ch] opacity-75">
                          {current.note}
                        </p>
                      </Rise>
                    ) : null}

                    <Rise
                      animateOnMount
                      delay={0.14}
                      y={20}
                      duration={0.55}
                      className="mt-[clamp(2.5rem,5vw,4.5rem)]"
                    >
                      <StepBody
                        step={step}
                        chosen={chosen}
                        days={days}
                        presetBarber={presetBarber}
                        onLocation={pickLocation}
                        onService={pickService}
                        onBarber={pickBarber}
                        onDay={pickDay}
                        onTime={pickTime}
                        onSubmit={submit}
                      />
                    </Rise>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {!done && (
            <SummaryRail
              rows={rows}
              total={total}
              currentStep={step}
              onJump={jump}
            />
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function StepBody({
  step,
  chosen,
  days,
  presetBarber,
  onLocation,
  onService,
  onBarber,
  onDay,
  onTime,
  onSubmit,
}: {
  step: number;
  chosen: Chosen;
  days: Day[];
  presetBarber: string | null;
  onLocation: (id: string) => void;
  onService: (id: string) => void;
  onBarber: (id: string) => void;
  onDay: (iso: string) => void;
  onTime: (minutes: number) => void;
  onSubmit: (details: Details) => void;
}) {
  const room = locations.find((l) => l.id === chosen.location) ?? null;
  const service = services.find((s) => s.id === chosen.service) ?? null;

  if (step === 1) {
    const held = barbers.find((b) => b.id === presetBarber);
    return (
      <>
        <ul className="m-0 list-none p-0">
          {locations.map((location, i) => (
            <OptionRow
              key={location.id}
              index={String(i + 1).padStart(2, "0")}
              title={location.name}
              detail={location.address}
              selected={chosen.location === location.id}
              onSelect={() => onLocation(location.id)}
            />
          ))}
        </ul>
        {held ? (
          <p className="label mt-6 opacity-75">
            Кресло {held.chair}, {held.name}: уже выбрано за вас.
          </p>
        ) : null}
      </>
    );
  }

  if (step === 2) {
    return (
      <ul className="m-0 list-none p-0">
        {services.map((s) => (
          <OptionRow
            key={s.id}
            index={s.index}
            title={s.name}
            detail={`${s.minutes} мин`}
            value={money(s.price)}
            selected={chosen.service === s.id}
            onSelect={() => onService(s.id)}
          />
        ))}
      </ul>
    );
  }

  if (step === 3) {
    return (
      <ul className="m-0 list-none p-0">
        {barbers.map((b) => (
          <OptionRow
            key={b.id}
            index={b.chair}
            media={
              /* A span, not a div: this sits inside the row's button, and a
                 button may only hold phrasing content. */
              <span className="relative block size-[clamp(3.25rem,5.5vw,4.75rem)] overflow-hidden rounded-[10px] bg-paper/10">
                <Image
                  src={b.image}
                  alt={`Портрет: ${b.name}, ${readableRole(b.role)} в «${
                    shop.name
                  }»`}
                  fill
                  sizes="96px"
                  className="object-cover"
                  style={{ objectPosition: "center 25%" }}
                />
              </span>
            }
            title={b.name}
            detail={b.role}
            selected={chosen.barber === b.id}
            onSelect={() => onBarber(b.id)}
          />
        ))}

        <OptionRow
          key={ANY_CHAIR.id}
          index="·"
          media={
            <span className="grid size-[clamp(3.25rem,5.5vw,4.75rem)] place-items-center rounded-[10px] border border-current/25">
              <span className="label leading-none opacity-75">Любой</span>
            </span>
          }
          title={ANY_CHAIR.name}
          detail={ANY_CHAIR.role}
          selected={chosen.barber === ANY_CHAIR.id}
          onSelect={() => onBarber(ANY_CHAIR.id)}
        />
      </ul>
    );
  }

  if (step === 4) {
    if (!room || !service) return null;
    return (
      <TimeStep
        room={room}
        service={service}
        days={days}
        date={chosen.date}
        time={chosen.time}
        onPickDay={onDay}
        onPickTime={onTime}
      />
    );
  }

  return <DetailsForm onSubmit={onSubmit} submitLabel={SUBMIT_LABEL} />;
}
