import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IoCopyOutline, IoLinkOutline, IoShareSocialOutline, IoTrashOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button/Button";
import { Input } from "@/components/core/Input";
import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

import { Popover } from "./Popover";

const framedDecorator = [
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
  title: "Core Components/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Всплывающая панель по **click** на триггере. Compound: `<Popover.Trigger>`, `<Popover.Content>`, опционально `<Popover.Header>` с `<Popover.Label>` / `<Popover.Hint>`, `<Popover.Body>`, `<Popover.Arrow />`. Padding — на всей панели; зазор между header и body — prop `gap` у `<Popover.Content>`. Placement и flip — как у `Tooltip`; закрытие — клик снаружи или `Escape`.",
      },
    },
  },
  decorators: [...framedDecorator],
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "Базовый",
  render: () => (
    <Popover>
      <Popover.Trigger>
        <Button variant="outline" type="button">
          Открыть
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Body>
          <Text as="p" variant="small">
            Произвольный контент внутри панели.
          </Text>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  ),
};

export const WithHeader: Story = {
  name: "Header + Label + Hint",
  render: () => (
    <Popover side="bottom">
      <Popover.Trigger>
        <Button variant="secondary" type="button">
          Настройки
        </Button>
      </Popover.Trigger>
      <Popover.Content showArrow>
        <Popover.Arrow />
        <Popover.Header>
          <Popover.Label>Экспорт</Popover.Label>
          <Popover.Hint>Выберите формат или скопируйте ссылку</Popover.Hint>
        </Popover.Header>
        <Popover.Body>
          <div className="flex flex-col gap-small">
            <Button variant="ghost" size="small" type="button">
              Скачать PDF
            </Button>
            <Button variant="ghost" size="small" type="button">
              Скачать CSV
            </Button>
          </div>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  ),
};

export const Placements: Story = {
  name: "Placement (4 стороны)",
  render: () => (
    <div className="grid grid-cols-2 gap-xlarge py-xlarge">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <div key={side} className="flex items-center justify-center">
          <Popover side={side}>
            <Popover.Trigger>
              <Button variant="outline" type="button" className="capitalize">
                {side}
              </Button>
            </Popover.Trigger>
            <Popover.Content showArrow offset={10}>
              <Popover.Arrow />
              <Popover.Body>
                <Text as="p" variant="small">{`Popover ${side}`}</Text>
              </Popover.Body>
            </Popover.Content>
          </Popover>
        </div>
      ))}
    </div>
  ),
};

const TAG_COLORS = [
  { id: "accent", label: "Accent", className: "bg-accent" },
  { id: "danger", label: "Danger", className: "bg-danger" },
  { id: "success", label: "Success", className: "bg-success" },
  { id: "warning", label: "Warning", className: "bg-warning" },
  { id: "info", label: "Info", className: "bg-info" },
] as const;

