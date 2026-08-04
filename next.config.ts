import type { NextConfig } from "next";

/**
 * Built as a static export for shared Apache hosting (reg.ru). `next build`
 * writes a plain HTML/CSS/JS tree to `out/`; there is no Node process on the
 * far end, so anything that needs a server at request time is off the table —
 * see `node_modules/next/dist/docs/01-app/02-guides/static-exports.md` for the
 * full list. Nothing on this site used any of it: the routes are all static,
 * `/journal/[slug]` already ships `generateStaticParams`, and the one reader of
 * `useSearchParams` (`/book`) is already inside a Suspense boundary.
 */
const nextConfig: NextConfig = {
  output: "export",

  /**
   * Emits `/services/index.html` rather than `/services.html`, so Apache's
   * stock DirectoryIndex resolves every route on its own. Without it the host
   * needs a rewrite rule to append `.html`, which on reg.ru means an .htaccess
   * that has to be kept in step with the routes by hand.
   */
  trailingSlash: true,

  images: {
    /**
     * The default loader is the Next image server, which does not exist in a
     * static export. The alternative on offer is `unoptimized: true` — every
     * `<Image>` then serves its original file, and the originals here are
     * 1920px JPEGs totalling 11MB. The six service thumbnails render at 56px
     * on a phone and would have pulled 400–700KB apiece.
     *
     * So: a custom loader pointing at variants generated ahead of the build by
     * `scripts/generate-images.mjs`. `next/image` goes on building real
     * srcsets and the browser goes on picking the width it actually needs.
     */
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",

    /**
     * Trimmed from the stock ladders, which between them would have meant 15
     * variants of all 27 images. These are the widths this layout actually
     * asks for — the widest slot is the full-bleed footer at 100vw, and 1920
     * covers it on a 2x laptop. Both lists are mirrored in the loader and in
     * the generator; the three have to agree or a srcset entry 404s.
     */
    deviceSizes: [640, 828, 1080, 1920],
    imageSizes: [64, 128, 256, 384],
  },
};

export default nextConfig;
