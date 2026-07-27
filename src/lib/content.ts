/**
 * Every word and price on the site lives here.
 * Swapping this file for a real shop's details rebrands the whole thing.
 */

export const shop = {
  name: "Maison Fade",
  short: "Maison",
  city: "Montréal",
  province: "QC",
  founded: 2016,
  email: "bonjour@maisonfade.ca",
  phone: "(514) 555-0142",
  phoneHref: "tel:+15145550142",
  instagram: "https://instagram.com",
  tagline: "Your chair is waiting.",
  description:
    "A Montréal barbershop where the difference is the last two millimetres. Cuts, fades, beards and hot towel shaves, by appointment or walk-in.",
} as const;

export const nav = [
  { label: "Services", href: "/services" },
  { label: "The Chairs", href: "/barbers" },
  { label: "Journal", href: "/journal" },
] as const;

/* ------------------------------------------------------------------ */

export const hero = {
  /* Rendered as one headline; the italic run is the emphasis. */
  roman: "A Montréal barbershop where the difference is",
  italic: "the last two millimetres",
  meta: ["Est. 2016", "Three rooms", "Open seven days"],
} as const;

export const manifesto = {
  note: "It's never just a haircut. It's the one appointment in your week that exists for no reason other than you.",
  headline: "Forty minutes that belong to nobody else",
  body: "One barber, start to finish. No rotation, no rush, no upsell. You sit, we ask what you want, and then we take the time it actually takes.",
} as const;

/* ------------------------------------------------------------------ */

export type Service = {
  id: string;
  index: string;
  name: string;
  price: number;
  minutes: number;
  blurb: string;
  image: string;
};

export const services: Service[] = [
  {
    id: "signature-cut",
    index: "01",
    name: "Signature Cut",
    price: 55,
    minutes: 45,
    blurb:
      "Consultation, cut, hot towel, style. The one we are known for, and the one we will not rush.",
    image: "/img/svc-cut.jpg",
  },
  {
    id: "skin-fade",
    index: "02",
    name: "Skin Fade",
    price: 60,
    minutes: 50,
    blurb:
      "Taken down to nothing at the neck and blended upward until the line stops existing.",
    image: "/img/svc-fade.jpg",
  },
  {
    id: "beard-sculpt",
    index: "03",
    name: "Beard Sculpt",
    price: 35,
    minutes: 30,
    blurb:
      "Shaped with shears and clipper, edged with a straight razor, finished with oil.",
    image: "/img/svc-beard.jpg",
  },
  {
    id: "hot-towel-shave",
    index: "04",
    name: "Hot Towel Shave",
    price: 50,
    minutes: 40,
    blurb:
      "Three towels, a badger brush, a straight razor and a cold finish. A ritual, not a service.",
    image: "/img/svc-shave.jpg",
  },
  {
    id: "wash-and-style",
    index: "05",
    name: "Wash & Style",
    price: 30,
    minutes: 25,
    blurb:
      "Deep wash, four minutes of scalp massage, blow-out and product. Between cuts, or before anything important.",
    image: "/img/svc-wash.jpg",
  },
  {
    id: "le-petit",
    index: "06",
    name: "Le Petit",
    price: 35,
    minutes: 30,
    blurb:
      "For clients under twelve. Their own chair, their own mirror, and a certificate for the first one.",
    image: "/img/svc-kids.jpg",
  },
];

export const combos = [
  { name: "Cut & Beard", price: 80, minutes: 70 },
  { name: "Cut & Hot Towel Shave", price: 95, minutes: 80 },
  { name: "The Full Hour", price: 120, minutes: 90 },
] as const;

/* ------------------------------------------------------------------ */

export type Barber = {
  id: string;
  chair: string;
  name: string;
  role: string;
  years: number;
  bio: string;
  specialties: string[];
  image: string;
};

