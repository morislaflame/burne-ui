import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { resolveAlertStatus } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";
import {
  AlertDialog,
  primaryButtonVariantForAlertTone,
  type AlertDialogProps,
  type AlertDialogSize,
} from "./AlertDialog";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[24rem] flex-col items-center justify-center p-xlarge text-foreground"
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
          "Модалка подтверждения (`alertdialog`): те же семантические варианты и иконки, что у `Alert`; размеры `small`–`large`. В `AlertDialog.Footer` для прямых потомков `Button` без `size` подставляется размер кнопки по размеру модалки (`footerButtonSizeForAlertDialog` / `useAlertDialog().footerButtonSize`). Подложка и Escape не закрывают окно.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
  argTypes: {
    size: {
      control: "select",
      options: ["small", "base", "large"],
    },
    variant: {
      control: "select",
      options: ["default", "outline", "secondary", "danger", "success", "info"],
    },
    status: {
      control: "select",
      options: ["warning"],
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function ConfirmTemplate({
  toneProps,
  size = "base",
  label = "Открыть",
}: {
  toneProps: Pick<AlertDialogProps, "variant" | "status">;
  size?: AlertDialogSize;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const tone = resolveAlertStatus(toneProps.status, toneProps.variant);
  const primaryVariant = primaryButtonVariantForAlertTone(tone);
  return (
    <>
      <Button type="button" size="base" variant="outline" onClick={() => setOpen(true)}>
        {label}
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen} size={size} {...toneProps}>
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
  render: () => <ConfirmTemplate toneProps={{ variant: "danger" }} label="Удалить (danger)" />,
};

export const VariantDefault: Story = {
  name: "Вариант default",
  render: () => <ConfirmTemplate toneProps={{ variant: "default" }} label="Default" />,
};


export const VariantSuccess: Story = {
  name: "Вариант success",
  render: () => <ConfirmTemplate toneProps={{ variant: "success" }} label="Success" />,
};

export const VariantInfo: Story = {
  name: "Вариант info",
  render: () => <ConfirmTemplate toneProps={{ variant: "info" }} label="Info" />,
};

export const StatusWarning: Story = {
  name: "Статус warning",
  render: () => <ConfirmTemplate toneProps={{ status: "warning" }} label="Warning" />,
};

export const Sizes: Story = {
  name: "Размеры small · base · large",
  render: function SizesDemo() {
    return (
      <div className="flex max-w-2xl flex-col flex-wrap gap-xlarge sm:flex-row sm:items-start">
        {(["small", "base", "large"] as const).map((size) => (
          <div key={size} className="flex flex-col items-start gap-base">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              {size}
            </span>
            <ConfirmTemplate
              toneProps={{ variant: "info" }}
              size={size}
              label={`Открыть (${size})`}
            />
          </div>
        ))}
      </div>
    );
  },
};
