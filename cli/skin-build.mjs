/**
 * `burne-ui skin build [dir]`
 *
 * Writes `dist/styles.css` from `src/skin.json`.
 * Class rules in `src/skin.css` (anything outside the token blocks) are appended.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { renderSkinStylesheet } from "./skin-stylesheet.mjs";
import { consumeSkinCliArgs, loadSkinPackage, readSkinLiveSlots, readSkinSlots, validateSkin } from "./skin-validate.mjs";

function authorCss(css) {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const withoutTokens = stripped.replace(/\[[^\]]*data-(?:skin|theme)[^\]]*\][^{]*\{[^}]*\}/g, "");
  return withoutTokens.trim();
}

export function buildSkin(dir) {
  const loaded = loadSkinPackage(dir);
  const errors = validateSkin({ ...loaded, slots: readSkinSlots(), live: readSkinLiveSlots() });
  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
  const generated = renderSkinStylesheet(loaded.definition).trimEnd();
  const extra = authorCss(loaded.css);
  const css = extra ? `${generated}\n\n${extra}\n` : `${generated}\n`;
  const outDir = join(dir, "dist");
  mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, "styles.css");
  writeFileSync(outFile, css);
  return outFile;
}

export function runSkinBuild(argv) {
  const parsed = consumeSkinCliArgs(argv);
  if (parsed.error) {
    console.error(parsed.error);
    process.exit(1);
  }
  const dir = parsed.dir;
  try {
    const file = buildSkin(dir);
    console.log(`Wrote ${file}`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
