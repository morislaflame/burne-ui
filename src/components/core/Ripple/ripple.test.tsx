import { fireEvent } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { render, setReducedMotion } from "@/__tests__/helpers";

import { Ripple } from ".";

afterEach(() => {
  setReducedMotion(false);
});

describe("Ripple disabled and button guards", () => {
  it("suppresses waves on disabled, aria-disabled, data-disabled, or non-primary button", () => {
    setReducedMotion(false);
    const { container, rerender } = render(
      <div role="button" aria-disabled="true">
        <Ripple />
      </div>,
    );
    const host = container.firstElementChild as HTMLElement;
    fireEvent.pointerDown(host, { button: 0, clientX: 10, clientY: 10 });
    expect(host.querySelectorAll("span span")).toHaveLength(0);

    rerender(
      <div role="button" data-disabled="">
        <Ripple />
      </div>,
    );
    fireEvent.pointerDown(host, { button: 0, clientX: 10, clientY: 10 });
    expect(host.querySelectorAll("span span")).toHaveLength(0);

    rerender(
      <button type="button" disabled>
        <Ripple />
      </button>,
    );
    const btnHost = container.firstElementChild as HTMLElement;
    fireEvent.pointerDown(btnHost, { button: 0, clientX: 10, clientY: 10 });
    expect(btnHost.querySelectorAll("span span")).toHaveLength(0);

    rerender(
      <div role="button">
        <Ripple />
      </div>,
    );
    const activeHost = container.firstElementChild as HTMLElement;
    fireEvent.pointerDown(activeHost, { button: 2, clientX: 10, clientY: 10 });
    expect(activeHost.querySelectorAll("span span")).toHaveLength(0);

    fireEvent.pointerDown(activeHost, { button: 0, clientX: 10, clientY: 10 });
    expect(activeHost.querySelectorAll("span span").length).toBeGreaterThan(0);
  });
});
