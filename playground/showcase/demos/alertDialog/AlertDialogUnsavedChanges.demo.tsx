import { useState } from "react";

import {
  AlertDialog,
  primaryButtonVariantForAlertTone,
} from "@/components/composite/AlertDialog";
import { Button } from "@/components/core/Button";

export function AlertDialogUnsavedChangesDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" type="button" onClick={() => setOpen(true)}>
        Покинуть страницу
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen} status="warning">
        <AlertDialog.Panel>
          <AlertDialog.Header>
          <AlertDialog.HeadingBlock>
            <AlertDialog.Title>Несохранённые изменения</AlertDialog.Title>
            <AlertDialog.Description>
              Если уйти сейчас, правки в документе будут потеряны.
            </AlertDialog.Description>
          </AlertDialog.HeadingBlock>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Остаться
          </Button>
          <Button
            type="button"
            variant={primaryButtonVariantForAlertTone("warning")}
            status="warning"
            onClick={() => setOpen(false)}
          >
            Уйти без сохранения
          </Button>
        </AlertDialog.Footer>
        </AlertDialog.Panel>
      </AlertDialog>
    </>
  );
}
