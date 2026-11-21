import { fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { render, setReducedMotion } from "@/__tests__/helpers";
import { createMotionStates } from "@/components/core/utils/slotMotion";

import { Breadcrumbs } from ".";

afterEach(() => {
  setReducedMotion(false);
  vi.restoreAllMocks();
});

describe("Breadcrumbs fixes", () => {
  it("honours item.current in collapsed and expanded modes and rotates chevron in RTL", () => {
    const { container, rerender } = render(
      <Breadcrumbs
        collapse
        items={[
          { label: "Home", href: "/" },
          { label: "Section", href: "/s" },
          { label: "Sub", href: "/sub", current: true },
          { label: "Trailing", href: "/trail", current: false },
        ]}
      />,
    );

    expect(screen.getByText("Sub")).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Trailing" })).not.toHaveAttribute("aria-current");

    const chevron = container.querySelector("svg");
    expect(chevron?.getAttribute("class")).toContain("rtl:rotate-180");

    rerender(
      <Breadcrumbs
        collapse={false}
        items={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs", current: false },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "Docs" })).not.toHaveAttribute("aria-current");
  });

  it("avoids duplicate React keys when collapsed items share labels", async () => {
    setReducedMotion(true);
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const { user } = render(
      <Breadcrumbs
        collapse
        items={[
          { label: "Root", href: "/" },
          { label: "Folder", onClick: () => {} },
          { label: "Folder", onClick: () => {} },
          { label: "Sub", href: "/sub" },
          { label: "Leaf" },
        ]}
      />,
    );

    const trigger = screen.getByRole("button", { name: /hidden|скрыт/i });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findAllByRole("menuitem", { name: "Folder" })).toHaveLength(2);
    const keyWarnings = error.mock.calls.filter((call) =>
      call.some((arg) => String(arg).includes("same key")),
    );
    expect(keyWarnings).toEqual([]);
  });

  it("forwards motionState, motionPayload, playInitialState and root states to InteractiveCrumb", () => {
    setReducedMotion(false);
    const seen: unknown[] = [];
    const states = createMotionStates({
      saving: {
        itemLink: (ctx) => {
          seen.push(ctx.payload);
        },
      },
    });

    render(
      <Breadcrumbs motion={{ states }}>
        <Breadcrumbs.List>
          <Breadcrumbs.Item
            href="/home"
            motionState="saving"
            motionPayload="crumb-snap"
            playInitialState
          >
            Home
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>Current</Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs>,
    );

    expect(seen).toEqual(["crumb-snap"]);
    void fireEvent;
  });
});
