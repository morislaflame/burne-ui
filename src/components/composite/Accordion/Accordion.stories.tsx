import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Ripple } from "@/components/core/Ripple";

import { Accordion } from ".";

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
      "Delivery within Russia in 2–5 days. International shipping is calculated separately.",
    icon: infoIcon,
    title: "How to place an order?",
  },
  {
    content: "Returns are available within 14 days if the product is in resalable condition.",
    title: "Under what conditions can the product be returned?",
  },
  {
    content: "Avoid abrasives and harsh chemicals. Store in a dry place.",
    title: "How to care for the product?",
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
          "Group of expandable items based on `Expandable`. Slots `Message`, `Icon`, `Content`, `Title`, `Indicator` — same styles as Expandable.",
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
      {items.map((item) => (
        <Accordion.Item key={item.title}>
          <AccordionItemDemo item={item} />
        </Accordion.Item>
      ))}
    </Accordion>
  ),
};

export const ExpandInteraction: Story = {
  name: "Interaction: expand",
  render: () => (
    <Accordion className="max-w-2xl" defaultOpenIndex={0}>
      {items.map((item) => (
        <Accordion.Item key={item.title}>
          <AccordionItemDemo item={item} />
        </Accordion.Item>
      ))}
    </Accordion>
  ),
  play: async ({ canvas, userEvent }) => {
    const first = canvas.getByRole("button", { name: /How to place an order/ });
    const second = canvas.getByRole("button", { name: /Under what conditions/ });
    await expect(first).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(second);
    await expect(second).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByText(/Return available/)).toBeVisible();
  },
};

export const PressRipple: Story = {
  name: "Ripple on press in trigger",
  render: () => (
    <Accordion className="max-w-md" defaultOpenIndex={0}>
      {items.map((item) => (
        <Accordion.Item key={item.title}>
          <Accordion.Heading>
            <Accordion.Trigger>
              <Ripple color="neutralMuted" />
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
