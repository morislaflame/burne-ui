import { useState } from "react";

import {
  AlertDialog,
  primaryButtonVariantForAlertTone,
} from "@/components/composite/AlertDialog";
import { Button } from "@/components/core/Button";

export function AlertDialogStatusDemo() {
  const [dangerOpen, setDangerOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-small">
        <Button variant="primary" status="danger" onClick={() => setDangerOpen(true)}>
          AlertDialog danger
        </Button>
        <Button variant="primary" status="success" onClick={() => setSuccessOpen(true)}>
          AlertDialog success
        </Button>
      </div>

      <AlertDialog open={dangerOpen} onOpenChange={setDangerOpen} status="danger">
        <AlertDialog.Panel>
          <AlertDialog.Header>
          <AlertDialog.HeadingBlock>
            <AlertDialog.Title>Удалить элемент?</AlertDialog.Title>
            <AlertDialog.Description>
              Действие необратимо. Окно не закроется по клику вне панели.
            </AlertDialog.Description>
          </AlertDialog.HeadingBlock>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <Button type="button" variant="outline" onClick={() => setDangerOpen(false)}>
            Отмена
          </Button>
          <Button
            type="button"
            variant={primaryButtonVariantForAlertTone("danger")}
            onClick={() => setDangerOpen(false)}
          >
            Удалить
          </Button>
        </AlertDialog.Footer>
        </AlertDialog.Panel>
      </AlertDialog>

      <AlertDialog open={successOpen} onOpenChange={setSuccessOpen} status="success">
        <AlertDialog.Panel>
          <AlertDialog.Header>
          <AlertDialog.HeadingBlock>
            <AlertDialog.Title>Изменения сохранены</AlertDialog.Title>
            <AlertDialog.Description>Настройки профиля обновлены успешно.</AlertDialog.Description>
          </AlertDialog.HeadingBlock>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <Button
            type="button"
            variant={primaryButtonVariantForAlertTone("success")}
            onClick={() => setSuccessOpen(false)}
          >
            Отлично
          </Button>
        </AlertDialog.Footer>
        </AlertDialog.Panel>
      </AlertDialog>
    </>
  );
}
