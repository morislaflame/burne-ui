import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Ripple } from "@/components/core/Ripple";
import {
  DualApiStoryPanel,
  DualApiStoryPanels,
} from "@/components/core/utils/dualApiStoryChrome";
import { dualApiStorySource } from "@/components/core/utils/dualApiStorySource";

import { Expandable } from ".";

const PIN_IMAGE =
  "https://i.pinimg.com/736x/89/e2/85/89e285ca1fc973db199bf395f7c89669.jpg";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-lg">
        <Story />
      </div>
    </div>
  ),
] as const;

const lightThemeDecorator = [
  (Story: ComponentType) => (
    <div
      data-theme="light"
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-lg">
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

const meta = {
  title: "Core Components/Expandable",
  component: Expandable,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Раскрывающийся блок. **Simple** — `title`, `description`, `icon` на root, контент в `children`. **Compound** — `Trigger`, `Panel`, опционально `Message`, `Icon`, `Content`, `Title`, `Description`.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
  args: {
    title: "Заголовок",
  },
} satisfies Meta<typeof Expandable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Simple и Compound",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple — props на &lt;Expandable&gt;">
        <Expandable
          title="Уведомления"
          icon={infoIcon}
          description="Краткое описание в триггере"
        >
          <p className="text-sm leading-relaxed">
            Контент панели — любые дети root, без отдельного Panel.
          </p>
        </Expandable>
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound — Trigger / Message">
        <Expandable>
          <Expandable.Trigger>
            <Expandable.Message>
              <Expandable.Icon>{infoIcon}</Expandable.Icon>
              <Expandable.Content>
                <Expandable.Title>Уведомления</Expandable.Title>
                <Expandable.Description>Краткое описание в триггере</Expandable.Description>
              </Expandable.Content>
            </Expandable.Message>
          </Expandable.Trigger>
          <Expandable.Panel>
            <p className="text-sm leading-relaxed">
              Любой контент: текст, списки, вложенные блоки.
            </p>
          </Expandable.Panel>
        </Expandable>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const Playground: Story = {
  render: (args) => (
    <Expandable {...args}>
      <p className="text-sm leading-relaxed">
        Любой контент внутри панели. В simple API достаточно обернуть его в{" "}
        <code className="text-xs">&lt;Expandable&gt;</code>.
      </p>
    </Expandable>
  ),
};

export const WithIcon: Story = {
  name: "С иконкой",
  render: () => (
    <Expandable title="Уведомления" icon={infoIcon}>
      <p className="text-sm">Иконка на одной линии с заголовком.</p>
    </Expandable>
  ),
};

export const WithImage: Story = {
  name: "С изображением",
  render: () => (
    <Expandable
      defaultOpen
      title="Progress is a mindset"
      description="Редакционный кадр в раскрывающемся блоке."
    >
      <img
        src={PIN_IMAGE}
        alt="Портрет в глянцевом красном шлеме, текст на визоре"
        className="w-full max-h-[min(420px,55vh)] rounded-mid object-cover"
        loading="lazy"
      />
    </Expandable>
  ),
};

export const PressRipple: Story = {
  name: "Риппл по нажатию",
  render: () => (
    <Expandable>
      <Expandable.Trigger>
        <Ripple color="neutralMuted" />
        <Expandable.Content>
          <Expandable.Title>Нажми на строку заголовка</Expandable.Title>
          <Expandable.Description>
            Ripple среди детей триггера — слой на всю кнопку (включая шеврон):{" "}
            <code className="text-xs">
              {`<Ripple color="neutralMuted" />`}
            </code>
          </Expandable.Description>
        </Expandable.Content>
      </Expandable.Trigger>
      <Expandable.Panel>
        <p className="text-sm">
          Отдельный режим для компонентов с акцентом на click-feedback.
        </p>
      </Expandable.Panel>
    </Expandable>
  ),
};

export const Accessibility: Story = {
  name: "Доступность",
  render: () => (
    <div className="flex flex-col gap-mid text-left">
      <p className="text-sm text-muted">
        Триггер — native <code className="text-primary">&lt;button type=&quot;button&quot;&gt;</code> с{" "}
        <code className="text-primary">aria-expanded</code> и{" "}
        <code className="text-primary">aria-controls</code>. Панель —{" "}
        <code className="text-primary">role=&quot;region&quot;</code>,{" "}
        <code className="text-primary">aria-labelledby</code>; при закрытии —{" "}
        <code className="text-primary">aria-hidden</code> и <code className="text-primary">inert</code>.
      </p>
      <Expandable title="Настройки уведомлений" description="Email и push">
        <p className="text-sm">Содержимое недоступно с клавиатуры, пока блок свёрнут.</p>
      </Expandable>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: /Настройки уведомлений/ });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByText(/Содержимое недоступно/)).toBeVisible();
  },
};

export const AllVariationsLight: Story = {
  name: "Все варианты — светлая тема",
  decorators: [...lightThemeDecorator],
  render: () => (
    <div className="flex flex-col gap-mid">
      <Expandable title="Только заголовок">
        <p className="text-sm">Контент без описания в триггере.</p>
      </Expandable>

      <Expandable title="С описанием" description="Дополнительная строка под заголовком.">
        <p className="text-sm">Текст внутри панели.</p>
      </Expandable>

      <Expandable
        title="С иконкой"
        icon={infoIcon}
        description="Иконка слева."
      >
        <p className="text-sm">Контент.</p>
      </Expandable>

      <Expandable
        defaultOpen
        title="С изображением"
        description="По умолчанию развёрнуто."
      >
        <img
          src={PIN_IMAGE}
          alt=""
          className="w-full max-h-[min(320px,40vh)] rounded-mid object-cover"
          loading="lazy"
        />
      </Expandable>
    </div>
  ),
};
