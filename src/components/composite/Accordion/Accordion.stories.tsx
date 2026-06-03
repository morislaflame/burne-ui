import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Ripple } from "@/components/core/Ripple";

import { Accordion } from "./Accordion";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-2xl">
        <Story />
      </div>
    </div>
  ),
] as const;

const infoIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

const items = [
  {
    content:
      "Доставка по РФ 2–5 дней. Международная доставка рассчитывается отдельно.",
    icon: infoIcon,
    title: "Как оформить заказ?",
  },
  {
    content: "Возврат возможен в течение 14 дней при сохранении товарного вида.",
    title: "При каких условиях можно вернуть товар?",
  },
  {
    content: "Избегайте абразивов и агрессивной химии. Хранить в сухом месте.",
    title: "Как ухаживать за товаром?",
  },
] as const;

function AccordionItemDemo({
  item,
}: {
  item: (typeof items)[number];
}) {
  return (
    <>
      <Accordion.Heading>
        <Accordion.Trigger>
          <Accordion.Message>
            {"icon" in item && item.icon ? (
              <Accordion.Icon>{item.icon}</Accordion.Icon>
            ) : null}
            <Accordion.Content>
              <Accordion.Title>{item.title}</Accordion.Title>
            </Accordion.Content>
            <Accordion.Indicator />
          </Accordion.Message>
        </Accordion.Trigger>
      </Accordion.Heading>
      <Accordion.Panel>
        <Accordion.Body>{item.content}</Accordion.Body>
      </Accordion.Panel>
    </>
  );
}

const meta = {
  title: "Composite Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Группа раскрывающихся пунктов на базе `Expandable`. Слоты `Message`, `Icon`, `Content`, `Title`, `Indicator` — те же стили, что у Expandable.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Accordion className="max-w-2xl" defaultOpenIndex={0}>
      {items.map((item, index) => (
        <Accordion.Item key={index}>
          <AccordionItemDemo item={item} />
        </Accordion.Item>
      ))}
    </Accordion>
  ),
};

export const PressRipple: Story = {
  name: "Риппл по нажатию в триггере",
  render: () => (
    <Accordion className="max-w-md" defaultOpenIndex={0}>
      {items.map((item, index) => (
        <Accordion.Item key={index}>
          <Accordion.Heading>
            <Accordion.Trigger>
              <Ripple color="accentMuted" />
              <Accordion.Message>
                {"icon" in item && item.icon ? (
                  <Accordion.Icon>{item.icon}</Accordion.Icon>
                ) : null}
                <Accordion.Content>
                  <Accordion.Title>{item.title}</Accordion.Title>
                </Accordion.Content>
                <Accordion.Indicator />
              </Accordion.Message>
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body>{item.content}</Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  ),
};
