import type { ComponentType, FormEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback } from "react";

import { Form } from "@/components/composite/Form/Form";
import { Button } from "@/components/core/Button/Button";
import { Input } from "@/components/core/Input/Input";
import { Card } from "./Card";

const PIN_IMAGE =
  "https://i.pinimg.com/736x/89/e2/85/89e285ca1fc973db199bf395f7c89669.jpg";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center p-8 text-brn-text"
      style={{ backgroundColor: "var(--brn-color-bg)" }}
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
      <Card.Footer className="flex items-center justify-end gap-2">
        <Button variant="ghost" size="s">
          Отмена
        </Button>
        <Button variant="default" size="s">
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
      <Card.Body className="px-0 pb-0 pt-2">
        <img
          src={PIN_IMAGE}
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
      <Card.Body className="border-t border-brn-border pt-4">
        <Form onSubmit={onSubmit} aria-label="Подписка на рассылку">
          <Input
            label="Email"
            name="email"
            inputType="text"
            placeholder="you@example.com"
            autoComplete="email"
          />
          <Button type="submit" variant="default" size="m" className="w-full">
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
