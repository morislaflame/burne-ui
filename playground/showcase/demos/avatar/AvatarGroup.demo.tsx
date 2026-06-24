import { Avatar, AvatarGroup } from "@/components/core/Avatar";
import { PIN_IMAGE1, PIN_IMAGE2, PIN_IMAGE3 } from "@/utils/mockImages";

export function AvatarGroupDemo() {
  return (
    <AvatarGroup>
      <Avatar size="base" label="Один" src={PIN_IMAGE1} alt="" loading="lazy" />
      <Avatar size="base" label="Два" src={PIN_IMAGE2} alt="" loading="lazy" />
      <Avatar size="base" label="Три" src={PIN_IMAGE3} alt="" loading="lazy" />
      <Avatar size="base" label="Четыре" />
    </AvatarGroup>
  );
}
