import { render } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { gsap } from "@/components/core/utils/gsapMotion";
import { setReducedMotion } from "@/__tests__/helpers";

import { usePaginationFlip } from "./paginationAnimations";

function Pages({ keys }: { keys: string[] }) {
  const ref = useRef<HTMLOListElement>(null);
  usePaginationFlip(ref, { page: 1, children: keys.join(",") });
  return (
    <ol ref={ref}>
      {keys.map((key) => (
        <li key={key} data-flip-key={key} />
      ))}
    </ol>
  );
}

afterEach(() => {
  setReducedMotion(true);
  vi.restoreAllMocks();
});

describe("usePaginationFlip", () => {
  it("kills the page tween when the list effect cleans up", () => {
    setReducedMotion(false);
    const kill = vi.fn();
    vi.spyOn(gsap, "fromTo").mockReturnValue({ kill } as unknown as gsap.core.Tween);

    const view = render(<Pages keys={["a"]} />);
    expect(gsap.fromTo).not.toHaveBeenCalled();

    view.rerender(<Pages keys={["b"]} />);
    expect(gsap.fromTo).toHaveBeenCalledTimes(1);

    view.unmount();
    expect(kill).toHaveBeenCalledTimes(1);
  });

  it("clears interrupted opacity/scale/transform before measuring the next FLIP snapshot", () => {
    setReducedMotion(false);
    const view = render(<Pages keys={["a"]} />);

    view.rerender(<Pages keys={["a", "b"]} />);
    const itemB = view.container.querySelector('[data-flip-key="b"]') as HTMLElement;
    gsap.set(itemB, { opacity: 0.35, scale: 0.85 });
    expect(itemB.style.opacity).toBe("0.35");

    // Rapid next click where "b" stays in place (prev exists, dx === 0)
    view.rerender(<Pages keys={["b", "c"]} />);
    expect(itemB.style.opacity).toBe("");
    expect(Number(gsap.getProperty(itemB, "scale"))).toBe(1);
  });
});
