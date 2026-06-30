import type { ComponentType } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import {
  DualApiStoryPanel,
  DualApiStoryPanels,
} from "@/components/core/utils/dualApiStoryChrome";
import { dualApiStorySource } from "@/components/core/utils/dualApiStorySource";

import { TextArea } from "./index";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-md">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/TextArea",
  component: TextArea,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Многострочное поле. **Simple** — `label`, `hint`, `error` на root; **Compound** — `<TextArea.Label>` / `<TextArea.Control>` / … Варианты и статусы как у `Input`. Минимальная высота — как у `Input`; выше — потянув за маркер в правом нижнем углу.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
} satisfies Meta<typeof TextArea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Simple и Compound",
  ...dualApiStorySource,
  render: () => (
    <DualApiStoryPanels>
      <DualApiStoryPanel title="Simple">
        <TextArea
          label="Комментарий"
          hint="До 500 символов."
          placeholder="Ваш отзыв…"
          rows={1}
        />
      </DualApiStoryPanel>
      <DualApiStoryPanel title="Compound">
        <TextArea>
          <TextArea.Label>Комментарий</TextArea.Label>
          <TextArea.Control placeholder="Ваш отзыв…" rows={1} />
          <TextArea.Hint>До 500 символов.</TextArea.Hint>
        </TextArea>
      </DualApiStoryPanel>
    </DualApiStoryPanels>
  ),
};

export const TypeInteraction: Story = {
  name: "Interaction: ввод",
  render: () => (
    <TextArea label="Комментарий" placeholder="Ваш отзыв…" rows={3} />
  ),
  play: async ({ canvas, userEvent }) => {
    const field = canvas.getByRole("textbox", { name: "Комментарий" });
    await userEvent.type(field, "Тестовый отзыв");
    await expect(field).toHaveValue("Тестовый отзыв");
  },
};

export const Outline: Story = {
  render: () => (
    <TextArea>
      <TextArea.Label>Описание</TextArea.Label>
      <TextArea.Control variant="outline" placeholder="Кратко о задаче…" />
      <TextArea.Hint>Вариант outline — прозрачный фон оболочки.</TextArea.Hint>
    </TextArea>
  ),
};

export const Variants: Story = {
  name: "Варианты",
  render: () => (
    <div className="flex w-full flex-col gap-large">
      <TextArea label="Default" variant="default" placeholder="default" />
      <TextArea label="Outline" variant="outline" placeholder="outline" />
    </div>
  ),
};

export const Statuses: Story = {
  name: "Статусы",
  render: () => (
    <div className="flex w-full flex-col gap-large">
      <TextArea status="danger" label="Danger" error="Слишком короткий текст." defaultValue="Ок" />
      <TextArea status="success" label="Success" hint="Текст сохранён." defaultValue="Готово" />
      <TextArea status="warning" label="Warning" hint="Проверьте формулировку." defaultValue="Черновик" />
    </div>
  ),
};

export const Sizes: Story = {
  name: "Размеры",
  render: () => (
    <div className="flex w-full flex-col gap-large">
      {(["small", "base", "mid", "large"] as const).map((size) => (
        <TextArea key={size} size={size} label={size} placeholder={`size="${size}"`} />
      ))}
    </div>
  ),
};

export const NotResizable: Story = {
  name: "Без ресайза",
  render: () => (
    <TextArea resizable={false} label="Фиксированная высота" hint="Ручка отключена (`resizable={false}`)." />
  ),
};

export const Disabled: Story = {
  render: () => (
    <TextArea disabled label="Disabled" defaultValue="Недоступно для редактирования." />
  ),
};

export const Required: Story = {
  render: () => (
    <TextArea isRequired label="Биография" placeholder="Расскажите о себе…" />
  ),
};

export const CustomClassNames: Story = {
  name: "Полная кастомизация classNames",
  parameters: {
    docs: {
      description: {
        story: "кастомизация classNames для TextArea",
      },
    },
  },
  render: () => (
    <TextArea
      className="max-w-md"
      classNames={{
        root: "rounded-mid border border-primary/20 p-base",
        shell: "ring-1 ring-primary/15",
        control: "text-primary placeholder:text-primary/50",
        hint: "text-foreground/70",
        error: "font-medium",
      }}
      label="Комментарий"
      placeholder="Ваш отзыв…"
      rows={3}
      status="danger"
      hint="До 500 символов."
      error="Текст слишком короткий."
    />
  ),
};
