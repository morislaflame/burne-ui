import { Avatar } from "@/components/core/Avatar";
import { PIN_IMAGE1, PIN_IMAGE2, PIN_IMAGE3 } from "@/stories-utils/mockImages";

export function AvatarGroupDemo() {
  return (
    <Avatar.Group>
      <Avatar size="base" label="One" src={PIN_IMAGE1} alt="" loading="lazy" />
      <Avatar size="base" label="Two" src={PIN_IMAGE2} alt="" loading="lazy" />
      <Avatar size="base" label="Three" src={PIN_IMAGE3} alt="" loading="lazy" />
      <Avatar size="base" label="Four" />
    </Avatar.Group>
  );
}
