import gsap from "gsap";
import { IoBookmarkOutline } from "react-icons/io5";

import { ToggleButton } from "@/components/core/ToggleButton";

const TL = { overwrite: "auto" as const, force3D: false };

export function ToggleButtonMotionIconSpinDemo() {
  return (
    <ToggleButton variant="outline">
      <ToggleButton.IconStart
        motion={{
          check: (ctx) =>
            gsap.fromTo(
              ctx.el,
              { rotation: -90, scale: 0.6 },
              { rotation: 0, scale: 1, duration: 0.4, ease: "back.out(2.1)", ...TL },
            ),
          uncheck: (ctx) =>
            gsap.to(ctx.el, { rotation: 90, scale: 0.7, duration: 0.18, ease: "power2.in", ...TL }),
        }}
      >
        <IoBookmarkOutline aria-hidden />
      </ToggleButton.IconStart>
      <ToggleButton.Text>Icon spin</ToggleButton.Text>
    </ToggleButton>
  );
}
