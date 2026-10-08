import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Alert } from "@/components/core/Alert";
import { Badge } from "@/components/core/Badge";
import { Button } from "@/components/core/Button";
import { Checkbox } from "@/components/core/Checkbox";
import { ColorSwatch } from "@/components/core/ColorPicker";
import { Dialog } from "@/components/core/Dialog";
import { Disclosure } from "@/components/core/Disclosure";
import { Field } from "@/components/core/Field";
import { Drawer } from "@/components/core/Drawer";
import { Input } from "@/components/core/Input";
import { Pagination } from "@/components/core/Pagination";
import { Radio } from "@/components/core/Radio";
import { SearchInput } from "@/components/core/SearchInput";
import { Select } from "@/components/core/Select";
import { Separator } from "@/components/core/Separator";
import { Slider } from "@/components/core/Slider";
import { Switch } from "@/components/core/Switch";
import { Table } from "@/components/core/Table";
import { Tabs } from "@/components/core/Tabs";
import { ToggleButton } from "@/components/core/ToggleButton";
import { dataOpenState } from "@/components/core/utils/dataContract";

import { render } from "./helpers";

describe("Э3.1 data-state", () => {
  it("Dialog trigger is closed until opened", () => {
    render(
      <Dialog>
        <Dialog.Trigger>Open</Dialog.Trigger>
      </Dialog>);
    expect(screen.getByRole("button", { name: "Open" })).toHaveAttribute(
      "data-state",
      dataOpenState(false));
  });

  it("Disclosure trigger is collapsed", () => {
    render(
      <Disclosure>
        <Disclosure.Trigger>Title</Disclosure.Trigger>
      </Disclosure>);
    expect(screen.getByRole("button", { name: "Title" })).toHaveAttribute(
      "data-state",
      "collapsed");
  });

  it("Checkbox keeps data-checked and publishes data-state", () => {
    const { unmount } = render(<Checkbox label="Agree" />);
    const unchecked = screen.getByRole("checkbox").closest("label");
    expect(unchecked).toHaveAttribute("data-state", "unchecked");
    expect(unchecked).not.toHaveAttribute("data-checked");
    unmount();

    render(<Checkbox label="Agree" defaultChecked />);
    const checked = screen.getByRole("checkbox").closest("label");
    expect(checked).toHaveAttribute("data-state", "checked");
    expect(checked).toHaveAttribute("data-checked", "true");
  });

  it("Switch publishes on and off", () => {
    const { unmount } = render(<Switch label="Alerts" />);
    expect(screen.getByRole("switch")).toHaveAttribute("data-state", "off");
    unmount();

    render(<Switch label="Alerts" defaultChecked />);
    expect(screen.getByRole("switch")).toHaveAttribute("data-state", "on");
  });

  it("Select combobox and chevron are closed", () => {
    render(<Select label="City" options={[{ value: "a", label: "A" }]} />);
    expect(screen.getByRole("combobox")).toHaveAttribute("data-state", "closed");
    const chevron = screen.getAllByRole("button").find((node) => node.getAttribute("data-state") === "closed");
    expect(chevron).toBeTruthy();
  });

  it("SearchInput uses data-state instead of data-search-expanded", () => {
    const { container } = render(<SearchInput aria-label="Find" />);
    expect(container.querySelector("[data-search-expanded]")).toBeNull();
    expect(container.querySelector("[data-search-expand]")).toBeNull();
    expect(screen.getByRole("search")).toHaveAttribute("data-state", "collapsed");
  });

  it("Tabs expose orientation and active state", () => {
    render(
      <Tabs defaultValue="a">
        <Tabs.List aria-label="Sections">
          <Tabs.Tab value="a">One</Tabs.Tab>
          <Tabs.Tab value="b">Two</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">A</Tabs.Panel>
        <Tabs.Panel value="b">B</Tabs.Panel>
      </Tabs>);
    expect(screen.getByRole("tablist").parentElement).toHaveAttribute(
      "data-orientation",
      "horizontal");
    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("data-state", "active");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("data-state", "inactive");
  });

  it("Button publishes variant, size, status, disabled, and motion state", () => {
    const { unmount } = render(
      <Button variant="primary" size="small" status="danger" disabled>
        Go
      </Button>);
    const idle = screen.getByRole("button", { name: "Go" });
    expect(idle).toHaveAttribute("data-variant", "primary");
    expect(idle).toHaveAttribute("data-size", "small");
    expect(idle).toHaveAttribute("data-status", "danger");
    expect(idle).toHaveAttribute("data-disabled", "");
    expect(idle).not.toHaveAttribute("data-state");
    unmount();

    render(<Button motionState="loading">Wait</Button>);
    expect(screen.getByRole("button", { name: "Wait" })).toHaveAttribute("data-state", "loading");
  });

  it("Input error and required land on the control", () => {
    render(<Input label="Email" error="Bad" required />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("data-invalid", "");
    expect(input).toHaveAttribute("data-required", "");
  });

  it("Slider and Separator publish orientation", () => {
    const { unmount } = render(<Slider label="Volume" />);
    expect(screen.getByRole("slider").closest("[data-orientation]")).toHaveAttribute(
      "data-orientation",
      "horizontal");
    unmount();

    render(<Separator />);
    expect(screen.getByRole("separator")).toHaveAttribute("data-orientation", "horizontal");
  });

  it("Checkbox indeterminate is mixed and keeps the kit state over rest", () => {
    render(<Checkbox label="Some" indeterminate data-state="checked" />);
    const input = screen.getByRole("checkbox");
    expect(input).toHaveAttribute("aria-checked", "mixed");
    expect((input as HTMLInputElement).indeterminate).toBe(true);
    const label = input.closest("label");
    expect(label).toHaveAttribute("data-state", "indeterminate");
    expect(label).toHaveAttribute("data-size", "base");
  });

  it("Radio and Switch keep kit data-state after rest", () => {
    const { unmount } = render(<Radio label="Card" data-state="open" />);
    expect(screen.getByRole("radio").closest("label")).toHaveAttribute("data-state", "unchecked");
    unmount();

    render(<Switch label="Alerts" data-state="open" />);
    expect(screen.getByRole("switch")).toHaveAttribute("data-state", "off");
  });

  it("ToggleButton publishes on and off", () => {
    const { unmount } = render(<ToggleButton>Pin</ToggleButton>);
    expect(screen.getByRole("button", { name: "Pin" })).toHaveAttribute("data-state", "off");
    unmount();

    render(<ToggleButton pressed>Pin</ToggleButton>);
    expect(screen.getByRole("button", { name: "Pin" })).toHaveAttribute("data-state", "on");
  });

  it("Pagination page publishes active and inactive", () => {
    render(
      <>
        <Pagination.Page page={1} active />
        <Pagination.Page page={2} />
      </>);
    expect(screen.getByText("1")).toHaveAttribute("data-state", "active");
    expect(screen.getByRole("button", { name: "2" })).toHaveAttribute("data-state", "inactive");
  });

  it("Drawer trigger is closed", () => {
    render(
      <Drawer>
        <Drawer.Trigger>Open</Drawer.Trigger>
      </Drawer>);
    expect(screen.getByRole("button", { name: "Open" })).toHaveAttribute("data-state", "closed");
  });

  it("Table column does not publish data-allows-sorting", () => {
    render(
      <Table>
        <Table.Content>
          <Table.Header>
            <Table.Column allowsSorting>Name</Table.Column>
          </Table.Header>
        </Table.Content>
      </Table>);
    expect(screen.getByRole("columnheader")).not.toHaveAttribute("data-allows-sorting");
    expect(screen.getByRole("columnheader")).toHaveAttribute("aria-sort");
  });

  it("publishes data-size, data-variant and data-status on the root", () => {
    const badge = render(<Badge status="info">New</Badge>);
    const badgeNode = screen.getByText("New").closest("[data-status]");
    expect(badgeNode).toHaveAttribute("data-size", "base");
    expect(badgeNode).toHaveAttribute("data-variant", "default");
    expect(badgeNode).toHaveAttribute("data-status", "info");
    badge.unmount();

    const button = render(<Button variant="outline" size="small">Save</Button>);
    const buttonNode = screen.getByRole("button", { name: "Save" });
    expect(buttonNode).toHaveAttribute("data-variant", "outline");
    expect(buttonNode).toHaveAttribute("data-size", "small");
    expect(buttonNode).toHaveAttribute("data-status", "default");
    button.unmount();

    const link = render(
      <Button asChild variant="outline" size="small">
        <a href="/next">Next</a>
      </Button>,
    );
    expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute("data-variant", "outline");
    expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute("data-size", "small");
    link.unmount();

    const input = render(<Input label="Name" status="success" />);
    expect(input.container.querySelector("[data-slot='input-shell']")).toHaveAttribute("data-status", "success");
    expect(input.container.querySelector("[data-slot='input-shell']")).toHaveAttribute("data-variant", "default");
    expect(screen.getByText("Name").closest("[data-size]")).toHaveAttribute("data-size", "base");
    input.unmount();

    const alert = render(<Alert status="warning">Heads up</Alert>);
    expect(screen.getByRole("alert")).toHaveAttribute("data-status", "warning");
    alert.unmount();

    const field = render(<Field size="mid"><span>Slot</span></Field>);
    expect(screen.getByText("Slot").parentElement).toHaveAttribute("data-size", "mid");
    field.unmount();

    render(<Tabs defaultValue="a"><Tabs.List><Tabs.Tab value="a">A</Tabs.Tab></Tabs.List></Tabs>);
    expect(screen.getByRole("tab", { name: "A" }).closest("[data-variant]")).toHaveAttribute("data-size", "base");
  });

  it("ColorSwatch publishes selected state and keeps focus-ring", () => {
    render(
      <ColorSwatch color="#3366ff" selected aria-label="Blue" onClick={() => undefined} />,
    );
    const swatch = screen.getByRole("button", { name: "Blue" });
    expect(swatch).toHaveAttribute("data-state", "selected");
    expect(swatch.className).toContain("focus-ring");
    expect(swatch.className).not.toContain("focus-visible:ring-2");
  });
});
