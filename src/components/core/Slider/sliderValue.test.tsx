import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { render } from "@/__tests__/helpers";

import { Slider } from ".";

describe("Slider.Value", () => {
  it("shows the value from root state without a track", () => {
    const ref = createRef<HTMLElement>();
    const { getByText } = render(
      <Slider defaultValue={40} label="Volume">
        <Slider.Header>
          <Slider.Value ref={ref} />
        </Slider.Header>
      </Slider>,
    );

    expect(getByText("40")).toBeTruthy();
    expect(ref.current?.textContent).toBe("40");
  });

  it("shows a range label without a track", () => {
    const { getByText } = render(
      <Slider range defaultValue={[10, 80]} label="Window">
        <Slider.Value />
      </Slider>,
    );

    expect(getByText("10 — 80")).toBeTruthy();
  });
});
