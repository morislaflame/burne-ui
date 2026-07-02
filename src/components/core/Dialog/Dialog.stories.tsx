import type { ComponentType } from "react";
import { useCallback, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor } from "storybook/test";

import { Form, type FormValues } from "@/components/composite/Form";
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
          "Модальное окно (портал в `document.body`). Панель: общий `p-large` и `gap-mid` между `Header` / `Body` / `Footer`; скролл — в `Body`. `variant=\"gloss\"` — стеклянная панель.\n\n`Dialog.Trigger` — встроенный триггер, который открывает диалог после анимации нажатия.",
      },
    },
  },
  decorators: [...darkThemeDecorator],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: function DialogDemo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button type="button" onClick={() => setOpen(true)}>
          Открыть диалог
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Panel>
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
          </Dialog.Panel>
        </Dialog>
      </>
    );
  },
};

// ─── With built-in Trigger ────────────────────────────────────────────────────

export const WithTrigger: Story = {
  name: "С Dialog.Trigger",
  parameters: {
    docs: {
      description: {
        story:
          "`Dialog.Trigger asChild` — триггер открывает диалог после завершения press-анимации кнопки. `e.preventDefault()` подавляет собственную анимацию `Button`, Trigger управляет ею сам.",
      },
    },
  },
  render: function WithTriggerDemo() {
    const [open, setOpen] = useState(false);
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <Button type="button">Открыть диалог</Button>
        </Dialog.Trigger>
        <Dialog.Panel>
          <Dialog.Header>
            <Dialog.HeadingBlock>
              <Dialog.Title>Настройки</Dialog.Title>
              <Dialog.Description>
                Диалог открылся после анимации нажатия на кнопку.
              </Dialog.Description>
            </Dialog.HeadingBlock>
            <Dialog.Close />
          </Dialog.Header>
          <Dialog.Body>
            <p className="text-sm text-muted">Содержимое диалога.</p>
          </Dialog.Body>
          <Dialog.Footer>
            <Button type="button" size="base" variant="ghost" onClick={() => setOpen(false)}>
              Закрыть
            </Button>
            <Button type="button" size="base" variant="primary" onClick={() => setOpen(false)}>
              Готово
            </Button>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    );
  },
};

// ─── Interaction test ─────────────────────────────────────────────────────────

export const OpenCloseInteraction: Story = {
  name: "Interaction: открытие",
  render: function DialogInteractionDemo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button type="button" onClick={() => setOpen(true)}>
          Открыть диалог
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Panel>
            <Dialog.Header>
              <Dialog.HeadingBlock>
                <Dialog.Title>Настройки экспорта</Dialog.Title>
                <Dialog.Description>
                  Выберите формат и директорию.
                </Dialog.Description>
              </Dialog.HeadingBlock>
              <Dialog.Close />
            </Dialog.Header>
            <Dialog.Body>
              <p className="text-sm text-muted">Содержимое диалога.</p>
            </Dialog.Body>
            <Dialog.Footer>
              <Button type="button" size="base" variant="ghost" onClick={() => setOpen(false)}>
                Отмена
              </Button>
              <Button type="button" size="base" variant="primary" onClick={() => setOpen(false)}>
                Сохранить
              </Button>
            </Dialog.Footer>
          </Dialog.Panel>
        </Dialog>
      </>
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Открыть диалог" }));
    await expect(
      await screen.findByRole("dialog", { name: "Настройки экспорта" }),
    ).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Отмена" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  },
};

// ─── With form ────────────────────────────────────────────────────────────────

export const WithForm: Story = {
  name: "С формой",
  render: function DialogWithFormDemo() {
    const [open, setOpen] = useState(false);
    const onSubmit = useCallback((values: FormValues) => {
      void values;
      setOpen(false);
    }, []);

    return (
      <>
        <Button type="button" onClick={() => setOpen(true)}>
          Открыть форму в диалоге
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Panel>
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
          </Dialog.Panel>
        </Dialog>
      </>
    );
  },
};

// ─── Scrollable content ───────────────────────────────────────────────────────

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
          <Dialog.Panel>
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
          </Dialog.Panel>
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

function GlossDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button type="button" variant="gloss">Открыть gloss-диалог</Button>
      </Dialog.Trigger>
      <Dialog.Panel variant="gloss">
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
          <Button type="button" size="base" variant="ghost" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button type="button" size="base" variant="gloss" onClick={() => setOpen(false)}>
            Сохранить
          </Button>
        </Dialog.Footer>
      </Dialog.Panel>
    </Dialog>
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

// ─── Custom classNames ────────────────────────────────────────────────────────

export const CustomClassNames: Story = {
  name: "Полная кастомизация classNames",
  parameters: {
    docs: {
      description: {
        story: "кастомизация classNames для Dialog",
      },
    },
  },
  render: function DialogClassNamesStory() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button type="button" onClick={() => setOpen(true)}>
          Открыть диалог
        </Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          classNames={{
            panel: "border-primary/40 bg-primary/5 shadow-token-large",
            title: "text-primary font-semibold",
            description: "text-foreground/80",
            footer: "border-t border-primary/20 pt-small",
          }}
        >
          <Dialog.Panel>
            <Dialog.Header>
              <Dialog.HeadingBlock>
                <Dialog.Title>Настройки</Dialog.Title>
                <Dialog.Description>Все слоты настроены через classNames.</Dialog.Description>
              </Dialog.HeadingBlock>
              <Dialog.Close />
            </Dialog.Header>
            <Dialog.Body>
              <p className="text-sm text-muted">Контент модального окна.</p>
            </Dialog.Body>
            <Dialog.Footer>
              <Button type="button" size="small" onClick={() => setOpen(false)}>
                Закрыть
              </Button>
            </Dialog.Footer>
          </Dialog.Panel>
        </Dialog>
      </>
    );
  },
};
