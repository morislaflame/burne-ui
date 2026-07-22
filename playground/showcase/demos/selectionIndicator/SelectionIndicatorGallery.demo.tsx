import { useState } from "react";
import { IoCheckmark } from "react-icons/io5";

import { Checkbox } from "@/components/core/Checkbox";
import { SelectionIndicator } from "@/components/core/SelectionIndicator";
import { SelectionThumb } from "@/components/core/SelectionThumb";
import { Text } from "@/components/core/Text";

import { SELECTION_INDICATOR_SIZES } from "../../shared/constants";

export function SelectionIndicatorGalleryDemo() {
  const [selected, setSelected] = useState(true);

  return (
    <div className="flex flex-col gap-mid">
      <Checkbox
        checked={selected}
        onChange={(e) => setSelected(e.target.checked)}
        label="Selected (for all indicators below)"
      />
      <div className="flex flex-wrap items-end gap-mid">
        {SELECTION_INDICATOR_SIZES.map((size) => (
          <div key={size} className="flex flex-col items-center gap-xsmall">
            <SelectionIndicator size={size} variant="default" selected={selected} />
            <Text as="span" variant="tools" className="text-muted">
              {size}
            </Text>
          </div>
        ))}
        <div className="flex flex-col items-center gap-xsmall">
          <SelectionIndicator size="base" variant="default" selected={selected} check />
          <Text as="span" variant="tools" className="text-muted">
            check
          </Text>
        </div>
        <div className="flex flex-col items-center gap-xsmall">
          <SelectionIndicator size="base" variant="outline" selected={selected} check />
          <Text as="span" variant="tools" className="text-muted">
            outline
          </Text>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-mid">
        <Text as="span" variant="small" className="text-muted">
          SelectionThumb:
        </Text>
        <div className="selection-indicator-base flex items-center justify-center">
          <SelectionThumb active={selected}>
            <SelectionThumb.Icon size="base">
              <IoCheckmark aria-hidden />
            </SelectionThumb.Icon>
          </SelectionThumb>
        </div>
        <div className="selection-indicator-mid flex items-center justify-center">
          <SelectionThumb active={!selected} />
        </div>
      </div>
    </div>
  );
}
