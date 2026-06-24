import { useState } from "react";

import {
  AlertDialog,
  primaryButtonVariantForAlertTone,
} from "@/components/composite/AlertDialog";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";

export function AlertDialogDeleteAccountDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="primary" status="danger" type="button" onClick={() => setOpen(true)}>
        Удалить аккаунт
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen} status="danger">
        <AlertDialog.Header>
          <AlertDialog.HeadingBlock>
            <AlertDialog.Title>Удалить аккаунт?</AlertDialog.Title>
            <AlertDialog.Description>
              Все проекты и данные будут удалены безвозвратно.
            </AlertDialog.Description>
          </AlertDialog.HeadingBlock>
        </AlertDialog.Header>
        <AlertDialog.Body className="flex flex-col gap-plus px-base pb-base">
          <Input>
            <Input.Label>Подтвердите email</Input.Label>
            <Input.Control name="confirm-email" placeholder="you@example.com" autoComplete="email" />
          </Input>
        </AlertDialog.Body>
        <AlertDialog.Footer>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button
            type="button"
            variant={primaryButtonVariantForAlertTone("danger")}
            onClick={() => setOpen(false)}
          >
            Удалить
          </Button>
        </AlertDialog.Footer>
      </AlertDialog>
    </>
  );
}
