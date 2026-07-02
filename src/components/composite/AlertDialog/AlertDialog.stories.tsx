import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor } from "storybook/test";

import { Button } from "@/components/core/Button";
import { glossDottedDecorator } from "@/components/core/utils/glossStoryChrome";
import {
  AlertDialog,
  primaryButtonStatusForAlertTone,
  primaryButtonVariantForAlertTone,
  type AlertDialogSize,
} from "./index";
import type { AlertStatus } from "@/components/core/Alert";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[24rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
] as const;

const meta = {
  title: "Composite Components/AlertDialog",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Модалка подтверждения (`alertdialog`): те же семантические статусы и иконки, что у `Alert`; размеры `small`–`large`. `variant=\"gloss\"` — стеклянная панель. В `AlertDialog.Footer` для прямых потомков `Button` без `size` подставляется размер кнопки по размеру модалки (`footerButtonSizeForAlertDialog` / `useAlertDialog().footerButtonSize`). Подложка и Escape не закрывают окно.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
  argTypes: {
    size: {
      control: "select",
      options: ["small", "base", "mid", "large"],
    },
    variant: {
      control: "select",
      options: ["default", "outline", "secondary", "gloss"],
    },
    status: {
      control: "select",
      options: ["default", "danger", "success", "info", "warning"],
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function ConfirmTemplate({
  status: statusProp,
  size = "base",
  label = "Открыть",
  variant = "default",
}: {
  status?: AlertStatus;
  size?: AlertDialogSize;
  label?: string;
  variant?: "default" | "outline" | "secondary" | "gloss";
}) {
  const [open, setOpen] = useState(false);
  const status = statusProp ?? "default";
  const primaryVariant = primaryButtonVariantForAlertTone(status);
  const primaryStatus = primaryButtonStatusForAlertTone(status);
  return (
    <AlertDialog open={open} onOpenChange={setOpen} size={size} status={status} variant={variant}>
      <AlertDialog.Trigger asChild>
        <Button type="button" size="base" variant="outline">
          {label}
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Panel>
        <AlertDialog.Header>
          <AlertDialog.HeadingBlock>
            <AlertDialog.Title>Подтверждение</AlertDialog.Title>
            <AlertDialog.Description>
              Выберите действие — окно не закроется по клику вне панели.
            </AlertDialog.Description>
          </AlertDialog.HeadingBlock>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button type="button" variant={primaryVariant} status={primaryStatus} onClick={() => setOpen(false)}>
            Продолжить
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Panel>
    </AlertDialog>
  );
}

export const ConfirmDelete: Story = {
  name: "Danger",
  render: () => <ConfirmTemplate status="danger" label="Удалить (danger)" />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Удалить (danger)" }));
    await expect(
      await screen.findByRole("alertdialog", { name: "Подтверждение" }),
    ).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Продолжить" }));
    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
  },
};

export const StatusDefault: Story = {
  name: "Статус default",
  render: () => <ConfirmTemplate status="default" label="Default" />,
};

export const StatusSuccess: Story = {
  name: "Статус success",
  render: () => <ConfirmTemplate status="success" label="Success" />,
};

export const StatusInfo: Story = {
  name: "Статус info",
  render: () => <ConfirmTemplate status="info" label="Info" />,
};

export const StatusWarning: Story = {
  name: "Статус warning",
  render: () => <ConfirmTemplate status="warning" label="Warning" />,
};

export const Sizes: Story = {
  name: "Размеры small · base · mid · large",
  render: function SizesDemo() {
    return (
      <div className="flex max-w-2xl flex-col flex-wrap gap-xlarge sm:flex-row sm:items-start">
        {(["small", "base", "mid", "large"] as const).map((size) => (
          <div key={size} className="flex flex-col items-start gap-base">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              {size}
            </span>
            <ConfirmTemplate status="info" size={size} label={`Открыть (${size})`} />
          </div>
        ))}
      </div>
    );
  },
};

function GlossDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-plus">
      <ConfirmTemplate variant="gloss" status="danger" label="Gloss danger" />
      <ConfirmTemplate variant="gloss" status="success" label="Gloss success" />
      <ConfirmTemplate variant="gloss" status="info" label="Gloss info" />
      <ConfirmTemplate variant="gloss" status="warning" label="Gloss warning" />
    </div>
  );
}

export const Gloss: Story = {
  name: "Gloss",
  parameters: { controls: { disable: true } },
  decorators: [glossDottedDecorator(false)],
  render: () => <GlossDemo />,
};

export const GlossLight: Story = {
  name: "Gloss — светлая тема",
  parameters: { controls: { disable: true } },
  decorators: [glossDottedDecorator(true)],
  render: () => <GlossDemo />,
};

export const CustomClassNames: Story = {
  name: "Полная кастомизация classNames",
  parameters: {
    docs: {
      description: {
        story: "Кастомизация слотов через `classNames` на root (как у `Dialog`).",
      },
    },
  },
  render: function AlertDialogClassNamesStory() {
    const [open, setOpen] = useState(false);
    return (
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        status="warning"
        classNames={{
          panel: "ring-1 ring-warning/30",
          title: "text-warning font-semibold",
          description: "text-foreground/80",
          footer: "border-t border-warning/20 pt-small",
        }}
      >
        <AlertDialog.Trigger asChild>
          <Button type="button" variant="outline">
            Открыть
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Panel>
          <AlertDialog.Header>
            <AlertDialog.HeadingBlock>
              <AlertDialog.Title>Несохранённые изменения</AlertDialog.Title>
              <AlertDialog.Description>
                Все слоты настроены через classNames на root.
              </AlertDialog.Description>
            </AlertDialog.HeadingBlock>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="button" onClick={() => setOpen(false)}>
              Продолжить
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Panel>
      </AlertDialog>
    );
  },
};
