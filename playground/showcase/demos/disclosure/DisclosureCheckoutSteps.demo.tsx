import { IoCheckmarkCircleOutline, IoCubeOutline, IoWalletOutline } from "react-icons/io5";

import { Disclosure, DisclosureGroup } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";

const STEPS = [
  {
    value: "cart",
    title: "Корзина",
    icon: <IoCubeOutline aria-hidden />,
    body: "Проверьте состав заказа и промокод.",
  },
  {
    value: "payment",
    title: "Оплата",
    icon: <IoWalletOutline aria-hidden />,
    body: "Выберите способ оплаты: карта, СБП или счёт.",
  },
  {
    value: "done",
    title: "Подтверждение",
    icon: <IoCheckmarkCircleOutline aria-hidden />,
    body: "Мы отправим чек на email после оплаты.",
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
