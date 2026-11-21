import { TagsInput } from "@/components/core/TagsInput";

export function TagsInputMotionNudgeDemo() {
  return (
    <TagsInput
      className="max-w-xs"
      label="Topics"
      defaultValues={["design", "react"]}
      placeholder="Add a tag"
      motion={{
        tag: {
          hoverIn: (ctx) => ctx.fromRest({ y: -4, yoyo: true, repeat: 1, duration: 0.2 }),
          hoverOut: false,
        },
      }}
    />
  );
}
