import gsap from "gsap";
import { IoAlarmOutline, IoTimeOutline } from "react-icons/io5";

import { TimeField } from "@/components/core/TimeField";

const TL = { overwrite: "auto" as const, force3D: false };

export function TimeFieldMotionAffixWaveDemo() {
  return (
    <TimeField
      className="w-64"
      label="Affix wave"
      defaultValue="14:15"
      hint="Timeline: shell / prefix / suffix / segments via ctx.targets"
      prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
      suffix={<IoAlarmOutline className="icon-base shrink-0" aria-hidden />}
      motion={{
        shell: {
          hoverIn: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { y: -2, rotate: -0.8, duration: 0.22 }, 0);
            if (ctx.targets.prefix) {
              tl.to(ctx.targets.prefix, { rotate: -12, duration: 0.2 }, 0);
            }
            if (ctx.targets.segments) {
              tl.to(ctx.targets.segments, { x: 4, duration: 0.2 }, 0.04);
            }
            if (ctx.targets.suffix) {
              tl.to(ctx.targets.suffix, { rotate: 12, duration: 0.2 }, 0);
            }
            return tl;
          },
          hoverOut: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { y: 0, rotate: 0, duration: 0.18 }, 0);
            if (ctx.targets.prefix) {
              tl.to(ctx.targets.prefix, { rotate: 0, duration: 0.16 }, 0);
            }
            if (ctx.targets.segments) {
              tl.to(ctx.targets.segments, { x: 0, duration: 0.16 }, 0);
            }
            if (ctx.targets.suffix) {
              tl.to(ctx.targets.suffix, { rotate: 0, duration: 0.16 }, 0);
            }
            return tl;
          },
        },
      }}
    />
  );
}
