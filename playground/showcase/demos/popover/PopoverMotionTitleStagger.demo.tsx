import gsap from "gsap";

import { Button } from "@/components/core/Button";
import { Popover } from "@/components/core/Popover";
import { Text } from "@/components/core/Text";

export function PopoverMotionTitleStaggerDemo() {
  return (
    <Popover
      motion={{
        title: {
          enter: (ctx) =>
            gsap.fromTo(
              ctx.el,
              { y: 8, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.28, delay: 0.06, force3D: false },
            ),
          leave: (ctx) => gsap.to(ctx.el, { y: -6, autoAlpha: 0, duration: 0.16, force3D: false }),
        },
        description: {
          enter: (ctx) =>
            gsap.fromTo(
              ctx.el,
              { y: 8, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.28, delay: 0.12, force3D: false },
            ),
          leave: (ctx) => gsap.to(ctx.el, { autoAlpha: 0, duration: 0.14 }),
        },
      }}
    >
      <Popover.Trigger asChild>
        <Button variant="outline" type="button">
          Stagger title
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Header>
          <Popover.Title>Filters</Popover.Title>
          <Popover.Description>Title and description enter after the panel.</Popover.Description>
        </Popover.Header>
        <Popover.Body>
          <Text as="p" variant="small">
            Content keeps the kit portalSurface recipe.
          </Text>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
}
