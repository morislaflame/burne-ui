import { useState } from "react";
import { IoCheckmark, IoEllipse } from "react-icons/io5";

import { SelectionThumb } from "@/components/core/SelectionThumb";
import { Text } from "@/components/core/Text";

export function SelectionIndicatorThumbGalleryDemo() {
  const [active, setActive] = useState(true);

  return (
    <div className="flex w-full max-w-md flex-col gap-large">
      <Text as="p" variant="small" className="font-medium">
        SelectionThumb
      </Text>
      <div className="flex flex-wrap items-center gap-2xlarge">
        <div className="selection-indicator-base flex items-center justify-center">
          <SelectionThumb active={active}>
            <SelectionThumb.Icon size="base">
              <IoCheckmark aria-hidden />
            </SelectionThumb.Icon>
          </SelectionThumb>
        </div>
        <div className="selection-indicator-mid flex items-center justify-center">
          <SelectionThumb active={!active} className="rounded-mid">
            <SelectionThumb.Icon size="mid">
              <IoEllipse aria-hidden />
            </SelectionThumb.Icon>
          </SelectionThumb>
        </div>
      </div>
      <label className="flex cursor-pointer items-center gap-small text-sm">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          className="size-4"
        />
        Active
      </label>
    </div>
  );
}
