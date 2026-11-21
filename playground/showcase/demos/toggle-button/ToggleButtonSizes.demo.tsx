import { ToggleButton } from "@/components/core/ToggleButton";

export function ToggleButtonSizesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-small">
      <ToggleButton size="small" defaultPressed>
        Small
      </ToggleButton>
      <ToggleButton size="base" defaultPressed>
        Base
      </ToggleButton>
      <ToggleButton size="mid" defaultPressed>
        Mid
      </ToggleButton>
      <ToggleButton size="large" defaultPressed>
        Large
      </ToggleButton>
    </div>
  );
}
