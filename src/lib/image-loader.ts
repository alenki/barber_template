import { SOURCE_DIR, VARIANT_DIR, VARIANT_WIDTHS } from "./image-sizes";

/**
 * The static-export stand-in for the Next image server.
 *
 * `next/image` calls this once per entry in the srcset it is building, with the
 * width it wants; the job is to hand back a URL that exists in `out/`. The
 * files themselves are rendered before the build by
 * `scripts/generate-images.mjs`, which walks the same width list.
 *
 * Not async, not clever: this runs during render for every image on the page,
 * and it has to return the same string on the server and in the browser or the
 * markup mismatches on hydration.
 */
export default function staticImageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  /* Anything not under /img/ — an inline data: URI, an external URL — has no
     generated counterpart and is left exactly as it came in. */
  if (!src.startsWith(SOURCE_DIR)) return src;

  /* The narrowest variant that still covers the requested width, so the browser
     never scales an image up. Past the top of the ladder it gets the widest
     one there is. */
  const w =
    VARIANT_WIDTHS.find((candidate) => candidate >= width) ??
    VARIANT_WIDTHS[VARIANT_WIDTHS.length - 1];

  /* `/img/hero-chair.jpg` -> `/img/r/hero-chair-640.webp` */
  const name = src.slice(SOURCE_DIR.length).replace(/\.[^./]+$/, "");

  return `/${VARIANT_DIR}/${name}-${w}.webp`;
}
