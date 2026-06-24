import { useState } from "react";

import { Surface } from "@/components/core/Surface";
import { Switch } from "@/components/core/Switch";
import { Text } from "@/components/core/Text";

export function SwitchSettingsPanelDemo() {
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(false);
  const [digest, setDigest] = useState(true);

  return (
    <Surface variant="secondary" padding="mid" className="w-full max-w-md">
      <Text as="p" variant="small" className="mb-mid font-medium">
        Уведомления
      </Text>
      <ul className="flex flex-col divide-y divide-border">
        <li className="flex items-center justify-between gap-mid py-mid first:pt-0 last:pb-0">
          <div className="flex min-w-0 flex-col gap-xsmall">
            <Text as="span" variant="small" className="font-medium">
              Push
            </Text>
            <Text as="span" variant="tools" className="text-muted">
              Мгновенные оповещения на устройстве
            </Text>
          </div>
          <Switch.Control
            checked={push}
            onChange={(e) => setPush(e.target.checked)}
            aria-label="Push-уведомления"
          />
        </li>
        <li className="flex items-center justify-between gap-mid py-mid first:pt-0 last:pb-0">
          <div className="flex min-w-0 flex-col gap-xsmall">
            <Text as="span" variant="small" className="font-medium">
              Email
            </Text>
            <Text as="span" variant="tools" className="text-muted">
              Дайджест раз в неделю
            </Text>
          </div>
          <Switch.Control
            checked={email}
            onChange={(e) => setEmail(e.target.checked)}
            aria-label="Email-уведомления"
          />
        </li>
        <li className="flex items-center justify-between gap-mid py-mid first:pt-0 last:pb-0">
          <div className="flex min-w-0 flex-col gap-xsmall">
            <Text as="span" variant="small" className="font-medium">
              Сводка
            </Text>
            <Text as="span" variant="tools" className="text-muted">
              Краткий отчёт по активности
            </Text>
          </div>
          <Switch.Control
            checked={digest}
            onChange={(e) => setDigest(e.target.checked)}
            aria-label="Сводка активности"
          />
        </li>
      </ul>
    </Surface>
  );
}
