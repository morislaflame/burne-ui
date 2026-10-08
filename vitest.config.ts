/// <reference types="vitest/config" />
import path from "node:path";
import { fileURLToPath } from "node:url";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig, mergeConfig } from "vitest/config";

import viteStorybookConfig from "./vite.storybook.config";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
// https://storybook.js.org/docs/writing-tests/test-coverage
export default mergeConfig(
  viteStorybookConfig,
  defineConfig({
    test: {
      coverage: {
        provider: "v8",
        reportsDirectory: "./coverage",
        reportOnFailure: true,
        include: ["src/**/*.{ts,tsx}"],
        exclude: [
          "**/*.stories.{ts,tsx}",
          "**/*.d.ts",
          "**/*.test.{ts,tsx}",
          "src/__tests__/**",
          "src/playground/**",
        ],
        reporter: ["text", "html", "json-summary"],
        watermarks: {
          statements: [50, 80],
          branches: [50, 80],
          functions: [50, 80],
          lines: [50, 80],
        },
        // No global fail-threshold: 53 components sit ~40% today.
        // Pointed floors for the motion engine and Э2 a11y modules (E0.2).
        // perFile is off: several slotMotion recipes are 0% and would fail the
        // group floor. Thresholds are aggregated per glob — an uncovered file
        // (inputA11y.ts is 0% today) is hidden until the group average drops.
        thresholds: {
          // Measured ~71/63/74/72. Headroom ~3pp — one new uncovered recipe
          // can fail CI; bump the floor after covering a recipe, do not lower it.
          "src/components/core/utils/slotMotion/**": {
            statements: 68,
            branches: 60,
            functions: 70,
            lines: 70,
          },
          // Measured ~70/60/89/71. Raised from 50/35/50/50 so Э2 cannot
          // silently drop a module without moving the group average.
          "src/components/core/{Input,TextArea,Select,ComboBox,TimeField,Checkbox,Radio,Switch,Slider,Field}/*A11y.ts": {
            statements: 65,
            branches: 50,
            functions: 80,
            lines: 65,
          },
          // Measured ~78/71/86/87.
          "src/components/composite/{Form,RadioGroup,CheckboxGroup}/*A11y.ts": {
            statements: 70,
            branches: 60,
            functions: 75,
            lines: 75,
          },
        },
      },
      projects: [
        {
          extends: true,
          test: {
            name: "unit",
            environment: "node",
            include: ["src/**/*.test.ts"],
          },
        },
        {
          extends: true,
          resolve: {
            dedupe: ["react", "react-dom"],
            alias: {
              react: path.resolve(dirname, "node_modules/react"),
              "react-dom": path.resolve(dirname, "node_modules/react-dom"),
            },
          },
          test: {
            name: "components",
            environment: "happy-dom",
            include: ["src/**/*.test.tsx"],
            setupFiles: ["./src/__tests__/setup.ts"],
          },
        },
        {
          extends: true,
          resolve: {
            dedupe: ["react", "react-dom"],
            alias: {
              react: path.resolve(dirname, "node_modules/react"),
              "react-dom": path.resolve(dirname, "node_modules/react-dom"),
            },
          },
          test: {
            // Opt-in only (`bun run bench:providers`). Default `test` / `test:run`
            // omit this project so watch mode does not rewrite the baseline JSON.
            name: "perf",
            environment: "happy-dom",
            include: ["src/__tests__/perf/**/*.bench.tsx"],
            setupFiles: ["./src/__tests__/setup.ts"],
            testTimeout: 120_000,
          },
        },
        {
          extends: true,
          plugins: [
            storybookTest({
              configDir: path.join(dirname, ".storybook"),
              storybookScript: "bun run storybook -- --no-open",
            }),
          ],
          test: {
            name: "storybook",
            browser: {
              enabled: true,
              headless: true,
              provider: playwright({}),
              instances: [{ browser: "chromium" }],
            },
          },
        },
      ],
    },
  }),
);
