import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor } from "storybook/test";

import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";

import { Drawer, type DrawerPlacement, type DrawerSize } from ".";

const decorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[18rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Drawer",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Выдвижная панель (портал в `document.body`). Поддерживает четыре направления, три размера, перетягивание (`Drawer.Handle`), скролл в `Drawer.Body` и `isDismissable={false}` на `Drawer.Backdrop`.\n\n`Drawer.Trigger` — встроенный триггер, открывает дравер после анимации нажатия.",
      },
    },
  },
  decorators: [...decorator],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Default (right) ─────────────────────────────────────────────────────────

export const Default: Story = {
  name: "По умолчанию (right)",
  render: function DefaultDemo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Открыть Drawer</Button>
        <Drawer open={open} onOpenChange={setOpen}>
          <Drawer.Panel>
            <Drawer.Header>
              <Drawer.HeadingBlock>
                <Drawer.Title>Настройки</Drawer.Title>
                <Drawer.Description>Выберите нужные параметры.</Drawer.Description>
              </Drawer.HeadingBlock>
              <Drawer.Close />
            </Drawer.Header>
            <Drawer.Body>
              <p className="text-base text-muted">Произвольный контент внутри боди.</p>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="ghost" onClick={() => setOpen(false)}>Отмена</Button>
              <Button onClick={() => setOpen(false)}>Сохранить</Button>
            </Drawer.Footer>
          </Drawer.Panel>
        </Drawer>
      </>
    );
  },
};

// ─── With built-in Trigger ────────────────────────────────────────────────────

export const WithTrigger: Story = {
  name: "С Drawer.Trigger",
  parameters: {
    docs: {
      description: {
        story:
          "`Drawer.Trigger asChild` — триггер открывает дравер после завершения press-анимации кнопки.",
      },
    },
  },
  render: function WithTriggerDemo() {
    const [open, setOpen] = useState(false);
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <Drawer.Trigger asChild>
          <Button>Открыть Drawer</Button>
        </Drawer.Trigger>
        <Drawer.Panel>
          <Drawer.Header>
            <Drawer.HeadingBlock>
              <Drawer.Title>Настройки</Drawer.Title>
              <Drawer.Description>Открылся после анимации нажатия.</Drawer.Description>
            </Drawer.HeadingBlock>
            <Drawer.Close />
          </Drawer.Header>
          <Drawer.Body>
            <p className="text-base text-muted">Содержимое дравера.</p>
          </Drawer.Body>
          <Drawer.Footer>
            <Button variant="ghost" onClick={() => setOpen(false)}>Закрыть</Button>
          </Drawer.Footer>
        </Drawer.Panel>
      </Drawer>
    );
  },
};

// ─── Interaction test ─────────────────────────────────────────────────────────

export const OpenCloseInteraction: Story = {
  name: "Interaction: открытие",
  render: function DrawerInteractionDemo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Открыть Drawer</Button>
        <Drawer open={open} onOpenChange={setOpen}>
          <Drawer.Panel>
            <Drawer.Header>
              <Drawer.HeadingBlock>
                <Drawer.Title>Настройки</Drawer.Title>
                <Drawer.Description>Выберите нужные параметры.</Drawer.Description>
              </Drawer.HeadingBlock>
              <Drawer.Close />
            </Drawer.Header>
            <Drawer.Body>
              <p className="text-base text-muted">Произвольный контент внутри боди.</p>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="ghost" onClick={() => setOpen(false)}>Отмена</Button>
              <Button onClick={() => setOpen(false)}>Сохранить</Button>
            </Drawer.Footer>
          </Drawer.Panel>
        </Drawer>
      </>
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Открыть Drawer" }));
    await expect(await screen.findByRole("dialog", { name: "Настройки" })).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Отмена" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  },
};

// ─── All placements ───────────────────────────────────────────────────────────

const PLACEMENTS: DrawerPlacement[] = ["right", "left", "bottom", "top"];

const HANDLE_HINT: Record<DrawerPlacement, string> = {
  bottom: "Потяните полоску вниз, чтобы закрыть.",
  top: "Потяните полоску вверх, чтобы закрыть.",
  left: "Потяните полоску влево, чтобы закрыть.",
  right: "Потяните полоску вправо, чтобы закрыть.",
};

