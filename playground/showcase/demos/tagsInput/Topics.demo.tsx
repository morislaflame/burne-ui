import { useState } from "react";

import { TagsInput } from "@/components/core/TagsInput";

export function TagsInputTopicsDemo() {
  const [values, setValues] = useState(["design"]);

  return (
    <TagsInput
      className="max-w-xs"
      label="Topics"
      hint="Enter or a comma. Backspace removes the last chip."
      placeholder="Add a tag"
      values={values}
      onValuesChange={setValues}
    />
  );
}
