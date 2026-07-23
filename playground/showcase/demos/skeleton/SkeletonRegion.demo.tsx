import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Skeleton } from "@/components/core/Skeleton";
import { Surface } from "@/components/core/Surface";

export function SkeletonRegionDemo() {
  const [busy, setBusy] = useState(true);

  return (
    <div className="flex w-full max-w-sm flex-col gap-mid">
      <Button size="small" onClick={() => setBusy((value) => !value)}>
        {busy ? "Show content" : "Show skeleton"}
      </Button>
      <Skeleton.Region busy={busy} aria-label="Profile">
        {busy ? (
          <Surface variant="secondary" padding="mid" className="flex w-full gap-mid">
            <Skeleton.Circle className="size-12 shrink-0" animation="shimmer" />
            <div className="flex min-w-0 flex-1 flex-col gap-small">
              <Skeleton className="h-4 w-32 rounded-small" animation="shimmer" />
              <Skeleton.Text lines={2} animation="shimmer" />
            </div>
          </Surface>
        ) : (
          <Surface variant="secondary" padding="mid">
            <p className="text-base text-foreground">Alex Rivera — product designer</p>
          </Surface>
        )}
      </Skeleton.Region>
    </div>
  );
}
