import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { render } from "@/__tests__/helpers";
import { Select } from "@/components/core/Select";

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

  it("ignores touch pointerenter so tapping on mobile does not stick a HoverCard open", async () => {
    render(card({ openDelay: 0 }));
    const trigger = screen.getByRole("button", { name: "Ada" });
    fireEvent.pointerEnter(trigger, { pointerType: "touch" });
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("stays open when selecting an option in a nested Select inside HoverCard", async () => {
    const { user } = render(
      <HoverCard
        openDelay={0}
        closeDelay={50}
        trigger={<button type="button">Profile</button>}
        title="Team settings"
      >
        <Select
          label="Role"
          items={[
            { value: "owner", label: "Owner" },
            { value: "member", label: "Member" },
          ]}
        />
      </HoverCard>,
    );

    const trigger = screen.getByRole("button", { name: "Profile" });
    fireEvent.pointerEnter(trigger, { pointerType: "mouse" });
    const hoverDialog = await screen.findByRole("dialog", { name: "Team settings" });

    const combo = screen.getByRole("combobox", { name: "Role" });
    combo.focus();
    await user.keyboard("{ArrowDown}");
    const memberOpt = await screen.findByRole("option", { name: "Member" });

    // Moving pointer from HoverCard onto portaled Select.Popover must not close HoverCard
    fireEvent.pointerLeave(hoverDialog, { pointerType: "mouse", relatedTarget: memberOpt });
    await new Promise((resolve) => setTimeout(resolve, 80));
    expect(screen.getByRole("dialog", { name: "Team settings" })).toBeInTheDocument();

    await user.click(memberOpt);
    expect(combo).toHaveTextContent("Member");
    expect(screen.getByRole("dialog", { name: "Team settings" })).toBeInTheDocument();
  });
});
