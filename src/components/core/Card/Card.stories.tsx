import type { ComponentType, FormEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";

import { Form } from "@/components/composite/Form/Form";
import { Button } from "@/components/core/Button/Button";
import { Input } from "@/components/core/Input/Input";
import { Ripple } from "@/components/core/Ripple";
import { Card, type CardVariant } from "./Card";
import { PIN_IMAGE1 } from "@/utils/mockImages";

const CARD_RIPPLE_COLOR: Record<CardVariant, "accentSoft" | "secondary"> = {
  default: "accentSoft",
  outline: "accentSoft",
  secondary: "secondary",
};

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="w-full max-w-md">
        <Story />
      </div>
    </div>
  ),
] as const;

const lightThemeDecorator = [
  (Story: ComponentType) => (
    <div
      data-brn-theme="light"
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="w-full max-w-md">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [...darkThemeDecorator],
  argTypes: {
    pressable: {
      control: "boolean",
      description:
        "Hover-lift + тень и squeeze при нажатии; role=\"button\", активация Enter/Space. Риппл — отдельно (`<Ripple />` первым ребёнком внутри карточки + контент в `z-[1]`).",
    },
    onPress: { action: "press" },
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card>
      <Card.Content>
        <Card.Title>Заголовок карточки</Card.Title>
        <Card.Description>
          Краткое описание или подзаголовок в вторичном цвете.
        </Card.Description>
      </Card.Content>
    </Card>
  ),
};

export const WithFooter: Story = {
  name: "С футером",
  render: () => (
    <Card>
      <Card.Content>
        <Card.Title>Документ</Card.Title>
        <Card.Description>Обновлён 10 мая 2026</Card.Description>
      </Card.Content>
      <Card.Footer className="flex items-center justify-end gap-base">
        <Button variant="ghost" size="base" ripple>
          Отмена
        </Button>
        <Button variant="default" size="base" ripple>
          Открыть
        </Button>
      </Card.Footer>
    </Card>
  ),
};

export const Outline: Story = {
  name: "Outline",
  render: () => (
    <Card variant="outline">
      <Card.Content>
        <Card.Title>Прозрачная заливка</Card.Title>
        <Card.Description>Только обводка — как вторичный блок.</Card.Description>
      </Card.Content>
    </Card>
  ),
};

export const Secondary: Story = {
  name: "Secondary",
  render: () => (
    <Card variant="secondary">
      <Card.Content>
        <Card.Title>Вторичная поверхность</Card.Title>
        <Card.Description>Тот же стиль, что у Alert/Badge secondary.</Card.Description>
      </Card.Content>
    </Card>
  ),
};

export const Pressable: Story = {
  name: "Нажимаемая (pressable)",
  render: function PressableDemo() {
    const [n, setN] = useState(0);
    return (
      <div className="flex flex-col gap-mid">
        <p className="text-center text-small tabular-nums text-muted" aria-live="polite">
          Нажатий (любая из карточек ниже): {n}
        </p>
        <Card pressable onPress={() => setN((c) => c + 1)}>
          <Ripple color={CARD_RIPPLE_COLOR.default} />
          <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
            <Card.Content>
              <Card.Title>Карточка-кнопка</Card.Title>
              <Card.Description>
                Наведение — lift и тень; клик — squeeze и onPress; риппл задаётся{" "}
                <code className="text-xs">&lt;Ripple /&gt;</code> снаружи.
              </Card.Description>
            </Card.Content>
          </div>
        </Card>
        <Card variant="outline" pressable onPress={() => setN((c) => c + 1)}>
          <Ripple color={CARD_RIPPLE_COLOR.outline} />
          <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
            <Card.Content>
              <Card.Title>Outline + pressable</Card.Title>
              <Card.Description>Тот же паттерн, стеклянная обводка.</Card.Description>
            </Card.Content>
          </div>
        </Card>
        <Card variant="secondary" pressable onPress={() => setN((c) => c + 1)}>
          <Ripple color={CARD_RIPPLE_COLOR.secondary} />
          <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
            <Card.Content>
              <Card.Title>Secondary + pressable</Card.Title>
              <Card.Description>Тон риппла под вторичную поверхность.</Card.Description>
            </Card.Content>
          </div>
        </Card>
      </div>
    );
  },
};

export const PressableWithNestedCard: Story = {
  name: "Нажимаемая с карточкой внутри",
  render: function PressableNestedDemo() {
    const [n, setN] = useState(0);
    return (
      <div className="flex flex-col gap-mid">
        <p className="text-center text-small tabular-nums text-muted" aria-live="polite">
          Нажатий по внешней карточке: {n}
        </p>
        <Card pressable onPress={() => setN((c) => c + 1)}>
          <Ripple color={CARD_RIPPLE_COLOR.default}/>
          <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
            <Card.Content>
              <Card.Title>Внешняя pressable</Card.Title>
              <Card.Description>
                Клик по области вне внутренней карточки увеличивает счётчик сверху. Внутренняя карточка
                статическая — только текст.
              </Card.Description>
              <Card className="mt-plus">
                <p className="px-mid py-plus text-base leading-normal text-foreground">
                  Вложенная обычная карточка без заголовка и описания — только этот абзац текста для
                  проверки вложенной поверхности и отступов.
                </p>
              </Card>
            </Card.Content>
          </div>
        </Card>
      </div>
    );
  },
};

export const WithImageBody: Story = {
  name: "С изображением в теле",
  render: () => (
    <Card>
      <Card.Content>
        <Card.Title>Progress is a mindset</Card.Title>
        <Card.Description>
          Редакционный кадр в теле карточки (как в примере Expandable).
        </Card.Description>
      </Card.Content>
      <Card.Body className="px-0 pb-0 pt-base">
        <img
          src={PIN_IMAGE1}
          alt="Портрет в глянцевом красном шлеме, текст на визоре"
          className="max-h-[min(380px,48vh)] w-full object-cover"
          loading="lazy"
        />
      </Card.Body>
    </Card>
  ),
};

function QuickSubscribeCard() {
  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);

  return (
    <Card>
      <Card.Content>
        <Card.Title>Подписка</Card.Title>
        <Card.Description>
          Короткая форма внутри Card.Body с компонентом Form.
        </Card.Description>
      </Card.Content>
      <Card.Body className="border-t border-base pt-mid">
        <Form onSubmit={onSubmit} aria-label="Подписка на рассылку">
          <Input
            label="Email"
            name="email"
            inputType="text"
            placeholder="you@example.com"
            autoComplete="email"
          />
          <Button type="submit" variant="default" size="large" className="w-full" ripple>
            Подписаться
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export const WithFormBody: Story = {
  name: "С формой в теле",
  render: () => <QuickSubscribeCard />,
};

export const LightTheme: Story = {
  name: "Светлая тема (Default)",
  decorators: [...lightThemeDecorator],
  render: () => (
    <Card>
      <Card.Content>
        <Card.Title>Заголовок карточки</Card.Title>
        <Card.Description>
          Обычная карточка без эффекта при наведении.
        </Card.Description>
      </Card.Content>
      <Card.Footer className="flex items-center justify-end gap-base">
        <Button variant="ghost" size="base" ripple>Отмена</Button>
        <Button variant="default" size="base" ripple>Открыть</Button>
      </Card.Footer>
    </Card>
  ),
};

export const LightThemeVariants: Story = {
  name: "Светлая тема (все варианты)",
  decorators: [...lightThemeDecorator],
  render: () => (
    <div className="flex flex-col gap-mid">
      <Card variant="default">
        <Card.Content>
          <Card.Title>Default</Card.Title>
          <Card.Description>Статическая карточка, без подъёма при наведении.</Card.Description>
        </Card.Content>
      </Card>
      <Card variant="outline">
        <Card.Content>
          <Card.Title>Outline</Card.Title>
          <Card.Description>Прозрачный фон и обводка.</Card.Description>
        </Card.Content>
      </Card>
      <Card variant="secondary">
        <Card.Content>
          <Card.Title>Secondary</Card.Title>
          <Card.Description>Accent-wash на surface.</Card.Description>
        </Card.Content>
      </Card>
    </div>
  ),
};
