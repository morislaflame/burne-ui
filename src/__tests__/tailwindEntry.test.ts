import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { compile } from "@tailwindcss/node";
import { describe, expect, it } from "vitest";

import { renderTailwindEntry, utilityNames } from "../../scripts/build-tailwind-entry.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

describe("burne-ui/tailwind.css", () => {
  it("ships every kit @utility and the theme bridge, without preflight", () => {
    const styles = readFileSync(path.join(root, "src/styles.css"), "utf8");
    const entry = readFileSync(path.join(root, "cli/tailwind.css"), "utf8");
    expect(entry).toBe(renderTailwindEntry());
    for (const name of utilityNames(styles)) {
      expect(entry).toContain(`@utility ${name}`);
    }
    expect(entry).toContain("@theme inline");
    expect(entry).not.toContain("@layer base");
    expect(entry).not.toMatch(/^@import ["']tailwindcss["']/m);
  });

  it("lets an app generate md:shadow-token-mid and divide-x-token", async () => {
    const compiler = await compile(
      `@import "tailwindcss";\n@import "./cli/tailwind.css";\n`,
      { base: root, onDependency() {} },
    );
    const css = compiler.build(["md:shadow-token-mid", "divide-x-token"]);
    expect(css).toContain("shadow-token-mid");
    expect(css).toContain("divide-x-token");
    expect(css).toMatch(/@media/);
  });
});
