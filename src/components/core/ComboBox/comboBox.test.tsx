import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Form } from "@/components/composite/Form";
import { render } from "@/__tests__/helpers";

import { ComboBox } from "./index";

const ITEMS = [
  { value: "oslo", label: "Oslo" },
  { value: "bergen", label: "Bergen" },
  { value: "tromso", label: "Tromsø" },
];

describe("ComboBox", () => {
  it("opens immediately on input click without wiping selected text or transforming shell", async () => {
    const pressIn = vi.fn();
    render(
      <ComboBox
        label="City"
        items={ITEMS}
        defaultValue="oslo"
        motion={{ shell: { pressIn } }}
      />,
    );

    const input = screen.getByRole("combobox", { name: "City" });
    expect(input).toHaveValue("Oslo");

    fireEvent.click(input);
    expect(pressIn).not.toHaveBeenCalled();
    expect(input).toHaveValue("Oslo");
    expect(await screen.findByRole("option", { name: "Bergen" })).toBeInTheDocument();
  });

  it("opens and filters synchronously when pasting or typing while closed", async () => {
    render(<ComboBox label="City" items={ITEMS} />);
    const input = screen.getByRole("combobox", { name: "City" });

    // Simulate mobile clipboard paste / Gboard change firing while popup is closed
    fireEvent.change(input, { target: { value: "berg" } });

    expect(input).toHaveValue("berg");
    expect(await screen.findByRole("option", { name: "Bergen" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Oslo" })).toBeNull();
  });

  it("blocks opening when readOnly or disabled", () => {
    const { rerender } = render(
      <ComboBox label="City" items={ITEMS} defaultValue="oslo" readOnly />,
    );
    const input = screen.getByRole("combobox", { name: "City" });
    fireEvent.click(input);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(screen.queryByRole("listbox")).toBeNull();

    rerender(<ComboBox label="City" items={ITEMS} defaultValue="oslo" disabled />);
    fireEvent.click(screen.getByRole("combobox", { name: "City" }));
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("guards Enter and Escape during IME composition and closes cleanly on Escape", async () => {
    const onValueChange = vi.fn();
    render(<ComboBox label="City" items={ITEMS} onValueChange={onValueChange} />);
    const input = screen.getByRole("combobox", { name: "City" });

    fireEvent.change(input, { target: { value: "os" } });
    await screen.findByRole("option", { name: "Oslo" });

    // IME Enter (keyCode 229) must not commit option prematurely
    fireEvent.keyDown(input, { key: "Enter", keyCode: 229 });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.keyDown(input, { key: "Escape" });
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).toBeNull();
    });
  });

  it("connects compound ComboBox.Label and ComboBox.Error inside Form and resets on form reset", async () => {
    const { user, container } = render(
      <Form defaultValues={{ city: "" }} rules={{ city: { required: "Select a city" } }}>
        <Form.Field name="city">
          <ComboBox name="city" items={ITEMS}>
            <ComboBox.Label>City</ComboBox.Label>
            <ComboBox.Shell>
              <ComboBox.Input />
              <ComboBox.Trigger />
            </ComboBox.Shell>
            <ComboBox.Popover />
            <ComboBox.Error />
          </ComboBox>
        </Form.Field>
        <button type="submit">Submit</button>
      </Form>,
    );

    const input = screen.getByRole("combobox", { name: "City" });
    expect(input).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Select a city");

    const plainForm = render(
      <form>
        <ComboBox name="town" label="Town" items={ITEMS} defaultValue="oslo" />
      </form>,
    );
    const townInput = plainForm.getByRole("combobox", { name: "Town" });
    fireEvent.click(townInput);
    await plainForm.user.click(await plainForm.findByRole("option", { name: "Bergen" }));
    expect(townInput).toHaveValue("Bergen");

    plainForm.container.querySelector("form")!.reset();
    await waitFor(() => {
      expect(townInput).toHaveValue("Oslo");
    });
    void container;
  });
});
