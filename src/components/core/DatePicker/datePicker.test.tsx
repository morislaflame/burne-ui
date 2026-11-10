import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { render } from "@/__tests__/helpers";

import { DatePicker } from ".";

const OCTOBER = new Date(2026, 9, 1);

describe("DatePicker", () => {
  it("moves the open grid with the arrow key", () => {
    render(<DatePicker label="Date" defaultMonth={OCTOBER} />);
    fireEvent.click(screen.getByRole("combobox", { name: "Date" }));
    const day = document.querySelector<HTMLButtonElement>('[data-calendar-roving][tabindex="0"]');
    expect(day).toBeTruthy();
    const before = day!.getAttribute("aria-label");
    fireEvent.keyDown(day!, { key: "ArrowRight" });
    const next = document.querySelector<HTMLButtonElement>('[data-calendar-roving][tabindex="0"]');
    expect(next?.getAttribute("aria-label")).not.toBe(before);
    expect(next).toHaveFocus();
  });

  it("opens the calendar and commits a single day", () => {
    render(<DatePicker label="Date" defaultMonth={OCTOBER} />);

    const trigger = screen.getByRole("combobox", { name: "Date" });
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("data-state", "closed");

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("data-state", "open");

    fireEvent.click(screen.getByRole("button", { name: "15 October 2026" }));

    expect(trigger).toHaveTextContent("15 Oct 2026");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("publishes invalid on the trigger from error", () => {
    render(<DatePicker label="Date" error="Pick a day" />);
    const trigger = screen.getByRole("combobox", { name: "Date" });
    expect(trigger).toHaveAttribute("role", "combobox");
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(trigger).toHaveAttribute("data-invalid", "");
    expect(trigger.getAttribute("aria-describedby")).toBeTruthy();
  });

  it("keeps the popover open when the same day is cleared", () => {
    render(
      <DatePicker label="Date" defaultMonth={OCTOBER} defaultValue={new Date(2026, 9, 15)} />,
    );
    const trigger = screen.getByRole("combobox", { name: "Date" });
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("button", { name: "15 October 2026" }));
    expect(trigger).toHaveTextContent("Select a date");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("closes a range only after both ends", () => {
    render(<DatePicker selectionMode="range" label="Stay" defaultMonth={OCTOBER} />);
    const trigger = screen.getByRole("combobox", { name: "Stay" });
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("button", { name: "10 October 2026" }));
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(screen.getByRole("button", { name: "12 October 2026" }));
    expect(trigger).toHaveTextContent("10 Oct 2026 – 12 Oct 2026");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("formats the field with the locale tag", () => {
    render(
      <DatePicker
        label="Дата"
        locale="ru"
        defaultValue={new Date(2026, 9, 15)}
      />,
    );
    expect(screen.getByRole("combobox", { name: "Дата" })).toHaveTextContent("15 окт. 2026 г.");
  });

  it("writes a local ISO day into the named field", () => {
    render(
      <form>
        <DatePicker label="Date" name="when" defaultMonth={OCTOBER} />
      </form>,
    );
    fireEvent.click(screen.getByRole("combobox", { name: "Date" }));
    fireEvent.click(screen.getByRole("button", { name: "15 October 2026" }));
    const hidden = document.querySelector('input[name="when"]');
    expect(hidden).toHaveValue("2026-10-15");
  });
});
