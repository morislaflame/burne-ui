import type { ComponentType, FormEvent } from "react";
import { useCallback, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Form } from "@/components/composite/Form";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";
import { Dialog } from ".";

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
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
      data-theme="light"
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
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
          "Модальное окно (портал в `document.body`). Панель: общий `p-large` и `gap-mid` между `Header` / `Body` / `Footer`; скролл — в `Body`. `variant=\"gloss\"` — стеклянная панель.",
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
            <p className="text-sm leading-relaxed text-muted">
              Произвольный контент: поля формы, списки, предпросмотр. Здесь только
              иллюстрация скролла при большом объёме текста.
            </p>
            <p className="mt-plus text-sm leading-relaxed text-muted">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </Dialog.Body>
          <Dialog.Footer>
            <Button type="button" size="base" variant="ghost" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="button" size="base" variant="primary" onClick={() => setOpen(false)}>
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
            <Dialog.Body>
              <Form.Section>
                <Input>
                  <Input.Label>Имя</Input.Label>
                  <Input.Control name="name" placeholder="Иван" autoComplete="name" />
                </Input>
                <Input>
                  <Input.Label>Email</Input.Label>
                  <Input.Control
                    name="email"
                    inputType="text"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </Input>
              </Form.Section>
            </Dialog.Body>
            <Dialog.Footer>
              <Button
                type="button"
                size="base"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                Отмена
              </Button>
              <Button type="submit" size="base" variant="primary">
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
        <Button type="button" size="base" variant="outline" onClick={() => setOpen(true)}>
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
              <p key={index} className="mb-mid text-sm leading-normal text-muted last:mb-0">
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
            <Button type="button" size="base" variant="ghost" onClick={() => setOpen(false)}>
              Закрыть
            </Button>
            <Button type="button" size="base" variant="primary" onClick={() => setOpen(false)}>
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

// ─── Gloss variant ───────────────────────────────────────────────────────────

const dottedGridStyle = {
  backgroundImage: "radial-gradient(rgb(128 128 128 / 0.22) 1px, transparent 1px)",
  backgroundSize: "30px 30px",
  backgroundPosition: "2px 2px",
} as const;

function glossDottedDecorator(light = false) {
  return (Story: ComponentType) => (
    <div
      data-theme={light ? "light" : undefined}
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)", ...dottedGridStyle }}
    >
      <div className="mx-auto max-w-xl">
        <Story />
      </div>
    </div>
  );
}

function GlossDialogContent({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} variant="gloss">
      <Dialog.Header>
        <Dialog.HeadingBlock>
          <Dialog.Title>Стеклянный диалог</Dialog.Title>
          <Dialog.Description>
            variant=&quot;gloss&quot; — модальная панель с conic-обводкой и бликом.
          </Dialog.Description>
        </Dialog.HeadingBlock>
        <Dialog.Close />
      </Dialog.Header>
      <Dialog.Body className="flex flex-col gap-mid">
        <Input>
          <Input.Label>Имя</Input.Label>
          <Input.Control variant="gloss" name="name" placeholder="Иван" autoComplete="name" />
        </Input>
        <Input>
          <Input.Label>Email</Input.Label>
          <Input.Control
            variant="gloss"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </Input>
      </Dialog.Body>
      <Dialog.Footer>
        <Button type="button" size="base" variant="ghost" onClick={() => onOpenChange(false)}>
          Отмена
        </Button>
        <Button type="button" size="base" variant="gloss" onClick={() => onOpenChange(false)}>
          Сохранить
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}

function GlossDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="button" variant="gloss" onClick={() => setOpen(true)}>
        Открыть gloss-диалог
      </Button>
      <GlossDialogContent open={open} onOpenChange={setOpen} />
    </>
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
