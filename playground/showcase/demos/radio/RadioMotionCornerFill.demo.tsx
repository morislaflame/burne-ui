import gsap from "gsap";

import { Radio } from "@/components/core/Radio";

const FILL_CORNER = "top right";

function fillFromTopRightCheck(el: HTMLElement) {
  return gsap.fromTo(
    el,
    { scale: 0, autoAlpha: 0, transformOrigin: FILL_CORNER },
    {
      scale: 1,
      autoAlpha: 1,
      duration: 0.4,
      ease: "power3.out",
      transformOrigin: FILL_CORNER,
      overwrite: "auto",
      force3D: false,
    },
  );
}

function fillFromTopRightUncheck(el: HTMLElement) {
  return gsap.to(el, {
    scale: 0,
    autoAlpha: 0,
    duration: 0.22,
    ease: "power2.in",
    transformOrigin: FILL_CORNER,
    overwrite: "auto",
    force3D: false,
  });
}

export function RadioMotionCornerFillDemo() {
  return (
    <Radio
      name="radio-motion-fill"
      value="a"
      defaultChecked
      label="Custom fill (simple)"
      hint="Fill grows in from the top-right corner."
      motion={{
        indicatorFill: {
          check: (ctx) => fillFromTopRightCheck(ctx.el),
          uncheck: (ctx) => fillFromTopRightUncheck(ctx.el),
        },
      }}
    />
  );
}
