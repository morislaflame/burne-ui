import { useState } from "react";
import {
  IoBookmarkOutline,
  IoHeartOutline,
  IoShareSocialOutline,
} from "react-icons/io5";

import { ToggleButton } from "@/components/core/ToggleButton";
import { Text } from "@/components/core/Text";

export function ToggleButtonReactionBarDemo() {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [shared, setShared] = useState(false);

  return (
    <div className="flex w-full max-w-sm flex-col gap-small rounded-mid border-token bg-secondary p-mid">
      <Text as="p" variant="small" className="text-muted">
        Статья · 4 мин
      </Text>
      <div className="flex flex-wrap gap-small">
        <ToggleButton
          pressed={liked}
          onPressedChange={setLiked}
          variant="outline"
          size="small"
          leftIcon={<IoHeartOutline aria-hidden />}
          className={liked ? "border-danger/40 bg-danger/10 text-danger" : ""}
        >
          {liked ? "В избранном" : "Нравится"}
        </ToggleButton>
        <ToggleButton
          pressed={bookmarked}
          onPressedChange={setBookmarked}
          variant="ghost"
          size="small"
          leftIcon={<IoBookmarkOutline aria-hidden />}
          className={bookmarked ? "text-warning" : "text-muted"}
        >
          Сохранить
        </ToggleButton>
        <ToggleButton
          pressed={shared}
          onPressedChange={setShared}
          variant="ghost"
          size="small"
          leftIcon={<IoShareSocialOutline aria-hidden />}
        >
          Поделиться
        </ToggleButton>
      </div>
    </div>
  );
}
