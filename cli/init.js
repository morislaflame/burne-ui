import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import * as prompts from "./prompts.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const THEME_BRIDGE_CSS = `
/*
 * Tailwind v4 can regenerate theme tokens — bind them back to burne runtime vars.
 */
@theme {
  --text-base: var(--text-base-size);
  --text-base--line-height: var(--text-base-line-height);
  --text-base--font-weight: var(--text-base-weight);
  --font-sans: var(--font-family-sans);
  --font-mono: var(--font-family-mono);
}
`;

/**
 * @returns {Promise<string>}
 */
async function loadDefaultThemeSource() {
  const distEntry = path.join(__dirname, "../dist/index.js");
  if (!fs.existsSync(distEntry)) {
    throw new Error(
      "burne-ui dist missing — reinstall the package (need burne-ui ≥ 1.5.9 with exportDefaultBurneThemeConfigSource).",
    );
  }
  const mod = await import(pathToFileURL(distEntry).href);
  if (typeof mod.exportDefaultBurneThemeConfigSource !== "function") {
    throw new Error(
      "This burne-ui build has no exportDefaultBurneThemeConfigSource — upgrade to ≥ 1.5.9.",
    );
  }
  return mod.exportDefaultBurneThemeConfigSource();
}

/** @typedef {"npm" | "pnpm" | "bun" | "yarn"} PackageManager */
/** @typedef {"system" | "dark" | "light"} ThemeMode */
/** @typedef {"next" | "vite" | "unknown"} Framework */

/**
 * @returns {PackageManager}
 */
export function detectPackageManager() {
  const ua = process.env.npm_config_user_agent ?? "";
  if (ua.startsWith("pnpm")) return "pnpm";
  if (ua.startsWith("yarn")) return "yarn";
  if (ua.startsWith("bun")) return "bun";
  const execpath = process.env.npm_execpath ?? "";
  if (execpath.includes("pnpm")) return "pnpm";
  if (execpath.includes("yarn")) return "yarn";
  if (execpath.includes("bun")) return "bun";
  return "npm";
}

/**
 * @param {string} cwd
 * @returns {Framework}
 */
export function detectFramework(cwd) {
  if (
    fs.existsSync(path.join(cwd, "next.config.ts")) ||
    fs.existsSync(path.join(cwd, "next.config.js")) ||
    fs.existsSync(path.join(cwd, "next.config.mjs"))
  ) {
    return "next";
  }
  if (
    fs.existsSync(path.join(cwd, "vite.config.ts")) ||
    fs.existsSync(path.join(cwd, "vite.config.js")) ||
    fs.existsSync(path.join(cwd, "vite.config.mjs"))
  ) {
    return "vite";
  }
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(cwd, "package.json"), "utf8"));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    if (deps?.next) return "next";
    if (deps?.vite) return "vite";
  } catch {
    /* ignore */
  }
  return "unknown";
}

/**
 * @param {string} cwd
 * @param {Framework} framework
 */
export function findCssCandidates(cwd, framework) {
  const candidates =
    framework === "vite"
      ? ["src/index.css", "src/styles.css", "src/App.css", "index.css"]
      : [
          "app/globals.css",
          "src/app/globals.css",
          "styles/globals.css",
          "src/styles/globals.css",
          "app/global.css",
        ];
  return candidates.filter((rel) => fs.existsSync(path.join(cwd, rel)));
}

/**
 * @param {string} cssPath
 */
export function patchCssFile(cssPath) {
  let css = fs.readFileSync(cssPath, "utf8");
  const hadBurne = css.includes("burne-ui/styles.css");
  const hadTailwind = /@import\s+["']tailwindcss["']/.test(css);
  const hadThemeBridge = css.includes("--text-base: var(--text-base-size)");

  if (!hadBurne) {
    if (hadTailwind) {
      const importLine = `\n@import "burne-ui/styles.css";\n`;
      const sourceBlocks = [...css.matchAll(/@source\s+[^;]+;/g)];
      if (sourceBlocks.length > 0) {
        const last = sourceBlocks[sourceBlocks.length - 1];
        const insertAt = last.index + last[0].length;
        css = css.slice(0, insertAt) + importLine + css.slice(insertAt);
      } else {
        css = css.replace(
          /@import\s+["']tailwindcss["']\s*;/,
          `@import "tailwindcss";${importLine}`,
        );
      }
    } else {
      css =
        `/* Burne UI — recommend Tailwind v4: @import "tailwindcss" */\n` +
        `@import "burne-ui/styles.css";\n\n` +
        css;
    }
  }

  if (!css.includes("burne-ui/styles.css")) {
    css += `\n@import "burne-ui/styles.css";\n`;
  }

  if (!hadThemeBridge) {
    const burneImport = css.match(/@import\s+["']burne-ui\/styles\.css["']\s*;/);
    if (burneImport && burneImport.index != null) {
      const insertAt = burneImport.index + burneImport[0].length;
      css = css.slice(0, insertAt) + "\n" + THEME_BRIDGE_CSS + css.slice(insertAt);
    } else {
      css += "\n" + THEME_BRIDGE_CSS;
    }
  }

  fs.writeFileSync(cssPath, css);
  return { hadBurne, hadTailwind, hadThemeBridge };
}

/**
 * @param {ThemeMode} theme
 * @param {boolean} toast
 */
function providerSource(theme, toast) {
  const toastLine = toast ? " toast" : " toast={false}";
  return `"use client";

