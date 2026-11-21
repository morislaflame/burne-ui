import { fireEvent, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { render } from "@/__tests__/helpers";
import { Form } from "@/components/composite/Form";

import { ColorPicker, ColorSlider } from ".";
import { COLOR_PICKER_CHECKERBOARD_CLASS } from "./colorPickerStyles";
import { hexToHsva, hexToRgba, hsvaToRgba } from "./colorUtils";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ColorPicker & ColorSlider", () => {
  it("validates hex characters in hexToRgba and clamps HSVA channels in hsvaToRgba", () => {
    expect(hexToRgba("#zzzzzz")).toBeNull();
    expect(hexToRgba("#12g456")).toBeNull();
    expect(hexToRgba("")).toBeNull();
    expect(hexToHsva("#zzzzzz")).toBeNull();
    expect(hexToRgba("#ff0080")).toEqual({ r: 255, g: 0, b: 128, a: 100 });

    const clamped = hsvaToRgba({ h: -60, s: 150, v: 200, a: 140 });
    expect(clamped).toEqual({ r: 255, g: 0, b: 255, a: 100 });
  });

  it("uses alternating token checkerboard tiles", () => {
    expect(COLOR_PICKER_CHECKERBOARD_CLASS).toContain("repeating-conic-gradient");
    expect(COLOR_PICKER_CHECKERBOARD_CLASS).toContain("var(--color-border)");
    expect(COLOR_PICKER_CHECKERBOARD_CLASS).toContain("var(--color-surface)");
  });

  it("allows clearing AlphaInput with backspace and typing a new number without snapping to 0", async () => {
    const onValueChange = vi.fn();
    const { user } = render(
      <ColorPicker defaultOpen defaultValue="#3b82f680" onValueChange={onValueChange}>
        <ColorPicker.Trigger />
        <ColorPicker.Content showAlpha />
      </ColorPicker>,
    );

    const alphaInput = screen.getByRole("textbox", { name: /Transparency/i }) as HTMLInputElement;
    expect(alphaInput.value).toBe("50");

    await user.click(alphaInput);
    await user.clear(alphaInput);
    // While focused and cleared, draft stays "" instead of forcing "0"
    expect(alphaInput.value).toBe("");

    await user.type(alphaInput, "5");
    expect(alphaInput.value).toBe("5");
    await user.tab();
    expect(alphaInput.value).toBe("5");
    expect(onValueChange).toHaveBeenCalled();
  });

  it("prevents popover open when disabled and blocks mutations when readOnly or Form disabled/readOnly", async () => {
    const onValueChange = vi.fn();
    const { user, rerender, unmount } = render(
      <Form disabled aria-label="Disabled form">
        <ColorPicker name="brand" label="Brand" defaultValue="#ff0000" onValueChange={onValueChange} />
      </Form>,
    );

    const trigger = screen.getByRole("button", { name: /Selected color/i });
    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(screen.queryByRole("dialog")).toBeNull();

    rerender(
      <ColorPicker
        readOnly
        defaultOpen
        defaultValue="#ff0000"
        onValueChange={onValueChange}
      >
        <ColorPicker.Trigger />
        <ColorPicker.Content showAlpha presets={["#00ff00"]} />
      </ColorPicker>,
    );

    const hexInput = screen.getByRole("textbox", { name: /Hex code/i });
    expect(hexInput).toHaveAttribute("readonly");
    await user.click(screen.getByRole("button", { name: /Select color #00ff00/i }));
    expect(onValueChange).not.toHaveBeenCalled();
    unmount();

    // Native form reset restores defaultValue
    const resetView = render(
      <form>
        <ColorPicker name="brand" defaultOpen defaultValue="#ff0000">
          <ColorPicker.Trigger />
          <ColorPicker.Content presets={["#00ff00"]} />
        </ColorPicker>
        <button type="reset">Reset</button>
      </form>,
    );
    await resetView.user.click(resetView.getByRole("button", { name: /Select color #00ff00/i }));
    expect(resetView.container.querySelector("input[type='hidden'][name='brand']")).toHaveValue("#00ff00");

    fireEvent.click(resetView.getByRole("button", { name: "Reset" }));
    await waitFor(() => {
      expect(resetView.container.querySelector("input[type='hidden'][name='brand']")).toHaveValue("#ff0000");
    });
  });

  it("keeps controlled value in sync without drifting when external value changes or ignores updates", async () => {
    function ControlledPicker({ locked = false }: { locked?: boolean }) {
      const [color, setColor] = useState("#ff0000");
      return (
        <div>
          <button type="button" onClick={() => setColor("#00ff00")}>
            External green
          </button>
          <ColorPicker
            open
            value={color}
            onValueChange={(next) => {
              if (!locked) setColor(next);
            }}
          >
            <ColorPicker.Trigger />
            <ColorPicker.Content presets={["#0000ff"]} />
          </ColorPicker>
        </div>
      );
    }

    const { user, rerender } = render(<ControlledPicker locked />);
    await user.click(screen.getByRole("button", { name: /Select color #0000ff/i }));
    const hexInput = screen.getByRole("textbox", { name: /Hex code/i }) as HTMLInputElement;
    // Locked parent kept value="#ff0000" — internal state must not drift to #0000ff
    expect(hexInput.value.toLowerCase()).toBe("ff0000");

    rerender(<ControlledPicker locked={false} />);
    await user.click(screen.getByRole("button", { name: "External green" }));
    expect(hexInput.value.toLowerCase()).toBe("00ff00");
  });

  it("updates uncontrolled ColorSlider display value and supports RTL pointer/keyboard/gradient", async () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      () =>
        ({
          width: 360,
          height: 20,
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          right: 360,
          bottom: 20,
          toJSON: () => ({}),
        }) as DOMRect,
    );
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

    const { user, container } = render(
      <div dir="rtl">
        <ColorSlider channel="hue" label="Hue" defaultValue={100} />
      </div>,
    );

    expect(screen.getByText("100")).toBeInTheDocument();
    const slider = screen.getByRole("slider", { name: "Hue" });
    expect(slider).toHaveAttribute("aria-valuenow", "100");
    expect(slider.style.insetInlineStart).toBeTruthy();

    const track = container.querySelector("[role='presentation']") as HTMLElement;
    expect(track.style.background).toContain("to left");

    slider.focus();
    // In RTL, ArrowLeft increments and ArrowRight decrements
    await user.keyboard("{ArrowLeft}");
    expect(slider).toHaveAttribute("aria-valuenow", "101");
    expect(screen.getByText("101")).toBeInTheDocument();

    await user.keyboard("{ArrowRight}");
    expect(slider).toHaveAttribute("aria-valuenow", "100");
    expect(screen.getByText("100")).toBeInTheDocument();

    // Pointer down on track focuses thumb
    slider.blur();
    fireEvent.pointerDown(track, { button: 0, pointerId: 1, clientX: 180, clientY: 10 });
    expect(slider).toHaveFocus();
    fireEvent.pointerUp(window, { pointerId: 1 });
  });
});
