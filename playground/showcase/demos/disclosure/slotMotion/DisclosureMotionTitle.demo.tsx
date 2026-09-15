import { Disclosure } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";

export function DisclosureMotionTitleDemo() {
  return (
    <Disclosure
      className="max-w-lg"
      motion={{
        title: {
          enter: (ctx) =>
            ctx.fromTo(
              { x: -8, opacity: 0.35 },
              { x: 0, opacity: 1, duration: 0.28, ease: "power2.out" },
            ),
          leave: { x: -6, autoAlpha: 0.45, duration: 0.18 },
        },
      }}
    >
      <Disclosure.Trigger>Title slot</Disclosure.Trigger>
      <Disclosure.Content>
        <Text as="p" variant="small" className="text-muted">
          `motion.title` is the text inside titleLift — enter/leave on open, not the hover lift.
        </Text>
      </Disclosure.Content>
    </Disclosure>
  );
}
