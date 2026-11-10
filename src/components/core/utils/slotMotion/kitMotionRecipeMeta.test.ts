import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { KIT_MOTION_RECIPE_META } from "./kitMotionRecipeMeta";
import { KIT_MOTION_RECIPES, MOTION_PHASE_NAMES, type MotionPhaseName } from "./slotMotionTypes";

const srcRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const file = path.join(dir, name);
    if (statSync(file).isDirectory()) walk(file, out);
    else if (/Animations\.ts$|MotionDefaults\.ts$|overlayTriggerSqueeze\.ts$/.test(name)) out.push(file);
  }
  return out;
}

describe("kit recipe phases", () => {
  it("lists every phase a kit default assigns", () => {
    const phase = MOTION_PHASE_NAMES.join("|");
    const recipe = KIT_MOTION_RECIPES.join("|");
    const re = new RegExp(`\\b(${phase})\\s*:`, "g");
    const recipeRe = new RegExp(`["'](${recipe})["']`, "g");
    const missing: string[] = [];
    for (const file of walk(srcRoot)) {
      const text = readFileSync(file, "utf8");
      for (const match of text.matchAll(re)) {
        const phaseName = match[1] as MotionPhaseName;
        const start = (match.index ?? 0) + match[0].length;
        let depth = 0;
        let end = start;
        while (end < text.length) {
          const ch = text[end];
          if (ch === "{" || ch === "(" || ch === "[") depth += 1;
          else if (ch === "}" || ch === ")" || ch === "]") {
            if (depth === 0) break;
            depth -= 1;
          } else if ((ch === "," || ch === "\n") && depth === 0) break;
          end += 1;
        }
        const value = text.slice(start, end);
        for (const hit of value.matchAll(recipeRe)) {
          const name = hit[1] as keyof typeof KIT_MOTION_RECIPE_META;
          if (!KIT_MOTION_RECIPE_META[name].phases.includes(phaseName)) {
            missing.push(`${name}.${phaseName} (${path.relative(srcRoot, file)})`);
          }
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it("gives every duration parameter a millisecond unit", () => {
    for (const meta of Object.values(KIT_MOTION_RECIPE_META)) {
      expect(meta.parameters[0]?.unit).toBe("ms");
    }
  });
});
