import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { render } from "@/__tests__/helpers";

import { TagsInput } from ".";

function field() {
  return screen.getByRole("textbox");
}

describe("TagsInput", () => {
  it("adds a chip on Enter and ignores a duplicate", () => {
    const onValuesChange = vi.fn();
    render(<TagsInput label="Topics" onValuesChange={onValuesChange} />);
    fireEvent.change(field(), { target: { value: "design" } });
    fireEvent.keyDown(field(), { key: "Enter" });
    expect(onValuesChange).toHaveBeenLastCalledWith(["design"]);
    expect(screen.getByRole("button", { name: "Remove design" })).toBeInTheDocument();
    fireEvent.change(field(), { target: { value: "design" } });
    fireEvent.keyDown(field(), { key: "Enter" });
    expect(onValuesChange).toHaveBeenLastCalledWith(["design"]);
  });

  it("splits a comma and removes the last chip with Backspace", () => {
    render(<TagsInput label="Topics" />);
    fireEvent.change(field(), { target: { value: "design, react" } });
    expect(screen.getByRole("button", { name: "Remove design" })).toBeInTheDocument();
    expect(field()).toHaveValue("react");
    fireEvent.change(field(), { target: { value: "" } });
    fireEvent.keyDown(field(), { key: "Backspace" });
    expect(screen.queryByRole("button", { name: "Remove design" })).not.toBeInTheDocument();
  });

  it("removes a chip from its button and stops at max", () => {
    const onValuesChange = vi.fn();
    render(<TagsInput label="Topics" max={1} onValuesChange={onValuesChange} />);
    fireEvent.change(field(), { target: { value: "design, react" } });
    expect(onValuesChange).toHaveBeenLastCalledWith(["design"]);
    expect(field()).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Remove design" }));
    expect(onValuesChange).toHaveBeenLastCalledWith([]);
  });
});
