import { useLayoutEffect, useRef, useState } from "react";

import { Button } from "@/components/core/Button";
import { Dialog } from "@/components/core/Dialog";

export function DialogAsChildMergedPropsDemo() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [refLabel, setRefLabel] = useState("ref: —");

  useLayoutEffect(() => {
    const node = triggerRef.current;
    setRefLabel(node ? `ref → #${node.id} (${node.tagName.toLowerCase()})` : "ref: —");
  }, []);

  return (
    <div className="flex flex-col items-center gap-mid">
      <p className="text-sm text-muted">{refLabel}</p>
      <p className="max-w-md text-center text-sm text-muted">
        <code className="text-foreground">Dialog.Trigger asChild</code> merges{" "}
        <code className="text-foreground">id</code>, <code className="text-foreground">data-*</code>,{" "}
        <code className="text-foreground">className</code>, and <code className="text-foreground">ref</code> onto the child.
      </p>
      <Dialog>
        <Dialog.Trigger
          asChild
          ref={triggerRef}
          id="playground-dialog-trigger"
          data-analytics="open-dialog"
          className="ring-2 ring-primary/30"
        >
          <Button type="button" variant="outline">
            Open (merged props)
          </Button>
        </Dialog.Trigger>
        <Dialog.Panel>
          <Dialog.Header>
            <Dialog.HeadingBlock>
              <Dialog.Title>Merged trigger</Dialog.Title>
              <Dialog.Description>
                Inspect the Button: host props from Trigger land on the child.
              </Dialog.Description>
            </Dialog.HeadingBlock>
            <Dialog.Close />
          </Dialog.Header>
          <Dialog.Body>
            <p className="text-sm text-muted">Opened via asChild trigger with forwarded props.</p>
          </Dialog.Body>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}
