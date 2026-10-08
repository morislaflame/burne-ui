import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { render } from "@/__tests__/helpers";

import { HoverCard } from ".";

function card(props: { openDelay?: number; closeDelay?: number } = {}) {
  return (
    <HoverCard
      openDelay={props.openDelay ?? 0}
      closeDelay={props.closeDelay ?? 0}
      trigger={<button type="button">Ada</button>}
      title="Ada Lovelace"
      description="Mathematician"
    >
      <button type="button">View profile</button>
    </HoverCard>
  );
}

describe("HoverCard", () => {
  it("opens on pointer enter and stays open across the card", async () => {
    render(card({ closeDelay: 250 }));
    const trigger = screen.getByRole("button", { name: "Ada" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");

    fireEvent.pointerEnter(trigger);
    const dialog = await screen.findByRole("dialog", { name: "Ada Lovelace" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls", dialog.id);

    fireEvent.click(trigger);
    expect(screen.getByRole("dialog", { name: "Ada Lovelace" })).toBeInTheDocument();

    fireEvent.pointerLeave(trigger);
    expect(screen.getByRole("dialog", { name: "Ada Lovelace" })).toBeInTheDocument();
    fireEvent.pointerEnter(dialog);
    await new Promise((resolve) => {
      setTimeout(resolve, 280);
    });
    expect(screen.getByRole("dialog", { name: "Ada Lovelace" })).toBeInTheDocument();

    fireEvent.pointerLeave(dialog);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("waits for openDelay and does not open on click", async () => {
    render(card({ openDelay: 40 }));
    const trigger = screen.getByRole("button", { name: "Ada" });
    fireEvent.click(trigger);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.pointerEnter(trigger);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(await screen.findByRole("dialog", { name: "Ada Lovelace" })).toBeInTheDocument();
  });

  it("opens on focus and closes on Escape", async () => {
    render(card());
    const trigger = screen.getByRole("button", { name: "Ada" });
    fireEvent.focus(trigger);
    expect(await screen.findByRole("dialog", { name: "Ada Lovelace" })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("cancels a pending open when the pointer leaves", async () => {
    render(card({ openDelay: 80 }));
    const trigger = screen.getByRole("button", { name: "Ada" });
    fireEvent.pointerEnter(trigger);
    fireEvent.pointerLeave(trigger);
    await new Promise((resolve) => {
      setTimeout(resolve, 120);
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
