import { Avatar } from "@/components/core/Avatar";
import { PIN_IMAGE2 } from "@/stories-utils/mockImages";

export function AvatarMotionImageScaleDemo() {
  return (
    <Avatar
      size="large"
      label="Alex Rivera"
      src={PIN_IMAGE2}
      alt=""
      motion={{
        image: {
          enter: (ctx) =>
            ctx.fromTo(
              { autoAlpha: 0, scale: 0.62 },
              { autoAlpha: 1, scale: 1, duration: 0.42, ease: "back.out(1.8)" },
            ),
          leave: "contentFade",
        },
      }}
    />
  );
}
