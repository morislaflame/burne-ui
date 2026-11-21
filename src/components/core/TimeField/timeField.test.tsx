import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Form } from "@/components/composite/Form";
import { render } from "@/__tests__/helpers";

import { TimeField } from "./index";

describe("TimeField", () => {
  it("never places aria-hidden on any focusable element", () => {
    const { container } = render(<TimeField label="Alarm" defaultValue="08:30" />);
    const hiddenFocusable = container.querySelectorAll(
      '[aria-hidden="true"] input:not([disabled]), input[aria-hidden="true"]:not([disabled]), [role="spinbutton"][aria-hidden="true"]',
    );
    expect(hiddenFocusable).toHaveLength(0);
  });

  it("blocks segment edits, keyboard input, and paste when readOnly or disabled", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <TimeField label="Start" defaultValue="09:15" readOnly onValueChange={onValueChange} />,
    );
    const [hour] = screen.getAllByRole("spinbutton");
    fireEvent.keyDown(hour!, { key: "ArrowUp" });
    fireEvent.keyDown(hour!, { key: "5" });
    fireEvent.paste(hour!, { clipboardData: { getData: () => "14:45" } });

    const mobileInput = container.querySelector<HTMLInputElement>('input[inputmode="numeric"]')!;
    expect(mobileInput).toBeDisabled();
    expect(onValueChange).not.toHaveBeenCalled();
    expect(hour).toHaveAttribute("aria-valuenow", "9");
  });

  it("connects compound TimeField.Label, shows Form errors, and resets uncontrolled time on form reset", async () => {
    const { user } = render(
      <Form defaultValues={{ start: "" }} rules={{ start: { required: "Pick a start time" } }}>
        <Form.Field name="start">
          <TimeField name="start">
            <TimeField.Label>Meeting time</TimeField.Label>
            <TimeField.Control />
            <TimeField.Error />
          </TimeField>
        </Form.Field>
        <button type="submit">Save</button>
      </Form>,
    );

    const group = screen.getByRole("group", { name: "Meeting time" });
    expect(group).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Pick a start time");
    expect(group).toHaveAttribute("aria-invalid", "true");

    const plain = render(
      <form>
        <TimeField name="when" label="When" defaultValue="10:30" />
      </form>,
    );
    const [plainHour] = within(plain.container).getAllByRole("spinbutton");
    fireEvent.keyDown(plainHour!, { key: "ArrowUp" });
    expect(plainHour).toHaveAttribute("aria-valuenow", "11");

    plain.container.querySelector("form")!.reset();
    await waitFor(() => {
      expect(plainHour).toHaveAttribute("aria-valuenow", "10");
    });
  });
});
