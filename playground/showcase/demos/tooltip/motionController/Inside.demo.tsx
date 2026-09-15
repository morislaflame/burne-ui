import { Button } from "@/components/core/Button";
import { Tooltip } from "@/components/core/Tooltip";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "tooltip:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
function TitlePulse() {
  const controller = useMotionController();
  return (
    <Tooltip.Title onPointerEnter={() => controller.playSlot("title", "tooltip:nudge")}>
      Title
    </Tooltip.Title>
  );
}

export function TooltipMotionControllerInsideDemo() {

  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col">
      <Tooltip open delayShowMs={0}>
        <Tooltip.Trigger>
          <Button size="small" variant="outline" type="button">
            Trigger
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content motion={{ events }}>
          <TitlePulse />
          <Tooltip.Description>Hover the title.</Tooltip.Description>
        </Tooltip.Content>
      </Tooltip>
    </div>
  );
}
