import { useState } from "react";

import { AlertDialog } from "@/components/composite/AlertDialog";
import { Button } from "@/components/core/Button";

export function AlertDialogLogoutDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" type="button" onClick={() => setOpen(true)}>
        Выйти
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialog.Header>
          <AlertDialog.HeadingBlock>
            <AlertDialog.Title>Выйти из аккаунта?</AlertDialog.Title>
            <AlertDialog.Description>Текущая сессия будет завершена на этом устройстве.</AlertDialog.Description>
          </AlertDialog.HeadingBlock>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button type="button" onClick={() => setOpen(false)}>
            Выйти
          </Button>
        </AlertDialog.Footer>
      </AlertDialog>
    </>
  );
}
