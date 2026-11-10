import { fireEvent, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { render } from "@/__tests__/helpers";
import { Checkbox } from "@/components/core/Checkbox";

import { CheckboxGroup } from ".";
import type { CheckboxGroupProps } from "./checkboxGroupTypes";

function Group(props: CheckboxGroupProps) {
  return (
    <CheckboxGroup {...props}>
      <CheckboxGroup.List>
        <Checkbox value="a" label="A" />
        <Checkbox value="b" label="B" />
      </CheckboxGroup.List>
    </CheckboxGroup>
  );
}

function Controlled({ initial = ["a"] }: { initial?: string[] }) {
  const [values, setValues] = useState(initial);
  return <Group values={values} onValuesChange={setValues} />;
}

describe("CheckboxGroup", () => {
  it("keeps an uncontrolled multiple selection", () => {
    const onValuesChange = vi.fn();
    render(<Group defaultValues={["a"]} onValuesChange={onValuesChange} />);
    expect(screen.getByRole("checkbox", { name: "A" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "B" })).not.toBeChecked();

    fireEvent.click(screen.getByRole("checkbox", { name: "B" }));
    expect(screen.getByRole("checkbox", { name: "A" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "B" })).toBeChecked();
    expect(onValuesChange).toHaveBeenLastCalledWith(["a", "b"]);

    fireEvent.click(screen.getByRole("checkbox", { name: "A" }));
    expect(screen.getByRole("checkbox", { name: "A" })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: "B" })).toBeChecked();
    expect(onValuesChange).toHaveBeenLastCalledWith(["b"]);
  });

  it("does not move a controlled multiple selection until values change", () => {
    const onValuesChange = vi.fn();
    render(<Group values={["a"]} onValuesChange={onValuesChange} />);
    fireEvent.click(screen.getByRole("checkbox", { name: "B" }));
    expect(onValuesChange).toHaveBeenCalledWith(["a", "b"]);
    expect(screen.getByRole("checkbox", { name: "B" })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: "A" })).toBeChecked();
  });

  it("updates a controlled multiple selection when the parent applies the next values", () => {
    render(<Controlled />);
    fireEvent.click(screen.getByRole("checkbox", { name: "B" }));
    expect(screen.getByRole("checkbox", { name: "A" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "B" })).toBeChecked();
    fireEvent.click(screen.getByRole("checkbox", { name: "A" }));
    expect(screen.getByRole("checkbox", { name: "A" })).not.toBeChecked();
  });

  it("keeps a checkbox without value on its own checked state", () => {
    const onValuesChange = vi.fn();
    render(
      <CheckboxGroup onValuesChange={onValuesChange}>
        <CheckboxGroup.List>
          <Checkbox label="Terms" />
          <Checkbox value="news" label="News" />
        </CheckboxGroup.List>
      </CheckboxGroup>,
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "Terms" }));
    expect(screen.getByRole("checkbox", { name: "Terms" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "News" })).not.toBeChecked();
    expect(onValuesChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("checkbox", { name: "News" }));
    expect(onValuesChange).toHaveBeenCalledWith(["news"]);
    expect(screen.getByRole("checkbox", { name: "Terms" })).toBeChecked();
  });

  it("keeps single selection on value", () => {
    const onValueChange = vi.fn();
    render(<Group selectionMode="single" defaultValue="a" onValueChange={onValueChange} />);
    expect(screen.getByRole("checkbox", { name: "A" })).toBeChecked();

    fireEvent.click(screen.getByRole("checkbox", { name: "B" }));
    expect(screen.getByRole("checkbox", { name: "B" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "A" })).not.toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith("b");

    fireEvent.click(screen.getByRole("checkbox", { name: "B" }));
    expect(screen.getByRole("checkbox", { name: "B" })).not.toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });
});