/** Кастомная панель: выбор цвета тега + превью — пример для dropdown-подобных сценариев. */
function TagColorPopoverDemo() {
  const [colorId, setColorId] = useState<(typeof TAG_COLORS)[number]["id"]>("accent");
  const active = TAG_COLORS.find((c) => c.id === colorId)!;

  return (
    <Popover side="bottom" defaultOpen>
      <Popover.Trigger>
        <Button variant="outline" type="button" className="gap-small">
          <span className={cn("size-3 rounded-full", active.className)} aria-hidden />
          Цвет тега
        </Button>
      </Popover.Trigger>
      <Popover.Content showArrow className="max-w-none">
        <Popover.Arrow />
        <Popover.Header>
          <Popover.Label>Метка задачи</Popover.Label>
          <Popover.Hint>Цвет виден в списке и на канбан-доске</Popover.Hint>
        </Popover.Header>
        <Popover.Body>
          <div className="flex flex-col gap-plus">
            <div className="flex flex-wrap gap-small">
              {TAG_COLORS.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  aria-label={color.label}
                  aria-pressed={colorId === color.id}
                  className={cn(
                    "inline-flex size-8 items-center justify-center rounded-base border-2 outline-none transition-colors",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                    colorId === color.id ? "border-accent" : "border-transparent",
                  )}
                  onClick={() => setColorId(color.id)}
                >
                  <span className={cn("size-5 rounded-full", color.className)} />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-base rounded-base border border-base bg-surface-secondary px-base py-small">
              <span className={cn("size-4 shrink-0 rounded-full", active.className)} aria-hidden />
              <Text as="span" variant="small">
                {active.label}
              </Text>
            </div>
            <Input label="Подпись" defaultValue="Срочно" size="small" />
          </div>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
}

export const CustomTagColorPanel: Story = {
  name: "Кастомная панель (TagColorPicker)",
  render: () => <TagColorPopoverDemo />,
};

function ShareLinkPopoverDemo() {
  const [copied, setCopied] = useState(false);

  return (
    <Popover side="top">
      <Popover.Trigger>
        <Button variant="default" type="button" leftIcon={<IoShareSocialOutline aria-hidden />}>
          Поделиться
        </Button>
      </Popover.Trigger>
      <Popover.Content showArrow>
        <Popover.Arrow />
        <Popover.Header>
          <Popover.Label>Поделиться ссылкой</Popover.Label>
          <Popover.Hint>Доступ по ссылке — только чтение</Popover.Hint>
        </Popover.Header>
        <Popover.Body>
          <div className="flex flex-col gap-plus">
            <Input
              readOnly
              size="small"
              defaultValue="https://app.example.com/doc/7xk2"
              suffix={
                <Button
                  variant="ghost"
                  size="small"
                  type="button"
                  aria-label="Копировать"
                  onClick={() => {
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 1500);
                  }}
                >
                  <IoCopyOutline aria-hidden />
                </Button>
              }
            />
            <div className="grid grid-cols-2 gap-small">
              <Button variant="outline" size="small" type="button" leftIcon={<IoLinkOutline aria-hidden />}>
                Ссылка
              </Button>
              <Button variant="ghost" size="small" type="button" className="text-danger" leftIcon={<IoTrashOutline aria-hidden />}>
                Отозвать
              </Button>
            </div>
            {copied ? (
              <Text as="p" variant="tools" className="text-success">
                Скопировано
              </Text>
            ) : null}
          </div>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
}

export const CustomSharePanel: Story = {
  name: "Кастомная панель (ShareLink)",
  render: () => <ShareLinkPopoverDemo />,
};

export const Controlled: Story = {
  name: "Контролируемый",
  render: function ControlledPopover() {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex flex-col items-center gap-mid">
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger>
            <Button variant="outline" type="button">
              {open ? "Закрыть" : "Открыть"}
            </Button>
          </Popover.Trigger>
          <Popover.Content>
            <Popover.Body>
              <Text as="p" variant="small">
                Состояние снаружи: {open ? "открыт" : "закрыт"}
              </Text>
            </Popover.Body>
          </Popover.Content>
        </Popover>
        <Button variant="ghost" size="small" type="button" onClick={() => setOpen((v) => !v)}>
          Toggle снаружи
        </Button>
      </div>
    );
  },
};

export const Accessibility: Story = {
  name: "Доступность",
  render: () => (
    <div className="flex max-w-md flex-col gap-mid text-left">
      <p className="text-sm text-muted">
        Панель: <code className="text-accent">role=&quot;dialog&quot;</code>,{" "}
        <code className="text-accent">aria-labelledby</code> /{" "}
        <code className="text-accent">aria-describedby</code> от Header. Триггер —{" "}
        <code className="text-accent">aria-expanded</code> и{" "}
        <code className="text-accent">aria-controls</code>. Закрытие: клик вне панели,{" "}
        <kbd className="rounded-small border border-base px-xsmall py-0.5 text-tools">Escape</kbd>.
      </p>
      <Popover>
        <Popover.Trigger>
          <Button variant="outline" type="button">
            Справка
          </Button>
        </Popover.Trigger>
        <Popover.Content>
          <Popover.Header>
            <Popover.Label>Справка по полю</Popover.Label>
          </Popover.Header>
          <Popover.Body>
            <Text as="p" variant="small" className="text-muted">
              Используйте формат ISO 8601 для даты.
            </Text>
          </Popover.Body>
        </Popover.Content>
      </Popover>
    </div>
  ),
};
