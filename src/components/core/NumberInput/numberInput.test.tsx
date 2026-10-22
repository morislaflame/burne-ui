import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { render } from "@/__tests__/helpers";

import { NumberInput } from ".";

describe("NumberInput", () => {
  it("steps with the arrow keys and stops on the bound", () => {
    render(<NumberInput label="Quantity" min={0} max={2} step={1} defaultValue={1} />);
    const input = screen.getByRole("spinbutton", { name: "Quantity" });
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(input).toHaveValue("2");
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(input).toHaveValue("2");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input).toHaveValue("1");
  });

  it("steps from empty to zero, then by the step", () => {
    render(<NumberInput label="Quantity" />);
    const input = screen.getByRole("spinbutton", { name: "Quantity" });
    fireEvent.click(screen.getByRole("button", { name: "Increase" }));
    expect(input).toHaveValue("0");
    fireEvent.click(screen.getByRole("button", { name: "Increase" }));
    expect(input).toHaveValue("1");
    fireEvent.click(screen.getByRole("button", { name: "Decrease" }));
    expect(input).toHaveValue("0");
  });

  it("disables a stepper on the bound and clamps on blur", () => {
    render(<NumberInput label="Quantity" min={0} max={10} defaultValue={10} />);
    const input = screen.getByRole("spinbutton", { name: "Quantity" });
    expect(screen.getByRole("button", { name: "Increase" })).toBeDisabled();
    fireEvent.change(input, { target: { value: "15" } });
    expect(input).toHaveValue("15");
    fireEvent.blur(input);
    expect(input).toHaveValue("10");
    expect(screen.getByRole("button", { name: "Increase" })).toBeDisabled();
  });

  it("snaps a typed value to the step on blur", () => {
    render(<NumberInput label="Amount" step={0.5} defaultValue={1} />);
    const input = screen.getByRole("spinbutton", { name: "Amount" });
    fireEvent.change(input, { target: { value: "1.2" } });
    fireEvent.blur(input);
    expect(input).toHaveValue("1");
    fireEvent.click(screen.getByRole("button", { name: "Increase" }));
    expect(input).toHaveValue("1.5");
  });

  it("publishes invalid from error", () => {
    render(<NumberInput label="Quantity" error="Required" />);
    const input = screen.getByRole("spinbutton", { name: "Quantity" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("data-invalid", "");
    expect(input.getAttribute("aria-describedby")).toBeTruthy();
  });

  it("shows the raw number on focus and announces the formatted value", () => {
    render(
      <NumberInput label="Amount" defaultValue={1200} formatOptions={{ useGrouping: true }} />,
    );
    const input = screen.getByRole("spinbutton", { name: "Amount" });
    expect(input).toHaveValue("1,200");
    expect(input).toHaveAttribute("aria-valuetext", "1,200");
    fireEvent.focus(input);
    expect(input).toHaveValue("1200");
    fireEvent.blur(input);
    expect(input).toHaveValue("1,200");
  });

  it("writes the number into the named input", () => {
    render(<NumberInput label="Quantity" name="qty" defaultValue={2} />);
    const input = screen.getByRole("spinbutton", { name: "Quantity" });
    expect(input).toHaveAttribute("name", "qty");
    expect(input).toHaveValue("2");
  });
});