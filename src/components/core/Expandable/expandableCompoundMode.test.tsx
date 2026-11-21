import { fireEvent, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { render, setReducedMotion } from "@/__tests__/helpers";
import { Accordion } from "@/components/composite/Accordion";
import { gsap } from "@/components/core/utils/gsapMotion";

import { Expandable } from ".";

function simpleModeErrors(error: { mock: { calls: unknown[][] } }) {
  return error.mock.calls.filter((args) => String(args[0]).includes("mounted in simple mode"));
}

describe("Expandable compound parts inside a wrapper", () => {
  afterEach(() => {
    setReducedMotion(false);
    vi.restoreAllMocks();
  });

  it("does not warn for the simple API", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<Expandable title="Title">Panel text</Expandable>);
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(simpleModeErrors(error)).toEqual([]);
  });

  it("does not warn when parts are direct children", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <Expandable>
        <Expandable.Trigger>Open</Expandable.Trigger>
        <Expandable.Panel>Body</Expandable.Panel>
      </Expandable>,
    );
    expect(screen.getAllByRole("button", { name: "Open" })).toHaveLength(1);
    expect(simpleModeErrors(error)).toEqual([]);
  });

  it("warns when a wrapper creates Expandable.Trigger", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    function Wrapped() {
      return (
        <>
          <Expandable.Trigger>Hidden</Expandable.Trigger>
          <Expandable.Panel>Body</Expandable.Panel>
        </>
      );
    }
    render(
      <Expandable title="Visible">
        <Wrapped />
      </Expandable>,
    );
    expect(simpleModeErrors(error).map((call) => String(call[0]))).toEqual([
      expect.stringContaining("[burne-ui] Expandable.Trigger mounted in simple mode"),
    ]);
  });

  it("warns when a wrapper creates Accordion.Heading and Trigger inside Item", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    function Wrapped() {
      return (
        <>
          <Accordion.Heading>
            <Accordion.Trigger>Nested</Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>Body</Accordion.Panel>
        </>
      );
    }
    render(
      <Accordion>
        <Accordion.Item value="0">
          <Wrapped />
        </Accordion.Item>
      </Accordion>,
    );
    const messages = simpleModeErrors(error).map((call) => String(call[0]));
    expect(messages).toEqual(
      expect.arrayContaining([
        expect.stringContaining("[burne-ui] Accordion.Heading mounted in simple mode"),
        expect.stringContaining("[burne-ui] Expandable.Trigger mounted in simple mode"),
      ]),
    );
  });

  it("renders one trigger when the wrapper returns Accordion.Item", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    function ItemDemo() {
      return (
        <Accordion.Item value="0">
          <Accordion.Heading>
            <Accordion.Trigger>How to place an order</Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>Returns are available</Accordion.Panel>
        </Accordion.Item>
      );
    }
    render(
      <Accordion defaultValue="0">
        <ItemDemo />
      </Accordion>,
    );
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(screen.getByRole("button", { name: "How to place an order" })).toBeVisible();
    expect(simpleModeErrors(error)).toEqual([]);
  });

  it("includes aria-controls and aria-expanded in SSR markup for Expandable and Accordion", () => {
    const simpleHtml = renderToString(<Expandable title="FAQ">Answer</Expandable>);
    expect(simpleHtml).toContain("aria-controls=");
    expect(simpleHtml).toContain('aria-expanded="false"');

    const accordionHtml = renderToString(
      <Accordion>
        <Accordion.Item value="1">
          <Accordion.Heading>
            <Accordion.Trigger>Section</Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>Details</Accordion.Panel>
        </Accordion.Item>
      </Accordion>,
    );
    expect(accordionHtml).toContain("aria-controls=");
    expect(accordionHtml).toContain('aria-expanded="false"');
  });

  it("registers Expandable.Panel motion on slot panel without overwriting panelShell collapsibleHeight", () => {
    setReducedMotion(false);
    const panelEnter = vi.fn();
    const toSpy = vi.spyOn(gsap, "to");
    render(
      <Expandable>
        <Expandable.Trigger>Open</Expandable.Trigger>
        <Expandable.Panel motion={{ enter: () => void panelEnter() }}>
          Panel content
        </Expandable.Panel>
      </Expandable>,
    );

    toSpy.mockClear();
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(panelEnter).toHaveBeenCalledTimes(1);
    expect(toSpy).toHaveBeenCalled();
  });

  it("lets native button fire onClick on Enter and handles non-button asChild Enter/Space", async () => {
    const onClick = vi.fn();
    const { user, rerender } = render(
      <Expandable title="Title">
        Content
      </Expandable>,
    );
    const nativeBtn = screen.getByRole("button", { name: "Title" });
    expect(fireEvent.keyDown(nativeBtn, { key: " " })).toBe(true);

    rerender(
      <Expandable>
        <Expandable.Trigger asChild onClick={onClick}>
          <div role="button" tabIndex={0}>
            Custom Trigger
          </div>
        </Expandable.Trigger>
        <Expandable.Panel>Content</Expandable.Panel>
      </Expandable>,
    );
    const custom = screen.getByRole("button", { name: "Custom Trigger" });
    custom.focus();
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(custom).toHaveAttribute("aria-expanded", "true");
  });
});
