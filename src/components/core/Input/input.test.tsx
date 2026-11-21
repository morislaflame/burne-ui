import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { render, setReducedMotion } from "@/__tests__/helpers";

import { Input } from "./index";

describe("Input", () => {
  it("skips pressSqueeze on touch pointerdown and direct input pointerdown so mobile Paste stays intact", () => {
    setReducedMotion(false);
    const pressIn = vi.fn();
    const { container } = render(
      <Input label="Email" prefix="@" motion={{ shell: { pressIn } }} />,
    );
    const shell = container.querySelector('[data-slot="input-shell"]')!;
    const input = screen.getByRole("textbox", { name: "Email" });

    fireEvent.pointerDown(input, { pointerType: "touch", button: 0 });
    fireEvent.pointerDown(shell, { pointerType: "touch", button: 0 });
    fireEvent.pointerDown(input, { pointerType: "mouse", button: 0 });
    expect(pressIn).not.toHaveBeenCalled();

    const prefix = screen.getByText("@");
    fireEvent.pointerDown(prefix, { pointerType: "mouse", button: 0 });
    expect(pressIn).toHaveBeenCalledTimes(1);
  });

  it("focuses the input when clicking shell prefix or suffix without stealing existing focus", () => {
    render(<Input label="Site" prefix="https://" suffix=".com" />);
    const input = screen.getByRole("textbox", { name: "Site" });
    const prefix = screen.getByText("https://");

    fireEvent.click(prefix);
    expect(input).toHaveFocus();

    const mouseDown = new MouseEvent("mousedown", { bubbles: true, cancelable: true });
    prefix.dispatchEvent(mouseDown);
    expect(mouseDown.defaultPrevented).toBe(true);
  });

  it("skips shell pressSqueeze when readOnly", () => {
    setReducedMotion(false);
    const pressIn = vi.fn();
    render(<Input label="Token" readOnly prefix="key" motion={{ shell: { pressIn } }} />);
    fireEvent.pointerDown(screen.getByText("key"), { pointerType: "mouse", button: 0 });
    expect(pressIn).not.toHaveBeenCalled();
  });
});
