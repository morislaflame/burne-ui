import gsap from "gsap";

import { Button } from "@/components/core/Button";
import { useToast } from "@/components/core/Toast";

export function ToastMotionBounceDemo() {
  const { toast } = useToast();

  return (
    <Button
      variant="primary"
      type="button"
      onClick={() =>
        toast.show({
          title: "Bounce",
          description: "root factory — back.out in, fade out on leave.",
          timeout: 4000,
          motion: {
            root: {
              enter: (ctx) =>
                gsap.fromTo(
                  ctx.el,
                  { y: 28, scale: 0.92, autoAlpha: 0 },
                  {
                    y: 0,
                    scale: 1,
                    autoAlpha: 1,
                    duration: 0.5,
                    ease: "back.out(1.4)",
                    overwrite: "auto",
                    force3D: false,
                  },
                ),
              leave: (ctx) =>
                gsap.to(ctx.el, {
                  y: 24,
                  scale: 0.94,
                  autoAlpha: 0,
                  duration: 0.22,
                  ease: "power2.in",
                  overwrite: "auto",
                  force3D: false,
                }),
            },
          },
        })
      }
    >
      Bounce toast
    </Button>
  );
}
