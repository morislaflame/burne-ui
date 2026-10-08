import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ComboBox } from "@/components/core/ComboBox";
import { Select } from "@/components/core/Select";

import { render, selectValueButton } from "./helpers";

const OPTIONS = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
];

describe("Э2.2 Select / ComboBox ARIA on the focusable node", () => {
  it("Select combobox role, invalid, required, and describedby live on the value button", () => {
    render(
      <Select
        label="City"
        options={OPTIONS}
        required
        error="Pick a city"
        hint="Pick a city"
      />);

    const button = selectValueButton();
    expect(button.tagName).toBe("BUTTON");
    expect(screen.getAllByRole("combobox")).toEqual([button]);
    expect(button).toHaveAttribute("aria-invalid", "true");
    expect(button).toHaveAttribute("aria-required", "true");
    expect(button).toHaveAttribute("aria-haspopup", "listbox");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button.getAttribute("aria-describedby")).toBeTruthy();
    expect(button).not.toHaveAttribute("aria-disabled");
  });

  it("Select disabled stays native on the button", () => {
    render(<Select label="City" options={OPTIONS} disabled />);
    const button = selectValueButton();
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("role", "combobox");
    expect(button).not.toHaveAttribute("aria-disabled");
  });

  it("ComboBox is a single combobox on the input", () => {
    render(<ComboBox label="City" options={OPTIONS} required error="Bad" hint="Hint" />);

    const input = screen.getByRole("combobox");
    expect(input.tagName).toBe("INPUT");
    expect(screen.getAllByRole("combobox")).toEqual([input]);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-required", "true");
    expect(input).toHaveAttribute("aria-autocomplete", "list");
    expect(input).toHaveAttribute("aria-haspopup", "listbox");
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(input.getAttribute("aria-describedby")).toBeTruthy();
    expect(input).not.toHaveAttribute("readonly");
    expect(input).not.toHaveAttribute("aria-disabled");
  });

  it("ComboBox activedescendant stays on the combobox input", () => {
    render(<ComboBox label="City" options={OPTIONS} required error="Bad" open />);
    const input = screen.getByRole("combobox");
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(input.getAttribute("aria-controls")).toBeTruthy();

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input.getAttribute("aria-activedescendant")).toMatch(/-opt-/);
  });
});
