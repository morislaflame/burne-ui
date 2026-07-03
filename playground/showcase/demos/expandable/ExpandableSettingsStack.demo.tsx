import { IoCardOutline, IoNotificationsOutline, IoShieldCheckmarkOutline } from "react-icons/io5";

import { Expandable } from "@/components/core/Expandable";
import { Text } from "@/components/core/Text";

const SECTIONS = [
  {
    title: "Notifications",
    description: "Email and push",
    icon: <IoNotificationsOutline aria-hidden className="size-full" />,
    body: "Set up alert channels and digest frequency.",
  },
  {
    title: "Safety",
    description: "2FA and sessions",
    icon: <IoShieldCheckmarkOutline aria-hidden className="size-full" />,
    body: "Enable two-factor authentication and view active sessions.",
  },
  {
    title: "Payment",
    description: "Cards and accounts",
    icon: <IoCardOutline aria-hidden className="size-full" />,
    body: "Payment methods and transaction history.",
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
