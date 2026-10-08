import { TagsInput } from "@/components/core/TagsInput";

const slots = ["tag", "input", "label", "hint", "error"] as const;

export function TagsInputMotionAppearDemo() {
  return (
    <TagsInput
      className="max-w-xs"
      label="Topics"
      hint="Enter or a comma"
      error="Add a topic"
      defaultValues={["design", "react"]}
      placeholder="Add a tag"
      motion={{
        shell: {
          enter: (ctx) => {
            const tl = ctx.timeline();
            let at = 0;
            tl.fromTo(ctx.el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.28 }, at);
            at += 0.08;
            for (const slot of slots) {
              for (const el of ctx.getTargets(slot)) {
                tl.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.24 }, at);
                at += 0.05;
              }
            }
            return tl;
          },
        },
      }}
    />
  );
}
