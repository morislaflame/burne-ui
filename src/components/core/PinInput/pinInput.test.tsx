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

  it("pastes a code and deletes the focused cell", () => {
    render(<PinInput label="Code" length={4} />);
    const first = digits()[0]!;
    fireEvent.paste(first, { clipboardData: { getData: () => "12ab" } });
    expect(digits().map((cell) => (cell as HTMLInputElement).value)).toEqual(["1", "2", "", ""]);
    fireEvent.keyDown(digits()[1]!, { key: "Backspace" });
    expect(digits().map((cell) => (cell as HTMLInputElement).value)).toEqual(["1", "", "", ""]);
  });

  it("hides a masked value without a password field", () => {
    render(<PinInput label="PIN" mask length={4} />);
    for (const cell of digits()) {
      expect(cell).toHaveAttribute("type", "text");
      expect(cell.className).toContain("text-security:disc");
    }
  });

  it("marks the field invalid from error, not from status", () => {
    const { rerender } = render(<PinInput label="Code" status="danger" />);
    expect(digits()[0]).not.toHaveAttribute("aria-invalid");
    rerender(<PinInput label="Code" error="Wrong code" />);
    expect(digits()[0]).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Wrong code")).toBeInTheDocument();
  });
});
