import { Accordion } from "@/components/composite/Accordion";

const FAQ = [
  {
    title: "Как оформить заказ?",
    description: "Доставка и оплата",
    body: "Доставка по РФ 2–5 дней. Оплата картой, СБП или при получении.",
  },
  {
    title: "Можно ли вернуть товар?",
    description: "Условия возврата",
    body: "Возврат в течение 14 дней при сохранении товарного вида и упаковки.",
  },
  {
    title: "Как ухаживать за изделием?",
    description: "Рекомендации по уходу",
    body: "Деликатная стирка при 30°C. Не использовать отбеливатель.",
  },
] as const;

export function AccordionCheckoutFaqDemo() {
  return (
    <Accordion className="w-full max-w-lg" defaultOpenIndex={0}>
      {FAQ.map((item) => (
        <Accordion.Item key={item.title}>
          <Accordion.Heading>
            <Accordion.Trigger>
              <Accordion.Message>
                <Accordion.Content>
                  <Accordion.Title>{item.title}</Accordion.Title>
                  <Accordion.Description>{item.description}</Accordion.Description>
                </Accordion.Content>
                <Accordion.Indicator />
              </Accordion.Message>
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body>{item.body}</Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
