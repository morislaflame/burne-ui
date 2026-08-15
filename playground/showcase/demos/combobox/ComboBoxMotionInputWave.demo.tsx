import gsap from "gsap";

import { ComboBox } from "@/components/core/ComboBox";

const TL = { overwrite: "auto" as const, force3D: false };

const options = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

export function ComboBoxMotionInputWaveDemo() {
  return (
    <ComboBox
      className="w-64"
      label="Input wave"
      options={options}
      defaultValue="svelte"
      hint="Timeline: inputGroup / input / trigger via ctx.targets"
      motion={{
        inputGroup: {
          hoverIn: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { rotate: -1.2, y: -2, duration: 0.22 }, 0);
            if (ctx.targets.input) {
              tl.to(ctx.targets.input, { x: 5, duration: 0.2 }, 0.04);
            }
            if (ctx.targets.trigger) {
              tl.to(ctx.targets.trigger, { rotate: 18, duration: 0.22 }, 0);
            }
            return tl;
          },
          hoverOut: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { rotate: 0, y: 0, duration: 0.18 }, 0);
            if (ctx.targets.input) {
              tl.to(ctx.targets.input, { x: 0, duration: 0.16 }, 0);
            }
            if (ctx.targets.trigger) {
              tl.to(ctx.targets.trigger, { rotate: 0, duration: 0.18 }, 0);
            }
            return tl;
          },
        },
      }}
    />
  );
}
