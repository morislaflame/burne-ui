import { Avatar } from "@/components/core/Avatar";
import { PIN_IMAGE1 } from "@/stories-utils/mockImages";

export function AvatarMotionInstantFadeDemo() {
  return (
    <Avatar
      size="large"
      label="Jordan Doe"
      src={PIN_IMAGE1}
      alt=""
      motion={{ image: { enter: false, leave: false } }}
    />
  );
}
