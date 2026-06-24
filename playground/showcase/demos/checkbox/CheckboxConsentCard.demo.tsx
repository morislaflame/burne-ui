import { useState } from "react";
import { IoStar } from "react-icons/io5";

import { Checkbox } from "@/components/core/Checkbox";
import { Text } from "@/components/core/Text";

export function CheckboxConsentCardDemo() {
  const [favorite, setFavorite] = useState(false);

  return (
    <div className="flex w-full max-w-sm items-start gap-mid rounded-mid border-token bg-secondary p-mid">
      <Checkbox checked={favorite} onChange={(e) => setFavorite(e.target.checked)} aria-label="В избранное">
        <Checkbox.Control>
          <Checkbox.Indicator className="rounded-mid">
            <IoStar aria-hidden className="size-full text-primary-foreground" />
          </Checkbox.Indicator>
        </Checkbox.Control>
      </Checkbox>
      <div className="min-w-0">
        <Text as="p" variant="base" className="font-medium">
          Button · Primary
        </Text>
        <Text as="p" variant="small" className="text-muted">
          Звезда в индикаторе с rounded-mid.
        </Text>
      </div>
    </div>
  );
}
