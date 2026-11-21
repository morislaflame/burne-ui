import { Expandable } from "@/components/core/Expandable";

export function ExpandableMotionChevronDemo() {
  return (
    <Expandable>
      <Expandable.Trigger>
        <Expandable.Title>Compound chevron</Expandable.Title>
        <Expandable.Chevron
          motion={{
            enter: (ctx) =>
              ctx.to({
                rotation: 180,
                duration: 0.45,
                ease: "back.out(1.6)",
              }),
            leave: (ctx) =>
              ctx.to({
                rotation: 0,
                duration: 0.28,
              }),
          }}
        />
      </Expandable.Trigger>
      <Expandable.Panel>
        <p className="text-small text-muted">Custom chevron easing via the part prop.</p>
      </Expandable.Panel>
    </Expandable>
  );
}
