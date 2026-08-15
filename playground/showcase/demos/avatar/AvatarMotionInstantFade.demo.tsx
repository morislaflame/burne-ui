import { useState } from "react";

import { Avatar } from "@/components/core/Avatar";
import { Button } from "@/components/core/Button";
import { PIN_IMAGE1 } from "@/stories-utils/mockImages";

export function AvatarMotionInstantFadeDemo() {
  const [play, setPlay] = useState(0);

  return (
    <div className="flex flex-col items-center gap-mid">
      <Avatar
        key={play}
        size="large"
        label="Jordan Doe"
        src={PIN_IMAGE1}
        alt=""
        motion={{ image: { enter: false, leave: false } }}
      />
      <Button size="small" variant="outline" type="button" onClick={() => setPlay((n) => n + 1)}>
        Replay
      </Button>
    </div>
  );
}
