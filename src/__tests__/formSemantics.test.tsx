import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Checkbox } from "@/components/core/Checkbox";
import { CheckboxGroup } from "@/components/composite/CheckboxGroup";
import { ColorPicker } from "@/components/core/ColorPicker";
import { ComboBox } from "@/components/core/ComboBox";
import { Field } from "@/components/core/Field";
import { Form } from "@/components/composite/Form";
import { Input } from "@/components/core/Input";
import { Radio } from "@/components/core/Radio";
import { RadioGroup } from "@/components/composite/RadioGroup";
import { SearchInput } from "@/components/core/SearchInput";
import { Select } from "@/components/core/Select";
import { Slider } from "@/components/core/Slider";
import { Switch } from "@/components/core/Switch";
import { TextArea } from "@/components/core/TextArea";
import { TimeField } from "@/components/core/TimeField";

import { dataInvalidNodes, render, selectValueButton } from "./helpers";

const OPTIONS = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
];

describe("Э2.1 invalid model", () => {
  it("Input error sets aria-invalid and data-invalid without status", () => {
    const { container } = render(<Input label="Name" error="Required" />);
    expect(screen.getByText("Required")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    expect(dataInvalidNodes(container).length).toBeGreaterThan(0);
  });

  it("Input error sets aria-invalid", () => {
    render(<Input label="Name" error="Required" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("TextArea error sets aria-invalid", () => {
    render(<TextArea label="Bio" error="Too short" />);
    expect(screen.getByText("Too short")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("Select error sets aria-invalid on the value button", () => {
    render(<Select label="City" items={OPTIONS} error="Pick one" />);
    expect(screen.getByText("Pick one")).toBeInTheDocument();
    expect(selectValueButton()).toHaveAttribute("aria-invalid", "true");
  });

  it("ComboBox error sets aria-invalid on the input", () => {
    render(<ComboBox label="City" items={OPTIONS} error="Pick one" />);
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-invalid", "true");
  });

  it("TimeField error sets aria-invalid on the group", () => {
    render(<TimeField label="Start" error="Required" />);
    expect(screen.getByRole("group")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getAllByRole("spinbutton").every((el) => el.getAttribute("aria-invalid") == null)).toBe(true);

  });

  it("Checkbox / Radio / Switch / Slider expose aria-invalid from error, not from visual danger", () => {
    const { rerender } = render(<Checkbox label="Accept" error="Required" />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-invalid", "true");

    rerender(<Radio label="A" error="Required" />);
    expect(screen.getByRole("radio")).toHaveAttribute("aria-invalid", "true");

    rerender(<Switch label="Alerts" error="Required" />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-invalid", "true");

    rerender(<Slider aria-label="Volume" error="Required" defaultValue={10} />);
    expect(screen.getByRole("slider")).toHaveAttribute("aria-invalid", "true");
  });

  it("RadioGroup and CheckboxGroup put aria-invalid on the group", () => {
    const { container, rerender } = render(
      <RadioGroup>
        <RadioGroup.Legend>Pay</RadioGroup.Legend>
        <RadioGroup.Error>Required</RadioGroup.Error>
        <RadioGroup.List>
          <Radio value="card" label="Card" />
        </RadioGroup.List>
      </RadioGroup>);
    expect(screen.getByRole("radiogroup", { name: "Pay" })).toHaveAttribute("aria-invalid", "true");
    expect(dataInvalidNodes(container).length).toBeGreaterThan(0);

    rerender(
      <CheckboxGroup>
        <CheckboxGroup.Legend>Add-ons</CheckboxGroup.Legend>
        <CheckboxGroup.Error>Pick one</CheckboxGroup.Error>
        <CheckboxGroup.List>
          <Checkbox value="x" label="Extra" />
        </CheckboxGroup.List>
      </CheckboxGroup>);
    expect(screen.getByRole("group")).toHaveAttribute("aria-invalid", "true");
  });

  it("SearchInput and ColorPicker accept aria-invalid", () => {
    const { container, rerender } = render(<SearchInput aria-label="Search" aria-invalid />);
    expect(screen.getByRole("searchbox")).toHaveAttribute("aria-invalid", "true");
    expect(dataInvalidNodes(container).length).toBeGreaterThan(0);

    rerender(
      <ColorPicker aria-invalid>
        <ColorPicker.Trigger />
      </ColorPicker>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-invalid", "true");
    expect(dataInvalidNodes(container).length).toBeGreaterThan(0);
  });

  it("Field.Error publishes data-invalid", () => {
    const { container } = render(
      <Field>
        <Field.Label>Name</Field.Label>
        <Input />
        <Field.Error>Required</Field.Error>
      </Field>);
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
    expect(dataInvalidNodes(container).length).toBeGreaterThan(0);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("Form binding sets aria-invalid after submit", async () => {
    const { user } = render(
      <Form
        aria-label="Signup"
        defaultValues={{ email: "" }}
        rules={{ email: { required: "Email is required" } }}
      >
        <Form.Field name="email">
          <Input name="email" label="Email" />
        </Form.Field>
        <button type="submit">Send</button>
      </Form>);

    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(await screen.findByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("invalid without a message sets aria-invalid and data-invalid", () => {
    const { container, rerender } = render(<Input label="Name" invalid />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("textbox")).toHaveAttribute("data-invalid", "");

    rerender(<TextArea label="Bio" invalid />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");

    rerender(<Select label="City" items={OPTIONS} invalid />);
    expect(selectValueButton()).toHaveAttribute("aria-invalid", "true");

    rerender(<ComboBox label="City" items={OPTIONS} invalid />);
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-invalid", "true");

    rerender(<TimeField label="Start" invalid />);
    expect(screen.getByRole("group")).toHaveAttribute("aria-invalid", "true");

    rerender(<Checkbox label="Accept" invalid />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-invalid", "true");

    rerender(<Radio label="Card" invalid />);
    expect(screen.getByRole("radio")).toHaveAttribute("aria-invalid", "true");

    rerender(<Switch label="Alerts" invalid />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-invalid", "true");

    rerender(<Slider label="Volume" invalid />);
    expect(screen.getByRole("slider")).toHaveAttribute("aria-invalid", "true");

    rerender(<SearchInput aria-label="Search" invalid />);
    expect(screen.getByRole("searchbox")).toHaveAttribute("aria-invalid", "true");

    rerender(
      <ColorPicker invalid>
        <ColorPicker.Trigger />
      </ColorPicker>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-invalid", "true");

    rerender(
      <RadioGroup invalid aria-label="Pay">
        <RadioGroup.List>
          <Radio value="card" label="Card" />
        </RadioGroup.List>
      </RadioGroup>,
    );
    expect(screen.getByRole("radiogroup", { name: "Pay" })).toHaveAttribute("aria-invalid", "true");

    rerender(
      <CheckboxGroup invalid>
        <CheckboxGroup.List>
          <Checkbox value="a" label="Alpha" />
        </CheckboxGroup.List>
      </CheckboxGroup>,
    );
    expect(screen.getByRole("group")).toHaveAttribute("aria-invalid", "true");

    rerender(
      <Field invalid>
        <Input label="Name" />
      </Field>,
    );
    expect(dataInvalidNodes(container).length).toBeGreaterThan(0);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("explicit invalid={false} hides an error message, and a form error still wins", async () => {
    const { user, rerender } = render(<Input label="Name" invalid={false} error="Required" />);
    expect(screen.getByText("Required")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");

    rerender(
      <Form
        aria-label="Signup"
        defaultValues={{ email: "" }}
        rules={{ email: { required: "Email is required" } }}
      >
        <Form.Field name="email">
          <Input name="email" label="Email" invalid={false} />
        </Form.Field>
        <button type="submit">Send</button>
      </Form>,
    );
    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(await screen.findByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });
});

describe("Э2.3 Field.Set describedby", () => {
  it("RadioGroup omits aria-describedby when Hint and Error are not rendered", () => {
    render(
      <RadioGroup>
        <RadioGroup.Legend>Pay</RadioGroup.Legend>
        <RadioGroup.List>
          <Radio value="card" label="Card" />
        </RadioGroup.List>
      </RadioGroup>);
    expect(screen.getByRole("radiogroup", { name: "Pay" })).not.toHaveAttribute("aria-describedby");
  });
});
