import type { Preview } from "@storybook/react-vite";
import { INITIAL_VIEWPORTS } from "storybook/viewport";

import "../src/styles.css";

const preview: Preview = {
  parameters: {
    layout: "centered",

    viewport: {
      options: INITIAL_VIEWPORTS,
    },

    backgrounds: {
      default: "background",
      values: [
        { name: "background", value: "var(--color-background)" },
        { name: "surface", value: "var(--color-surface)" },
        { name: "light (gray)", value: "#e4e4e7" },
      ],
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

  a11y: {
      // a11y test behavior with Vitest addon (axe-core):
      // 'off'   — do not run automatically
      // 'todo'  — warnings in Storybook UI, CI does not fail (baseline)
      // 'error' — fail in UI and CLI/CI on violations
      // https://storybook.js.org/docs/writing-tests/accessibility-testing#test-behavior
      test: "todo",

      // Analyze the rendered story DOM (Storybook disables rule 'region' by default)
      context: "body",

      config: {},

      options: {},
    },

    // Visual tests (Chromatic): https://storybook.js.org/docs/writing-tests/visual-testing
    chromatic: {
      // GSAP/hover animations — let the frame stabilize before capture
      delay: 300,
    },
  },
};

export default preview;
