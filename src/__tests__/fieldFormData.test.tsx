import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Checkbox } from "@/components/core/Checkbox";
import { CheckboxGroup } from "@/components/composite/CheckboxGroup";
import { ColorPicker } from "@/components/core/ColorPicker";
import { ComboBox } from "@/components/core/ComboBox";
import { DatePicker } from "@/components/core/DatePicker";
import { Form } from "@/components/composite/Form";
import { Input } from "@/components/core/Input";
import { NumberInput } from "@/components/core/NumberInput";
import { PinInput } from "@/components/core/PinInput";
import { Radio } from "@/components/core/Radio";
import { RadioGroup } from "@/components/composite/RadioGroup";
import { SearchInput } from "@/components/core/SearchInput";
import { Select } from "@/components/core/Select";
import { Slider } from "@/components/core/Slider";
import { Switch } from "@/components/core/Switch";
import { TagsInput } from "@/components/core/TagsInput";
import { TextArea } from "@/components/core/TextArea";
import { TimeField } from "@/components/core/TimeField";

import { render } from "./helpers";

const OPTIONS = [
  { value: "en", label: "English" },
  { value: "ru", label: "Russian" },
];

describe("native form values", () => {
  it("puts every field into FormData", () => {
    const { container } = render(
      <form>
        <Input name="email" type="email" label="Email" defaultValue="a@b.co" />
        <TextArea name="note" label="Note" defaultValue="hello" />
        <SearchInput name="q" aria-label="Search" defaultValue="find" />
        <Select name="lang" aria-label="Language" items={OPTIONS} defaultValue="en" />
        <Select
          name="langs"
          aria-label="Languages"
          items={OPTIONS}
          selectionMode="multiple"
          defaultValues={["en", "ru"]}
        />
        <ComboBox name="city" aria-label="City" items={OPTIONS} defaultValue="ru" />
        <DatePicker name="day" label="Day" defaultValue={new Date(2026, 9, 15)} />
        <TimeField name="when" label="When" defaultValue="09:30" />
        <NumberInput name="qty" label="Qty" defaultValue={3} />
        <PinInput name="pin" aria-label="Pin" length={4} defaultValue="1234" />
        <TagsInput name="tags" label="Tags" defaultValues={["red", "blue"]} />
        <Slider name="vol" aria-label="Volume" defaultValue={40} />
        <Slider name="span" aria-label="Span" range defaultValue={[10, 20]} />
        <ColorPicker name="brand" label="Brand" defaultValue="#112233" />
        <Checkbox name="agree" label="Agree" defaultChecked />
        <Switch name="alerts" label="Alerts" defaultChecked />
        <RadioGroup name="pay" aria-label="Pay" defaultValue="card">
          <Radio value="card" label="Card" />
          <Radio value="cash" label="Cash" />
        </RadioGroup>
        <CheckboxGroup name="top" aria-label="Toppings" selectionMode="multiple" defaultValues={["a"]}>
          <Checkbox value="a" label="A" />
          <Checkbox value="b" label="B" />
        </CheckboxGroup>
      </form>,
    );

    const data = new FormData(container.querySelector("form")!);
    expect(data.get("email")).toBe("a@b.co");
    expect(data.get("note")).toBe("hello");
    expect(data.get("q")).toBe("find");
    expect(data.get("lang")).toBe("en");
    expect(data.getAll("langs")).toEqual(["en", "ru"]);
    expect(data.get("city")).toBe("ru");
    expect(data.get("day")).toBe("2026-10-15");
    expect(data.get("when")).toBe("09:30");
    expect(data.get("qty")).toBe("3");
    expect(data.get("pin")).toBe("1234");
    expect(data.getAll("tags")).toEqual(["red", "blue"]);
    expect(data.get("vol")).toBe("40");
    expect(data.getAll("span").map(String)).toEqual(["10", "20"]);
    expect(String(data.get("brand")).toLowerCase()).toBe("#112233");
    expect(data.get("agree")).toBe("on");
    expect(data.get("alerts")).toBe("on");
    expect(data.get("pay")).toBe("card");
    expect(data.getAll("top")).toEqual(["a"]);
  });

  it("keeps a readOnly checkbox unchecked", async () => {
    const { user } = render(<Checkbox label="Agree" readOnly />);
    await user.click(screen.getByRole("checkbox"));
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("keeps a checkbox unchecked when the form is readOnly", async () => {
    const { user } = render(
      <Form readOnly aria-label="Locked">
        <Checkbox name="agree" label="Agree" />
      </Form>,
    );
    await user.click(screen.getByRole("checkbox"));
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("focuses the select combobox from autoFocus", () => {
    render(
      // The prop under test is the field focus redirect.
      // eslint-disable-next-line jsx-a11y/no-autofocus -- asserts autoFocus leaves the wrapper
      <Select aria-label="Language" items={OPTIONS} autoFocus />,
    );
    expect(document.activeElement).toHaveAttribute("role", "combobox");
  });

  it("routes host attributes to the field and control attributes to the input", () => {
    render(
      <Input
        label="Email"
        name="email"
        type="email"
        data-testid="host"
        style={{ color: "rgb(255, 0, 0)" }}
      />,
    );
    const host = screen.getByTestId("host");
    const input = screen.getByRole("textbox");
    expect(host.tagName).toBe("DIV");
    expect(host).toHaveStyle({ color: "rgb(255, 0, 0)" });
    expect(input).toHaveAttribute("name", "email");
    expect(input).toHaveAttribute("type", "email");
    expect(input).not.toHaveAttribute("data-testid", "host");
  });
});
