import { IoHelpCircleOutline } from "react-icons/io5";

import { Disclosure } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";

export function DisclosureMotionChevronDemo() {
  return (
    <Disclosure className="max-w-lg">
      <Disclosure.Trigger>
        <Disclosure.Icon className="text-info">
          <IoHelpCircleOutline aria-hidden />
        </Disclosure.Icon>
        Compound chevron
        <Disclosure.Chevron
          motion={{
            enter: (ctx) => {
              const tl = ctx.timeline();
              const icon = ctx.getTarget("icon");
              tl.to(
                ctx.el,
                { rotation: 180, duration: 0.45, ease: "back.out(1.6)" },
                0,
              );
              if (icon) {
                tl.to(
                  icon,
                  { scale: 1.12, rotate: -8, duration: 0.32, ease: "back.out(1.8)" },
                  0,
                );
              }
              return tl;
            },
            leave: (ctx) => {
              const tl = ctx.timeline();
              const icon = ctx.getTarget("icon");
              tl.to(ctx.el, { rotation: 0, duration: 0.28 }, 0);
              if (icon) tl.to(icon, { scale: 1, rotate: 0, duration: 0.22 }, 0);
              return tl;
            },
          }}
        />
      </Disclosure.Trigger>
      <Disclosure.Content>
        <Text as="p" variant="small" className="text-muted">
          Chevron factory reaches `icon` via ctx.getTarget. Height stays the kit recipe.
        </Text>
      </Disclosure.Content>
    </Disclosure>
  );
}
