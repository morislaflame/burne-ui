import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Form } from "@/components/composite/Form";
import { render } from "@/__tests__/helpers";

import { DatePicker } from ".";

const OCTOBER = new Date(2026, 9, 1);

/** Pointer opens after the press squeeze, the same wait Select uses for its listbox. */
async function openPicker(name: string) {
  const { user } = render(<DatePicker label={name} defaultMonth={OCTOBER} />);
  return { user, trigger: await pressOpen(user, name) };
}

async function pressOpen(user: { click: (target: Element) => Promise<void> }, name: string) {
  const trigger = screen.getByRole("combobox", { name });
  await user.click(trigger);
  await screen.findByRole("dialog");
  return trigger;
}

describe("DatePicker", () => {
  it("moves the open grid with the arrow key", async () => {
    await openPicker("Date");
    const day = await waitFor(() => {
      const node = document.querySelector<HTMLButtonElement>('[data-calendar-roving][tabindex="0"]');
      expect(node).toBeTruthy();
      return node!;
    });
    const before = day.getAttribute("aria-label");
    fireEvent.keyDown(day, { key: "ArrowRight" });
    const next = document.querySelector<HTMLButtonElement>('[data-calendar-roving][tabindex="0"]');
    expect(next?.getAttribute("aria-label")).not.toBe(before);
    expect(next).toHaveFocus();
  });

  it("opens the calendar and commits a single day", async () => {
    const { user } = render(<DatePicker label="Date" defaultMonth={OCTOBER} />);

    const trigger = screen.getByRole("combobox", { name: "Date" });
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("data-state", "closed");

    await user.click(trigger);
    await screen.findByRole("dialog");

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("data-state", "open");

    await user.click(screen.getByRole("button", { name: "15 October 2026" }));

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

  it("keeps the popover open when the same day is cleared", async () => {
    const { user } = render(
      <DatePicker label="Date" defaultMonth={OCTOBER} defaultValue={new Date(2026, 9, 15)} />,
    );
    const trigger = await pressOpen(user, "Date");
    await user.click(screen.getByRole("button", { name: "15 October 2026" }));
    expect(trigger).toHaveTextContent("Select a date");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("closes a range only after both ends", async () => {
    const { user } = render(<DatePicker selectionMode="range" label="Stay" defaultMonth={OCTOBER} />);
    const trigger = await pressOpen(user, "Stay");
    await user.click(screen.getByRole("button", { name: "10 October 2026" }));
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await user.click(screen.getByRole("button", { name: "12 October 2026" }));
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

  it("writes a local ISO day into the named field", async () => {
    const { user } = render(
      <form>
        <DatePicker label="Date" name="when" defaultMonth={OCTOBER} />
      </form>,
    );
    await pressOpen(user, "Date");
    await user.click(screen.getByRole("button", { name: "15 October 2026" }));
    const hidden = document.querySelector('input[name="when"]');
    expect(hidden).toHaveValue("2026-10-15");
  });

  it("integrates with Form defaultValues/validation and resets uncontrolled date on native form reset", async () => {
    const { user } = render(
      <Form defaultValues={{ day: "2026-10-15" }} rules={{ day: { required: "Pick date" } }}>
        <Form.Field name="day">
          <DatePicker name="day" label="Appointment" defaultMonth={OCTOBER} />
        </Form.Field>
        <button type="reset">Reset</button>
      </Form>,
    );

    const appt = screen.getByRole("combobox", { name: "Appointment" });
    expect(appt).toHaveTextContent("15 Oct 2026");

    const plain = render(
      <form>
        <DatePicker
          name="d"
          label="Departure"
          defaultMonth={OCTOBER}
          defaultValue={new Date(2026, 9, 5)}
        />
      </form>,
    );
    const dep = plain.getByRole("combobox", { name: "Departure" });
    expect(dep).toHaveTextContent("5 Oct 2026");
    await plain.user.click(dep);
    await plain.findByRole("dialog");
    await plain.user.click(plain.getByRole("button", { name: "20 October 2026" }));
    expect(dep).toHaveTextContent("20 Oct 2026");

    plain.container.querySelector("form")!.reset();
    await waitFor(() => {
      expect(dep).toHaveTextContent("5 Oct 2026");
    });
    void user;
  });
});
