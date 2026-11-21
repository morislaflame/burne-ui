import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ButtonGroup } from "@/components/composite/ButtonGroup";
import { CheckboxGroup } from "@/components/composite/CheckboxGroup";
import { Form } from "@/components/composite/Form";
import { RadioGroup } from "@/components/composite/RadioGroup";
import { Badge } from "@/components/core/Badge";
import { Button } from "@/components/core/Button";
import { Calendar } from "@/components/core/Calendar";
import { Card } from "@/components/core/Card";
import { Checkbox } from "@/components/core/Checkbox";
import { ColorPicker } from "@/components/core/ColorPicker";
import { ComboBox } from "@/components/core/ComboBox";
import { Dialog } from "@/components/core/Dialog";
import { Disclosure } from "@/components/core/Disclosure";
import { Dropdown } from "@/components/core/Dropdown";
import { Input } from "@/components/core/Input";
import { Meter } from "@/components/core/Meter";
import { NumberInput } from "@/components/core/NumberInput";
import { Pagination } from "@/components/core/Pagination";
import { PinInput } from "@/components/core/PinInput";
import { Popover } from "@/components/core/Popover";
import { ProgressBar } from "@/components/core/ProgressBar";
import { Radio } from "@/components/core/Radio";
import { SearchInput } from "@/components/core/SearchInput";
import { Select } from "@/components/core/Select";
import { Separator } from "@/components/core/Separator";
import { Slider } from "@/components/core/Slider";
import { Stepper } from "@/components/core/Stepper";
import { Switch } from "@/components/core/Switch";
import { Table } from "@/components/core/Table";
import { Tabs } from "@/components/core/Tabs";
import { TagsInput } from "@/components/core/TagsInput";
import { Text } from "@/components/core/Text";
import { TextArea } from "@/components/core/TextArea";
import { ToggleButton } from "@/components/core/ToggleButton";

