import { fireEvent, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { render } from "@/__tests__/helpers";
import { Form } from "@/components/composite/Form";

import { Slider } from ".";
import { snapSliderToStep } from "./sliderAPI";

const rect200 = () =>
  ({
    width: 200,
    height: 20,
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 200,
    bottom: 20,
    toJSON: () => ({}),
  }) as DOMRect;

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Slider", () => {
  it("rounds floating-point steps cleanly and guards invalid step/min/max", () => {
    expect(snapSliderToStep(0.1 + 0.2, 0, 1, 0.1)).toBe(0.3);
    expect(snapSliderToStep(0.15, 0.05, 1.05, 0.1)).toBe(0.15);
    expect(snapSliderToStep(50, 0, 100, 0)).toBe(50);
    expect(snapSliderToStep(50, 0, 100, Number.NaN)).toBe(50);
    expect(snapSliderToStep(50, 100, 20, 1)).toBe(100);
  });

  it("wires compound <Slider><Slider.Track /></Slider> and focuses thumb on pointerdown", async () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(rect200);
    const onValueChange = vi.fn();

    render(
      <Slider defaultValue={20} min={0} max={100} step={10} onValueChange={onValueChange}>
        <Slider.Header>
          <Slider.Label>Brightness</Slider.Label>
          <Slider.Value />
        </Slider.Header>
        <Slider.Track data-testid="compound-track" />
      </Slider>,
    );

    const thumb = screen.getByRole("slider", { name: "Brightness" });
    expect(thumb).toHaveAttribute("aria-valuenow", "20");

    const track = screen.getByTestId("compound-track");
    fireEvent.pointerDown(track, { button: 0, pointerId: 1, clientX: 100, clientY: 10 });
    expect(thumb).toHaveFocus();
    expect(thumb).toHaveAttribute("aria-valuenow", "50");
    expect(onValueChange).toHaveBeenCalledWith(50);

    // Multi-touch pointerId 2 is ignored while pointerId 1 is dragging
    fireEvent.pointerMove(window, { pointerId: 2, clientX: 190, clientY: 10 });
    expect(thumb).toHaveAttribute("aria-valuenow", "50");

    fireEvent.pointerMove(window, { pointerId: 1, clientX: 190, clientY: 10 });
    expect(thumb).toHaveAttribute("aria-valuenow", "100");
    fireEvent.pointerUp(window, { pointerId: 1 });
  });

  it("prevents range thumbs from crossing via keyboard and unlocks stacked thumbs at [0,0] and [100,100]", async () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(rect200);

    const { user, unmount } = render(
      <Slider range defaultValue={[30, 50]} min={0} max={100} step={10} aria-label="Span" />,
    );
    const [startThumb, endThumb] = screen.getAllByRole("slider");
    startThumb!.focus();
    await user.keyboard("{End}");
    expect(startThumb).toHaveAttribute("aria-valuenow", "50");
    expect(endThumb).toHaveAttribute("aria-valuenow", "50");

    endThumb!.focus();
    await user.keyboard("{Home}");
    expect(startThumb).toHaveAttribute("aria-valuenow", "50");
    expect(endThumb).toHaveAttribute("aria-valuenow", "50");
    unmount();

    // Stacked at [0, 0]: clicking/dragging toward max moves thumb 1 (end)
    const stackedMin = render(
      <Slider range defaultValue={[0, 0]} min={0} max={100} step={10} aria-label="MinStack">
        <Slider.Track data-testid="min-track" />
      </Slider>,
    );
    fireEvent.pointerDown(stackedMin.getByTestId("min-track"), {
      button: 0,
      pointerId: 1,
      clientX: 100,
      clientY: 10,
    });
    fireEvent.pointerUp(window, { pointerId: 1 });
    const minThumbs = stackedMin.getAllByRole("slider");
    expect(minThumbs[0]).toHaveAttribute("aria-valuenow", "0");
    expect(minThumbs[1]).toHaveAttribute("aria-valuenow", "50");
    stackedMin.unmount();

    // Stacked at [100, 100]: grabbing top thumb (end) and dragging toward min switches to thumb 0 (start)
    const stackedMax = render(
      <Slider range defaultValue={[100, 100]} min={0} max={100} step={10} aria-label="MaxStack" />,
    );
    const maxThumbs = stackedMax.getAllByRole("slider");
    fireEvent.pointerDown(maxThumbs[1]!, { button: 0, pointerId: 5, clientX: 190, clientY: 10 });
    fireEvent.pointerMove(window, { pointerId: 5, clientX: 100, clientY: 10 });
    fireEvent.pointerUp(window, { pointerId: 5 });
    expect(maxThumbs[0]).toHaveAttribute("aria-valuenow", "50");
    expect(maxThumbs[1]).toHaveAttribute("aria-valuenow", "100");
  });

  it("supports RTL pointer ratio, insetInlineStart positioning, and ArrowLeft/ArrowRight inversion", async () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(rect200);
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
        <Slider defaultValue={20} min={0} max={100} step={10} aria-label="RTL Volume">
          <Slider.Track data-testid="rtl-track" />
        </Slider>
      </div>,
    );

    const thumb = screen.getByRole("slider", { name: "RTL Volume" });
    expect(thumb.style.insetInlineStart).toBeTruthy();
    const fill = container.querySelector("span") as HTMLSpanElement;
    expect(fill.style.insetInlineStart).toBe("0%");

    // In RTL, clicking near left edge (clientX = 10 on 200px track) maps to max (100)
    fireEvent.pointerDown(screen.getByTestId("rtl-track"), {
      button: 0,
      pointerId: 1,
      clientX: 10,
      clientY: 10,
    });
    fireEvent.pointerUp(window, { pointerId: 1 });
    expect(thumb).toHaveAttribute("aria-valuenow", "100");

    // ArrowRight decrements in RTL; ArrowLeft increments; ArrowUp always increments; ArrowDown always decrements
    await user.keyboard("{ArrowRight}");
    expect(thumb).toHaveAttribute("aria-valuenow", "90");

    await user.keyboard("{ArrowDown}");
    expect(thumb).toHaveAttribute("aria-valuenow", "80");

    await user.keyboard("{ArrowLeft}");
    expect(thumb).toHaveAttribute("aria-valuenow", "90");

    await user.keyboard("{ArrowUp}");
    expect(thumb).toHaveAttribute("aria-valuenow", "100");
  });

  it("cascades Form disabled/readOnly/error and resets on native form reset", async () => {
    const { user, rerender, unmount } = render(
      <Form disabled aria-label="Form">
        <Slider name="vol" label="Volume" defaultValue={30} />
      </Form>,
    );
    expect(screen.getByRole("slider", { name: "Volume" })).toBeDisabled();

    rerender(
      <Form readOnly defaultValues={{ vol: 30 }} aria-label="Form">
        <Slider name="vol" label="Volume" step={10} />
      </Form>,
    );
    const roSlider = screen.getByRole("slider", { name: "Volume" });
    expect(roSlider).toHaveAttribute("aria-readonly", "true");
    roSlider.focus();
    await user.keyboard("{ArrowRight}");
    expect(roSlider).toHaveAttribute("aria-valuenow", "30");
    unmount();

    render(
      <form>
        <Slider name="vol" aria-label="Volume" defaultValue={25} step={5} />
        <button type="reset">Reset</button>
      </form>,
    );
    const slider = screen.getByRole("slider", { name: "Volume" });
    slider.focus();
    await user.keyboard("{ArrowRight}");
    expect(slider).toHaveAttribute("aria-valuenow", "30");

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    await waitFor(() => {
      expect(slider).toHaveAttribute("aria-valuenow", "25");
    });
  });

  it("keeps SliderFill strictly synchronized with SliderThumb when increasing value (never running ahead before commit)", () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(rect200);
    const onValueChange = vi.fn();

    // Controlled slider whose parent holds `value={20}` until rerender:
    // pointerMove right must NOT advance `fill.style.width` ahead of `thumb.style.insetInlineStart`.
    const { container, rerender } = render(
      <Slider value={20} min={0} max={100} step={1} aria-label="Controlled sync" onValueChange={onValueChange}>
        <Slider.Track data-testid="sync-track" />
      </Slider>,
    );

    const thumb = screen.getByRole("slider", { name: "Controlled sync" });
    const fill = container.querySelector("span") as HTMLSpanElement;

    const initialFillWidth = fill.style.width;
    const initialThumbStart = thumb.style.insetInlineStart;
    // 200px track, 20px thumb (`half = 10px` = 5% of track): fill end = thumb center + 5%
    expect(Number.parseFloat(initialFillWidth) - Number.parseFloat(initialThumbStart)).toBeCloseTo(5, 5);

    fireEvent.pointerDown(thumb, { button: 0, pointerId: 7, clientX: 46, clientY: 10 });
    fireEvent.pointerMove(window, { pointerId: 7, clientX: 154, clientY: 10 });
    expect(onValueChange).toHaveBeenCalledWith(80);

    // Before parent updates `value`, fill MUST stay locked to thumb (not jump ahead to 80)
    expect(thumb.style.insetInlineStart).toBe(initialThumbStart);
    expect(fill.style.width).toBe(initialFillWidth);

    // Once parent commits `value={80}`, both thumb and fill advance together in the same commit
    rerender(
      <Slider value={80} min={0} max={100} step={1} aria-label="Controlled sync" onValueChange={onValueChange}>
        <Slider.Track data-testid="sync-track" />
      </Slider>,
    );
    expect(
      Number.parseFloat(fill.style.width) - Number.parseFloat(thumb.style.insetInlineStart),
    ).toBeCloseTo(5, 5);
    fireEvent.pointerUp(window, { pointerId: 7 });
  });
});
