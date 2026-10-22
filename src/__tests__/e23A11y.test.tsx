import { screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { BurneLabelsProvider } from "@/theme/BurneLabelsProvider";

import { Button } from "@/components/core/Button";
import { Calendar } from "@/components/core/Calendar";
import { ListBox } from "@/components/core/ListBox";
import { Popover } from "@/components/core/Popover";
import { Slider } from "@/components/core/Slider";
import { Checkbox } from "@/components/core/Checkbox";
import { CheckboxGroup } from "@/components/composite/CheckboxGroup";
import { Drawer } from "@/components/core/Drawer";
import { Form } from "@/components/composite/Form";
import { Input } from "@/components/core/Input";
import { Loading } from "@/components/core/Loading";
import { Radio } from "@/components/core/Radio";
import { Ripple } from "@/components/core/Ripple";
import { RadioGroup } from "@/components/composite/RadioGroup";
import { Switch } from "@/components/core/Switch";
import { Table } from "@/components/core/Table";
import { TimeField } from "@/components/core/TimeField";

import { render } from "./helpers";

describe("Э2.3 a11y", () => {
  it("TimeField puts aria-required on the group", () => {
    render(<TimeField label="When" required />);
    expect(screen.getByRole("group")).toHaveAttribute("aria-required", "true");
    for (const segment of screen.getAllByRole("spinbutton")) {
      expect(segment).not.toHaveAttribute("aria-required");
    }
  });

  it("Checkbox exposes aria-required; Radio uses the native required attribute", () => {
    render(<Checkbox label="Agree" required />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-required", "true");

    render(<Radio label="Card" value="card" required />);
    const radio = screen.getByRole("radio");
    expect(radio).toBeRequired();
    expect(radio).not.toHaveAttribute("aria-required");
  });

  it("Switch required is native and aria-required", () => {
    render(<Switch label="Alerts" required />);
    const input = screen.getByRole("switch");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-required", "true");
  });

  it("CheckboxGroup required stays on the group", () => {
    render(
      <CheckboxGroup required>
        <CheckboxGroup.Legend>Topics</CheckboxGroup.Legend>
        <CheckboxGroup.List>
          <Checkbox value="a" label="Alpha" />
          <Checkbox value="b" label="Beta" />
        </CheckboxGroup.List>
      </CheckboxGroup>);
    expect(screen.getByRole("group")).toHaveAttribute("aria-required", "true");
    for (const box of screen.getAllByRole("checkbox")) {
      expect(box).not.toBeRequired();
    }
  });

  it("CheckboxGroup single required stays on the group", () => {
    render(
      <CheckboxGroup required selectionMode="single">
        <CheckboxGroup.Legend>Topics</CheckboxGroup.Legend>
        <CheckboxGroup.List>
          <Checkbox value="a" label="Alpha" />
          <Checkbox value="b" label="Beta" />
        </CheckboxGroup.List>
      </CheckboxGroup>,
    );
    expect(screen.getByRole("group")).toHaveAttribute("aria-required", "true");
    for (const box of screen.getAllByRole("checkbox")) {
      expect(box).not.toBeRequired();
    }
  });

  it("RadioGroup required is on the group and the first radio", () => {
    render(
      <RadioGroup required>
        <RadioGroup.Legend>Pay</RadioGroup.Legend>
        <RadioGroup.List>
          <Radio value="card" label="Card" />
          <Radio value="cash" label="Cash" />
        </RadioGroup.List>
      </RadioGroup>);
    expect(screen.getByRole("radiogroup", { name: "Pay" })).toHaveAttribute("aria-required", "true");
    const radios = screen.getAllByRole("radio");
    expect(radios[0]).toBeRequired();
    expect(radios[1]).not.toBeRequired();
  });

  it("RadioGroup readOnly is aria-readonly on the group, not the radio", async () => {
    const onValueChange = vi.fn();
    const { user } = render(
      <RadioGroup readOnly defaultValue="card" onValueChange={onValueChange}>
        <RadioGroup.Legend>Pay</RadioGroup.Legend>
        <RadioGroup.List>
          <Radio value="card" label="Card" />
          <Radio value="cash" label="Cash" />
        </RadioGroup.List>
      </RadioGroup>,
    );
    const group = screen.getByRole("radiogroup", { name: "Pay" });
    expect(group).toHaveAttribute("aria-readonly", "true");
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).not.toHaveAttribute("aria-readonly");
      expect(radio).toHaveAttribute("data-readonly", "");
    }
    await user.click(screen.getByRole("radio", { name: "Cash" }));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("radio", { name: "Card" })).toBeChecked();
  });

  it("Calendar hides padding day cells from the accessibility tree", () => {
    render(<Calendar aria-label="Date" value={new Date(2026, 9, 21)} />);
    const grid = screen.getByRole("grid", { name: /October 2026/ });
    const hidden = grid.querySelectorAll('[role="gridcell"][aria-hidden="true"]');
    expect(hidden.length).toBeGreaterThan(0);
    for (const cell of hidden) {
      expect(cell).toHaveAttribute("aria-hidden", "true");
      expect(cell).not.toHaveAttribute("aria-label");
    }
    for (const cell of screen.getAllByRole("gridcell")) {
      expect(cell.querySelector("[aria-label]")).toBeTruthy();
    }
  });

  it("Button motionState loading sets aria-busy", () => {
    const { rerender } = render(<Button motionState="loading">Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("aria-busy", "true");
    rerender(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).not.toHaveAttribute("aria-busy");
  });

  it("Drawer handle is named Close", () => {
    render(
      <Drawer defaultOpen placement="bottom">
        <Drawer.Panel>
          <Drawer.Handle />
          <Drawer.Title>Menu</Drawer.Title>
        </Drawer.Panel>
      </Drawer>);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /drag/i })).not.toBeInTheDocument();
  });

  it("Table.Caption names the table", () => {
    render(
      <Table>
        <Table.Content>
          <Table.Caption>Crew</Table.Caption>
        </Table.Content>
      </Table>);
    expect(screen.getByRole("table", { name: "Crew" }).querySelector("caption")).toHaveTextContent("Crew");
  });

  it("Form error summary stays mounted without role=alert", () => {
    const { container } = render(
      <Form>
        <Form.Field name="email">
          <Input name="email" label="Email" />
        </Form.Field>
      </Form>);
    const summary = container.querySelector("[tabindex='-1']");
    expect(summary).toBeTruthy();
    expect(summary).not.toHaveAttribute("role", "alert");
    expect(summary).toHaveAttribute("aria-live", "polite");
  });

  it("failed submit focuses the first invalid field", async () => {
    const { user, container } = render(
      <Form
        rules={{
          email: { required: "Need email" },
          name: { required: "Need name" },
        }}
      >
        <Form.Field name="email">
          <Input name="email" label="Email" />
        </Form.Field>
        <Form.Field name="name">
          <Input name="name" label="Name" />
        </Form.Field>
        <button type="submit">Send</button>
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(screen.getByRole("textbox", { name: "Email" })).toHaveFocus();
    expect(container.querySelector("[tabindex='-1']")).not.toHaveFocus();
  });

  it("Ripple ref points at the clip span", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Ripple ref={ref} />);
    expect(ref.current?.tagName).toBe("SPAN");
    expect(ref.current).toHaveAttribute("aria-hidden", "true");
  });

  it("Loading default accessible name comes from labels", () => {
    render(<Loading />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Loading");
  });

  it("BurneLabels overrides built-in names", async () => {
    const { user } = render(
      <BurneLabelsProvider
        labels={{
          loading: "Загрузка",
          listBoxEmpty: "Пусто",
          switch: "Тумблер",
          radioOption: "Пункт",
          calendarPrevious: "Назад",
          sliderValue: "Громкость",
          formErrorOne: "Поправьте поле",
        }}
      >
        <Loading />
        <ListBox.Empty />
        <Switch />
        <Radio />
        <Calendar />
        <Slider defaultValue={10} />
        <Form
          aria-label="Signup"
          defaultValues={{ email: "" }}
          rules={{ email: { required: "Need email" } }}
        >
          <Form.Field name="email">
            <Input name="email" label="Email" />
          </Form.Field>
          <button type="submit">Send</button>
        </Form>
      </BurneLabelsProvider>,
    );

    expect(screen.getByRole("status", { name: "Загрузка" })).toBeInTheDocument();
    expect(screen.getByText("Пусто")).toBeInTheDocument();
    expect(screen.getByRole("switch")).toHaveAttribute("aria-label", "Тумблер");
    expect(screen.getByRole("radio")).toHaveAttribute("aria-label", "Пункт");
    expect(screen.getByRole("button", { name: "Назад" })).toBeInTheDocument();
    expect(screen.getByRole("slider")).toHaveAttribute("aria-label", "Громкость");

    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(await screen.findByText("Поправьте поле")).toBeInTheDocument();
  });

  it("Popover dialog sets aria-modal to false", () => {
    render(
      <Popover defaultOpen>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content>
          <Popover.Title>Note</Popover.Title>
        </Popover.Content>
      </Popover>,
    );
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "false");
  });
});
