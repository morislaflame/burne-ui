import { fireEvent, screen, waitFor } from "@testing-library/react";
import { StrictMode, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { render } from "@/__tests__/helpers";
import { Form } from "@/components/composite/Form";
import { Radio } from "@/components/core/Radio";

import { RadioGroup } from ".";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("RadioGroup", () => {
  it("keeps required deterministic across StrictMode and re-renders", async () => {
    function Harness() {
      const [count, setCount] = useState(0);
      return (
        <StrictMode>
          <button type="button" onClick={() => setCount((c) => c + 1)}>
            Rerender {count}
          </button>
          <RadioGroup required label="Payment">
            <RadioGroup.List>
              <Radio value="card" label="Card" />
              <Radio value="cash" label="Cash" />
            </RadioGroup.List>
          </RadioGroup>
        </StrictMode>
      );
    }

    const { user } = render(<Harness />);
    const radios = screen.getAllByRole("radio");
    expect(radios[0]).toBeRequired();
    expect(radios[1]).not.toBeRequired();

    await user.click(screen.getByRole("button", { name: /Rerender/ }));
    await user.click(radios[1]!);
    await user.click(screen.getByRole("button", { name: /Rerender/ }));

    expect(radios[0]).toBeRequired();
    expect(radios[1]).not.toBeRequired();
  });

  it("blocks arrow-key selection when readOnly or disabled and flips ArrowLeft/ArrowRight in RTL", async () => {
    const onReadOnlyChange = vi.fn();
    const { user, unmount } = render(
      <RadioGroup readOnly defaultValue="a" onValueChange={onReadOnlyChange} aria-label="Locked">
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    const lockedA = screen.getByRole("radio", { name: "A" });
    lockedA.focus();
    await user.keyboard("{ArrowRight}{ArrowDown}");
    expect(onReadOnlyChange).not.toHaveBeenCalled();
    expect(lockedA).toBeChecked();
    unmount();

    const originalStyle = window.getComputedStyle.bind(window);
    vi.spyOn(window, "getComputedStyle").mockImplementation((el) => {
      const style = originalStyle(el);
      if (!(el instanceof HTMLElement) || el.closest("[dir='rtl']") == null) return style;
      return new Proxy(style, {
        get(target, prop, receiver) {
          if (prop === "direction") return "rtl";
          const value = Reflect.get(target, prop, receiver);
          return typeof value === "function" ? value.bind(target) : value;
        },
      });
    });

    const rtlView = render(
      <div dir="rtl">
        <RadioGroup defaultValue="b" aria-label="RTL choices">
          <Radio value="a" label="A" />
          <Radio value="b" label="B" />
          <Radio value="c" label="C" />
        </RadioGroup>
      </div>,
    );
    const radioB = rtlView.getByRole("radio", { name: "B" });
    radioB.focus();

    await rtlView.user.keyboard("{ArrowLeft}");
    expect(rtlView.getByRole("radio", { name: "C" })).toBeChecked();

    await rtlView.user.keyboard("{ArrowRight}");
    expect(rtlView.getByRole("radio", { name: "B" })).toBeChecked();

    await rtlView.user.keyboard("{ArrowDown}");
    expect(rtlView.getByRole("radio", { name: "C" })).toBeChecked();
  });

  it("cascades disabled, readOnly, and error from Form and resets on native form reset", async () => {
    const { user, rerender, unmount } = render(
      <Form disabled aria-label="Form">
        <RadioGroup name="pay" label="Pay" items={[{ value: "card", label: "Card" }]} />
      </Form>,
    );
    expect(screen.getByRole("radiogroup", { name: "Pay" })).toBeDisabled();
    expect(screen.getByRole("radio", { name: "Card" })).toBeDisabled();

    rerender(
      <Form
        defaultValues={{ pay: "" }}
        rules={{ pay: { required: "Select payment" } }}
        aria-label="Form"
      >
        <RadioGroup name="pay" label="Pay" items={[{ value: "card", label: "Card" }]} />
        <button type="submit">Send</button>
      </Form>,
    );
    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Select payment");
    expect(screen.getByRole("radiogroup", { name: "Pay" })).toHaveAttribute("aria-invalid", "true");
    unmount();

    render(
      <form>
        <RadioGroup name="pay" required defaultValue="card" aria-label="Pay">
          <Radio value="card" label="Card" />
          <Radio value="cash" label="Cash" />
        </RadioGroup>
        <button type="reset">Reset</button>
      </form>,
    );
    fireEvent.click(screen.getByRole("radio", { name: "Cash" }));
    expect(screen.getByRole("radio", { name: "Cash" })).toBeChecked();

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    await waitFor(() => {
      expect(screen.getByRole("radio", { name: "Card" })).toBeChecked();
      expect(screen.getByRole("radio", { name: "Cash" })).not.toBeChecked();
    });
  });
});
