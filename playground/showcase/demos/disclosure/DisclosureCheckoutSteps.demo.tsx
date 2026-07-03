import { IoCheckmarkCircleOutline, IoCubeOutline, IoWalletOutline } from "react-icons/io5";

import { Disclosure, DisclosureGroup } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";

const STEPS = [
  {
    value: "cart",
    title: "Basket",
    icon: <IoCubeOutline aria-hidden />,
    body: "Check the contents of your order and promotional code.",
  },
  {
    value: "payment",
    title: "Payment",
    icon: <IoWalletOutline aria-hidden />,
    body: "Select payment method: card, SBP or account.",
  },
  {
    value: "done",
    title: "Confirmation",
    icon: <IoCheckmarkCircleOutline aria-hidden />,
    body: "We will send a check to email after payment.",
  },
] as const;

export function DisclosureCheckoutStepsDemo() {
  return (
    <DisclosureGroup variant="outline" defaultValue="cart" className="w-full max-w-lg">
      {STEPS.map((step) => (
        <Disclosure key={step.value} value={step.value}>
          <Disclosure.Trigger icon={step.icon}>{step.title}</Disclosure.Trigger>
          <Disclosure.Content>
            <Text as="p" variant="small" className="text-muted">
              {step.body}
            </Text>
          </Disclosure.Content>
        </Disclosure>
      ))}
    </DisclosureGroup>
  );
}
