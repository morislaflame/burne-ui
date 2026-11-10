import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

/**
 * CI canary: this story is the only one with `a11y.test: "error"` until Э2
 * starts flipping form/overlay stories. Inline high-contrast styles so axe
 * does not depend on theme tokens resolving in the test browser.
 *
 * Proven: `test-storybook` fails this file on a real axe hit (`image-alt`
 * for `<img>` without alt). Keep the sample clean so the job stays a gate,
 * not a baseline dump.
 */
function A11yGateSample() {
  return (
    <form
      aria-label="A11y gate"
      onSubmit={(event) => event.preventDefault()}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        maxWidth: 280,
        padding: 16,
        background: "#111111",
        color: "#ffffff",
      }}
    >
      <label htmlFor="a11y-gate-name">
        Name
        <input
          id="a11y-gate-name"
          name="name"
          type="text"
          autoComplete="name"
          style={{
            display: "block",
            width: "100%",
            marginTop: 4,
            padding: 8,
            color: "#111111",
            background: "#ffffff",
          }}
        />
      </label>
      <button
        type="submit"
        style={{
          padding: "8px 12px",
          color: "#111111",
          background: "#ffffff",
          border: "2px solid #111111",
        }}
      >
        Continue
      </button>
    </form>
  );
}

const meta = {
  title: "Foundations/A11yGate",
  parameters: {
    layout: "centered",
    a11y: { test: "error" },
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Canary: Story = {
  render: () => <A11yGateSample />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("form", { name: "A11y gate" })).toBeVisible();
    await expect(canvas.getByRole("textbox", { name: "Name" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Continue" })).toBeVisible();
  },
};