import { BurneUIProvider } from "burne-ui";

import burneTheme from "./burne-theme";

/**
 * Generated by \`burne-ui init\`.
 * Theme tokens live in \`burne-theme.ts\` (replace via docs site → Copy config).
 */
export function BurneProviders({ children }: { children: React.ReactNode }) {
  return (
    <BurneUIProvider config={burneTheme} defaultTheme="${theme}"${toastLine}>
      {children}
    </BurneUIProvider>
  );
}
`;
}

/**
 * @param {string} cwd
 * @param {Framework} framework
 */
function resolveProviderPath(cwd, framework) {
  if (framework === "vite") {
    const dir = path.join(cwd, "src");
    return {
      dir,
      file: path.join(dir, "burne-providers.tsx"),
      importHint: "./burne-providers",
    };
  }
  const dir = path.join(cwd, "app");
  const srcApp = path.join(cwd, "src", "app");
  if (fs.existsSync(srcApp) && !fs.existsSync(dir)) {
    return {
      dir: srcApp,
      file: path.join(srcApp, "burne-providers.tsx"),
      importHint: "./burne-providers",
    };
  }
  return {
    dir,
    file: path.join(dir, "burne-providers.tsx"),
    importHint: "./burne-providers",
  };
}

/**
 * @param {Framework} framework
 * @param {string} importHint
 * @param {ThemeMode} [theme]
 */
function layoutSnippet(framework, importHint, theme = "dark") {
  if (framework === "vite") {
    return `// src/main.tsx
import { BurneProviders } from "${importHint}";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BurneProviders>
      <App />
    </BurneProviders>
  </StrictMode>,
);
`;
  }
  const themeProp = theme === "dark" ? "" : ` defaultTheme="${theme}"`;
  return `// app/layout.tsx
