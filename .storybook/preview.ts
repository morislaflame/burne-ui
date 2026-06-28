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
      // Поведение a11y-тестов с Vitest addon (axe-core):
      // 'off'   — не запускать автоматически
      // 'todo'  — предупреждения в UI Storybook, CI не падает (базовая линия)
      // 'error' — падение в UI и CLI/CI при нарушениях
      // https://storybook.js.org/docs/writing-tests/accessibility-testing#test-behavior
      test: "todo",

      // Анализируем отрендеренный DOM сториса (по умолчанию Storybook отключает rule 'region')
      context: "body",

      config: {},

      options: {},
    },
  },
};

export default preview;
