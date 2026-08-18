import { IoBookmarkOutline } from "react-icons/io5";

import { ToggleButton } from "@/components/core/ToggleButton";

export function ToggleButtonMotionIconSpinDemo() {
  return (
    <ToggleButton variant="outline">
      <ToggleButton.IconStart
        motion={{
          check: (ctx) =>
            ctx.fromTo(
              { rotation: -90, scale: 0.6 },
              { rotation: 0, scale: 1, duration: 0.4, ease: "back.out(2.1)" },
            ),
          uncheck: (ctx) =>
            ctx.to({ rotation: 90, scale: 0.7, duration: 0.18, ease: "power2.in" }),
        }}
      >
        <IoBookmarkOutline aria-hidden />
      </ToggleButton.IconStart>
      <ToggleButton.Text>Icon spin</ToggleButton.Text>
    </ToggleButton>
  );
}
