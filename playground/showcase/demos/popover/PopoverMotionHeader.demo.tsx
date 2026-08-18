import { Button } from "@/components/core/Button";
import { Popover } from "@/components/core/Popover";
import { Text } from "@/components/core/Text";

export function PopoverMotionHeaderDemo() {
  return (
    <Popover
      motion={{
        header: {
          enter: (ctx) =>
            ctx.fromTo(
              { y: -8, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.26, delay: 0.04 },
            ),
          leave: { y: -4, autoAlpha: 0, duration: 0.14 },
        },
      }}
    >
      <Popover.Trigger asChild>
        <Button variant="outline" type="button">
          Header enter
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Header>
          <Popover.Title>Filters</Popover.Title>
          <Popover.Description>Header slides in after the panel.</Popover.Description>
        </Popover.Header>
        <Popover.Body>
          <Text as="p" variant="small">
            Title and body keep their own slots.
          </Text>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
}
