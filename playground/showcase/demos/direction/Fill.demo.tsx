import { ProgressBar } from "@/components/core/ProgressBar";
import { Switch } from "@/components/core/Switch";

import { RtlPair } from "./rtlPair";

export function DirectionFillDemo() {
  return (
    <RtlPair>
      {() => (
        <>
          <ProgressBar label="Upload" showValue value={64} min={0} max={100} />
          <Switch label="Alerts" defaultChecked />
        </>
      )}
    </RtlPair>
  );
}
