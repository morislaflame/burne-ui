import { TagsInput } from "@/components/core/TagsInput";

export function TagsInputCompoundDemo() {
  return (
    <TagsInput className="max-w-xs" defaultValues={["design"]}>
      <TagsInput.Label>Topics</TagsInput.Label>
      <TagsInput.Control />
      <TagsInput.Hint>Label, control, and hint in this order.</TagsInput.Hint>
    </TagsInput>
  );
}
