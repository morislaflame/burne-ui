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
          "src/playground/**",
        ],
        reporter: ["text", "html", "json-summary"],
        watermarks: {
          statements: [50, 80],
          branches: [50, 80],
          functions: [50, 80],
          lines: [50, 80],
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
