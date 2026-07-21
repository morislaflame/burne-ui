import { IoInformationCircleOutline, IoLockClosedOutline, IoNotificationsOutline } from "react-icons/io5";

import { Disclosure } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";

const faqItems = [
  { value: "faq-1", title: "What's happened Burne UI?", icon: <IoInformationCircleOutline /> },
  { value: "faq-2", title: "How to connect a theme?", icon: <IoNotificationsOutline /> },
  { value: "faq-3", title: "Is there SSR?", icon: <IoLockClosedOutline /> },
] as const;

export function DisclosureOutlineFaqDemo() {
  return (
    <Disclosure.Group variant="outline" defaultValue="faq-1" className="max-w-lg">
      {faqItems.map(({ value, title, icon }) => (
        <Disclosure key={value} value={value}>
          <Disclosure.Trigger icon={icon}>{title}</Disclosure.Trigger>
          <Disclosure.Content>
            <Text as="p" variant="small" className="text-muted">
              Answer to the question «{title}» — compound Disclosure.Group with accordion-behavior.
            </Text>
          </Disclosure.Content>
        </Disclosure>
      ))}
    </Disclosure.Group>
  );
}