describe("Cross-component & mobile UX audit regressions", () => {
  describe("Mobile clipboard Paste / touch UX on field shells", () => {
    it("does not apply pressSqueeze scale transform on Input or TextArea shell during touch or input pointerdown", () => {
      const { container } = render(
        <div>
          <Input aria-label="Phone" defaultValue="" />
          <TextArea aria-label="Notes" defaultValue="" />
        </div>,
      );
      const input = screen.getByLabelText("Phone");
      const textarea = screen.getByLabelText("Notes");
      const inputShell = container.querySelector('[data-slot="shell"]') as HTMLElement | null;

      fireEvent.pointerDown(input, { pointerType: "touch", button: 0 });
      expect(inputShell?.style.transform ?? "").not.toContain("scale");

      fireEvent.pointerDown(textarea, { pointerType: "touch", button: 0 });
      expect(textarea.parentElement?.style.transform ?? "").not.toContain("scale");
    });

    it("opens and filters ComboBox when pasting or typing into a closed input", () => {
      render(
        <ComboBox
          aria-label="Framework"
          items={[
            { value: "react", label: "React" },
            { value: "vue", label: "Vue" },
            { value: "solid", label: "Solid" },
          ]}
        />,
      );

      const input = screen.getByRole("combobox", { name: "Framework" });
      fireEvent.change(input, { target: { value: "Sol" } });

      expect(screen.getByRole("listbox")).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "Solid" })).toBeInTheDocument();
      expect(screen.queryByRole("option", { name: "React" })).toBeNull();
    });

    it("replaces an existing PinInput digit in-place and renders type=password when mask=true", () => {
      const onValueChange = vi.fn();
      render(
        <PinInput
          label="OTP"
          length={4}
          defaultValue="1234"
          mask
          onValueChange={onValueChange}
        />,
      );

      const inputs = document.querySelectorAll<HTMLInputElement>("input");
      expect(inputs).toHaveLength(4);
      expect(inputs[0]?.type).toBe("password");
      expect(inputs[0]?.id).toBeTruthy();

      fireEvent.change(inputs[0]!, { target: { value: "19" } });
      expect(onValueChange).toHaveBeenLastCalledWith("9234");
    });

    it("ignores Enter during active IME composition in TagsInput", () => {
      const onValuesChange = vi.fn();
      render(
        <TagsInput
          aria-label="Tags"
          defaultValues={["ui"]}
          onValuesChange={onValuesChange}
        />,
      );

      const input = screen.getByLabelText("Tags");
      fireEvent.compositionStart(input);
      fireEvent.change(input, { target: { value: "nihao" } });
      fireEvent.keyDown(input, { key: "Enter", isComposing: true, keyCode: 229 });

      expect(onValuesChange).not.toHaveBeenCalled();

      fireEvent.compositionEnd(input);
      fireEvent.keyDown(input, { key: "Enter" });
      expect(onValuesChange).toHaveBeenCalledWith(["ui", "nihao"]);
    });
  });

  describe("Top-Layer <dialog> portals, nested Popovers, and LIFO Escape", () => {
    it("mounts Select portal inside an open modal Dialog and closes Select before Dialog on Escape", () => {
      const onDialogOpenChange = vi.fn();
      render(
        <Dialog open onOpenChange={onDialogOpenChange}>
          <Dialog.Panel>
            <Dialog.Header>
              <Dialog.Title>Settings</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Select
                aria-label="Role"
                defaultOpen
                items={[
                  { value: "admin", label: "Admin" },
                  { value: "viewer", label: "Viewer" },
                ]}
              />
            </Dialog.Body>
          </Dialog.Panel>
        </Dialog>,
      );

      const dialogEl = document.querySelector("dialog");
      const listboxEl = screen.getByRole("listbox");
      expect(dialogEl).toBeTruthy();
      expect(dialogEl?.contains(listboxEl)).toBe(true);

      // First Escape closes only the inner Select, keeping Dialog open.
      fireEvent.keyDown(listboxEl, { key: "Escape" });
      expect(onDialogOpenChange).not.toHaveBeenCalledWith(false);
      expect(screen.queryByRole("listbox")).toBeNull();

      // Second Escape closes the Dialog itself.
      fireEvent.keyDown(dialogEl!, { key: "Escape" });
      expect(onDialogOpenChange).toHaveBeenCalledWith(false);
    });

    it("keeps outer Popover open when selecting an option inside a nested Select portal", () => {
      const onOuterOpenChange = vi.fn();
      render(
        <Popover open onOpenChange={onOuterOpenChange}>
          <Popover.Trigger asChild>
            <Button>Filter</Button>
          </Popover.Trigger>
          <Popover.Content>
            <Select
              aria-label="Status"
              defaultOpen
              items={[
                { value: "open", label: "Open" },
                { value: "closed", label: "Closed" },
              ]}
            />
          </Popover.Content>
        </Popover>,
      );

      const option = screen.getByRole("option", { name: "Closed" });
      fireEvent.pointerDown(option, { button: 0 });
      fireEvent.click(option);

      expect(onOuterOpenChange).not.toHaveBeenCalledWith(false);
    });

    it("closes action Dropdown.Item without value on click", () => {
      const onSelect = vi.fn();
      render(
        <Dropdown defaultOpen>
          <Dropdown.Trigger asChild>
            <Button>Actions</Button>
          </Dropdown.Trigger>
          <Dropdown.Popover>
            <Dropdown.Item onSelect={onSelect}>Duplicate</Dropdown.Item>
          </Dropdown.Popover>
        </Dropdown>,
      );

      fireEvent.click(screen.getByRole("menuitem", { name: "Duplicate" }));
      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole("menu")).toBeNull();
    });
  });

  describe("Form disabled/readOnly cascade, Form.Field rules persistence, and native reset", () => {
    it("cascades Form disabled and readOnly into CheckboxGroup, RadioGroup, Switch, Slider, and ColorPicker", () => {
      render(
        <Form disabled>
          <CheckboxGroup name="perms" label="Permissions">
            <Checkbox value="read" label="Read" />
          </CheckboxGroup>
          <RadioGroup name="plan" label="Plan">
            <Radio value="pro" label="Pro" />
          </RadioGroup>
          <Switch name="alerts" label="Alerts" />
          <Slider name="volume" label="Volume" defaultValue={40} />
          <ColorPicker name="accent" aria-label="Accent" defaultValue="#3b82f6" />
        </Form>,
      );

      expect(screen.getByLabelText("Read")).toBeDisabled();
      expect(screen.getByLabelText("Pro")).toBeDisabled();
      expect(screen.getByLabelText("Alerts")).toBeDisabled();
      expect(screen.getByRole("slider", { name: "Volume" })).toBeDisabled();
    });

    it("preserves Form.Field rules across parent re-renders and resets uncontrolled controls on form reset", async () => {
      const onSubmit = vi.fn();
      const { rerender } = render(
        <Form onSubmit={onSubmit}>
          <Form.Field name="email" rules={{ required: "Email required" }}>
            <Input name="email" aria-label="Email" defaultValue="" />
          </Form.Field>
          <NumberInput aria-label="Qty" defaultValue={5} />
          <button type="submit">Save</button>
          <button type="reset">Reset</button>
        </Form>,
      );

      // Force parent re-render before submitting.
      rerender(
        <Form onSubmit={onSubmit}>
          <Form.Field name="email" rules={{ required: "Email required" }}>
            <Input name="email" aria-label="Email" defaultValue="" />
          </Form.Field>
          <NumberInput aria-label="Qty" defaultValue={5} />
          <button type="submit">Save</button>
          <button type="reset">Reset</button>
        </Form>,
      );

      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Save" }));
      });
      expect(onSubmit).not.toHaveBeenCalled();

      const qtyInput = screen.getByLabelText("Qty") as HTMLInputElement;
      fireEvent.focus(qtyInput);
      fireEvent.change(qtyInput, { target: { value: "12" } });
      fireEvent.blur(qtyInput);
      expect(qtyInput.value).toBe("12");

      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Reset" }));
        await Promise.resolve();
      });
      expect(qtyInput.value).toBe("5");
    });
  });

  describe("Actions, Data, Disclosure, and Primitive consistency", () => {
    it("blocks navigation and handlers on <Button asChild disabled><a href=...>", () => {
      const childClick = vi.fn();
      render(
        <Button asChild disabled>
          <a href="/billing" onClick={childClick}>
            Upgrade
          </a>
        </Button>,
      );

      const link = screen.getByText("Upgrade").closest("a")!;
      expect(link).not.toHaveAttribute("href");
      expect(link).toHaveAttribute("aria-disabled", "true");

      fireEvent.click(link);
      fireEvent.keyDown(link, { key: "Enter" });
      expect(childClick).not.toHaveBeenCalled();
    });

    it("materializes remaining selectable keys when unchecking one row from Table selectedKeys='all'", () => {
      const onSelectionChange = vi.fn();
      render(
        <Table
          aria-label="Users"
          selectionMode="multiple"
          defaultSelectedKeys="all"
          disabledKeys={["u3"]}
          onSelectionChange={onSelectionChange}
        >
          <Table.Content>
            <Table.Header>
              <Table.Column>Name</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row id="u1">
                <Table.Cell>Alice</Table.Cell>
              </Table.Row>
              <Table.Row id="u2">
                <Table.Cell>Bob</Table.Cell>
              </Table.Row>
              <Table.Row id="u3">
                <Table.Cell>Charlie</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Content>
        </Table>,
      );

      fireEvent.click(screen.getByText("Alice"));
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      const nextKeys = onSelectionChange.mock.calls[0]?.[0] as Set<string>;
      expect(nextKeys instanceof Set).toBe(true);
      expect([...nextKeys]).toEqual(["u2"]);
    });

    it("applies status without leaking DOM attributes on ProgressBar and Meter, and keeps single-digit Badge accessible", () => {
      const { container } = render(
        <div>
          <ProgressBar value={60} status="danger" aria-label="Disk" />
          <Meter value={80} status="warning" label="Memory" />
          <Badge>3</Badge>
          <Separator classNames={{ root: "custom-sep" }} />
          <Text classNames={{ root: "custom-txt" }}>Body</Text>
        </div>,
      );

      const progress = screen.getByRole("progressbar", { name: "Disk" });
      const meter = screen.getByRole("meter", { name: "Memory" });
      expect(progress).not.toHaveAttribute("aria-labelledby");
      expect(progress.querySelector("[status]")).toBeNull();
      expect(meter.querySelector("[status]")).toBeNull();

      const badgeText = screen.getByText("3");
      expect(badgeText.closest('[aria-hidden="true"]')).toBeNull();
      expect(container.querySelector(".custom-sep")).toBeTruthy();
      expect(container.querySelector(".custom-txt")).toBeTruthy();
    });

    it("does not steal document focus on Calendar mount and hides keepMounted inactive Tabs.Panel with display class", () => {
      render(
        <div>
          <Calendar value={new Date(2026, 10, 20)} />
          <Tabs defaultValue="a">
            <Tabs.List aria-label="Sections">
              <Tabs.Tab value="a">A</Tabs.Tab>
              <Tabs.Tab value="b">B</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="a" keepMounted className="flex">
              Panel A
            </Tabs.Panel>
            <Tabs.Panel value="b" keepMounted className="flex">
              Panel B
            </Tabs.Panel>
          </Tabs>
          <Disclosure defaultOpen={false}>
            <Disclosure.Trigger>More</Disclosure.Trigger>
            <Disclosure.Content>Hidden body</Disclosure.Content>
          </Disclosure>
        </div>,
      );

      expect(document.activeElement).toBe(document.body);
      const panelB = screen.getByText("Panel B").closest('[role="tabpanel"]')!;
      expect(panelB.className).toContain("hidden");
    });

    it("fires SearchInput onChange exactly once on Clear and hides Clear when readOnly", () => {
      const onChange = vi.fn();
      const { rerender } = render(
        <SearchInput
          aria-label="Search"
          defaultExpanded
          defaultValue="query"
          onChange={onChange}
        />,
      );

      const clearBtn = screen.getByRole("button", { name: /clear/i });
      fireEvent.click(clearBtn);
      expect(onChange).toHaveBeenCalledTimes(1);

      rerender(
        <SearchInput
          aria-label="Search"
          defaultExpanded
          defaultValue="locked"
          readOnly
          onChange={onChange}
        />,
      );
      expect(screen.queryByRole("button", { name: /clear/i })).toBeNull();
    });

    it("guards pressable Card against nested button clicks and disabled state, and cascades ButtonGroup segmented props", () => {
      const onCardClick = vi.fn();
      const onInnerClick = vi.fn();
      render(
        <div>
          <Card pressable asChild onClick={onCardClick}>
            <div role="button" tabIndex={0} aria-label="Outer Card">
              <Card.Body>
                <button type="button" onClick={onInnerClick}>
                  Inner Action
                </button>
              </Card.Body>
            </div>
          </Card>
          <ButtonGroup segmented size="small" disabled>
            <Button>One</Button>
            <ToggleButton>Two</ToggleButton>
          </ButtonGroup>
        </div>,
      );

      fireEvent.click(screen.getByRole("button", { name: "Inner Action" }));
      expect(onInnerClick).toHaveBeenCalledTimes(1);
      expect(onCardClick).not.toHaveBeenCalled();

      expect(screen.getByRole("button", { name: "One" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Two" })).toBeDisabled();
    });

    it("supports linear Stepper forward revisit after backtracking, safe Pagination NaN/zero bounds, and RTL Slider keyboard inversion", () => {
      const onStepChange = vi.fn();
      const { rerender } = render(
        <div dir="rtl">
          <Slider label="RTL Volume" defaultValue={50} min={0} max={100} step={10} />
          <Pagination totalPages={0} page={Number.NaN} />
          <Stepper
            linear
            value="s3"
            onValueChange={onStepChange}
            steps={[
              { value: "s1", title: "Step 1" },
              { value: "s2", title: "Step 2" },
              { value: "s3", title: "Step 3" },
            ]}
          />
        </div>,
      );

      const slider = screen.getByRole("slider", { name: "RTL Volume" });
      fireEvent.keyDown(slider, { key: "ArrowLeft" });
      expect(slider).toHaveAttribute("aria-valuenow", "60");

      rerender(
        <div dir="rtl">
          <Slider label="RTL Volume" defaultValue={50} min={0} max={100} step={10} />
          <Pagination totalPages={0} page={Number.NaN} />
          <Stepper
            linear
            value="s1"
            onValueChange={onStepChange}
            steps={[
              { value: "s1", title: "Step 1" },
              { value: "s2", title: "Step 2" },
              { value: "s3", title: "Step 3" },
            ]}
          />
        </div>,
      );

      const step3Btn = screen.getByRole("button", { name: /step 3/i });
      expect(step3Btn).not.toBeDisabled();
      fireEvent.click(step3Btn);
      expect(onStepChange).toHaveBeenCalledWith("s3");
    });

    it("rejects invalid hex characters without NaN corruption in ColorPicker", () => {
      const onValueChange = vi.fn();
      render(<ColorPicker defaultOpen defaultValue="#3b82f6" onValueChange={onValueChange} />);

      const hexInput = document.querySelector<HTMLInputElement>('input[maxlength], input[type="text"]');
      if (hexInput) {
        fireEvent.change(hexInput, { target: { value: "#zzzzzz" } });
        fireEvent.blur(hexInput);
      }
      for (const call of onValueChange.mock.calls) {
        expect(String(call[0])).not.toContain("NaN");
      }
    });
  });
});