function DrawerHandleDemoContent({ placement }: { placement: DrawerPlacement }) {
  const isHorizontal = placement === "left" || placement === "right";

  const main = (
    <>
      <Drawer.Header>
        <Drawer.HeadingBlock>
          <Drawer.Title>Handle · {placement}</Drawer.Title>
          <Drawer.Description>{HANDLE_HINT[placement]}</Drawer.Description>
        </Drawer.HeadingBlock>
        <Drawer.Close />
      </Drawer.Header>
      <Drawer.Body>
        <p className="text-base text-muted">{HANDLE_HINT[placement]}</p>
      </Drawer.Body>
    </>
  );

  if (isHorizontal) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 self-stretch">
        {placement === "right" ? <Drawer.Handle /> : null}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">{main}</div>
        {placement === "left" ? <Drawer.Handle /> : null}
      </div>
    );
  }

  if (placement === "top") {
    return (
      <>
        {main}
        <Drawer.Handle />
      </>
    );
  }

  return (
    <>
      <Drawer.Handle />
      {main}
    </>
  );
}

export const AllPlacements: Story = {
  name: "Все плейсменты",
  render: function AllPlacementsDemo() {
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState<DrawerPlacement>("right");

    const openWith = (p: DrawerPlacement) => {
      setPlacement(p);
      setOpen(true);
    };

    return (
      <div className="flex flex-wrap gap-base">
        {PLACEMENTS.map((p) => (
          <Button key={p} variant="outline" onClick={() => openWith(p)}>
            {p}
          </Button>
        ))}
        <Drawer open={open} onOpenChange={setOpen} placement={placement}>
          <Drawer.Panel>
            <Drawer.Header>
              <Drawer.HeadingBlock>
                <Drawer.Title>placement="{placement}"</Drawer.Title>
              </Drawer.HeadingBlock>
              <Drawer.Close />
            </Drawer.Header>
            <Drawer.Body>
              <p className="text-base text-muted">Ящик выезжает со стороны «{placement}».</p>
            </Drawer.Body>
            <Drawer.Footer>
              <Button onClick={() => setOpen(false)}>Закрыть</Button>
            </Drawer.Footer>
          </Drawer.Panel>
        </Drawer>
      </div>
    );
  },
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

const SIZES: DrawerSize[] = ["default", "mid", "full"];

export const Sizes: Story = {
  name: "Размеры",
  render: function SizesDemo() {
    const [open, setOpen] = useState(false);
    const [size, setSize] = useState<DrawerSize>("default");

    const openWith = (s: DrawerSize) => {
      setSize(s);
      setOpen(true);
    };

    return (
      <div className="flex flex-wrap gap-base">
        {SIZES.map((s) => (
          <Button key={s} variant="outline" onClick={() => openWith(s)}>
            {s}
          </Button>
        ))}
        <Drawer open={open} onOpenChange={setOpen} placement="right">
          <Drawer.Panel size={size}>
            <Drawer.Header>
              <Drawer.HeadingBlock>
                <Drawer.Title>size="{size}"</Drawer.Title>
                <Drawer.Description>
                  {size === "default" && "Стандарт — до 24rem."}
                  {size === "mid" && "Половина экрана — 50vw."}
                  {size === "full" && "На весь экран."}
                </Drawer.Description>
              </Drawer.HeadingBlock>
              <Drawer.Close />
            </Drawer.Header>
            <Drawer.Body>
              <p className="text-base text-muted">Контент ящика размера «{size}».</p>
            </Drawer.Body>
            <Drawer.Footer>
              <Button onClick={() => setOpen(false)}>Закрыть</Button>
            </Drawer.Footer>
          </Drawer.Panel>
        </Drawer>
      </div>
    );
  },
};

// ─── Handle (all placements) ──────────────────────────────────────────────────

export const WithHandle: Story = {
  name: "Handle (все плейсменты)",
  render: function WithHandleDemo() {
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState<DrawerPlacement>("bottom");

    const openWith = (p: DrawerPlacement) => {
      setPlacement(p);
      setOpen(true);
    };

    return (
      <div className="flex flex-wrap gap-base">
        {PLACEMENTS.map((p) => (
          <Button key={p} variant="outline" onClick={() => openWith(p)}>
            {p}
          </Button>
        ))}
        <Drawer open={open} onOpenChange={setOpen} placement={placement}>
          <Drawer.Panel>
            <DrawerHandleDemoContent placement={placement} />
          </Drawer.Panel>
        </Drawer>
      </div>
    );
  },
};

// ─── isDismissable=false ──────────────────────────────────────────────────────

export const NonDismissable: Story = {
  name: "isDismissable={false}",
  render: function NonDismissableDemo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Открыть (фон не закрывает)
        </Button>
        <Drawer open={open} onOpenChange={setOpen}>
          <Drawer.Panel>
            <Drawer.Backdrop isDismissable={false} />
            <Drawer.Header>
              <Drawer.HeadingBlock>
                <Drawer.Title>Подтвердите действие</Drawer.Title>
              </Drawer.HeadingBlock>
            </Drawer.Header>
            <Drawer.Body>
              <p className="text-base text-muted">
                Клик по подложке не закрывает. Используйте кнопку ниже.
              </p>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="ghost" onClick={() => setOpen(false)}>Отмена</Button>
              <Button onClick={() => setOpen(false)}>Подтвердить</Button>
            </Drawer.Footer>
          </Drawer.Panel>
        </Drawer>
      </>
    );
  },
};

