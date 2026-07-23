import { Button } from "@/components/core/Button";
import { Popover } from "@/components/core/Popover";
import { Text } from "@/components/core/Text";

const SIZES = ["small", "base", "mid", "large"] as const;

export function PopoverSizesDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2xlarge py-large">
      {SIZES.map((size) => (
        <Popover key={size} size={size} side="bottom">
          <Popover.Trigger asChild>
            <Button variant="outline" type="button" size={size} className="capitalize">
              {size}
            </Button>
          </Popover.Trigger>
          <Popover.Content showArrow>
            <Popover.Arrow />
            <Popover.Header>
              <Popover.Title>Size {size}</Popover.Title>
              <Popover.Description>
                Padding, type scale, and panel width for this size.
              </Popover.Description>
            </Popover.Header>
            <Popover.Body>
              <Text as="p" variant="small" className="text-muted">
                Body text follows the size preset; long lines wrap within max-w-component.
              </Text>
            </Popover.Body>
          </Popover.Content>
        </Popover>
      ))}
    </div>
  );
}
