import gsap from "gsap";

import { Input } from "@/components/core/Input";

const TL = { overwrite: "auto" as const, force3D: false };

export function InputMotionFileRowExitDemo() {
  return (
    <Input
      className="w-full max-w-sm"
      inputType="file"
      label="File leave"
      placeholder="Pick a file, then remove it"
      hint="Custom fileRow.leave factory — rotate + slide"
      motion={{
        fileRow: {
          leave: (ctx) =>
            gsap.to(ctx.el, {
              rotate: -10,
              x: 28,
              y: -6,
              scale: 0.82,
              autoAlpha: 0,
              duration: 0.34,
              ease: "power2.in",
              ...TL,
            }),
        },
      }}
    />
  );
}
