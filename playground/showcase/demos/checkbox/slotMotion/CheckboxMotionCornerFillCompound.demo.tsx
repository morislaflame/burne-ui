import gsap from "gsap";

import { Checkbox } from "@/components/core/Checkbox";

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

export function CheckboxMotionCornerFillCompoundDemo() {
  return (
    <Checkbox defaultChecked>
      <Checkbox.Control>
        <Checkbox.Indicator>
          <Checkbox.Indicator.Fill
            motion={{
              check: (ctx) => fillFromTopRightCheck(ctx.el),
              uncheck: (ctx) => fillFromTopRightUncheck(ctx.el),
            }}
          />
          <Checkbox.Indicator.Mark />
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.Content>
        <Checkbox.Label>Custom fill (compound)</Checkbox.Label>
        <Checkbox.Hint>motion on Checkbox.Indicator.Fill — same corner origin.</Checkbox.Hint>
      </Checkbox.Content>
    </Checkbox>
  );
}
