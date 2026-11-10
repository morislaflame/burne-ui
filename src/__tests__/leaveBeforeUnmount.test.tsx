import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Dialog } from "@/components/core/Dialog";

import { render, setReducedMotion } from "./helpers";

describe("Э0.1 leave before unmount", () => {
  it("keeps the dialog in the document until leave finishes, then unmounts", async () => {
    setReducedMotion(false);
    const { user } = render(
      <Dialog defaultOpen>
        <Dialog.Panel
          motion={{
            panel: { leave: { autoAlpha: 0, duration: 0.2 } },
            overlay: { leave: { autoAlpha: 0, duration: 0.2 } },
          }}
        >
          <Dialog.Title>Leaving</Dialog.Title>
          <Dialog.Close aria-label="Close" />
        </Dialog.Panel>
      </Dialog>);

    const dialog = await screen.findByRole("dialog");
    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(document.querySelector("dialog")).toBe(dialog);

    await waitFor(
      () => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      },
      { timeout: 1500 });
  });
});
