#!/usr/bin/env node
/**
 * Downloads every Figma asset the prototype uses into public/assets/<name>.svg.
 *
 *   npm run assets
 *
 * The URLs come from the Figma MCP server and expire 7 days after they were
 * issued (issued 2026-10-20 → valid until ~2026-10-27). If they have expired,
 * re-run `get_design_context` on the Figma nodes listed in figma-assets.json
 * and paste the new asset ids into that file.
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(
  await (await import("node:fs/promises")).readFile(join(root, "scripts/figma-assets.json"), "utf8"),
);
const outDir = join(root, "public/assets");
await mkdir(outDir, { recursive: true });
const force = process.argv.includes("--force");

// name -> list of candidate URLs (the same asset is often exported by several screens)
const sources = new Map();
for (const { id, files } of Object.values(manifest.screens)) {
  for (const name of files) {
    if (!sources.has(name)) sources.set(name, []);
    sources.get(name).push(`${manifest.base}/${id}/${name}.svg`);
  }
}

let ok = 0;
let skipped = 0;
const failed = [];

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function fetchOne(name, urls) {
  const dest = join(outDir, `${name}.svg`);
  if (!force && (await exists(dest))) {
    skipped++;
    return;
  }
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const body = Buffer.from(await res.arrayBuffer());
      if (body.length === 0) continue;
      await writeFile(dest, body);
      ok++;
      return;
    } catch {
      /* try the next source */
    }
  }
  failed.push(name);
}

const entries = [...sources.entries()];
const POOL = 8;
for (let i = 0; i < entries.length; i += POOL) {
  await Promise.all(entries.slice(i, i + POOL).map(([n, u]) => fetchOne(n, u)));
  process.stdout.write(`\r  ${Math.min(i + POOL, entries.length)}/${entries.length}`);
}

console.log(`\n✓ downloaded ${ok}, already present ${skipped}, failed ${failed.length}`);
if (failed.length) {
  console.log(`  missing: ${failed.join(", ")}`);
  console.log("  The Figma links may have expired — see the note at the top of this script.");
  process.exitCode = 1;
}
