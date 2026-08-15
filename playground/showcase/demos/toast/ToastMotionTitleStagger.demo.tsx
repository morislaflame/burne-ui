import gsap from "gsap";

import { Button } from "@/components/core/Button";
import { useToast } from "@/components/core/Toast";

export function ToastMotionTitleStaggerDemo() {
  const { toast } = useToast();

  return (
    <Button
      variant="outline"
      type="button"
      onClick={() =>
        toast.show({
          title: "Staggered title",
          description: "Title enters after the card. Leave returns a tween.",
          timeout: 4000,
          motion: {
            title: {
              enter: (ctx) =>
                gsap.fromTo(
                  ctx.el,
                  { y: 12, autoAlpha: 0 },
                  { y: 0, autoAlpha: 1, duration: 0.35, delay: 0.08 },
                ),
              leave: (ctx) => gsap.to(ctx.el, { y: -8, autoAlpha: 0, duration: 0.16 }),
            },
          },
        })
      }
    >
      Title stagger
    </Button>
  );
}
