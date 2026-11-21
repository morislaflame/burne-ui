import { fireEvent, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { render, setReducedMotion } from "@/__tests__/helpers";

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

afterEach(() => {
  setReducedMotion(false);
  vi.restoreAllMocks();
});

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

  it("roves across enabled steps with arrows, Home, and End", () => {
    render(<Harness linear={false} />);
    const current = screen.getByRole("button", { name: /Shipping/ });
    current.focus();
    fireEvent.keyDown(current, { key: "Home" });
    expect(screen.getByRole("button", { name: /Account/ })).toHaveAttribute("aria-current", "step");
    fireEvent.keyDown(screen.getByRole("button", { name: /Account/ }), { key: "End" });
    expect(screen.getByRole("button", { name: /Payment/ })).toHaveAttribute("aria-current", "step");
    fireEvent.keyDown(screen.getByRole("button", { name: /Payment/ }), { key: "ArrowLeft" });
    expect(screen.getByRole("button", { name: /Shipping/ })).toHaveAttribute("aria-current", "step");
  });

  it("moves to the previous step with the arrow key and lets ArrowRight return without locking the reached step", () => {
    render(<Harness />);
    const shipping = screen.getByRole("button", { name: /Shipping/ });
    shipping.focus();
    fireEvent.keyDown(shipping, { key: "ArrowLeft" });
    const account = screen.getByRole("button", { name: /Account/ });
    expect(account).toHaveAttribute("aria-current", "step");
    expect(screen.getByRole("button", { name: /Shipping/ })).not.toBeDisabled();

    fireEvent.keyDown(account, { key: "ArrowRight" });
    expect(screen.getByRole("button", { name: /Shipping/ })).toHaveAttribute("aria-current", "step");
    expect(screen.getByRole("button", { name: /Payment/ })).toBeDisabled();
  });

  it("forwards rest props onto Stepper.Item <li>, scopes roving to [data-slot=trigger], and initializes indicator shadow", () => {
    setReducedMotion(false);
    render(
      <Stepper aria-label="Wizard" defaultValue="one" linear={false}>
        <Stepper.Item value="one" data-testid="step-li-one" id="custom-step-one">
          <Stepper.Trigger>
            <Stepper.Indicator data-testid="ind-one" />
            <Stepper.Title>Step One</Stepper.Title>
          </Stepper.Trigger>
          <button type="button">Extra Action</button>
        </Stepper.Item>
        <Stepper.Item value="two" title="Step Two" />
      </Stepper>,
    );

    const li = screen.getByTestId("step-li-one");
    expect(li).toHaveAttribute("id", "custom-step-one");

    const indicator = screen.getByTestId("ind-one");
    expect(indicator.className).toContain("animate-shadow");
    expect(indicator.style.getPropertyValue("--el-shadow")).not.toBe("");

    const firstTrigger = screen.getByRole("button", { name: /Step One/ });
    expect(firstTrigger).toHaveAttribute("data-slot", "trigger");
    firstTrigger.focus();
    fireEvent.keyDown(firstTrigger, { key: "ArrowRight" });
    expect(screen.getByRole("button", { name: /Step Two/ })).toHaveAttribute("aria-current", "step");
  });
});
