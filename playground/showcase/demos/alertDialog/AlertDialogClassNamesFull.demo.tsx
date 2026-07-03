import { useState } from "react";

import { Button } from "@/components/core/Button";
import { AlertDialog } from "@/components/composite/AlertDialog";

export function AlertDialogClassNamesFullDemo() {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
      status="warning"
      classNames={{
        panel: "ring-1 ring-warning/30",
        title: "text-warning font-semibold",
        description: "text-foreground/80",
        footer: "border-t border-warning/20 pt-small",
      }}
    >
      <AlertDialog.Trigger asChild>
        <Button variant="outline">Open from classNames</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Panel>
        <AlertDialog.Header>
          <AlertDialog.HeadingBlock>
            <AlertDialog.Title>Unsaved changes</AlertDialog.Title>
            <AlertDialog.Description>
              Slots panel, title, description and footer configured via classNames.
            </AlertDialog.Description>
          </AlertDialog.HeadingBlock>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Continue</Button>
        </AlertDialog.Footer>
      </AlertDialog.Panel>
    </AlertDialog>
  );
}
