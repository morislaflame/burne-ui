import { IoCardOutline, IoNotificationsOutline, IoShieldCheckmarkOutline } from "react-icons/io5";

import { Expandable } from "@/components/core/Expandable";
import { Text } from "@/components/core/Text";

const SECTIONS = [
  {
    title: "Уведомления",
    description: "Email и push",
    icon: <IoNotificationsOutline aria-hidden className="size-full" />,
    body: "Настройте каналы оповещений и частоту дайджеста.",
  },
  {
    title: "Безопасность",
    description: "2FA и сессии",
    icon: <IoShieldCheckmarkOutline aria-hidden className="size-full" />,
    body: "Включите двухфакторную аутентификацию и просмотрите активные сессии.",
  },
  {
    title: "Оплата",
    description: "Карты и счета",
    icon: <IoCardOutline aria-hidden className="size-full" />,
    body: "Способы оплаты и история транзакций.",
  },
] as const;

export function ExpandableSettingsStackDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-small">
      {SECTIONS.map((section) => (
        <Expandable
          key={section.title}
          title={section.title}
          icon={section.icon}
          description={section.description}
        >
          <Text as="p" variant="small" className="text-muted">
            {section.body}
          </Text>
        </Expandable>
      ))}
    </div>
  );
}
