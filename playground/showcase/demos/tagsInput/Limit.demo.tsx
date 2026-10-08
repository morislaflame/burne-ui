import { TagsInput } from "@/components/core/TagsInput";

export function TagsInputLimitDemo() {
  return (
    <TagsInput
      className="max-w-xs"
      label="Topics"
      hint="Three chips, then the field stops."
      max={3}
      defaultValues={["design", "react"]}
      placeholder="Add a tag"
    />
  );
}
