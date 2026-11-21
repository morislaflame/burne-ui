import { describe, expect, it, vi } from "vitest";
import { useState } from "react";

import { Accordion } from "@/components/composite/Accordion";
import { CheckboxGroup } from "@/components/composite/CheckboxGroup";
import { RadioGroup } from "@/components/composite/RadioGroup";
import { ToggleButtonGroup } from "@/components/composite/ToggleButtonGroup";
import { AppShell } from "@/components/core/AppShell";
import { AspectRatio } from "@/components/core/AspectRatio";
import { Dropdown } from "@/components/core/Dropdown";
import { Header } from "@/components/core/Header";
import { ListBox } from "@/components/core/ListBox";
import { Resizable } from "@/components/core/Resizable";
import { Sidebar } from "@/components/core/Sidebar";
import { Table } from "@/components/core/Table";
import { Tabs } from "@/components/core/Tabs";
import { Toast, useToast } from "@/components/core/Toast";

import { render, setReducedMotion } from "./helpers";

describe("layout shells", () => {
  it("places header, sidebar and main", () => {
    const view = render(
      <AppShell>
        <Header sticky>Top</Header>
        <Sidebar aria-label="Sections" side="end" width="small">Nav</Sidebar>
        <span>Body</span>
      </AppShell>,
    );
    expect(view.getByText("Nav").closest("aside")).toHaveAttribute("data-side", "end");
    expect(view.getByText("Top").closest("header")).toHaveClass("sticky");
    expect(view.getByText("Nav").closest("aside")).toHaveClass("border-s-token", "w-page-small");
    expect(view.getByRole("main")).toHaveTextContent("Body");
  });

  it("keeps the aspect ratio after a user style", () => {
    const view = render(
      <AspectRatio ratio="16/9" style={{ color: "red" }}>
        Frame
      </AspectRatio>,
    );
    const root = view.getByText("Frame").parentElement as HTMLElement;
    expect(root.style.aspectRatio).toBe("16 / 9");
    expect(root.style.color).toBe("red");
  });

  it("exposes a separator handle", () => {
    const view = render(
      <Resizable>
        <Resizable.Panel defaultSize={40}>A</Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel defaultSize={60}>B</Resizable.Panel>
      </Resizable>,
    );
    expect(view.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
    expect(view.getByText("A").style.flexBasis).toContain(
      "calc(40 * (100% - var(--resizable-handles, 0)",
    );
  });
});

describe("data-driven items", () => {
  it("renders tabs, accordion, list, menu, radios, checks and toggles", async () => {
    const view = render(
      <div>
        <Tabs defaultValue="a" items={[{ value: "a", label: "Alpha", content: "A body" }]} />
        <Accordion items={[{ value: "care", title: "Care", content: "Dry" }]} />
        <ListBox aria-label="Fruit" items={[{ value: "apple", label: "Apple" }]} />
        <Dropdown label="Menu" defaultOpen items={[{ value: "cut", label: "Cut" }]} />
        <RadioGroup aria-label="Pay" items={[{ value: "card", label: "Card" }]} />
        <CheckboxGroup
          aria-label="Flags"
          items={[{ value: "bold", label: "Bold" }]}
        />
        <ToggleButtonGroup items={[{ value: "grid", label: "Grid" }]} />
      </div>,
    );
    expect(view.getByRole("tab", { name: "Alpha" })).toBeInTheDocument();
    expect(view.getByText("A body")).toBeInTheDocument();
    expect(view.getByRole("button", { name: "Care" })).toBeInTheDocument();
    expect(view.getByRole("option", { name: "Apple" })).toBeInTheDocument();
    expect(view.getByRole("menuitem", { name: "Cut" })).toBeInTheDocument();
    expect(view.getByRole("radio", { name: "Card" })).toBeInTheDocument();
    expect(view.getByRole("checkbox", { name: "Bold" })).toBeInTheDocument();
    expect(view.queryByRole("checkbox", { name: "Old" })).not.toBeInTheDocument();
    expect(view.getByRole("button", { name: "Grid" })).toBeInTheDocument();
  });
});

describe("table disabled rows and sticky header", () => {
  it("skips a disabled row and bounds the scrollport", async () => {
    const onSelectionChange = vi.fn();
    const view = render(
      <Table
        selectionMode="multiple"
        stickyHeader
        onSelectionChange={onSelectionChange}
        disabledKeys={["b"]}
      >
        <Table.ScrollContainer>
          <Table.Content aria-label="People">
            <Table.Header>
              <Table.Column>Name</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row id="a"><Table.Cell>Ann</Table.Cell></Table.Row>
              <Table.Row id="b"><Table.Cell>Ben</Table.Cell></Table.Row>
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>,
    );
    const ben = view.getByText("Ben").closest("tr");
    expect(ben).toHaveAttribute("data-disabled", "");
    await view.user.click(ben!);
    expect(onSelectionChange).not.toHaveBeenCalled();
    const table = view.getByRole("grid", { name: "People" });
    expect(table.parentElement).toHaveClass("max-h-[var(--max-component-2xlarge)]");
    expect(table.parentElement?.parentElement).not.toHaveClass("overflow-clip");
  });
});

function ToastAll() {
  const { toast } = useToast();
  const [ready, setReady] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        if (!ready) {
          toast.show({ title: "One", duration: 0 });
          toast.show({ title: "Two", duration: 0 });
          setReady(true);
          return;
        }
        toast.dismissAll();
      }}
    >
      Toasts
    </button>
  );
}

describe("toast dismissAll", () => {
  it("removes every toast", async () => {
    setReducedMotion(true);
    const view = render(
      <Toast.Provider>
        <ToastAll />
      </Toast.Provider>,
    );
    await view.user.click(view.getByRole("button", { name: "Toasts" }));
    expect(view.getAllByText("One").length).toBeGreaterThan(0);
    expect(view.getAllByText("Two").length).toBeGreaterThan(0);
    await view.user.click(view.getByRole("button", { name: "Toasts" }));
    expect(view.queryByRole("group", { name: "One" })).not.toBeInTheDocument();
    expect(view.queryByRole("group", { name: "Two" })).not.toBeInTheDocument();
  });
});
