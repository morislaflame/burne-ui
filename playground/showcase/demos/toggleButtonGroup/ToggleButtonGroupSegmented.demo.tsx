import { useState } from "react";

import { ToggleButtonGroup } from "@/components/composite/ToggleButtonGroup";
import { ToggleButton } from "@/components/core/ToggleButton";

export function ToggleButtonGroupSegmentedDemo() {
  const [tags, setTags] = useState<string[]>(["design"]);

  return (
    <ToggleButtonGroup
      segmented
      selectionMode="multiple"
      aria-label="Tags"
      values={tags}
      onValuesChange={setTags}
    >
      <ToggleButton value="design">Design</ToggleButton>
      <ToggleButton value="dev">Dev</ToggleButton>
      <ToggleButton value="qa">QA</ToggleButton>
    </ToggleButtonGroup>
  );
}
