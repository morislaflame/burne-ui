import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { gsap } from "@/components/core/utils/gsapMotion";
import { setReducedMotion } from "@/__tests__/helpers";

import { useRadioControlTrackAnimation } from "./radioAnimations";
import { RadioFieldProvider } from "./radioContext";
import type { RadioFieldContextValue } from "./radioTypes";

function Track() {
  const ref = useRadioControlTrackAnimation();
  return <span ref={ref} />;
}

function Harness({ disabled }: { disabled: boolean }) {
  return (
    <RadioFieldProvider value={{ isDisabled: disabled } as RadioFieldContextValue}>
      <Track />
    </RadioFieldProvider>
  );
}

afterEach(() => {
  setReducedMotion(true);
  vi.restoreAllMocks();
});

describe("useRadioControlTrackAnimation", () => {
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
