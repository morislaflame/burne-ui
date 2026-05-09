import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../Button";
import { Dialog } from "./Dialog";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border min-h-[32rem] w-full p-8 text-b-text"
      style={{ backgroundColor: "var(--b-color-bg)" }}
    >
      <div className="mx-auto w-full max-w-xl">
        <Story />
      </div>
    </div>
  ),
] as const;

const lightThemeDecorator = [
  (Story: ComponentType) => (
    <div
      data-b-theme="light"
      className="box-border min-h-[32rem] w-full p-8 text-b-text"
      style={{ backgroundColor: "var(--b-color-bg)" }}
    >
      <div className="mx-auto w-full max-w-xl">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Dialog",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Модальное окно (портал в `document.body`): хедер с заголовком и подзаголовком в стиле Expandable, кнопка закрытия, тело и футер. Управление через `open` / `onOpenChange`.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function DialogDemo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button type="button" onClick={() => setOpen(true)}>
          Открыть диалог
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Header>
            <Dialog.HeadingBlock>
              <Dialog.Title>Настройки экспорта</Dialog.Title>
              <Dialog.Description>
                Выберите формат и директорию. Изменения не применятся, пока вы не
                сохраните проект.
              </Dialog.Description>
            </Dialog.HeadingBlock>
            <Dialog.Close />
          </Dialog.Header>
          <Dialog.Body>
            <p className="text-sm leading-relaxed text-b-muted">
              Произвольный контент: поля формы, списки, предпросмотр. Здесь только
              иллюстрация скролла при большом объёме текста.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-b-muted">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </Dialog.Body>
          <Dialog.Footer>
            <Button type="button" size="s" variant="ghost" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="button" size="s" variant="default" onClick={() => setOpen(false)}>
              Сохранить
            </Button>
          </Dialog.Footer>
        </Dialog>
      </>
    );
  },
};

export const TitleOnly: Story = {
  name: "Только заголовок",
  render: function TitleOnlyDemo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button type="button" size="s" variant="outline" onClick={() => setOpen(true)}>
          Открыть
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Header>
            <Dialog.HeadingBlock>
              <Dialog.Title>Подтверждение</Dialog.Title>
            </Dialog.HeadingBlock>
            <Dialog.Close />
          </Dialog.Header>
          <Dialog.Body>
            <p className="text-sm text-b-text">Удалить выбранный элемент?</p>
          </Dialog.Body>
          <Dialog.Footer>
            <Button type="button" size="s" variant="outline" onClick={() => setOpen(false)}>
              Нет
            </Button>
            <Button type="button" size="s" variant="destructive" onClick={() => setOpen(false)}>
              Да, удалить
            </Button>
          </Dialog.Footer>
        </Dialog>
      </>
    );
  },
};

export const OnLightTheme: Story = {
  name: "Светлая тема",
  decorators: [...lightThemeDecorator],
  render: Default.render,
};
