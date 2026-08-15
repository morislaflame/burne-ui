import gsap from "gsap";

import { Alert } from "@/components/core/Alert";
import { killMotion } from "@/components/core/utils/gsapMotion";

export function AlertMotionOrchestratedDemo() {
  return (
    <Alert
      status="warning"
      title="Orchestrated title"
      description="Hover the banner — the title yoyos until you leave."
      motion={{
        root: {
          hoverIn: (ctx) =>
            gsap.to(ctx.targets.title, {
              x: 8,
              repeat: -1,
              yoyo: true,
              duration: 0.35,
              ease: "sine.inOut",
              overwrite: "auto",
              force3D: false,
            }),
          hoverOut: (ctx) => {
            killMotion(ctx.targets.title);
            gsap.set(ctx.targets.title, { x: 0 });
          },
        },
      }}
    />
  );
}
