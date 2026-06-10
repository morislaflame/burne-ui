import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IoGlobeOutline, IoPeopleOutline, IoVideocamOutline } from "react-icons/io5";

import { Radio } from "@/components/core/Radio";
import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

import { RadioGroup } from ".";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-xl">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Composite Components/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [...darkThemeDecorator],
  args: {
    isRequired: false,
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

const CARD_RADIO_CLASS = cn(
  "group relative flex flex-col gap-plus rounded-mid border border-base bg-surface px-plus py-mid transition-colors",
  "data-[selected=true]:border-primary data-[selected=true]:bg-primary-tint",
  "has-[:focus-visible]:border-primary has-[:focus-visible]:bg-primary-tint",
);

export const Playground: Story = {
  render: (args) => (
    <RadioGroup {...args} defaultValue="card">
      <RadioGroup.Legend>
        <RadioGroup.Label>Способ оплаты</RadioGroup.Label>
        <RadioGroup.Hint>Можно выбрать только один вариант.</RadioGroup.Hint>
      </RadioGroup.Legend>
      <RadioGroup.List>
        <Radio value="card" label="Банковская карта" />
        <Radio value="cash" label="Наличные" />
        <Radio value="invoice" label="Счёт для юрлица" />
      </RadioGroup.List>
    </RadioGroup>
  ),
};

export const CardLayout: Story = {
  name: "Карточки (compound Radio)",
  render: () => {
    const formats = [
      {
        value: "online",
        title: "Онлайн",
        hint: "Трансляция и чат в реальном времени",
        meta: "Бесплатно",
        icon: IoVideocamOutline,
      },
      {
        value: "hybrid",
        title: "Гибрид",
        hint: "Зал + онлайн-доступ для удалённых участников",
        meta: "от 2 900 ₽",
        icon: IoGlobeOutline,
      },
      {
        value: "offline",
        title: "Очно",
        hint: "Живое общение, нетворкинг и кофе-брейки",
        meta: "от 4 500 ₽",
        icon: IoPeopleOutline,
      },
    ] as const;

    return (
      <RadioGroup defaultValue="hybrid" name="event-format" className="max-w-2xl">
        <RadioGroup.Legend>
          <RadioGroup.Label>Формат участия</RadioGroup.Label>
          <RadioGroup.Hint>Выберите, как вы хотите присоединиться к мероприятию.</RadioGroup.Hint>
        </RadioGroup.Legend>
        <div className="grid gap-mid md:grid-cols-3">
          {formats.map((option) => (
            <Radio key={option.value} value={option.value} className={CARD_RADIO_CLASS}>
              <Radio.Control className="absolute top-plus right-plus size-5" />
              <Radio.Content className="flex flex-col gap-plus pr-xlarge">
                <span className="inline-flex size-10 items-center justify-center rounded-base border border-base bg-surface-secondary text-primary">
                  <option.icon className="size-5" aria-hidden />
                </span>
                <div className="flex flex-col gap-xsmall">
                  <Radio.Label>{option.title}</Radio.Label>
                  <Radio.Hint>{option.hint}</Radio.Hint>
                </div>
                <Text as="span" variant="small" className="font-semibold">
                  {option.meta}
                </Text>
              </Radio.Content>
            </Radio>
          ))}
        </div>
      </RadioGroup>
    );
  },
};

export const Horizontal: Story = {
  name: "Горизонтально",
  render: () => (
    <RadioGroup defaultValue="s">
      <RadioGroup.Legend>
        <RadioGroup.Label>Размер</RadioGroup.Label>
        <RadioGroup.Hint>Пункты в ряд с переносом при нехватке места.</RadioGroup.Hint>
      </RadioGroup.Legend>
      <RadioGroup.List orientation="horizontal">
        <Radio value="s" label="S" />
        <Radio value="m" label="M" />
        <Radio value="l" label="L" />
        <Radio value="xl" label="XL" />
      </RadioGroup.List>
    </RadioGroup>
  ),
};

export const WithDescriptions: Story = {
  name: "С описаниями",
  render: () => (
    <RadioGroup defaultValue="courier">
      <RadioGroup.Legend>
        <RadioGroup.Label>Доставка</RadioGroup.Label>
      </RadioGroup.Legend>
      <RadioGroup.List>
        <Radio value="courier" label="Курьер" hint="1–2 рабочих дня" />
        <Radio value="pickup" label="Самовывоз" hint="Бесплатно, сегодня" />
        <Radio value="post" label="Почта" hint="5–7 дней" />
      </RadioGroup.List>
    </RadioGroup>
  ),
};

export const Required: Story = {
  name: "Обязательное поле",
  render: () => (
    <RadioGroup isRequired>
      <RadioGroup.Legend>
        <RadioGroup.Label>Тариф</RadioGroup.Label>
      </RadioGroup.Legend>
      <RadioGroup.List>
        <Radio value="free" label="Бесплатный" />
        <Radio value="pro" label="Pro" />
      </RadioGroup.List>
    </RadioGroup>
  ),
};

export const WithError: Story = {
  name: "С ошибкой",
  render: () => (
    <RadioGroup isRequired>
      <RadioGroup.Legend>
        <RadioGroup.Label>Тариф</RadioGroup.Label>
        <RadioGroup.Hint>Нужно выбрать один вариант перед продолжением.</RadioGroup.Hint>
      </RadioGroup.Legend>
      <RadioGroup.Group>
        <RadioGroup.List>
          <Radio value="free" label="Бесплатный" />
          <Radio value="pro" label="Pro" />
        </RadioGroup.List>
        <RadioGroup.Error>Выберите тариф, чтобы продолжить.</RadioGroup.Error>
      </RadioGroup.Group>
    </RadioGroup>
  ),
};

export const Controlled: Story = {
  name: "Контролируемый",
  render: function Controlled() {
    const [value, setValue] = useState<string | undefined>("card");

    return (
      <RadioGroup value={value} onValueChange={setValue}>
        <RadioGroup.Legend>
          <RadioGroup.Label>Контролируемый</RadioGroup.Label>
          <RadioGroup.Hint>{`Выбрано: ${value ?? "—"}`}</RadioGroup.Hint>
        </RadioGroup.Legend>
        <RadioGroup.List>
          <Radio value="card" label="Карта" />
          <Radio value="cash" label="Наличные" />
        </RadioGroup.List>
      </RadioGroup>
    );
  },
};

export const WithoutDescription: Story = {
  name: "Без подзаголовка",
  render: () => (
    <RadioGroup defaultValue="m">
      <RadioGroup.Legend>
        <RadioGroup.Label>Размер</RadioGroup.Label>
      </RadioGroup.Legend>
      <RadioGroup.List>
        <Radio value="s" label="S" />
        <Radio value="m" label="M" />
        <Radio value="l" label="L" />
      </RadioGroup.List>
    </RadioGroup>
  ),
};

export const Accessibility: Story = {
  name: "Доступность",
  render: () => (
    <div className="flex max-w-md flex-col gap-mid text-left">
      <p className="text-sm text-muted">
        Группа — native <code className="text-primary">&lt;fieldset&gt;</code> +{" "}
        <code className="text-primary">&lt;legend&gt;</code>. Подсказка и ошибка —{" "}
        <code className="text-primary">aria-describedby</code> на fieldset; у опции hint — на input
        через <code className="text-primary">Radio.Hint</code>.
      </p>
      <RadioGroup isRequired>
        <RadioGroup.Legend>
          <RadioGroup.Label>Доставка</RadioGroup.Label>
          <RadioGroup.Hint>Выберите один способ доставки.</RadioGroup.Hint>
        </RadioGroup.Legend>
        <RadioGroup.List>
          <Radio value="courier" label="Курьер" hint="1–2 рабочих дня" />
          <Radio value="pickup" label="Самовывоз" hint="Бесплатно, сегодня" />
        </RadioGroup.List>
        <RadioGroup.Error role="alert">Выберите способ доставки.</RadioGroup.Error>
      </RadioGroup>
    </div>
  ),
};
