import { ToggleButton } from "@/components/core/ToggleButton";

export function ToggleButtonVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-small">
      <ToggleButton variant="default" defaultPressed>
        Default
      </ToggleButton>
      <ToggleButton variant="outline" defaultPressed>
        Outline
      </ToggleButton>
      <ToggleButton variant="ghost" defaultPressed>
        Ghost
      </ToggleButton>
    </div>
  );
}
