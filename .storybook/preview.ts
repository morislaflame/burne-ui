import type { Preview } from "@storybook/react-vite";

import "../src/styles.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "b",
      values: [
        { name: "b", value: "var(--b-color-bg)" },
        { name: "surface", value: "var(--b-color-surface)" },
        { name: "light (gray)", value: "#e4e4e7" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
