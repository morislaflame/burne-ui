import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { render } from "@/__tests__/helpers";

import { PinInput } from ".";

function digits() {
  return screen.getAllByRole("textbox");
}

describe("PinInput", () => {
  it("fills cells from the start and skips letters", () => {
    const onValueChange = vi.fn();
    render(<PinInput label="Code" length={4} onValueChange={onValueChange} />);
    const cells = digits();
    fireEvent.change(cells[0]!, { target: { value: "1" } });
    fireEvent.change(digits()[1]!, { target: { value: "a" } });
    fireEvent.change(digits()[1]!, { target: { value: "2" } });
    expect(onValueChange).toHaveBeenLastCalledWith("12");
    expect(digits()[0]).toHaveValue("1");
    expect(digits()[1]).toHaveValue("2");
  });

  it("spreads several characters typed into one cell", () => {
    render(<PinInput label="Code" length={4} />);
    fireEvent.change(digits()[0]!, { target: { value: "12a3" } });
    expect(digits().map((cell) => (cell as HTMLInputElement).value)).toEqual(["1", "2", "3", ""]);
  });

  it("fills every cell when the pasted code is complete", () => {
    const onValueChange = vi.fn();
    render(<PinInput label="Code" length={4} onValueChange={onValueChange} />);
    fireEvent.paste(digits()[0]!, { clipboardData: { getData: () => "1234" } });
    expect(digits().map((cell) => (cell as HTMLInputElement).value)).toEqual(["1", "2", "3", "4"]);
    expect(onValueChange).toHaveBeenLastCalledWith("1234");
  });

  it("pastes a code and deletes the focused cell", () => {
    render(<PinInput label="Code" length={4} />);
    const first = digits()[0]!;
    fireEvent.paste(first, { clipboardData: { getData: () => "12ab" } });
    expect(digits().map((cell) => (cell as HTMLInputElement).value)).toEqual(["1", "2", "", ""]);
    fireEvent.keyDown(digits()[1]!, { key: "Backspace" });
    expect(digits().map((cell) => (cell as HTMLInputElement).value)).toEqual(["1", "", "", ""]);
  });

  it("renders password inputs with one-time-code autocomplete when masked", () => {
    const { container } = render(<PinInput label="PIN" mask length={4} />);
    const cells = Array.from(container.querySelectorAll<HTMLInputElement>('input:not([type="hidden"])'));
    expect(cells).toHaveLength(4);
    cells.forEach((cell, index) => {
      expect(cell).toHaveAttribute("type", "password");
      expect(cell).toHaveAttribute("inputmode", "numeric");
      expect(cell).toHaveAttribute("autocomplete", index === 0 ? "one-time-code" : "off");
    });
  });

  it("puts className on one cell", () => {
    render(
      <PinInput length={4} label="Code" separator="–">
        <PinInput.Shell>
          <PinInput.Control className="border-primary" />
          <PinInput.Control />
          <PinInput.Control />
          <PinInput.Control />
        </PinInput.Shell>
      </PinInput>,
    );
    const cells = digits();
    expect(cells).toHaveLength(4);
    expect(cells[0]?.className).toContain("border-primary");
    expect(cells[1]?.className).not.toContain("border-primary");
    expect(screen.getByText("–")).toBeInTheDocument();
  });

  it("marks the field invalid from error", () => {
    render(<PinInput label="Code" error="Wrong code" />);
    expect(digits()[0]).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Wrong code")).toBeInTheDocument();
  });

  it("links Label htmlFor to cell 0 and edits an already-filled cell without overwriting the next cell", () => {
    render(<PinInput label="OTP" length={4} defaultValue="1234" />);
    const label = screen.getByText("OTP").closest("label")!;
    expect(label.getAttribute("for")).toBe(digits()[0]!.id);

    // Typing "9" into cell 0 when cell 0 already has "1" produces "19" or "91"
    fireEvent.change(digits()[0]!, { target: { value: "19" } });
    expect(digits().map((cell) => (cell as HTMLInputElement).value)).toEqual(["9", "2", "3", "4"]);
    expect(digits()[1]).toHaveFocus();
  });

  it("keeps focus on an empty cell for mobile Paste callout and pastes from cell 0 when earlier cells are empty", async () => {
    const { container } = render(
      <form>
        <PinInput name="otp" label="Code" length={4} defaultValue="" />
      </form>,
    );
    const cells = digits();
    cells[2]!.focus();
    expect(cells[2]).toHaveFocus();

    fireEvent.paste(cells[2]!, { clipboardData: { getData: () => "5678" } });
    expect(digits().map((cell) => (cell as HTMLInputElement).value)).toEqual(["5", "6", "7", "8"]);

    container.querySelector("form")!.reset();
    await vi.waitFor(() => {
      expect(digits().map((cell) => (cell as HTMLInputElement).value)).toEqual(["", "", "", ""]);
    });
  });
});
