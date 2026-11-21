import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { render } from "@/__tests__/helpers";

import { Meter } from ".";

describe("Meter Phase 2E fixes", () => {
  it("applies semantic status fill and connects compound Meter.Label via aria-labelledby", () => {
    render(
      <Meter status="warning">
        <Meter.Header>
          <Meter.Label>CPU</Meter.Label>
        </Meter.Header>
        <Meter.Track value={80} />
      </Meter>,
    );
    const meter = screen.getByRole("meter", { name: "CPU" });
    expect(meter).toHaveAttribute("aria-labelledby");
    expect(meter).toHaveAttribute("data-status", "warning");
    expect(meter).not.toHaveAttribute("status");
    expect(meter.querySelector("span")?.className).toContain("bg-warning");
  });

  it("guards NaN, Infinity, and min >= max, and merges user style with thickness", () => {
    render(
      <Meter.Track
        value={Number.POSITIVE_INFINITY}
        min={Number.NaN}
        max={Number.POSITIVE_INFINITY}
        thickness={10}
        style={{ opacity: 0.5 }}
      />,
    );
    const meter = screen.getByRole("meter");
    expect(meter).toHaveAttribute("aria-valuenow", "100");
    expect(meter).toHaveAttribute("aria-valuemin", "0");
    expect(meter).toHaveAttribute("aria-valuemax", "100");
    expect(meter.style.height).toBe("10px");
    expect(meter.style.opacity).toBe("0.5");
  });
});