export const barbers: Barber[] = [
  {
    id: "amir",
    chair: "01",
    name: "Amir Belkacem",
    role: "Master Barber · Founder",
    years: 14,
    bio: "Opened the Saint-Denis room in 2016 with two chairs and a borrowed mirror. Scissor-over-comb, textured crops, and an unreasonable devotion to the perimeter.",
    specialties: ["Scissor work", "Textured crops", "Grey blending"],
    image: "/img/barber-1.jpg",
  },
  {
    id: "theo",
    chair: "02",
    name: "Théo Marchand",
    role: "Barber · Shave Specialist",
    years: 9,
    bio: "Trained in Lyon under a barber who timed him with a stopwatch. Believes a shave should take forty minutes and not one less.",
    specialties: ["Straight razor", "Hot towel", "Classic parts"],
    image: "/img/barber-2.jpg",
  },
  {
    id: "wesley",
    chair: "03",
    name: "Wesley Okonjo",
    role: "Barber",
    years: 7,
    bio: "Skin fades measured to the millimetre and line-ups you could set a ruler against. Ask him about waves; he will talk for an hour.",
    specialties: ["Skin fades", "Line-ups", "Waves"],
    image: "/img/barber-3.jpg",
  },
  {
    id: "marco",
    chair: "04",
    name: "Marco Ferrante",
    role: "Senior Barber",
    years: 21,
    bio: "Twenty-one years, three cities, one pompadour that has never once fallen. The best conversation in the room, whether you want it or not.",
    specialties: ["Pompadours", "Side parts", "Beard shaping"],
    image: "/img/barber-4.jpg",
  },
  {
    id: "elias",
    chair: "05",
    name: "Elias Haddad",
    role: "Barber · Curl Specialist",
    years: 6,
    bio: "Curls, coils and everything the clipper guards cannot solve. The only one of us allowed near a razor on wet hair.",
    specialties: ["Curly & coily", "Dry cutting", "Kids"],
    image: "/img/barber-5.jpg",
  },
];

/* ------------------------------------------------------------------ */

export const testimonials = [
  {
    name: "Julien R.",
    quote:
      "I had the same haircut for eleven years. Amir gave me one I did not know I wanted, and now I cannot go anywhere else.",
    image: "/img/test-1.jpg",
  },
  {
    name: "Samuel D.",
    quote:
      "The hot towel shave is worth the price twice over. I book it the day before every wedding, funeral and job interview.",
    image: "/img/test-2.jpg",
  },
  {
    name: "Noah P.",
    quote:
      "Booked online in nine seconds, walked out forty minutes later looking like a better-paid version of myself.",
    image: "/img/test-3.jpg",
  },
] as const;

/* ------------------------------------------------------------------ */

export const ritual = [
  {
    n: "1",
    text: "A drink before we start. Espresso until six, something stronger after.",
  },
  {
    n: "2",
    text: "Forty minutes with one barber. The same one, every time, if you want it that way.",
  },
  {
    n: "3",
    text: "A hot towel, a cold finish, and your next chair held before you reach the door.",
  },
] as const;

/* ------------------------------------------------------------------ */

export type Post = {
  slug: string;
  title: string;
  category: string;
  readMinutes: number;
  date: string;
  excerpt: string;
  image: string;
  /** One real sentence describing the photograph. Never "image of". */
  imageAlt: string;
  body: string[];
};

export const posts: Post[] = [
  {
    slug: "how-often-should-you-cut-your-hair",
    title: "How often should you actually be cutting your hair?",
    category: "Grooming",
    readMinutes: 4,
    date: "12 June 2026",
    excerpt:
      "The honest answer is that it depends on the shape, not the calendar — and most men wait about nine days too long.",
    image: "/img/journal-1.jpg",
    imageAlt:
      "A badger shaving brush resting in a silver lather bowl beside two open straight razors and a row of clipper guards on a dark towel",
    body: [
      "The standard advice is four weeks, and the standard advice is wrong roughly half the time. What actually decides your interval is not how fast your hair grows but how much of the shape is doing the work.",
      "A skin fade is almost entirely shape. The moment the shortest section grows past a millimetre or two, the blend that took your barber twenty minutes stops reading as a blend and starts reading as a haircut that is growing out. Two to three weeks, no argument.",
      "A longer textured crop is the opposite. The shape lives in the perimeter and the weight, and both survive growth. Six weeks is fine. Eight is often better, because the cut settles into itself around week five.",
      "The test is simple, and you can do it in your bathroom. Push your hair the wrong way and let go. If it falls back into the shape, you have time. If it stays where you pushed it, the weight has gone and you are due.",
      "One more thing nobody says out loud: book the next appointment before you leave. Not because we want the booking, but because the six weeks where you meant to call and did not are the six weeks you will resent.",
    ],
  },
  {
    slug: "growing-it-out-one-more-month",
    title: "The case for growing it out one more month",
    category: "Style",
    readMinutes: 3,
    date: "28 May 2026",
    excerpt:
      "The awkward stage is not a stage. It is a shape problem, and it is fixable without losing the length.",
    image: "/img/journal-2.jpg",
    imageAlt:
      "An illuminated red, white and blue barber pole mounted on a stone shopfront wall",
    body: [
      "Every man who has tried to grow his hair out has quit in the same place: week seven, when the sides start to flare and the back sits on the collar like it is embarrassed to be there.",
      "That is not your hair failing. That is the perimeter and the weight going out of sync, and it takes about fifteen minutes to fix without touching the length on top.",
      "What we do instead is take the corners off the perimeter, hollow out the weight behind the ear, and leave every millimetre of what you are actually growing. You walk out with the same length and a shape that reads as intentional.",
      "Come in every five weeks while you are growing. It feels counterproductive. It is the only reason anyone ever gets past week seven.",
    ],
  },
  {
    slug: "everything-about-the-hot-towel",
    title: "Everything we know about the hot towel, in order",
    category: "The Ritual",
    readMinutes: 6,
    date: "9 May 2026",
    excerpt:
      "Three towels, one badger brush, and the reason a shave takes forty minutes instead of nine.",
    image: "/img/journal-3.jpg",
    imageAlt:
      "Clippers, a gold trimmer, shears, a straight razor, a comb and a neck brush laid out in a row on a black towel",
    body: [
      "The towel is not theatre. It is the whole shave. Everything else — the brush, the lather, the razor — is downstream of what the towel does to the hair on your face.",
      "First towel, as hot as you can stand: it opens the follicle and softens the beard. Two minutes, no less. This is the one people cut short and it is the one that matters most.",
      "The lather goes on with a badger brush, not fingers, because the brush lifts every hair to standing rather than laying it flat. Lather is a scaffold, not a lubricant.",
      "The razor moves with the grain first. Always. Against the grain on the first pass is how you get the bumps you have spent your adult life assuming were unavoidable.",
      "Second towel, hot again, to clear the lather and take the second pass. Third towel, cold, to close everything you just opened. Then balm, never alcohol, whatever your grandfather told you.",
      "Forty minutes. You will notice it for three days.",
    ],
  },
];

