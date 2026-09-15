import { TextArea } from "@/components/core/TextArea";

export function TextAreaMotionResizePulseDemo() {
  return (
    <TextArea
      className="w-full max-w-md"
      label="Resize pulse"
      rows={3}
      placeholder="Hover the corner grip"
      hint="resizeHandle.hoverIn — scale pulse, height drag stays kit-internal"
      motion={{
        resizeHandle: {
          hoverIn: (ctx) =>
            ctx.to({
              scale: 1.35,
              rotate: 8,
              duration: 0.16,
              yoyo: true,
              repeat: 1,
              ease: "power2.inOut",
            }),
        },
      }}
    />
  );
}
