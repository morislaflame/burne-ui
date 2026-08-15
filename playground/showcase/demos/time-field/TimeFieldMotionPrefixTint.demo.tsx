import gsap from "gsap";
import { IoAlarmOutline, IoTimeOutline } from "react-icons/io5";

import { TimeField } from "@/components/core/TimeField";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

const TL = { overwrite: "auto" as const, force3D: false };

export function TimeFieldMotionPrefixTintDemo() {
  return (
    <TimeField
      className="w-64"
      defaultValue="18:45"
      motion={{
        prefix: {
          hoverIn: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { scale: 1.12, duration: 0.18 }, 0);
            tweenCssColor(ctx.el, "var(--color-primary)");
            return tl;
          },
          hoverOut: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { scale: 1, duration: 0.16 }, 0);
            tweenCssColor(ctx.el, "var(--color-foreground)", { clearOnComplete: true });
            return tl;
          },
        },
        suffix: {
          hoverIn: (ctx) =>
            gsap.to(ctx.el, { rotate: 18, duration: 0.18, ease: "back.out(1.6)", ...TL }),
          hoverOut: (ctx) =>
            gsap.to(ctx.el, { rotate: 0, duration: 0.16, ease: "power2.inOut", ...TL }),
        },
      }}
    >
      <TimeField.Label>Prefix tint</TimeField.Label>
      <TimeField.Control
        prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
        suffix={<IoAlarmOutline className="icon-base shrink-0" aria-hidden />}
        motion={{
          pressIn: (ctx) =>
            gsap.to(ctx.el, { rotate: -1.4, duration: 0.16, ease: "back.out(1.8)", ...TL }),
          pressOut: (ctx) =>
            gsap.to(ctx.el, { rotate: 0, duration: 0.18, ease: "power2.inOut", ...TL }),
        }}
      />
      <TimeField.Hint>Compound Control press + prefix/suffix slot factories</TimeField.Hint>
    </TimeField>
  );
}
