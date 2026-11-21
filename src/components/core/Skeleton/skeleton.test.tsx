import { describe, expect, it } from "vitest";

import { render } from "@/__tests__/helpers";

import { Skeleton } from ".";

describe("Skeleton Phase 2E fixes", () => {
  it("normalizes Skeleton.Circle data-size, publishes Skeleton.Region data-state, and guards Skeleton.Text lines", () => {
    const { container, rerender } = render(
      <Skeleton.Region busy aria-label="Loading card">
        <Skeleton.Circle />
        <Skeleton.Circle size="h-10 w-10" />
        <Skeleton.Text lines={0} />
        <Skeleton.Text lines={Number.NaN} />
      </Skeleton.Region>,
    );

    const region = container.firstElementChild as HTMLElement;
    expect(region).toHaveAttribute("data-state", "loading");
    const circles = region.querySelectorAll(".rounded-full");
    expect(circles[0]).toHaveAttribute("data-size", "base");
    expect(circles[1]).not.toHaveAttribute("data-size");

    rerender(
      <Skeleton.Region busy={false} aria-label="Loading card">
        <div>Loaded</div>
      </Skeleton.Region>,
    );
    expect(container.firstElementChild).toHaveAttribute("data-state", "idle");
  });
});
