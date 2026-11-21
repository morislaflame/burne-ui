import { fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { render, setReducedMotion } from "@/__tests__/helpers";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

import { Tabs } from ".";

afterEach(() => {
  setReducedMotion(false);
  vi.restoreAllMocks();
});

describe("Tabs fixes", () => {
  it("applies hidden class after user display className and sets inert on inactive keepMounted panels", () => {
    render(
      <Tabs defaultValue="a" keepMounted>
        <Tabs.List aria-label="Tabs">
          <Tabs.Tab value="a">Tab A</Tabs.Tab>
          <Tabs.Tab value="b">Tab B</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a" className="flex flex-col">
          Active content
        </Tabs.Panel>
        <Tabs.Panel value="b" className="flex flex-col" data-testid="panel-b">
          <a href="/hidden">Hidden link</a>
        </Tabs.Panel>
      </Tabs>,
    );

    const panelB = screen.getByTestId("panel-b");
    expect(panelB).toHaveClass("hidden");
    expect(panelB).not.toHaveClass("flex");
    expect(panelB.inert).toBe(true);
  });

  it("gives tabIndex={0} to the first non-disabled tab when value is null", () => {
    render(
      <Tabs value={null}>
        <Tabs.List aria-label="Tabs">
          <Tabs.Tab value="a" disabled>
            Disabled A
          </Tabs.Tab>
          <Tabs.Tab value="b">Enabled B</Tabs.Tab>
          <Tabs.Tab value="c">Enabled C</Tabs.Tab>
        </Tabs.List>
      </Tabs>,
    );

    expect(screen.getByRole("tab", { name: "Disabled A" })).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("tab", { name: "Enabled B" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tab", { name: "Enabled C" })).toHaveAttribute("tabindex", "-1");
  });

  it("inverts ArrowLeft and ArrowRight in RTL horizontal orientation and uses logical start-0 for vertical indicator", () => {
    const originalStyle = window.getComputedStyle.bind(window);
    vi.spyOn(window, "getComputedStyle").mockImplementation((el) => {
      const style = originalStyle(el);
      if (!(el instanceof HTMLElement) || el.getAttribute("dir") !== "rtl") return style;
      return new Proxy(style, {
        get(target, prop, receiver) {
          if (prop === "direction") return "rtl";
          const val = Reflect.get(target, prop, receiver);
          return typeof val === "function" ? val.bind(target) : val;
        },
      });
    });

    const { container } = render(
      <Tabs defaultValue="one">
        <Tabs.List dir="rtl" aria-label="RTL Tabs">
          <Tabs.Tab value="one">One</Tabs.Tab>
          <Tabs.Tab value="two">Two</Tabs.Tab>
          <Tabs.Tab value="three">Three</Tabs.Tab>
        </Tabs.List>
      </Tabs>,
    );

    const one = screen.getByRole("tab", { name: "One" });
    one.focus();
    fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowLeft" });
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true");

    const vert = render(
      <Tabs defaultValue="v1" orientation="vertical">
        <Tabs.List aria-label="Vertical Tabs">
          <Tabs.Tab value="v1">V1</Tabs.Tab>
        </Tabs.List>
      </Tabs>,
    );
    const indicator = vert.container.querySelector('[role="tablist"] > span[aria-hidden]');
    expect(indicator?.className).toContain("start-0");
    void container;
  });

  it("supports non-button asChild tabs in roving keyboard navigation and skips aria-disabled tabs", () => {
    render(
      <Tabs defaultValue="a">
        <Tabs.List aria-label="Links">
          <Tabs.Tab value="a" asChild>
            <a href="#a">Alpha</a>
          </Tabs.Tab>
          <Tabs.Tab value="b" asChild disabled>
            <a href="#b">Blocked</a>
          </Tabs.Tab>
          <Tabs.Tab value="c" asChild>
            <a href="#c">Charlie</a>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>,
    );

    const alpha = screen.getByRole("tab", { name: "Alpha" });
    const blocked = screen.getByRole("tab", { name: "Blocked" });
    expect(blocked).not.toHaveAttribute("href");
    expect(blocked).toHaveAttribute("aria-disabled", "true");

    alpha.focus();
    fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "Charlie" })).toHaveAttribute("aria-selected", "true");
  });

  it("does not re-render Tabs.Panel on initial tab ref layout notification and forwards root motion events to nested scopes", () => {
    let panelRenders = 0;
    function ProbePanel() {
      panelRenders += 1;
      return <div>Body</div>;
    }

    const ping = vi.fn();
    const events = createMotionEvents({
      "tabs:ping": () => void ping(),
    });

    function Harness() {
      const tabCtrl = useMotionControllerHandle<keyof typeof events>();
      return (
        <>
          <button type="button" onClick={() => void tabCtrl.playSlot("tab", "tabs:ping")}>
            Trigger Ping
          </button>
          <Tabs defaultValue="a" motion={{ events }}>
            <Tabs.List aria-label="Perf">
              <Tabs.Tab value="a" motionController={tabCtrl}>
                A
              </Tabs.Tab>
              <Tabs.Tab value="b">B</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="a">
              <ProbePanel />
            </Tabs.Panel>
          </Tabs>
        </>
      );
    }

    render(<Harness />);
    expect(panelRenders).toBe(1);

    fireEvent.click(screen.getByRole("button", { name: "Trigger Ping" }));
    expect(ping).toHaveBeenCalledTimes(1);
  });
});
