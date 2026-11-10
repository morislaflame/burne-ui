import { TagsInput } from "@/components/core/TagsInput";

export function TagsInputSizesDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-small">
      <TagsInput size="small" label="Small" defaultValues={["design"]} placeholder="Add a tag" />
      <TagsInput size="base" label="Base" defaultValues={["design"]} placeholder="Add a tag" />
      <TagsInput size="mid" label="Mid" defaultValues={["design"]} placeholder="Add a tag" />
      <TagsInput size="large" label="Large" defaultValues={["design"]} placeholder="Add a tag" />
    </div>
  );
}
