import { fireEvent, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { Form } from "@/components/composite/Form";
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

  it("does not freeze displayed value on blurred stepper click when controlled value changes later", () => {
    function Harness() {
      const [val, setVal] = useState<number | null>(1000);
      return (
        <div>
          <NumberInput
            label="Price"
            value={val}
            onValueChange={setVal}
            step={100}
            formatOptions={{ useGrouping: true }}
          />
          <button type="button" onClick={() => setVal(5000)}>
            Jump
          </button>
        </div>
      );
    }

    render(<Harness />);
    const input = screen.getByRole("spinbutton", { name: "Price" });
    expect(input).toHaveValue("1,000");

    fireEvent.click(screen.getByRole("button", { name: "Increase" }));
    expect(input).toHaveValue("1,100");

    fireEvent.click(screen.getByRole("button", { name: "Jump" }));
    expect(input).toHaveValue("5,000");
  });

  it("marks compound NumberInput invalid from Form error and resets uncontrolled value on form reset", async () => {
    const { user } = render(
      <Form defaultValues={{ qty: "" }} rules={{ qty: { required: "Need qty" } }}>
        <Form.Field name="qty">
          <NumberInput name="qty">
            <NumberInput.Label>Qty</NumberInput.Label>
            <NumberInput.Control />
          </NumberInput>
        </Form.Field>
        <button type="submit">Send</button>
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(screen.getByRole("spinbutton", { name: "Qty" })).toHaveAttribute("aria-invalid", "true");

    const plain = render(
      <form>
        <NumberInput name="count" label="Count" defaultValue={4} />
      </form>,
    );
    const countInput = plain.getByRole("spinbutton", { name: "Count" });
    fireEvent.click(plain.getByRole("button", { name: "Increase" }));
    expect(countInput).toHaveValue("5");

    plain.container.querySelector("form")!.reset();
    await waitFor(() => {
      expect(countInput).toHaveValue("4");
    });
  });
});