import { ThemeScript } from "burne-ui";
import { BurneProviders } from "${importHint}";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript${themeProp} />
      </head>
      <body className="min-h-[100dvh] bg-background text-foreground antialiased">
        <BurneProviders>{children}</BurneProviders>
      </body>
    </html>
  );
}
`;
}

/**
 * @param {string} pmBin
 * @param {string[]} args
 * @param {string} cwd
 */
function runCommand(pmBin, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(pmBin, args, {
      cwd,
      stdio: "inherit",
      shell: process.platform === "win32",
      env: process.env,
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${pmBin} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

/**
 * @param {PackageManager} pm
 * @param {string} cwd
 */
async function installDeps(pm, cwd) {
  const pkgs = ["burne-ui", "react-icons", "gsap"];
  if (pm === "npm") await runCommand("npm", ["install", ...pkgs], cwd);
  else if (pm === "pnpm") await runCommand("pnpm", ["add", ...pkgs], cwd);
  else if (pm === "bun") await runCommand("bun", ["add", ...pkgs], cwd);
  else await runCommand("yarn", ["add", ...pkgs], cwd);
}

/**
 * @param {string[]} argv
 */
function parseInitArgs(argv) {
  /** @type {{
   *   yes: boolean;
   *   skipInstall: boolean;
   *   toast: boolean;
   *   pm?: PackageManager;
   *   theme?: ThemeMode;
   *   css?: string;
   *   help: boolean;
   * }} */
  const out = {
    yes: false,
    skipInstall: false,
    toast: true,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") out.help = true;
    else if (arg === "--yes" || arg === "-y") out.yes = true;
    else if (arg === "--skip-install") out.skipInstall = true;
    else if (arg === "--no-toast") out.toast = false;
    else if (arg === "--pm") {
      const v = argv[++i];
      if (v === "npm" || v === "pnpm" || v === "bun" || v === "yarn") out.pm = v;
      else throw new Error(`Unknown --pm "${v}"`);
    } else if (arg === "--theme") {
      const v = argv[++i];
      if (v === "system" || v === "dark" || v === "light") out.theme = v;
      else throw new Error(`Unknown --theme "${v}"`);
    } else if (arg === "--css") {
      out.css = argv[++i];
      if (!out.css) throw new Error("--css requires a path");
    } else if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  return out;
}

/**
 * @param {string[]} argv
 * @param {string} cliVersion
 */
export async function runInit(argv, cliVersion) {
  const args = parseInitArgs(argv);
  if (args.help) {
    console.log(`burne-ui init v${cliVersion}\nRun: burne-ui --help`);
    return;
  }

  const cwd = process.cwd();
  if (!fs.existsSync(path.join(cwd, "package.json"))) {
    throw new Error("No package.json here. Run from your app root.");
  }

  const interactive = !args.yes && process.stdin.isTTY;
  const framework = detectFramework(cwd);
  const detectedPm = detectPackageManager();
  const cssCandidates = findCssCandidates(cwd, framework);

  console.log(`\nburne-ui init  v${cliVersion}`);
  console.log(
    framework === "unknown"
      ? "Framework: not detected (will use app/burne-providers.tsx)\n"
      : `Detected: ${framework}\n`,
  );

  /** @type {PackageManager} */
  let pm = args.pm ?? detectedPm;
  if (!args.pm && interactive) {
    pm = await prompts.select({
      message: "Package manager",
      initialValue: detectedPm,
      options: [
        { value: "npm", label: "npm" },
        { value: "pnpm", label: "pnpm" },
        { value: "bun", label: "bun" },
        { value: "yarn", label: "yarn" },
      ],
    });
  }

  /** @type {ThemeMode} */
  let theme = args.theme ?? "system";
  if (!args.theme && interactive) {
    theme = await prompts.select({
      message: "Default theme",
      initialValue: "system",
      options: [
        { value: "system", label: "System", hint: "OS preference" },
        { value: "dark", label: "Dark" },
        { value: "light", label: "Light" },
      ],
    });
  }

  let toast = args.toast;
  if (!args.yes && interactive && args.toast) {
    toast = await prompts.confirm({
      message: "Include Toast.Provider?",
      initialValue: true,
    });
  }

  /** @type {string | null} */
  let cssRel = args.css ?? null;
  if (!cssRel && cssCandidates.length === 1) {
    cssRel = cssCandidates[0];
  } else if (!cssRel && cssCandidates.length > 1 && interactive) {
    cssRel = await prompts.select({
      message: "CSS file to patch",
      options: cssCandidates.map((c) => ({ value: c, label: c })),
    });
  } else if (!cssRel && cssCandidates.length > 1) {
    cssRel = cssCandidates[0];
  } else if (!cssRel && interactive) {
    const custom = await prompts.text({
      message: "Global CSS path (empty = skip)",
      placeholder: framework === "vite" ? "src/index.css" : "app/globals.css",
      defaultValue: "",
    });
    cssRel = custom.trim() || null;
  }

  const fw = framework === "unknown" ? "next" : framework;
  const provider = resolveProviderPath(cwd, fw);

  if (!args.skipInstall) {
    console.log(`\nInstalling burne-ui + react-icons + gsap with ${pm}…\n`);
    await installDeps(pm, cwd);
  }

  if (cssRel) {
    const abs = path.resolve(cwd, cssRel);
    if (!fs.existsSync(abs)) throw new Error(`CSS not found: ${cssRel}`);
    const { hadBurne, hadTailwind, hadThemeBridge } = patchCssFile(abs);
    console.log(hadBurne ? `CSS OK (already linked): ${cssRel}` : `Patched CSS: ${cssRel}`);
    if (!hadThemeBridge) console.log("Added @theme bridge (text-base / font-sans).");
    if (!hadTailwind) {
      console.log('Note: no @import "tailwindcss" — add Tailwind v4 for className utilities.');
    }
  } else {
    console.log('Skipped CSS — add: @import "burne-ui/styles.css";');
  }

  fs.mkdirSync(provider.dir, { recursive: true });
  const relProvider = path.relative(cwd, provider.file);
  const themeFile = path.join(provider.dir, "burne-theme.ts");
  const relTheme = path.relative(cwd, themeFile);

  const themeSource = await loadDefaultThemeSource();
  if (fs.existsSync(themeFile) && interactive) {
    const overwriteTheme = await prompts.confirm({
      message: `Overwrite ${relTheme}?`,
      initialValue: false,
    });
    if (overwriteTheme) {
      fs.writeFileSync(themeFile, themeSource);
      console.log(`Wrote ${relTheme}`);
    }
  } else if (!fs.existsSync(themeFile)) {
    fs.writeFileSync(themeFile, themeSource);
    console.log(`Wrote ${relTheme}`);
  }

  if (fs.existsSync(provider.file) && interactive) {
    const overwrite = await prompts.confirm({
      message: `Overwrite ${relProvider}?`,
      initialValue: false,
    });
    if (overwrite) fs.writeFileSync(provider.file, providerSource(theme, toast));
  } else {
    fs.writeFileSync(provider.file, providerSource(theme, toast));
    console.log(`Wrote ${relProvider}`);
  }

  const snippet = layoutSnippet(fw, provider.importHint, theme);
  console.log(`\n── Wrap your root layout ──\n\n${snippet}`);
  console.log("Theme: edit burne-theme.ts, or replace via docs site → Copy config.\n");
}
