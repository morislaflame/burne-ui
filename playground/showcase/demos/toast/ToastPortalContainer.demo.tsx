import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Toast, useToast } from "@/components/core/Toast";

function ToastPortalContainerInner() {
  const { toast } = useToast();

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() =>
        toast.show({
          status: "success",
          title: "Inside custom host",
          description: "This toast is portaled into the dashed container.",
        })
      }
    >
      Show toast in host
    </Button>
  );
}

export function ToastPortalContainerDemo() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="flex w-full max-w-lg flex-col gap-large">
      <p className="text-sm text-muted">
        <code className="text-foreground">Toast.Provider portalContainer</code> — viewport mounts into the host.
      </p>
      <div
        ref={setContainer}
        className="relative flex h-64 flex-col items-center justify-center gap-large overflow-hidden rounded-mid border-2 border-dashed border-primary/40 bg-surface/40 p-large"
      >
        <p className="absolute left-large top-large text-xs text-muted">Custom portal host</p>
        {container ? (
          <Toast.Provider portalContainer={container} defaultPlacement="bottom-center">
            <ToastPortalContainerInner />
          </Toast.Provider>
        ) : null}
      </div>
    </div>
  );
}
