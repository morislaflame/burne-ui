import { ContextMenu } from "@/components/core/ContextMenu";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "menu:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

const surface =
  "min-h-control-mid items-center justify-center rounded-mid border-token bg-surface px-large text-foreground";

function ItemPulse() {
  const controller = useMotionController();
  return (
    <ContextMenu.Item onPointerEnter={() => controller.playSlot("item", "menu:nudge")}>
      Hover item
    </ContextMenu.Item>
  );
}

export function ContextMenuMotionControllerInsideDemo() {
  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col">
      <ContextMenu open>
        <ContextMenu.Trigger className={surface}>Menu</ContextMenu.Trigger>
        <ContextMenu.Content motion={{ events }}>
          <ItemPulse />
          <ContextMenu.Item>Quiet</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    </div>
  );
}
