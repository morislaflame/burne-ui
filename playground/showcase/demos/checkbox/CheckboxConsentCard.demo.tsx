import { useId, useState } from "react";
import { IoStar } from "react-icons/io5";

import { Checkbox } from "@/components/core/Checkbox";
import { Text } from "@/components/core/Text";

export function CheckboxConsentCardDemo() {
  const [favorite, setFavorite] = useState(false);
  const inputId = useId();

  return (
    <label
      htmlFor={inputId}
      className="block w-full max-w-sm cursor-pointer rounded-mid border-token bg-secondary p-mid"
    >
      <Checkbox
        id={inputId}
        checked={favorite}
        onChange={(e) => setFavorite(e.target.checked)}
        className="w-full gap-x-mid gap-y-xsmall"
      >
        <Checkbox.Control>
          <Checkbox.Indicator className="rounded-mid">
            <IoStar aria-hidden className="size-full text-primary-foreground" />
          </Checkbox.Indicator>
        </Checkbox.Control>
        <div id={`${inputId}-label`} className="min-w-0 flex flex-col gap-xsmall">
          <Text as="p" variant="base" className="font-medium">
            Button · Primary
          </Text>
          <Text as="p" variant="small" className="text-muted">
            Весь блок кликабелен.
          </Text>
        </div>
      </Checkbox>
    </label>
  );
}
