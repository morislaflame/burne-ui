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
  },
};

export default preview;
