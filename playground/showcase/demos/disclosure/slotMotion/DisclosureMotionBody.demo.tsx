import { Disclosure } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";

export function DisclosureMotionBodyDemo() {
  return (
    <Disclosure
      className="max-w-lg"
      motion={{
        body: {
          enter: (ctx) =>
            ctx.fromTo(
              { y: 8, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.28, delay: "expand" },
            ),
          leave: { y: 6, autoAlpha: 0, duration: 0.16 },
        },
      }}
    >
      <Disclosure.Trigger>Body slot</Disclosure.Trigger>
      <Disclosure.Content>
        <Text as="p" variant="small" className="text-muted">
          `delay: "expand"` starts `motion.body` after collapsibleHeight.
        </Text>
      </Disclosure.Content>
    </Disclosure>
  );
}
