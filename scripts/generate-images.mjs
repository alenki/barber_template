/**
 * Renders the responsive image variants the static export serves.
 *
 * There is no image server behind a static build, so the widths `next/image`
 * asks for have to exist on disk before `next build` copies `public/` into
 * `out/`. This walks every source in `assets/img`, writes one webp per width in
 * `VARIANT_WIDTHS`, and leaves them where `src/lib/image-loader.ts` points.
 *
 * Sources live in `assets/`, not `public/`, because they are build inputs and
 * nothing ever requests them: the loader rewrites every `/img/foo.jpg` to
 * `/img/r/foo-{width}.webp`, so shipping the 1920px originals would have put
 * 11MB into the upload that no browser would ever fetch. The `/img/*.jpg`
 * strings in content.ts are keys the loader resolves, which is how the custom
 * loader is meant to work — see the Cloudinary example in
 * `node_modules/next/dist/docs/01-app/02-guides/static-exports.md`, whose paths
 * are likewise not local files.
 *
 * Run by `npm run build`. Safe to run repeatedly: a variant newer than its
 * source is left alone, so a second build costs nothing.
 */
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

/* The script is plain .mjs so it can run before the TypeScript build, so the
   shared width list is inlined here rather than imported from
   src/lib/image-sizes.ts. The comment there is the reason they must match. */
const VARIANT_WIDTHS = [64, 128, 256, 384, 640, 828, 1080, 1920];
const SOURCE = path.join(process.cwd(), "assets", "img");
const OUT = path.join(process.cwd(), "public", "img", "r");

/**
 * The social card. Every platform crops `summary_large_image` to about 1.91:1,
 * and the file this used to point at was the 1920x2875 hero — a portrait, so
 * VK and Telegram were each choosing their own middle third of it. Rendered
 * once here at the size the crawlers actually want.
 *
 * JPEG rather than webp: this is the one image fetched by other people's
 * servers rather than by a browser, and not every crawler reads webp.
 */
const OG = {
  from: "hero-chair.jpg",
  to: path.join(process.cwd(), "public", "img", "og.jpg"),
  width: 1200,
  height: 630,
  /**
   * The same 0.35 the Hero passes as `objectPosition: "center 35%"`. Letting
   * sharp choose with `strategy.attention` gave a card that was two-thirds
   * white cape with the client's head cut off at the top edge — it optimises
   * for detail, not for composition. Matching the hero means the card shows
   * what someone sees when the link opens.
   */
  focusY: 0.35,
};

/* Photographs, and they are the whole design. 78 is where this set stops
   showing banding in the dark interiors; the grain overlay in globals.css
   hides what little is left. */
const QUALITY = 78;

const isSource = (f) => /\.(jpe?g|png)$/i.test(f);

async function main() {
  if (!existsSync(SOURCE)) {
    console.error(`No source directory at ${SOURCE}`);
    process.exit(1);
  }

  await mkdir(OUT, { recursive: true });

  const files = (await readdir(SOURCE)).filter(isSource);
  if (files.length === 0) {
    console.error(`No images found in ${SOURCE}`);
    process.exit(1);
  }

  let written = 0;
  let skipped = 0;
  let bytes = 0;

  for (const file of files) {
    const src = path.join(SOURCE, file);
    const srcStat = await stat(src);
    const name = file.replace(/\.[^.]+$/, "");
    const meta = await sharp(src).metadata();

    for (const width of VARIANT_WIDTHS) {
      const dest = path.join(OUT, `${name}-${width}.webp`);

      /* Rebuilds are the common case; only redo a variant its source has
         outrun. */
      if (existsSync(dest) && (await stat(dest)).mtimeMs > srcStat.mtimeMs) {
        skipped += 1;
        bytes += (await stat(dest)).size;
        continue;
      }

      /* `withoutEnlargement` keeps a variant from being upscaled past its
         source, so the file for a width the original cannot fill is simply the
         original's size. The loader still resolves to it, and the browser
         still picks correctly off the srcset — it just never invents pixels. */
      const buf = await sharp(src)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toBuffer();

      await writeFile(dest, buf);
      written += 1;
      bytes += buf.length;
    }

    process.stdout.write(`  ${file} (${meta.width}x${meta.height})\n`);
  }

  /* --------------------------------------------------------- social card */
  const ogSrc = path.join(SOURCE, OG.from);
  if (!existsSync(ogSrc)) {
    console.error(`Social card source missing: ${ogSrc}`);
    process.exit(1);
  }

  const ogMeta = await sharp(ogSrc).metadata();

  /* Cut the widest band of the source that has the card's aspect ratio, centred
     on the focal point, then clamp it inside the image so a focus near either
     edge cannot ask for pixels that are not there. */
  const bandH = Math.min(
    ogMeta.height,
    Math.round((ogMeta.width * OG.height) / OG.width)
  );
  const top = Math.max(
    0,
    Math.min(
      ogMeta.height - bandH,
      Math.round(ogMeta.height * OG.focusY - bandH / 2)
    )
  );

  await sharp(ogSrc)
    .extract({ left: 0, top, width: ogMeta.width, height: bandH })
    .resize(OG.width, OG.height)
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(OG.to);

  const mb = (n) => (n / 1024 / 1024).toFixed(1);
  console.log(
    `\n${files.length} sources -> ${written + skipped} variants ` +
      `(${written} written, ${skipped} up to date), ${mb(bytes)}MB total`
  );
  console.log(`social card -> public/img/og.jpg ${OG.width}x${OG.height}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
