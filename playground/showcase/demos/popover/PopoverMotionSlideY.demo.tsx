import gsap from "gsap";

import { Button } from "@/components/core/Button";
import { Popover } from "@/components/core/Popover";
import { Text } from "@/components/core/Text";

export function PopoverMotionSlideYDemo() {
  return (
    <Popover
      motion={{
        content: {
          enter: (ctx) =>
            gsap.fromTo(
              ctx.el,
              { y: 10, autoAlpha: 0 },
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.24,
                ease: "power2.out",
                overwrite: "auto",
                force3D: false,
              },
            ),
          leave: (ctx) =>
            gsap.to(ctx.el, {
              y: 8,
              autoAlpha: 0,
              duration: 0.16,
              overwrite: "auto",
              force3D: false,
            }),
        },
      }}
    >
      <Popover.Trigger asChild>
        <Button variant="primary" type="button">
          Slide y
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Body>
          <Text as="p" variant="small">
            Custom content factory instead of portalSurface.
          </Text>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
}
