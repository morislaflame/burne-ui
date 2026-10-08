import { fireEvent, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { render } from "@/__tests__/helpers";

import { Stepper } from ".";

const steps = [
  { value: "account", title: "Account", description: "Email" },
  { value: "shipping", title: "Shipping", description: "Address" },
  { value: "payment", title: "Payment", description: "Card" },
];

function Harness({ linear = true }: { linear?: boolean }) {
  const [value, setValue] = useState("shipping");
  return <Stepper aria-label="Checkout" steps={steps} value={value} onValueChange={setValue} linear={linear} />;
}

describe("Stepper", () => {
  it("marks the current step and lets a completed step be selected", () => {
    const onValueChange = vi.fn();
    render(<Stepper aria-label="Checkout" steps={steps} value="shipping" onValueChange={onValueChange} />);
    expect(screen.getByRole("button", { name: /Shipping/ })).toHaveAttribute("aria-current", "step");
    fireEvent.click(screen.getByRole("button", { name: /Account/ }));
    expect(onValueChange).toHaveBeenCalledWith("account");
  });

  it("ignores a later step while linear", () => {
    const onValueChange = vi.fn();
    render(<Stepper aria-label="Checkout" steps={steps} value="shipping" onValueChange={onValueChange} />);
    expect(screen.getByRole("button", { name: /Payment/ })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: /Payment/ }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("selects a later step when linear is off", () => {
    render(<Harness linear={false} />);
    fireEvent.click(screen.getByRole("button", { name: /Payment/ }));
    expect(screen.getByRole("button", { name: /Payment/ })).toHaveAttribute("aria-current", "step");
  });

  it("moves to the previous step with the arrow key", () => {
    render(<Harness />);
    const current = screen.getByRole("button", { name: /Shipping/ });
    current.focus();
    fireEvent.keyDown(current, { key: "ArrowLeft" });
    expect(screen.getByRole("button", { name: /Account/ })).toHaveAttribute("aria-current", "step");
  });
});
