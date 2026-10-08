import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Calendar } from "@/components/core/Calendar";
import { ComboBox } from "@/components/core/ComboBox";
import { ListBox } from "@/components/core/ListBox";
import { Select } from "@/components/core/Select";
import { Slider } from "@/components/core/Slider";
import { Tabs } from "@/components/core/Tabs";
import { TimeField } from "@/components/core/TimeField";

import { render, selectValueButton } from "./helpers";

const OPTIONS = [
  { value: "alpha", label: "Alpha" },
  { value: "beta", label: "Beta" },
  { value: "charlie", label: "Charlie" },
];

describe("Э0.1 keyboard", () => {
  it("Tabs: arrows move selection; Home/End jump to first/last", async () => {
    const { user } = render(
      <Tabs defaultValue="one">
        <Tabs.List aria-label="Sections">
          <Tabs.Tab value="one">One</Tabs.Tab>
          <Tabs.Tab value="two">Two</Tabs.Tab>
          <Tabs.Tab value="three">Three</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one">Panel one</Tabs.Panel>
        <Tabs.Panel value="two">Panel two</Tabs.Panel>
        <Tabs.Panel value="three">Panel three</Tabs.Panel>
      </Tabs>);

    const one = screen.getByRole("tab", { name: "One" });
    one.focus();
    expect(one).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Three" })).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("aria-selected", "true");
  });

  it("ListBox: arrows, Home/End, Enter select, typeahead", async () => {
    const { user } = render(
      <ListBox aria-label="Letters">
        <ListBox.Item value="alpha" label="Alpha" />
        <ListBox.Item value="beta" label="Beta" />
        <ListBox.Item value="charlie" label="Charlie" />
      </ListBox>);

    const list = screen.getByRole("listbox");
    list.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("option", { name: "Alpha" })).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{End}");
    await user.keyboard("{Enter}");
    expect(screen.getByRole("option", { name: "Charlie" })).toHaveAttribute("aria-selected", "true");

    await user.keyboard("b");
    await user.keyboard("{Enter}");
    expect(screen.getByRole("option", { name: "Beta" })).toHaveAttribute("aria-selected", "true");
  });

  it("Select: ArrowDown opens, arrows move, Enter commits, Escape closes", async () => {
    const { user } = render(<Select label="City" options={OPTIONS} />);

    const trigger = selectValueButton();
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    expect(await screen.findByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger).toHaveTextContent("Beta");

    trigger.focus();
    await user.keyboard("{ArrowDown}");
    expect(await screen.findByRole("listbox")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("ComboBox: ArrowDown opens the list, Escape closes", async () => {
    const { user } = render(<ComboBox label="City" options={OPTIONS} />);

    const input = screen.getByRole("combobox");
    input.focus();
    await user.keyboard("{ArrowDown}");
    expect(await screen.findByRole("listbox")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("Calendar grid: ArrowRight moves to the next day", async () => {
    const { user } = render(<Calendar defaultValue={new Date(2026, 8, 1)} />);
    const day = screen.getByRole("button", { name: "1 September 2026" });
    day.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "2 September 2026" })).toHaveFocus();
  });

  it("TimeField: ArrowUp increments the focused segment", async () => {
    const { user } = render(<TimeField label="Start" defaultValue="12:30" />);
    const hour = screen.getAllByRole("spinbutton")[0];
    hour.focus();
    const before = hour.getAttribute("aria-valuenow");
    await user.keyboard("{ArrowUp}");
    expect(hour.getAttribute("aria-valuenow")).not.toBe(before);
  });

  it("Slider: ArrowRight steps up; Home/End jump to min/max", async () => {
    const { user } = render(
      <Slider ariaLabel="Volume" defaultValue={40} min={0} max={100} step={10} />);
    const slider = screen.getByRole("slider");
    slider.focus();
    expect(slider).toHaveAttribute("aria-valuenow", "40");

    await user.keyboard("{ArrowRight}");
    expect(slider).toHaveAttribute("aria-valuenow", "50");

    await user.keyboard("{Home}");
    expect(slider).toHaveAttribute("aria-valuenow", "0");

    await user.keyboard("{End}");
    expect(slider).toHaveAttribute("aria-valuenow", "100");
  });
});
