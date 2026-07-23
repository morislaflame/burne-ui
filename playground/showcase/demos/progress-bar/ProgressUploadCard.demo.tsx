import { useEffect, useState } from "react";

import { ProgressBar } from "@/components/core/ProgressBar";
import { Text } from "@/components/core/Text";

export function ProgressUploadCardDemo() {
  const [value, setValue] = useState(18);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setValue((v) => (v >= 100 ? 18 : v + 7));
    }, 900);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flex w-full max-w-md flex-col gap-small rounded-mid border-token bg-secondary p-large">
      <div className="flex items-center justify-between gap-large">
        <Text as="p" variant="small" className="font-medium">
          assets.zip
        </Text>
        <Text as="span" variant="xsmall" className="tabular-nums text-muted">
          {value}%
        </Text>
      </div>
      <ProgressBar
        value={value}
        color="var(--color-info)"
        className="w-full"
        aria-label="Loading assets.zip"
      />
    </div>
  );
}
