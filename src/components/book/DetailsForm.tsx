"use client";

import { useId, useRef, useState } from "react";
import type { ChangeEvent } from "react";

export type Details = {
  name: string;
  email: string;
  phone: string;
  note: string;
};

export type FieldName = "name" | "email" | "phone";

const EASE_CLASS = "ease-[cubic-bezier(0.16,1,0.3,1)]";

/* The house voice, applied to being told off. Short, flat, never scolding. */
const COMPLAINT: Record<FieldName, string> = {
  name: "Нам нужно имя, чтобы записать его на кресло.",
  email: "В этом адресе чего-то не хватает, проверьте.",
  phone: "Номер, по которому вас можно набрать: не меньше десяти цифр.",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(d: Details): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  if (d.name.trim().length < 2) errors.name = COMPLAINT.name;
  if (!EMAIL.test(d.email.trim())) errors.email = COMPLAINT.email;
  if (d.phone.replace(/\D/g, "").length < 10) errors.phone = COMPLAINT.phone;
  return errors;
}

/**
 * The only step that asks rather than offers. Real labels, real input types,
 * and complaints that are announced where they happen; nothing is validated
 * until you have had a go at the whole thing.
 */
export function DetailsForm({
  onSubmit,
  submitLabel,
}: {
  onSubmit: (details: Details) => void;
  submitLabel: string;
}) {
  const baseId = useId();
  const [details, setDetails] = useState<Details>({
    name: "",
    email: "",
    phone: "",
    note: "",
  });
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [tried, setTried] = useState(false);

  const refs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
  };

  const set = (field: keyof Details) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const next = { ...details, [field]: e.target.value };
    setDetails(next);
    /* Once you have been told off, the message clears the moment it is fixed. */
    if (tried) setErrors(validate(next));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTried(true);
    const found = validate(details);
    setErrors(found);
    const first = (["name", "email", "phone"] as FieldName[]).find(
      (f) => found[f]
    );
    if (first) {
      refs[first].current?.focus();
      return;
    }
    onSubmit({
      name: details.name.trim(),
      email: details.email.trim(),
      phone: details.phone.trim(),
      note: details.note.trim(),
    });
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="max-w-[38rem]">
      <Field
        id={`${baseId}-name`}
        label="Имя"
        hint="Как к вам обращаться"
        error={errors.name}
      >
        {(props) => (
          <input
            {...props}
            ref={refs.name}
            type="text"
            name="name"
            autoComplete="name"
            required
            value={details.name}
            onChange={set("name")}
          />
        )}
      </Field>

      <Field
        id={`${baseId}-email`}
        label="Почта"
        hint="Только для напоминания, больше ни для чего"
        error={errors.email}
      >
        {(props) => (
          <input
            {...props}
            ref={refs.email}
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            required
            value={details.email}
            onChange={set("email")}
          />
        )}
      </Field>

      <Field
        id={`${baseId}-phone`}
        label="Телефон"
        hint="На случай, если мастер задержится"
        error={errors.phone}
      >
        {(props) => (
          <input
            {...props}
            ref={refs.phone}
            type="tel"
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            required
            value={details.phone}
            onChange={set("phone")}
          />
        )}
      </Field>

      <Field
        id={`${baseId}-note`}
        label="Что нам стоит знать"
        hint="Необязательно"
      >
        {(props) => (
          <textarea
            {...props}
            name="note"
            rows={2}
            value={details.note}
            onChange={set("note")}
            className={`${props.className} resize-none`}
          />
        )}
      </Field>

      <button
        type="submit"
        className={`group relative mt-[clamp(2.5rem,5vw,4rem)] flex w-full items-center justify-between gap-6 overflow-hidden rounded-[10px] bg-ink px-[clamp(1.25rem,2.4vw,2rem)] py-[clamp(1.25rem,2.4vw,1.9rem)] text-ember transition-colors duration-500 ${EASE_CLASS}`}
      >
        <span className="display text-[clamp(1.35rem,2.6vw,2.25rem)] leading-none italic">
          {submitLabel}
        </span>
        <span
          aria-hidden="true"
          className={`text-[clamp(1.1rem,2vw,1.6rem)] leading-none transition-transform duration-[600ms] ${EASE_CLASS} group-hover:translate-x-2`}
        >
          →
        </span>
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */

type ControlProps = {
  id: string;
  className: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

/**
 * Label above, hairline under, Bodoni in between. The complaint takes the
 * place of the hint so the row never changes height.
 */
function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint: string;
  error?: string;
  children: (props: ControlProps) => React.ReactNode;
}) {
  const messageId = `${id}-message`;

  return (
    <p className="m-0 mt-[clamp(1.75rem,3.5vw,2.75rem)] first:mt-0">
      <label htmlFor={id} className="label block">
        {label}
      </label>

      {children({
        id,
        "aria-describedby": messageId,
        "aria-invalid": error ? true : undefined,
        className: `display mt-3 block w-full border-b bg-transparent pb-3 text-[clamp(1.4rem,3vw,2.4rem)] leading-[1.25] italic transition-colors duration-500 placeholder:opacity-40 ${
          error ? "border-ink" : "border-current/30 focus:border-current"
        }`,
      })}

      {/* The complaint sits in a live region that is on the page from the
          start; an alert added only when it fires often goes unannounced. */}
      <span id={messageId} className="label mt-2 block">
        <span className={error ? "hidden" : "opacity-75"}>{hint}</span>
        <span role="alert" className="font-bold">
          {error ?? ""}
        </span>
      </span>
    </p>
  );
}
