import { IoCheckmark } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Card } from "@/components/core/Card";
import { Text } from "@/components/core/Text";

const PLANS = [
  {
    id: "free",
    title: "Free",
    price: "0 ₽",
    description: "Для личных проектов",
    features: ["3 проекта", "Community support"],
    highlighted: false,
  },
  {
    id: "pro",
    title: "Pro",
    price: "990 ₽",
    description: "Для команд до 10 человек",
    features: ["Безлимитные проекты", "Приоритетная поддержка"],
    highlighted: true,
  },
] as const;

export function CardPricingGridDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-mid sm:grid-cols-2">
      {PLANS.map((plan) => (
        <Card key={plan.id} variant={plan.highlighted ? "secondary" : "outline"}>
          <Card.Header>
            <Card.Title>{plan.title}</Card.Title>
            <Card.Description>{plan.description}</Card.Description>
          </Card.Header>
          <Card.Body>
            <Text as="p" variant="large" className="font-semibold">
              {plan.price}
              <Text as="span" variant="tools" className="font-normal text-muted">
                {" "}
                / мес
              </Text>
            </Text>
            <ul className="mt-mid flex flex-col gap-xsmall">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-xsmall text-sm text-muted">
                  <IoCheckmark aria-hidden className="size-4 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </Card.Body>
          <Card.Footer className="flex justify-end">
            <Button size="small" variant={plan.highlighted ? "primary" : "outline"}>
              Выбрать
            </Button>
          </Card.Footer>
        </Card>
      ))}
    </div>
  );
}
