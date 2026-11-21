import { fireEvent, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Input } from "@/components/core/Input";
import { TextArea } from "@/components/core/TextArea";
import { render } from "@/__tests__/helpers";

import { Form } from "./index";

describe("Form", () => {
  it("preserves Form.Field rules across parent re-renders and merges root rules", async () => {
    const onSubmit = vi.fn();

    function Host() {
      const [tick, setTick] = useState(0);
      return (
        <div>
          <button type="button" onClick={() => setTick((n) => n + 1)}>
            Rerender {tick}
          </button>
          <Form
            aria-label="Account"
            defaultValues={{ username: "", bio: "" }}
            rules={{ bio: { required: "Bio required" } }}
            onSubmit={onSubmit}
          >
            <Form.Field name="username" rules={{ required: "Username required" }}>
              <Input name="username" label="Username" />
            </Form.Field>
            <Form.Field name="bio">
              <TextArea name="bio" label="Bio" />
            </Form.Field>
            <button type="submit">Save</button>
          </Form>
        </div>
      );
    }

    const { user } = render(<Host />);
    await user.click(screen.getByRole("button", { name: /Rerender/ }));
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onSubmit).not.toHaveBeenCalled();
    const alerts = await screen.findAllByRole("alert");
    expect(alerts.map((el) => el.textContent)).toEqual(["Username required", "Bio required"]);

    await user.type(screen.getByRole("textbox", { name: "Username" }), "andrey");
    await user.type(screen.getByRole("textbox", { name: "Bio" }), "Builder");
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ username: "andrey", bio: "Builder" });
    });
  });

  it("passes resolver transformed values to onSubmit and ignores undefined error keys", async () => {
    const onSubmit = vi.fn();
    const { user } = render(
      <Form
        aria-label="Transform"
        defaultValues={{ email: "  USER@EXAMPLE.COM  " }}
        resolver={(values) => ({
          values: { email: String(values.email).trim().toLowerCase() },
          errors: { email: undefined },
        })}
        onSubmit={onSubmit}
      >
        <Form.Field name="email">
          <Input name="email" label="Email" />
        </Form.Field>
        <button type="submit">Submit</button>
      </Form>,
    );

    await user.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ email: "user@example.com" });
    });
  });

  it("resets values, errors, touched, and calls user onReset on native form reset", async () => {
    const onReset = vi.fn();
    const { user } = render(
      <Form
        aria-label="Profile"
        defaultValues={{ name: "Initial" }}
        rules={{ name: { required: "Name is required" } }}
        onReset={onReset}
      >
        <Form.Field name="name">
          <Input name="name" label="Name" />
        </Form.Field>
        <button type="submit">Save</button>
        <button type="reset">Reset</button>
      </Form>,
    );

    const input = screen.getByRole("textbox", { name: "Name" });
    expect(input).toHaveValue("Initial");

    await user.clear(input);
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Name is required");
    expect(input).toHaveAttribute("aria-invalid", "true");

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    await waitFor(() => {
      expect(onReset).toHaveBeenCalledTimes(1);
      expect(input).toHaveValue("Initial");
      expect(input).not.toHaveAttribute("aria-invalid");
      expect(screen.queryAllByText("Name is required")).toHaveLength(0);
    });
  });
});
