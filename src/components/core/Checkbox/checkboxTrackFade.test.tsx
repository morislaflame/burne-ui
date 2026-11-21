import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { gsap } from "@/components/core/utils/gsapMotion";
import { setReducedMotion } from "@/__tests__/helpers";

import { useCheckboxControlTrackAnimation } from "./checkboxAnimations";
import { CheckboxFieldProvider } from "./checkboxContext";
import type { CheckboxFieldContextValue } from "./checkboxTypes";

function Track() {
  const ref = useCheckboxControlTrackAnimation();
  return <span ref={ref} />;
}

function Harness({ disabled }: { disabled: boolean }) {
  return (
    <CheckboxFieldProvider value={{ isDisabled: disabled } as CheckboxFieldContextValue}>
      <Track />
    </CheckboxFieldProvider>
  );
}

afterEach(() => {
  setReducedMotion(true);
  vi.restoreAllMocks();
});

describe("useCheckboxControlTrackAnimation", () => {
  it("kills the disabled fade when the effect cleans up", () => {
    setReducedMotion(false);
    const kill = vi.fn();
    vi.spyOn(gsap, "fromTo").mockReturnValue({ kill } as unknown as gsap.core.Tween);

    const view = render(<Harness disabled={false} />);
    expect(gsap.fromTo).not.toHaveBeenCalled();

    view.rerender(<Harness disabled />);
    expect(gsap.fromTo).toHaveBeenCalledTimes(1);

    view.unmount();
    expect(kill).toHaveBeenCalledTimes(1);
  });
});
