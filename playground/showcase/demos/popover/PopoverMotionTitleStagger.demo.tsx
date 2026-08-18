import { Button } from "@/components/core/Button";
import { Popover } from "@/components/core/Popover";
import { Text } from "@/components/core/Text";

export function PopoverMotionTitleStaggerDemo() {
  return (
    <Popover
      motion={{
        title: {
          enter: (ctx) =>
            ctx.fromTo(
              { y: 8, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.28, delay: 0.06 },
            ),
          leave: { y: -6, autoAlpha: 0, duration: 0.16 },
        },
        description: {
          enter: (ctx) =>
            ctx.fromTo(
              { y: 8, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.28, delay: 0.12 },
            ),
          leave: { autoAlpha: 0, duration: 0.14 },
        },
        arrow: {
          enter: (ctx) =>
            ctx.fromTo(
              { scale: 0.6, autoAlpha: 0 },
              { scale: 1, autoAlpha: 1, duration: 0.22, delay: 0.04 },
            ),
          leave: { scale: 0.8, autoAlpha: 0, duration: 0.12 },
        },
      }}
    >
      <Popover.Trigger asChild>
        <Button variant="outline" type="button">
          Stagger title
        </Button>
      </Popover.Trigger>
      <Popover.Content showArrow>
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
