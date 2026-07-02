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
        <Button variant="outline">Открыть с classNames</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Panel>
        <AlertDialog.Header>
          <AlertDialog.HeadingBlock>
            <AlertDialog.Title>Несохранённые изменения</AlertDialog.Title>
            <AlertDialog.Description>
              Слоты panel, title, description и footer настроены через classNames.
            </AlertDialog.Description>
          </AlertDialog.HeadingBlock>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button onClick={() => setOpen(false)}>Продолжить</Button>
        </AlertDialog.Footer>
      </AlertDialog.Panel>
    </AlertDialog>
  );
}
