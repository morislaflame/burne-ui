import { useState } from "react";
import { IoBookmarkOutline, IoHeart, IoHeartOutline, IoShareSocialOutline } from "react-icons/io5";

import { ToggleButton } from "@/components/core/ToggleButton";
import { Text } from "@/components/core/Text";
import { Button } from "@/index";

export function ToggleButtonReactionBarDemo() {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="flex max-w-sm flex-col gap-plus rounded-mid border-token bg-surface p-mid">
      <div className="flex flex-col gap-small">
        <Text as="p" variant="base" className="font-medium">
          How to create a new project
        </Text>
        <Text as="p" variant="small" className="text-muted">
          Article · 4 min
        </Text>
      </div>
      <div className="flex flex-wrap gap-small">
        <ToggleButton
          pressed={liked}
          onPressedChange={setLiked}
          variant="outline"
          size="small"
          icon={liked ? <IoHeart aria-hidden /> : <IoHeartOutline aria-hidden />}
          fillColor="bg-danger"
          className={liked ? "text-danger-foreground" : ""}
        >
          Like
        </ToggleButton>
        <ToggleButton
          pressed={bookmarked}
          onPressedChange={setBookmarked}
          variant="ghost"
          size="small"
          icon={<IoBookmarkOutline aria-hidden />}
        >
          Save
        </ToggleButton>
        <Button
          variant="ghost"
          size="small"
          icon={<IoShareSocialOutline aria-hidden />}
        >
          Share
        </Button>
      </div>
    </div>
  );
}