/* ------------------------------------------------------------------ */

export const locations = [
  {
    id: "plateau",
    name: "Le Plateau",
    address: "4181 Rue Saint-Denis",
    city: "Montréal, QC H2W 2M6",
    chairs: 5,
    image: "/img/interior-wide.jpg",
    hours: [
      { days: "Mon — Fri", time: "10:00 — 20:00" },
      { days: "Saturday", time: "10:00 — 19:00" },
      { days: "Sunday", time: "11:00 — 18:00" },
    ],
  },
  {
    id: "vieux",
    name: "Vieux-Montréal",
    address: "122 Rue McGill",
    city: "Montréal, QC H2Y 2E5",
    chairs: 4,
    image: "/img/interior-alt.jpg",
    hours: [
      { days: "Mon — Fri", time: "09:00 — 19:00" },
      { days: "Saturday", time: "10:00 — 18:00" },
      { days: "Sunday", time: "Closed" },
    ],
  },
  {
    id: "mile-end",
    name: "Mile End",
    address: "5305 Boulevard Saint-Laurent",
    city: "Montréal, QC H2T 1S5",
    chairs: 3,
    image: "/img/detail-chair.jpg",
    hours: [
      { days: "Mon — Fri", time: "11:00 — 20:00" },
      { days: "Saturday", time: "10:00 — 19:00" },
      { days: "Sunday", time: "11:00 — 17:00" },
    ],
  },
] as const;

/* ------------------------------------------------------------------ */

export const faqs = [
  {
    q: "Do you take walk-ins?",
    a: "Always, chair permitting. Booking guarantees you a barber and a time — a walk-in gets whoever is free, which on a Saturday afternoon may be nobody.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Free up to six hours before your appointment. Inside six hours, or a no-show, we charge fifty percent of the service. The chair was held for you.",
  },
  {
    q: "Can I request a specific barber?",
    a: "Yes, and you should. Every booking lets you choose your chair, and we will tell you honestly if someone else is better suited to what you are asking for.",
  },
  {
    q: "Do you cut every hair type?",
    a: "Straight, wavy, coily, thinning, grey, and everything between. If it is curly, ask for Elias. If it is thinning, ask for Marco.",
  },
  {
    q: "How do I pay?",
    a: "Card, tap, or cash. Online bookings can pre-pay or settle in the chair — you choose at the last step.",
  },
  {
    q: "Do you do weddings or group bookings?",
    a: `Groups of four or more, by arrangement, before opening or after close. Email ${shop.email} and tell us the date.`,
  },
] as const;

/* ------------------------------------------------------------------ */

export const marqueeWords = [
  "Signature Cut",
  "Skin Fade",
  "Beard Sculpt",
  "Hot Towel Shave",
  "Wash & Style",
  "Le Petit",
] as const;
