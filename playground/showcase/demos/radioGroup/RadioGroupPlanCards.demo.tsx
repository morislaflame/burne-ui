import { IoGlobeOutline, IoPeopleOutline, IoVideocamOutline } from "react-icons/io5";

import { RadioGroup } from "@/components/composite/RadioGroup";
import { Radio } from "@/components/core/Radio";
import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

const CARD_CLASS = cn(
  "group relative flex flex-col gap-mid rounded-mid border-token bg-surface px-mid py-large transition-colors",
  "data-[selected=true]:border-primary data-[selected=true]:bg-primary-tint",
  "has-[:focus-visible]:border-primary has-[:focus-visible]:bg-primary-tint",
);

const PLANS = [
  {
    value: "starter",
    title: "Starter",
    hint: "For personal projects and prototypes",
    price: "0 ₽",
    icon: IoVideocamOutline,
  },
  {
    value: "team",
    title: "Team",
    hint: "Collaboration and shared libraries",
    price: "2 900 ₽",
    icon: IoGlobeOutline,
  },
  {
    value: "enterprise",
    title: "Enterprise",
    hint: "SSO, audit and dedicated support",
    price: "on request",
    icon: IoPeopleOutline,
  },
] as const;

export function RadioGroupPlanCardsDemo() {
  return (
    <RadioGroup defaultValue="team" name="plan" className="w-full max-w-2xl">
      <RadioGroup.Legend>
        <RadioGroup.Label>Tariff plan</RadioGroup.Label>
        <RadioGroup.Hint>Cards with compound Radio — indicator in the corner.</RadioGroup.Hint>
      </RadioGroup.Legend>
      <div className="grid gap-large md:grid-cols-3">
        {PLANS.map((plan) => (
          <Radio key={plan.value} value={plan.value} className={CARD_CLASS}>
            <Radio.Control className="absolute top-mid right-mid size-5" />
            <Radio.Content className="flex flex-col gap-mid pr-2xlarge">
              <span className="inline-flex size-10 items-center justify-center rounded-base border-token bg-secondary text-foreground">
                <plan.icon className="size-5" aria-hidden />
              </span>
              <div className="flex flex-col gap-xsmall">
                <Radio.Label>{plan.title}</Radio.Label>
                <Radio.Hint>{plan.hint}</Radio.Hint>
              </div>
              <Text as="span" variant="small" className="font-semibold">
                {plan.price}
              </Text>
            </Radio.Content>
          </Radio>
        ))}
      </div>
    </RadioGroup>
  );
}
