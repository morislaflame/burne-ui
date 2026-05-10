import type { Preview } from "@storybook/react-vite";

import "../src/styles.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "brn",
      values: [
        { name: "brn", value: "var(--brn-color-bg)" },
        { name: "surface", value: "var(--brn-color-surface)" },
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
