import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { render } from "@/__tests__/helpers";
import { Form } from "@/components/composite/Form";

import { Checkbox } from ".";

describe("Checkbox", () => {
  it("toggles via Checkbox.Label in compound mode with and without Checkbox.Content", async () => {
    const onChange = vi.fn();
    const { user, unmount } = render(
      <Checkbox onChange={onChange}>
        <Checkbox.Control />
        <Checkbox.Label>Accept terms</Checkbox.Label>
      </Checkbox>,
    );

    const input = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(input).not.toBeChecked();

    await user.click(screen.getByText("Accept terms"));
    expect(input).toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(1);
    unmount();

    const wrapped = render(
      <Checkbox>
        <Checkbox.Control />
        <Checkbox.Content>
          <Checkbox.Label>Subscribe</Checkbox.Label>
          <Checkbox.Hint>Weekly digest</Checkbox.Hint>
        </Checkbox.Content>
      </Checkbox>,
    );
    const subInput = wrapped.getByRole("checkbox", { name: "Subscribe" });
    expect(subInput.closest("label")).toBeNull();
    await wrapped.user.click(wrapped.getByText("Subscribe"));
    expect(subInput).toBeChecked();
  });

  it("preserves indeterminate state when readOnly checkbox is clicked", async () => {
    const onChange = vi.fn();
    const { user } = render(
      <Checkbox label="Partial" indeterminate readOnly onChange={onChange} />,
    );
    const input = screen.getByRole("checkbox", { name: "Partial" }) as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
    expect(input).toHaveAttribute("aria-readonly", "true");

    await user.click(input);
    expect(onChange).not.toHaveBeenCalled();
    expect(input.checked).toBe(false);
    expect(input.indeterminate).toBe(true);
  });

  it("restores defaultChecked and indeterminate on native form reset", async () => {
    const { user, container } = render(
      <form>
        <Checkbox name="agree" label="Agree" defaultChecked />
        <button type="reset">Reset</button>
      </form>,
    );
    const input = screen.getByRole("checkbox", { name: "Agree" });
    const root = container.querySelector("label")!;
    expect(input).toBeChecked();
    expect(root).toHaveAttribute("data-state", "checked");

    await user.click(input);
    expect(input).not.toBeChecked();
    expect(root).toHaveAttribute("data-state", "unchecked");

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    await waitFor(() => {
      expect(input).toBeChecked();
      expect(root).toHaveAttribute("data-state", "checked");
    });
  });

  it("inherits disabled and readOnly from Form", async () => {
    const { user, rerender } = render(
      <Form disabled aria-label="Disabled form">
        <Checkbox name="agree" label="Agree" />
      </Form>,
    );
    const input = screen.getByRole("checkbox", { name: "Agree" });
    expect(input).toBeDisabled();
    expect(input.closest("label")).toHaveAttribute("data-disabled", "");

    rerender(
      <Form readOnly aria-label="Readonly form">
        <Checkbox name="agree" label="Agree" />
      </Form>,
    );
    const roInput = screen.getByRole("checkbox", { name: "Agree" });
    expect(roInput).toHaveAttribute("aria-readonly", "true");
    await user.click(roInput);
    expect(roInput).not.toBeChecked();
  });
});
