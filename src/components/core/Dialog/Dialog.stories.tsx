import type { ComponentType, FormEvent } from "react";
import { useCallback, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../Button";
import { Dialog } from "./Dialog";
import { Form } from "../../composite/Form";
import { Input } from "../Input/Input";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex flex-col items-center justify-center w-full p-8 text-b-text"
      style={{ backgroundColor: "var(--b-color-bg)" }}
    >
      <div className="mx-auto max-w-xl">
        <Story />
      </div>
    </div>
  ),
] as const;

const lightThemeDecorator = [
  (Story: ComponentType) => (
    <div
      data-b-theme="light"
      className="box-border flex flex-col items-center justify-center w-full p-8 text-b-text"
      style={{ backgroundColor: "var(--b-color-bg)" }}
    >
      <div className="mx-auto max-w-xl">
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
          "Модальное окно (портал в `document.body`). Длинный контент скроллится в `Dialog.Body`; шапка и футер фиксированы. Управление через `open` / `onOpenChange`.",
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

export const WithForm: Story = {
  name: "С формой",
  render: function DialogWithFormDemo() {
    const [open, setOpen] = useState(false);
    const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setOpen(false);
    }, []);

    return (
      <>
        <Button type="button" onClick={() => setOpen(true)}>
          Открыть форму в диалоге
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Header>
            <Dialog.HeadingBlock>
              <Dialog.Title>Быстрое редактирование</Dialog.Title>
              <Dialog.Description>
                Данные отправляются только в демо — страница не перезагружается.
              </Dialog.Description>
            </Dialog.HeadingBlock>
            <Dialog.Close />
          </Dialog.Header>
          <Form
            onSubmit={onSubmit}
            aria-label="Форма в диалоге"
            className="min-w-0"
          >
            <Dialog.Body className="flex flex-col gap-4">
              <Input
                label="Имя"
                name="name"
                placeholder="Иван"
                autoComplete="name"
              />
              <Input
                label="Email"
                name="email"
                inputType="text"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </Dialog.Body>
            <Dialog.Footer>
              <Button
                type="button"
                size="s"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                Отмена
              </Button>
              <Button type="submit" size="s" variant="default">
                Сохранить
              </Button>
            </Dialog.Footer>
          </Form>
        </Dialog>
      </>
    );
  },
};

export const ScrollableContent: Story = {
  name: "С прокручиваемым контентом",
  render: function ScrollableContentDemo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button type="button" size="s" variant="outline" onClick={() => setOpen(true)}>
          Длинный контент
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Header>
            <Dialog.HeadingBlock>
              <Dialog.Title>Прокручиваемый контент</Dialog.Title>
              <Dialog.Description>
                Заголовок и описание остаются на месте; прокрутка только в области ниже.
              </Dialog.Description>
            </Dialog.HeadingBlock>
            <Dialog.Close />
          </Dialog.Header>
          <Dialog.Body>
            {Array.from({ length: 10 }).map((_, index) => (
              <p key={index} className="mb-4 text-sm leading-normal text-b-muted last:mb-0">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                culpa qui officia deserunt mollit anim id est laborum.
              </p>
            ))}
          </Dialog.Body>
          <Dialog.Footer>
            <Button type="button" size="s" variant="ghost" onClick={() => setOpen(false)}>
              Закрыть
            </Button>
            <Button type="button" size="s" variant="default" onClick={() => setOpen(false)}>
              Готово
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
