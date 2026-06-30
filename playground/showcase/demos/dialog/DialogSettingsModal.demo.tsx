import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Dialog } from "@/components/core/Dialog";
import { Switch } from "@/components/core/Switch";
import { Text } from "@/components/core/Text";

export function DialogSettingsModalDemo() {
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  return (
    <>
      <Button variant="outline" type="button" onClick={() => setOpen(true)}>
        Настройки приватности
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Panel>
          <Dialog.Header>
          <Dialog.HeadingBlock>
            <Dialog.Title>Приватность</Dialog.Title>
            <Dialog.Description>Управление сбором данных.</Dialog.Description>
          </Dialog.HeadingBlock>
          <Dialog.Close />
        </Dialog.Header>
        <Dialog.Body className="flex flex-col gap-mid">
          <Switch
            checked={analytics}
            onChange={(e) => setAnalytics(e.target.checked)}
            label="Аналитика использования"
            hint="Анонимная статистика для улучшения продукта"
          />
          <Text as="p" variant="tools" className="text-muted">
            Dialog с формой настроек внутри Body.
          </Text>
        </Dialog.Body>
        <Dialog.Footer>
          <Button type="button" onClick={() => setOpen(false)}>
            Готово
          </Button>
        </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
