import { useState } from "react";

import { AlertDialog } from "@/components/composite/AlertDialog";
import { Button } from "@/components/core/Button";

export function AlertDialogLogoutDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialog.Trigger asChild>
          <Button variant="ghost">
            Выйти
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Panel>
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
        </AlertDialog.Panel>
      </AlertDialog>
    </>
  );
}
