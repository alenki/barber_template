/**
 * The one list of variant widths. `next.config.ts` splits it into the two
 * ladders `next/image` wants, `scripts/generate-images.mjs` renders a file per
 * entry, and `image-loader.ts` maps a requested width onto one. Everything that
 * needs these numbers reads them from here, so they cannot drift apart and
 * leave a srcset pointing at a file nobody generated.
 */
export const VARIANT_WIDTHS = [
  64, 128, 256, 384, 640, 828, 1080, 1920,
] as const;

/** Where the generated variants live, relative to `public/`. */
export const VARIANT_DIR = "img/r";

/** Only `/img/*` is rewritten; anything else is passed through untouched. */
export const SOURCE_DIR = "/img/";
