import { useState } from "react";
import gsap from "gsap";

import { Avatar } from "@/components/core/Avatar";
import { Button } from "@/components/core/Button";
import { PIN_IMAGE2 } from "@/stories-utils/mockImages";

const TL = { overwrite: "auto" as const, force3D: false };

export function AvatarMotionImageScaleDemo() {
  const [play, setPlay] = useState(0);

  return (
    <div className="flex flex-col items-center gap-mid">
      <Avatar
        key={play}
        size="large"
        label="Alex Rivera"
        src={PIN_IMAGE2}
        alt=""
        motion={{
          image: {
            enter: (ctx) =>
              gsap.fromTo(
                ctx.el,
                { autoAlpha: 0, scale: 0.62 },
                { autoAlpha: 1, scale: 1, duration: 0.42, ease: "back.out(1.8)", ...TL },
              ),
            leave: "contentFade",
          },
        }}
      />
      <Button size="small" variant="outline" type="button" onClick={() => setPlay((n) => n + 1)}>
        Replay
      </Button>
    </div>
  );
}
