import { IoInformationCircleOutline } from "react-icons/io5";

import { Expandable } from "@/components/core/Expandable";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

function hoverTextColor(el: HTMLElement, color: string, duration = 0.25) {
  if (!el.dataset.motionColorRest) {
    el.dataset.motionColorRest = getComputedStyle(el).color;
  }
  return tweenCssColor(el, color, { duration });
}

function restoreTextColor(el: HTMLElement, duration = 0.2) {
  const rest = el.dataset.motionColorRest || "var(--color-foreground)";
  return tweenCssColor(el, rest, {
    duration,
    clearOnComplete: true,
    onComplete: () => {
      delete el.dataset.motionColorRest;
    },
  });
}

export function ExpandableMotionTitleColorDemo() {
  return (
    <Expandable
      classNames={{
        root: "border-token-info overflow-hidden",
        trigger: "bg-info/5",
      }}
    >
      <Expandable.Trigger className="hover:bg-info/10">
        <Expandable.Message>
          <Expandable.Icon className="text-info">
            <IoInformationCircleOutline aria-hidden />
          </Expandable.Icon>
          <Expandable.Content>
            <Expandable.Title className="font-w-strong text-info">
              Delivery window
            </Expandable.Title>
            <Expandable.Description className="text-foreground/70">
              Title color and icon follow the chevron
            </Expandable.Description>
          </Expandable.Content>
        </Expandable.Message>
        <Expandable.Chevron
          className="text-info"
          motion={{
            enter: (ctx) => {
              const tl = ctx.timeline();
              const title = ctx.getTarget("title");
              const icon = ctx.getTarget("icon");
              tl.to(
                ctx.el,
                { rotation: 180, duration: 0.42, ease: "back.out(1.6)" },
                0,
              );
              if (icon) {
                tl.to(
                  icon,
                  { scale: 1.12, rotate: -8, duration: 0.32, ease: "back.out(1.8)" },
                  0,
                );
              }
              if (title) {
                tl.add(hoverTextColor(title, "var(--color-info)", 0.28), 0);
              }
              return tl;
            },
            leave: (ctx) => {
              const tl = ctx.timeline();
              const title = ctx.getTarget("title");
              const icon = ctx.getTarget("icon");
              tl.to(ctx.el, { rotation: 0, duration: 0.22 }, 0);
              if (icon) tl.to(icon, { scale: 1, rotate: 0, duration: 0.22 }, 0);
              if (title) tl.add(restoreTextColor(title, 0.22), 0);
              return tl;
            },
          }}
        />
      </Expandable.Trigger>
      <Expandable.Panel className="border-t border-info/20 bg-info/5">
        <p className="text-small text-muted">
          Height is still collapsibleHeight. Chevron factory reaches Title/Icon via ctx.getTarget.
        </p>
      </Expandable.Panel>
    </Expandable>
  );
}
