import { IoCheckmark, IoEllipse } from "react-icons/io5";

import { SelectionThumb } from "@/components/core/SelectionThumb";
import { Text } from "@/components/core/Text";

export function SelectionIndicatorThumbGalleryDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-large">
      <Text as="p" variant="small" className="font-medium">
        SelectionThumb
      </Text>
      <div className="flex flex-wrap items-center gap-2xlarge">
        <div className="selection-indicator-base flex items-center justify-center">
          <SelectionThumb size="base">
            <SelectionThumb.Icon size="base">
              <IoCheckmark aria-hidden />
            </SelectionThumb.Icon>
          </SelectionThumb>
        </div>
        <div className="selection-indicator-mid flex items-center justify-center">
          <SelectionThumb size="mid" gloss>
            <SelectionThumb.Icon size="mid" gloss>
              <IoEllipse aria-hidden />
            </SelectionThumb.Icon>
          </SelectionThumb>
        </div>
      </div>
    </div>
  );
}
