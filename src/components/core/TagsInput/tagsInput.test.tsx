import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Form } from "@/components/composite/Form";
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

  it("removes a chip from the keyboard", async () => {
    const { user } = render(<TagsInput label="Topics" defaultValues={["design"]} />);
    const remove = screen.getByRole("button", { name: "Remove design" });
    remove.focus();
    await user.keyboard("{Enter}");
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

  it("ignores Enter while IME composition is active and prevents mousedown blur on chip remove", () => {
    const onValuesChange = vi.fn();
    render(
      <TagsInput label="Topics" defaultValues={["existing"]} onValuesChange={onValuesChange} />,
    );
    const input = field();
    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: "東京" } });
    fireEvent.keyDown(input, { key: "Enter", isComposing: true, keyCode: 229 });
    expect(onValuesChange).not.toHaveBeenCalled();

    fireEvent.compositionEnd(input, { target: { value: "東京" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onValuesChange).toHaveBeenLastCalledWith(["existing", "東京"]);

    const removeBtn = screen.getByRole("button", { name: "Remove existing" });
    const mouseDown = new MouseEvent("mousedown", { bubbles: true, cancelable: true });
    removeBtn.dispatchEvent(mouseDown);
    expect(mouseDown.defaultPrevented).toBe(true);
  });

  it("integrates with Form validation and resets uncontrolled chips on native form reset", async () => {
    const { user } = render(
      <Form defaultValues={{ tags: [] }} rules={{ tags: { required: "Add at least one tag" } }}>
        <Form.Field name="tags">
          <TagsInput name="tags" label="Tags" />
        </Form.Field>
        <button type="submit">Save</button>
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Add at least one tag");
    expect(field()).toHaveAttribute("aria-invalid", "true");

    const plain = render(
      <form>
        <TagsInput name="topics" label="Topics" defaultValues={["one"]} />
      </form>,
    );
    const plainInput = plain.getAllByRole("textbox")[1]!;
    fireEvent.change(plainInput, { target: { value: "two" } });
    fireEvent.keyDown(plainInput, { key: "Enter" });
    expect(plain.getByRole("button", { name: "Remove two" })).toBeInTheDocument();

    plain.container.querySelector("form")!.reset();
    await waitFor(() => {
      expect(plain.queryByRole("button", { name: "Remove two" })).toBeNull();
      expect(plain.getByRole("button", { name: "Remove one" })).toBeInTheDocument();
    });
  });
});
