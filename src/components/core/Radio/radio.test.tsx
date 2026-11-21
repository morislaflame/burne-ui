import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { render } from "@/__tests__/helpers";
import { Form } from "@/components/composite/Form";

import { Radio } from ".";

describe("Radio standalone", () => {
  it("binds standalone Radio to Form disabled, readOnly, value, and error", async () => {
    const { user, rerender } = render(
      <Form disabled aria-label="Form">
        <Radio name="plan" value="pro" label="Pro" />
      </Form>,
    );
    expect(screen.getByRole("radio", { name: "Pro" })).toBeDisabled();

    rerender(
      <Form readOnly defaultValues={{ plan: "" }} aria-label="Form">
        <Radio name="plan" value="pro" label="Pro" />
      </Form>,
    );
    await user.click(screen.getByRole("radio", { name: "Pro" }));
    expect(screen.getByRole("radio", { name: "Pro" })).not.toBeChecked();

    rerender(
      <Form
        defaultValues={{ plan: "" }}
        rules={{ plan: { required: "Choose a plan" } }}
        aria-label="Form"
      >
        <Radio name="plan" value="pro" label="Pro" />
        <button type="submit">Submit</button>
      </Form>,
    );
    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Choose a plan");
    expect(screen.getByRole("radio")).toHaveAttribute("aria-invalid", "true");

    await user.click(screen.getByRole("radio"));
    expect(screen.getByRole("radio")).toBeChecked();
  });

  it("restores defaultChecked on native form reset", async () => {
    render(
      <form>
        <Radio name="opt" value="yes" label="Yes" defaultChecked />
        <button type="reset">Reset</button>
      </form>,
    );
    const radio = screen.getByRole("radio", { name: "Yes" });
    expect(radio).toBeChecked();

    fireEvent.click(radio);
    expect(radio).not.toBeChecked();

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    await waitFor(() => {
      expect(radio).toBeChecked();
    });
  });
});
