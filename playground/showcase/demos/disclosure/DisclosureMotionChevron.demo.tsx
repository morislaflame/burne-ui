import gsap from "gsap";

import { Disclosure } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";

export function DisclosureMotionChevronDemo() {
  return (
    <Disclosure className="max-w-lg">
      <Disclosure.Trigger>
        Compound chevron
        <Disclosure.Chevron
          motion={{
            enter: (ctx) =>
              gsap.to(ctx.el, {
                rotation: 180,
                duration: 0.45,
                ease: "back.out(1.6)",
                overwrite: "auto",
                force3D: false,
              }),
            leave: (ctx) =>
              gsap.to(ctx.el, {
                rotation: 0,
                duration: 0.28,
                overwrite: "auto",
                force3D: false,
              }),
          }}
        />
      </Disclosure.Trigger>
      <Disclosure.Content>
        <Text as="p" variant="small" className="text-muted">
          Custom chevron easing via the part prop.
        </Text>
      </Disclosure.Content>
    </Disclosure>
  );
}
