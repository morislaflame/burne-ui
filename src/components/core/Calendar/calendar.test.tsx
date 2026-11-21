import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { render } from "@/__tests__/helpers";

import { Calendar } from ".";

describe("Calendar Phase 2E fixes", () => {
  it("does not steal page focus on mount", () => {
    render(
      <div>
        <input aria-label="Before" />
        <Calendar value={new Date(2026, 5, 15)} />
      </div>,
    );
    expect(document.activeElement).toBe(document.body);
  });

  it("normalizes mid-day minDate so today at 00:00 is not disabled", async () => {
    const onValueChange = vi.fn();
    const midDayMin = new Date(2026, 5, 15, 14, 45, 0);
    const { user } = render(
      <Calendar
        defaultMonth={new Date(2026, 5, 1)}
        minDate={midDayMin}
        onValueChange={onValueChange}
      />,
    );
    const sameDayBtn = screen.getByRole("button", { name: "15 June 2026" });
    expect(sameDayBtn).not.toBeDisabled();
    await user.click(sameDayBtn);
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("supports disabled and readOnly props", async () => {
    const onChange = vi.fn();
    const { container, user, rerender } = render(
      <Calendar
        disabled
        defaultMonth={new Date(2026, 5, 1)}
        onValueChange={onChange}
      />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("data-disabled", "");
    const day = screen.getByRole("button", { name: "10 June 2026" });
    expect(day).toBeDisabled();
    await user.click(day);
    expect(onChange).not.toHaveBeenCalled();

    rerender(
      <Calendar
        readOnly
        defaultMonth={new Date(2026, 5, 1)}
        onValueChange={onChange}
      />,
    );
    expect(container.firstElementChild).toHaveAttribute("data-readonly", "");
    const readOnlyDay = screen.getByRole("button", { name: "10 June 2026" });
    expect(readOnlyDay).not.toBeDisabled();
    await user.click(readOnlyDay);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("disables out-of-range months, years, and nav buttons, and clamps Feb 29 on year press", async () => {
    const { user } = render(
      <Calendar
        defaultValue={new Date(2024, 1, 29)}
        minDate={new Date(2024, 1, 10)}
        maxDate={new Date(2025, 4, 20)}
      />,
    );
    // Prev month is Jan 2024 < Feb 10, 2024 -> Prev button disabled
    expect(screen.getByRole("button", { name: /Previous/i })).toBeDisabled();

    // Drill up to months -> years
    await user.click(screen.getByRole("button", { name: "February 2024" }));
    expect(screen.getByRole("button", { name: "Jan" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "2024" }));
    expect(screen.getByRole("button", { name: "2023" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "2026" })).toBeDisabled();

    // Select 2025 -> should clamp Feb 29 -> Feb 28 (not overflow to March 1!)
    await user.click(screen.getByRole("button", { name: "2025" }));
    await user.click(screen.getByRole("button", { name: "Feb" }));
    expect(screen.getByRole("grid", { name: "February 2025" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "28 February 2025" })).toHaveAttribute("tabindex", "0");
  });

  it("keeps roving focus inside defaultMonth when value is in another month and points YearsView initialIndex at viewDate", async () => {
    const { user, unmount } = render(
      <Calendar
        defaultMonth={new Date(2026, 0, 1)}
        value={new Date(2026, 7, 20)}
      />,
    );
    const jan1 = screen.getByRole("button", { name: "1 January 2026" });
    expect(jan1).toHaveAttribute("tabindex", "0");
    jan1.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "2 January 2026" })).toHaveFocus();
    unmount();

    render(
      <Calendar
        defaultView="years"
        defaultMonth={new Date(2026, 3, 1)}
        value={new Date(1995, 0, 1)}
      />,
    );
    expect(screen.getByRole("button", { name: "2026" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("button", { name: "2019" })).toHaveAttribute("tabindex", "-1");
  });

  it("flips ArrowLeft/ArrowRight in RTL grids", async () => {
    const originalStyle = window.getComputedStyle.bind(window);
    vi.spyOn(window, "getComputedStyle").mockImplementation((el) => {
      const style = originalStyle(el);
      if (!(el instanceof HTMLElement) || !el.closest("[dir='rtl']")) return style;
      return new Proxy(style, {
        get(target, prop, receiver) {
          if (prop === "direction") return "rtl";
          const value = Reflect.get(target, prop, receiver);
          return typeof value === "function" ? value.bind(target) : value;
        },
      });
    });

    const { user } = render(
      <div dir="rtl">
        <Calendar defaultValue={new Date(2026, 8, 10)} />
      </div>,
    );
    const day10 = screen.getByRole("button", { name: "10 September 2026" });
    day10.focus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("button", { name: "11 September 2026" })).toHaveFocus();
    vi.restoreAllMocks();
  });
});
