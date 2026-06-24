import { useState } from "react";

import {
  AlertDialog,
  primaryButtonVariantForAlertTone,
} from "@/components/composite/AlertDialog";
import { Button } from "@/components/core/Button";

export function AlertDialogGlossDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="gloss" status="danger" onClick={() => setOpen(true)}>
        Gloss AlertDialog
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen} variant="gloss" status="danger">
        <AlertDialog.Header>
          <AlertDialog.HeadingBlock>
            <AlertDialog.Title>Удалить элемент?</AlertDialog.Title>
            <AlertDialog.Description>
              Gloss AlertDialog — подтверждение на стеклянной панели.
            </AlertDialog.Description>
          </AlertDialog.HeadingBlock>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <Button type="button" variant="gloss" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button
            type="button"
            variant={primaryButtonVariantForAlertTone("danger")}
            status="danger"
            onClick={() => setOpen(false)}
          >
            Удалить
          </Button>
        </AlertDialog.Footer>
      </AlertDialog>
    </>
  );
}
