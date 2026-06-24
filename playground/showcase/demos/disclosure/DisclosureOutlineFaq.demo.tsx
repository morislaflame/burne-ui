import {
  IoInformationCircleOutline,
  IoLockClosedOutline,
  IoNotificationsOutline,
} from "react-icons/io5";

import { Disclosure, DisclosureGroup } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";

const faqItems = [
  { value: "faq-1", title: "Что такое Burne UI?", icon: <IoInformationCircleOutline /> },
  { value: "faq-2", title: "Как подключить тему?", icon: <IoNotificationsOutline /> },
  { value: "faq-3", title: "Есть ли SSR?", icon: <IoLockClosedOutline /> },
] as const;

export function DisclosureOutlineFaqDemo() {
  return (
    <DisclosureGroup variant="outline" defaultValue="faq-1" className="max-w-lg">
      {faqItems.map(({ value, title, icon }) => (
        <Disclosure key={value} value={value}>
          <Disclosure.Trigger icon={icon}>{title}</Disclosure.Trigger>
          <Disclosure.Content>
            <Text as="p" variant="small" className="text-muted">
              Ответ на вопрос «{title}» — compound DisclosureGroup с аккордеон-поведением.
            </Text>
          </Disclosure.Content>
        </Disclosure>
      ))}
    </DisclosureGroup>
  );
}
