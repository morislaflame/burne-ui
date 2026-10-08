import { TagsInput } from "@/components/core/TagsInput";

export function TagsInputClassNamesDemo() {
  return (
    <TagsInput
      className="max-w-xs"
      label="Topics"
      defaultValues={["design", "react"]}
      placeholder="Add a tag"
      classNames={{
        shell: "border-token-primary",
        tag: "bg-primary-tint text-primary",
        input: "text-primary",
      }}
    />
  );
}
