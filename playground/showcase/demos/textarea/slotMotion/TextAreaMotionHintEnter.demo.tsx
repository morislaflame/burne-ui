import { TextArea } from "@/components/core/TextArea";

export function TextAreaMotionHintEnterDemo() {
  return (
    <TextArea
      className="w-80"
      label="Release notes"
      hint="Markdown is supported."
      error="Keep it under 500 characters."
      rows={3}
      defaultValue=""
      motion={{
        label: {
          enter: (ctx) =>
            ctx.fromTo({ y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.26 }),
        },
        hint: {
          enter: (ctx) =>
            ctx.fromTo(
              { y: 8, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.28, delay: 0.06 },
            ),
        },
        error: {
          enter: (ctx) =>
            ctx.fromTo(
              { y: 8, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.28, delay: 0.1 },
            ),
        },
      }}
    />
  );
}
