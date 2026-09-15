import { Disclosure } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";

export function DisclosureMotionTitleLiftTiltDemo() {
  return (
    <Disclosure
      className="max-w-lg"
      motion={{
        titleLift: {
          hoverIn: (ctx) => ctx.to({ y: -2, rotation: -1.4, duration: 0.2, ease: "power2.out" }),
          hoverOut: (ctx) => ctx.to({ y: 0, rotation: 0, duration: 0.16, ease: "power2.out" }),
        },
      }}
    >
      <Disclosure.Trigger>Title tilt on hover</Disclosure.Trigger>
      <Disclosure.Content>
        <Text as="p" variant="small" className="text-muted">
          Public `titleLift` slot — hover is a slight rotate, not the kit scale-lift. Press squeeze stays default.
        </Text>
      </Disclosure.Content>
    </Disclosure>
  );
}
