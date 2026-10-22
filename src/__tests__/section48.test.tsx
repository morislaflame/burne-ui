import { describe, expect, it, vi } from "vitest";

import { Calendar } from "@/components/core/Calendar";
import { ComboBox } from "@/components/core/ComboBox";
import { DatePicker } from "@/components/core/DatePicker";
import { NumberInput } from "@/components/core/NumberInput";
import { Select } from "@/components/core/Select";
import { Separator } from "@/components/core/Separator";
import { Table } from "@/components/core/Table";
import { Tabs } from "@/components/core/Tabs";
import { Toast, toast } from "@/components/core/Toast";

import { render, selectValueButton, setReducedMotion } from "./helpers";

describe("section 4.8 remainder", () => {
  it("hides a decorative separator from the accessibility tree", () => {
    const view = render(
      <>
        <Separator />
        <Separator orientation="vertical" decorative />
      </>,
    );
    expect(view.getByRole("separator")).toBeInTheDocument();
    expect(view.container.querySelector("[aria-hidden='true']")).toHaveAttribute("role", "none");
  });

  it("groups select options and clears the value", async () => {
    const view = render(
      <Select
        clearable
        label="Snack"
        defaultValue="apple"
        items={[
          { label: "Fruit", items: [{ value: "apple", label: "Apple" }] },
          { value: "water", label: "Water" },
        ]}
      />,
    );
    expect(selectValueButton()).toHaveTextContent("Apple");
    selectValueButton().focus();
    await view.user.keyboard("{ArrowDown}");
    expect(view.getByText("Fruit")).toBeInTheDocument();
    expect(view.getByRole("option", { name: "Water" })).toBeInTheDocument();
    await view.user.click(view.getByRole("button", { name: "Clear field" }));
    expect(selectValueButton()).toHaveTextContent("Select a value");
  });

  it("filters, commits a custom value, and shows a loading status", async () => {
    const filtered = render(
      <ComboBox
        label="City"
        allowsCustomValue
        filter={(option, query) => option.value === query}
        items={[{ value: "oslo", label: "Oslo" }]}
      />,
    );
    const input = filtered.getByRole("combobox");
    await filtered.user.click(input);
    await filtered.user.keyboard("bergen{Enter}");
    expect(filtered.getByRole("combobox")).toHaveValue("bergen");
    expect(filtered.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");

    const loading = render(
      <ComboBox label="City" loading defaultOpen items={[{ value: "oslo", label: "Oslo" }]} />,
    );
    expect(loading.getByRole("status")).toHaveTextContent("Loading");
    expect(loading.queryByRole("option", { name: "Oslo" })).toBeNull();
  });

  it("disables unavailable calendar days and keeps a read-only date field closed", async () => {
    const month = new Date(2026, 0, 1);
    const calendar = render(
      <Calendar
        defaultMonth={month}
        isDateUnavailable={(date) => date.getDate() === 15}
      />,
    );
    const blocked = calendar.getByRole("button", { name: /15/ });
    expect(blocked).toBeDisabled();

    const field = render(
      <DatePicker readOnly label="When" defaultValue={month} defaultOpen />,
    );
    expect(field.queryByRole("dialog")).toBeNull();
    expect(field.getByRole("combobox", { name: "When" })).toHaveAttribute("aria-readonly", "true");
  });

  it("selects several dates", async () => {
    const month = new Date(2026, 0, 1);
    const onValuesChange = vi.fn();
    const view = render(
      <DatePicker
        selectionMode="multiple"
        label="Days"
        defaultMonth={month}
        onValuesChange={onValuesChange}
      />,
    );
    await view.user.click(view.getByRole("combobox", { name: "Days" }));
    await view.user.click(view.getByRole("button", { name: "1 January 2026" }));
    expect(onValuesChange).toHaveBeenCalled();
    expect(view.getByRole("combobox", { name: /Days/ })).toHaveTextContent("2026");
  });

  it("moves focus without selecting in manual tabs and unmounts a panel", async () => {
    const view = render(
      <Tabs activationMode="manual" defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">One</Tabs.Tab>
          <Tabs.Tab value="b">Two</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Alpha</Tabs.Panel>
        <Tabs.Panel value="b" keepMounted={false}>
          Beta
        </Tabs.Panel>
      </Tabs>,
    );
    view.getByRole("tab", { name: "One" }).focus();
    await view.user.keyboard("{ArrowRight}");
    expect(view.getByRole("tab", { name: "Two" })).toHaveFocus();
    expect(view.getByRole("tab", { name: "One" })).toHaveAttribute("aria-selected", "true");
    expect(view.queryByText("Beta")).toBeNull();
  });

  it("formats a number with Intl options", () => {
    const view = render(
      <NumberInput label="Amount" defaultValue={1200} formatOptions={{ useGrouping: true }} />,
    );
    const amount = view.getByRole("spinbutton") as HTMLInputElement;
    expect(amount.value).toMatch(/1[,.\s\u00a0\u202f]?200/);
  });

  it("shows a toast from outside React and resizes a column from the keyboard", async () => {
    setReducedMotion(true);
    const view = render(
      <Toast.Provider>
        <Table columnResize aria-label="Files">
          <Table.Content>
            <Table.Header>
              <Table.Column id="name">Name</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row id="1">
                <Table.Cell>Notes</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Content>
        </Table>
      </Toast.Provider>,
    );
    toast.show({ title: "Saved" });
    expect(await view.findByRole("group", { name: "Saved" })).toBeInTheDocument();
    const handle = view.getByRole("separator");
    const column = handle.parentElement as HTMLElement;
    Object.defineProperty(column, "getBoundingClientRect", {
      value: () => ({ width: 100, height: 20, x: 0, y: 0, top: 0, left: 0, bottom: 20, right: 100 }),
    });
    handle.focus();
    await view.user.keyboard("{ArrowRight}");
    expect(column.style.width).toBe("108px");
  });
});
