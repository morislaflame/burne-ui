import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { pathToFileURL } from "node:url";

const burneUi = join(import.meta.dirname, "..");

describe("burne-ui init", () => {
  it("writes burne-theme.ts from the packed CLI into an empty Vite app", async () => {
    const root = mkdtempSync(join(tmpdir(), "burne-init-"));
    try {
      const pack = spawnSync("npm", ["pack", "--pack-destination", root], {
        cwd: burneUi,
        encoding: "utf8",
      });
      assert.equal(pack.status, 0, pack.stderr || pack.stdout);
      const tarballName = pack.stdout.trim().split("\n").at(-1);
      assert.ok(tarballName, "npm pack did not print a tarball name");

      const extracted = join(root, "pkg");
      mkdirSync(extracted);
      const tar = spawnSync("tar", ["-xzf", join(root, tarballName), "-C", extracted], {
        encoding: "utf8",
      });
      assert.equal(tar.status, 0, tar.stderr || tar.stdout);

      const app = join(root, "vite-app");
      mkdirSync(join(app, "src"), { recursive: true });
      writeFileSync(join(app, "package.json"), `${JSON.stringify({ name: "vite-app", private: true })}\n`);
      writeFileSync(join(app, "vite.config.ts"), "export default {};\n");
      writeFileSync(join(app, "src/index.css"), '@import "tailwindcss";\n');

      const init = spawnSync(
        process.execPath,
        [
          join(extracted, "package/cli/burne-ui.js"),
          "init",
          "--yes",
          "--skip-install",
          "--theme",
          "dark",
          "--css",
          "src/index.css",
        ],
        { cwd: app, encoding: "utf8" },
      );
      assert.equal(init.status, 0, init.stderr || init.stdout);

      const themeFile = join(app, "src/burne-theme.ts");
      const packed = await import(pathToFileURL(join(extracted, "package/dist/theme/themeConfig.js")).href);
      assert.equal(typeof packed.exportDefaultBurneThemeConfigSource, "function");
      assert.equal(readFileSync(themeFile, "utf8"), packed.exportDefaultBurneThemeConfigSource());
      assert.match(readFileSync(join(app, "src/burne-providers.tsx"), "utf8"), /from "\.\/burne-theme"/);
      assert.match(readFileSync(join(app, "src/index.css"), "utf8"), /burne-ui\/styles\.css/);
      assert.match(readFileSync(join(app, "src/index.css"), "utf8"), /burne-ui\/tailwind\.css/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