// ─── Scrollable body ──────────────────────────────────────────────────────────

export const ScrollableBody: Story = {
  name: "Скролл в Body",
  render: function ScrollableBodyDemo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>Длинный контент</Button>
        <Drawer open={open} onOpenChange={setOpen} placement="right">
          <Drawer.Panel>
            <Drawer.Header>
              <Drawer.HeadingBlock>
                <Drawer.Title>Длинный список</Drawer.Title>
                <Drawer.Description>Шапка и футер зафиксированы.</Drawer.Description>
              </Drawer.HeadingBlock>
              <Drawer.Close />
            </Drawer.Header>
            <Drawer.Body>
              {Array.from({ length: 18 }).map((_, i) => (
                <p key={i} className="mb-mid text-sm leading-normal text-muted last:mb-0">
                  Строка {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              ))}
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="ghost" onClick={() => setOpen(false)}>Закрыть</Button>
            </Drawer.Footer>
          </Drawer.Panel>
        </Drawer>
      </>
    );
  },
};

// ─── With Form ────────────────────────────────────────────────────────────────

export const WithForm: Story = {
  name: "С формой",
  render: function WithFormDemo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Форма в Drawer</Button>
        <Drawer open={open} onOpenChange={setOpen} placement="right">
          <Drawer.Panel>
            <Drawer.Header>
              <Drawer.HeadingBlock>
                <Drawer.Title>Редактировать профиль</Drawer.Title>
                <Drawer.Description>Заполните поля и сохраните изменения.</Drawer.Description>
              </Drawer.HeadingBlock>
              <Drawer.Close />
            </Drawer.Header>
            <Drawer.Body className="flex flex-col gap-mid">
              <Input>
                <Input.Label>Имя</Input.Label>
                <Input.Control name="name" placeholder="Иван" />
              </Input>
              <Input>
                <Input.Label>Email</Input.Label>
                <Input.Control name="email" placeholder="you@example.com" />
              </Input>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="ghost" onClick={() => setOpen(false)}>Отмена</Button>
              <Button onClick={() => setOpen(false)}>Сохранить</Button>
            </Drawer.Footer>
          </Drawer.Panel>
        </Drawer>
      </>
    );
  },
};

// ─── Custom classNames ────────────────────────────────────────────────────────

export const CustomClassNames: Story = {
  name: "Полная кастомизация classNames",
  parameters: {
    docs: {
      description: {
        story: "кастомизация classNames для Drawer",
      },
    },
  },
  render: function DrawerClassNamesStory() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button type="button" onClick={() => setOpen(true)}>
          Открыть Drawer
        </Button>
        <Drawer
          open={open}
          onOpenChange={setOpen}
          classNames={{
            panel: "border-primary/40 shadow-token-lg",
            header: "border-b border-primary/20 pb-small",
            title: "text-primary font-semibold",
            description: "text-foreground/75",
            footer: "border-t border-primary/20 pt-small",
          }}
        >
          <Drawer.Panel>
            <Drawer.Header>
              <Drawer.HeadingBlock>
                <Drawer.Title>Настройки</Drawer.Title>
                <Drawer.Description>Все слоты настроены через classNames.</Drawer.Description>
              </Drawer.HeadingBlock>
              <Drawer.Close />
            </Drawer.Header>
            <Drawer.Body>
              <p className="text-small text-muted">Контент выдвижной панели.</p>
            </Drawer.Body>
            <Drawer.Footer>
              <Button type="button" size="small" onClick={() => setOpen(false)}>
                Закрыть
              </Button>
            </Drawer.Footer>
          </Drawer.Panel>
        </Drawer>
      </>
    );
  },
};
