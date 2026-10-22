import { Disclosure } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";

export function DisclosureMotionBodyDemo() {
  return (
    <Disclosure
      className="max-w-lg"
      motion={{
        content: {
          enter: (ctx) =>
            ctx.fromTo(
              { y: 8, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.28, delay: "expand" },
            ),
          leave: { y: 6, autoAlpha: 0, duration: 0.16 },
        },
      }}
    >
      <Disclosure.Trigger>Content slot</Disclosure.Trigger>
      <Disclosure.Content>
        <Text as="p" textStyle="small" className="text-muted">
          `delay: "expand"` starts `motion.content` after collapsibleHeight.
        </Text>
      </Disclosure.Content>
    </Disclosure>
  );
}
