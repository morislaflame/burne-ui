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
            ctx.to(ctx.targets.title, {
              x: 8,
              repeat: -1,
              yoyo: true,
              duration: 0.35,
              ease: "sine.inOut",
            }),
          hoverOut: (ctx) => {
            if (!ctx.targets.title) return undefined;
            killMotion(ctx.targets.title);
            return ctx.to(ctx.targets.title, { x: 0, duration: 0 });
          },
        },
      }}
    />
  );
}
