import { Avatar } from "@/components/core/Avatar";
import { Text } from "@/components/core/Text";
import { PIN_IMAGE1, PIN_IMAGE2, PIN_IMAGE3 } from "@/stories-utils/mockImages";

export function AvatarProjectMembersDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-mid">
      <Text as="p" variant="small" className="font-medium">
        Project participants
      </Text>
      <div className="flex items-center gap-mid">
        <Avatar.Group>
          <Avatar size="base" label="Kate" src={PIN_IMAGE1} alt="" loading="lazy" />
          <Avatar size="base" label="John" src={PIN_IMAGE2} alt="" loading="lazy" />
          <Avatar size="base" label="Sara" src={PIN_IMAGE3} alt="" loading="lazy" />
          <Avatar size="base" label="+2" />
        </Avatar.Group>
        <Text as="span" variant="xsmall" className="text-muted">
          5 participants
        </Text>
      </div>
    </div>
  );
}
