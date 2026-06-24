import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Dialog } from "@/components/core/Dialog";
import { Text } from "@/components/core/Text";

export function DialogBasicDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Открыть Dialog</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Header>
          <Dialog.HeadingBlock>
            <Dialog.Title>Пример диалога</Dialog.Title>
            <Dialog.Description>Нативный &lt;dialog&gt; с анимацией из библиотеки.</Dialog.Description>
          </Dialog.HeadingBlock>
          <Dialog.Close />
        </Dialog.Header>
        <Dialog.Body>
          <Text as="p" variant="base">
            Контент модального окна. Закройте по Escape или кнопке.
          </Text>
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button onClick={() => setOpen(false)}>Готово</Button>
        </Dialog.Footer>
      </Dialog>
    </>
  );
}
