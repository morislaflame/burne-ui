import { screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Accordion } from "@/components/composite/Accordion";
import { Disclosure } from "@/components/core/Disclosure";
import { Expandable } from "@/components/core/Expandable";
import { Table } from "@/components/core/Table";
import { Tabs } from "@/components/core/Tabs";

import { render } from "./helpers";

describe("R5.3 Tabs", () => {
  it("moves with arrows when uncontrolled and follows a controlled value", async () => {
    const onValueChange = vi.fn();
    const { user, rerender } = render(
      <Tabs defaultValue="one" onValueChange={onValueChange}>
        <Tabs.List aria-label="Sections">
          <Tabs.Tab value="one">One</Tabs.Tab>
          <Tabs.Tab value="two">Two</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one">Panel one</Tabs.Panel>
        <Tabs.Panel value="two">Panel two</Tabs.Panel>
      </Tabs>,
    );
    screen.getByRole("tab", { name: "One" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true");
    expect(onValueChange).toHaveBeenCalledWith("two");

    function Controlled() {
      const [value, setValue] = useState<string | null>("one");
      return (
        <Tabs value={value} onValueChange={setValue}>
          <Tabs.List aria-label="Sections">
            <Tabs.Tab value="one">One</Tabs.Tab>
            <Tabs.Tab value="two">Two</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="one">Panel one</Tabs.Panel>
          <Tabs.Panel value="two">Panel two</Tabs.Panel>
        </Tabs>
      );
    }
    rerender(<Controlled />);
    screen.getByRole("tab", { name: "One" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true");
  });
});

describe("R5.3 Accordion", () => {
  function item(value: string, title: string, body: string) {
    return (
      <Accordion.Item value={value}>
        <Accordion.Heading>
          <Accordion.Trigger>{title}</Accordion.Trigger>
        </Accordion.Heading>
        <Accordion.Panel>{body}</Accordion.Panel>
      </Accordion.Item>
    );
  }

  it("opens one item from the keyboard and follows a controlled value", async () => {
    const onValueChange = vi.fn();
    const { user, rerender } = render(
      <Accordion onValueChange={onValueChange}>
        {item("ship", "Shipping", "Two days")}
        {item("pay", "Payment", "Card")}
      </Accordion>,
    );
    const shipping = screen.getByRole("button", { name: "Shipping" });
    shipping.focus();
    await user.keyboard("{Enter}");
    expect(shipping).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Two days")).toBeVisible();
    expect(onValueChange).toHaveBeenCalledWith("ship");

    function Controlled() {
      const [value, setValue] = useState<string | null>("pay");
      return (
        <Accordion value={value} onValueChange={setValue}>
          {item("ship", "Shipping", "Two days")}
          {item("pay", "Payment", "Card")}
        </Accordion>
      );
    }
    rerender(<Controlled />);
    expect(screen.getByRole("button", { name: "Payment" })).toHaveAttribute("aria-expanded", "true");
    await user.click(screen.getByRole("button", { name: "Shipping" }));
    expect(screen.getByRole("button", { name: "Shipping" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Payment" })).toHaveAttribute("aria-expanded", "false");
  });
});

describe("R5.3 Disclosure", () => {
  it("toggles from the keyboard and follows controlled open", async () => {
    const onOpenChange = vi.fn();
    const { user, rerender } = render(
      <Disclosure onOpenChange={onOpenChange}>
        <Disclosure.Trigger>Details</Disclosure.Trigger>
        <Disclosure.Content>Body copy</Disclosure.Content>
      </Disclosure>,
    );
    const trigger = screen.getByRole("button", { name: "Details" });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(onOpenChange).toHaveBeenCalledWith(true);

    function Controlled() {
      const [open, setOpen] = useState(true);
      return (
        <Disclosure open={open} onOpenChange={setOpen}>
          <Disclosure.Trigger>Details</Disclosure.Trigger>
          <Disclosure.Content>Body copy</Disclosure.Content>
        </Disclosure>
      );
    }
    rerender(<Controlled />);
    const details = screen.getByRole("button", { name: "Details" });
    expect(details).toHaveAttribute("aria-expanded", "true");
    details.focus();
    await user.keyboard("{Enter}");
    expect(details).toHaveAttribute("aria-expanded", "false");
  });
});

describe("R5.3 Expandable", () => {
  it("toggles from the keyboard and follows controlled open", async () => {
    const onOpenChange = vi.fn();
    const { user, rerender } = render(
      <Expandable title="Notes" onOpenChange={onOpenChange}>
        Hidden note
      </Expandable>,
    );
    const trigger = screen.getByRole("button", { name: "Notes" });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Hidden note")).toBeVisible();
    expect(onOpenChange).toHaveBeenCalledWith(true);

    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <Expandable title="Notes" open={open} onOpenChange={setOpen}>
          Hidden note
        </Expandable>
      );
    }
    rerender(<Controlled />);
    await user.click(screen.getByRole("button", { name: "Notes" }));
    expect(screen.getByRole("button", { name: "Notes" })).toHaveAttribute("aria-expanded", "true");
  });
});

describe("R5.3 Table", () => {
  const rows = [
    { id: "1", name: "Ada", role: "Math" },
    { id: "2", name: "Grace", role: "Code" },
  ];

  it("sorts a column, selects a row, and keeps the header sticky", async () => {
    const onSortChange = vi.fn();
    const onSelectionChange = vi.fn();
    const { user } = render(
      <Table
            selectionMode="multiple"
            onSelectionChange={onSelectionChange}
            onSortChange={onSortChange}>
        <Table.ScrollContainer className="overflow-y-auto" style={{ maxHeight: 160 }}>
          <Table.Content
            aria-label="People"
          >
            <Table.Header>
              <Table.Column sortable rowHeader id="name">
                Name
              </Table.Column>
              <Table.Column id="role">Role</Table.Column>
            </Table.Header>
            <Table.Body>
              {rows.map((row) => (
                <Table.Row key={row.id} id={row.id}>
                  <Table.Cell>{row.name}</Table.Cell>
                  <Table.Cell>{row.role}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>,
    );

    const nameHeader = screen.getByRole("rowheader", { name: "Name" });
    expect(nameHeader.className).toContain("sticky");
    await user.click(screen.getByRole("button", { name: "Name" }));
    expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
    expect(onSortChange).toHaveBeenCalled();

    const ada = screen.getByRole("row", { name: /Ada/ });
    await user.click(ada);
    expect(ada).toHaveAttribute("aria-selected", "true");
    expect(onSelectionChange).toHaveBeenCalled();
  });

  it("virtualizes the body and keeps the header sticky", () => {
    const many = Array.from({ length: 40 }, (_, index) => ({
      id: String(index + 1),
      name: `Row ${index + 1}`,
    }));
    render(
      <Table>
        <Table.ScrollContainer className="overflow-y-auto" style={{ maxHeight: 160 }}>
          <Table.Content aria-label="Rows">
            <Table.Header>
              <Table.Column rowHeader>Name</Table.Column>
            </Table.Header>
            <Table.Body virtualized virtualItemSize={40} items={many}>
              {(row: { id: string; name: string }) => (
                <Table.Row id={row.id}>
                  <Table.Cell>{row.name}</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>,
    );
    expect(screen.getAllByRole("row").length).toBeLessThan(many.length);
    expect(screen.getByRole("rowheader", { name: "Name" }).className).toContain("sticky");
  });
});
