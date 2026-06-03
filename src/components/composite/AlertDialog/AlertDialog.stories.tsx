import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/components/core/Button";
import {
  AlertDialog,
  primaryButtonVariantForAlertTone,
  type AlertDialogSize,
} from "./AlertDialog";
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
          "Модалка подтверждения (`alertdialog`): те же семантические статусы и иконки, что у `Alert`; размеры `small`–`large`. В `AlertDialog.Footer` для прямых потомков `Button` без `size` подставляется размер кнопки по размеру модалки (`footerButtonSizeForAlertDialog` / `useAlertDialog().footerButtonSize`). Подложка и Escape не закрывают окно.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
  argTypes: {
    size: {
      control: "select",
      options: ["small", "base", "mid", "large"],
    },
    status: {
      control: "select",
      options: ["default", "outline", "secondary", "danger", "success", "info", "warning"],
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function ConfirmTemplate({
  status,
  size = "base",
  label = "Открыть",
}: {
  status?: AlertStatus;
  size?: AlertDialogSize;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const tone = status ?? "default";
  const primaryVariant = primaryButtonVariantForAlertTone(tone);
  return (
    <>
      <Button type="button" size="base" variant="outline" onClick={() => setOpen(true)}>
        {label}
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen} size={size} status={status}>
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
          <Button type="button" variant={primaryVariant} onClick={() => setOpen(false)}>
            Продолжить
          </Button>
        </AlertDialog.Footer>
      </AlertDialog>
    </>
  );
}

export const ConfirmDelete: Story = {
  name: "Danger",
  render: () => <ConfirmTemplate status="danger" label="Удалить (danger)" />,
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
