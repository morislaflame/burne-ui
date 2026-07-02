import type { ComponentType, ReactNode } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen } from "storybook/test";
import { IoHelpCircleOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button/Button";

import { Tooltip, type TooltipVariant } from ".";

const VARIANTS: TooltipVariant[] = [
  "default",
  "outline",
  "secondary",
  "danger",
  "info",
  "warning",
  "success",
];

const framedDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
] as const;

/** Фон страницы и `data-theme="light"`, как у `Alert.stories` («Варианты (светлая тема)»). */
const lightThemeDecorator = [
  (Story: ComponentType) => (
    <div
      data-theme="light"
      className="box-border w-full p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto w-full max-w-xl">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Подсказка по **hover** и **focus**. Compound: `<Tooltip.Trigger>` + `<Tooltip.Content>`; опционально `<Tooltip.Arrow />`. С единственным child триггера handlers и `aria-describedby` пробрасываются на него.",
      },
    },
  },
  decorators: [...framedDecorator],
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

const TOOLTIP_VARIANT_ITEMS: Array<{
  variant: TooltipVariant;
  title: string;
  description?: string;
  icon?: ReactNode;
  showIcon?: boolean;
}> = [
  {
    variant: "default",
    title: "Default",
    description: "Нейтральная подсказка без иконки статуса.",
  },
  {
    variant: "outline",
    title: "Outline",
    description: "Полупрозрачный фон с рамкой.",
  },
  {
    variant: "secondary",
    title: "Secondary",
    description: "Тот же фон, что у secondary-компонентов.",
  },
  {
    variant: "success",
    title: "Profile updated successfully",
    description: "Изменения сохранены и синхронизированы.",
  },
  {
    variant: "danger",
    title: "Unable to connect to server",
    description: "We're experiencing connection issues.",
  },
  {
    variant: "info",
    title: "Справка",
    description: "Дополнительная информация в нейтрально-информационном тоне.",
  },
  {
    variant: "warning",
    title: "Scheduled maintenance",
    description: "Services will be unavailable Sunday from 2:00 AM to 6:00 AM UTC.",
  },
  {
    variant: "default",
    title: "Своя иконка",
    description: "Иконка через prop `icon` на Panel.",
    icon: <IoHelpCircleOutline aria-hidden className="text-primary" />,
  },
  {
    variant: "danger",
    title: "Semantic без иконки",
    description: "showIcon={false} отключает стандартную иконку.",
    showIcon: false,
  },
  {
    variant: "success",
    title: "Только заголовок",
  },
];

function TooltipVariantsDemo() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-plus">
      {TOOLTIP_VARIANT_ITEMS.map((item) => (
        <Tooltip.Panel
          key={`${item.variant}-${item.title}`}
          variant={item.variant}
          size="base"
          title={item.title}
          description={item.description}
          icon={item.icon}
          showIcon={item.showIcon}
        />
      ))}
    </div>
  );
}

export const Variants: Story = {
  name: "Варианты",
  render: () => <TooltipVariantsDemo />,
};

export const OnButtonSizes: Story = {
  name: "Размеры на кнопке",
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-mid">
      <Tooltip size="small" variant="default">
        <Tooltip.Trigger>
          <Button size="small" variant="outline" type="button">
            Hover (small)
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Компактный тултип</Tooltip.Content>
      </Tooltip>
      <Tooltip size="base" variant="default">
        <Tooltip.Trigger>
          <Button size="base" variant="outline" type="button">
            Hover (base)
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Стандартный размер подсказки</Tooltip.Content>
      </Tooltip>
      <Tooltip size="mid" variant="default">
        <Tooltip.Trigger>
          <Button size="mid" variant="outline" type="button">
            Hover (mid)
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Средний размер подсказки</Tooltip.Content>
      </Tooltip>
      <Tooltip size="large" variant="default">
        <Tooltip.Trigger>
          <Button size="large" variant="outline" type="button">
            Hover (large)
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Более широкий отступ для длинной подсказки</Tooltip.Content>
      </Tooltip>
    </div>
  ),
};

function SemanticVariantsDemo() {
  return (
    <div className="flex min-h-[14rem] max-w-xl flex-row flex-wrap items-center justify-center gap-mid py-xlarge">
      {VARIANTS.map((variant) => (
        <Tooltip key={variant} variant={variant}>
          <Tooltip.Trigger>
            <Button variant="ghost" type="button" className="capitalize">
              {variant}
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>{`Вариант «${variant}»`}</Tooltip.Content>
        </Tooltip>
      ))}
    </div>
  );
}

export const SemanticVariants: Story = {
  name: "Варианты как у Alert — semantic (тёмная тема)",
  render: () => <SemanticVariantsDemo />,
};

export const SemanticVariantsOnLightTheme: Story = {
  name: "Варианты как у Alert — semantic (светлая тема)",
  decorators: [...lightThemeDecorator],
  render: () => <SemanticVariantsDemo />,
};

export const DefaultWithOptionalIcon: Story = {
  name: "Опциональная иконка на default",
  render: () => (
    <Tooltip
      variant="default"
      icon={<IoHelpCircleOutline aria-hidden className="text-primary" />}
    >
      <Tooltip.Trigger>
        <Button size="large" variant="outline" type="button">
          Hover
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>Своя иконка только через prop `icon`</Tooltip.Content>
    </Tooltip>
  ),
};

export const SemanticIconHidden: Story = {
  name: "Semantic без иконки",
  render: () => (
    <Tooltip variant="danger" showIcon={false}>
      <Tooltip.Trigger>
        <Button size="large" variant="outline" type="button">
          Hover
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>Без стандартной иконки</Tooltip.Content>
    </Tooltip>
  ),
};

export const WithArrow: Story = {
  name: "Со стрелкой",
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-mid">
      <Tooltip delayShowMs={0} side="top">
        <Tooltip.Trigger>
          <Button variant="secondary" type="button">
            Со стрелкой
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content showArrow>
          <Tooltip.Arrow />
          Тултип со стрелкой сверху
        </Tooltip.Content>
      </Tooltip>
      <Tooltip delayShowMs={0} side="bottom">
        <Tooltip.Trigger>
          <Button variant="outline" type="button">
            Снизу
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content showArrow>
          <Tooltip.Arrow />
          Подсказка снизу
        </Tooltip.Content>
      </Tooltip>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByRole("button", { name: "Со стрелкой" }));
    await expect(screen.getByRole("tooltip")).toHaveTextContent("Тултип со стрелкой сверху");
  },
};

export const CustomOffset: Story = {
  name: "Кастомный offset",
  render: () => (
    <Tooltip delayShowMs={0} side="top">
      <Tooltip.Trigger>
        <Button variant="primary" type="button">
          offset=12
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content showArrow offset={12}>
        <Tooltip.Arrow />
        Больший зазор от триггера
      </Tooltip.Content>
    </Tooltip>
  ),
};

export const Placements: Story = {
  name: "Placement (4 стороны)",
  render: () => (
    <div className="grid grid-cols-2 gap-xlarge py-xlarge">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <div key={side} className="flex items-center justify-center">
          <Tooltip delayShowMs={0} side={side}>
            <Tooltip.Trigger>
              <Button variant="outline" type="button" className="capitalize">
                {side}
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content showArrow>
              <Tooltip.Arrow />
              {`Tooltip ${side}`}
            </Tooltip.Content>
          </Tooltip>
        </div>
      ))}
    </div>
  ),
};

export const KeyboardFocus: Story = {
  name: "Focus (клавиатура)",
  render: () => (
    <Tooltip delayShowMs={0}>
      <Tooltip.Trigger>
        <Button variant="outline" type="button">
          Tab сюда
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>Подсказка при фокусе и hover</Tooltip.Content>
    </Tooltip>
  ),
};

export const Accessibility: Story = {
  name: "Доступность",
  render: () => (
    <div className="flex max-w-md flex-col gap-mid text-left">
      <p className="text-sm text-muted">
        Контент: <code className="text-primary">role=&quot;tooltip&quot;</code>. Связь с триггером —{" "}
        <code className="text-primary">aria-describedby</code> только пока подсказка открыта. Hover и
        focus; <kbd className="rounded-small border-token px-xsmall py-0.5 text-tools">Escape</kbd>{" "}
        закрывает. Единственный child <code className="text-primary">Trigger</code> получает handlers без
        лишнего tab-stop.
      </p>
      <Tooltip delayShowMs={0}>
        <Tooltip.Trigger>
          <Button variant="outline" type="button">
            Кнопка с подсказкой
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Дополнительное описание для AT</Tooltip.Content>
      </Tooltip>
      <Tooltip delayShowMs={0} variant="info">
        <Tooltip.Trigger>
          <Button variant="ghost" type="button" aria-label="Справка по полю">
            ?
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Триггер без видимой подписи — нужен aria-label</Tooltip.Content>
      </Tooltip>
    </div>
  ),
};

export const CustomClassNames: Story = {
  name: "Полная кастомизация classNames",
  parameters: {
    docs: {
      description: {
        story:
          "Слоты root (триггер), trigger, content, arrow, panel, glossContent, message, icon, indicator, title и description через prop classNames на корне.",
      },
    },
  },
  render: () => (
    <Tooltip
      delayShowMs={0}
      variant="info"
      classNames={{
        root: "rounded-mid ring-2 ring-primary/35",
        trigger: "rounded-mid",
        content: "ring-1 ring-primary/25",
        panel: "border-primary/30",
        title: "text-primary font-semibold",
        description: "text-muted/80",
      }}
    >
      <Tooltip.Trigger>
        <Button variant="outline" type="button">
          Кастомные слоты
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content showArrow>
        <Tooltip.Arrow />
        <Tooltip.Icon />
        <Tooltip.Title>Заголовок</Tooltip.Title>
        <Tooltip.Description>Описание с кастомными классами</Tooltip.Description>
      </Tooltip.Content>
    </Tooltip>
  ),
};

export const GlossWithCompoundLayout: Story = {
  name: "Gloss — grid как у Alert",
  render: () => (
    <Tooltip delayShowMs={0} surface="gloss" variant="info">
      <Tooltip.Trigger>
        <Button variant="gloss" type="button">
          Gloss compound
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content showArrow>
        <Tooltip.Arrow />
        <Tooltip.Icon />
        <Tooltip.Title>Справка</Tooltip.Title>
        <Tooltip.Description>Иконка слева от заголовка и описания</Tooltip.Description>
      </Tooltip.Content>
    </Tooltip>
  ),
};

export const CompoundCustomIcon: Story = {
  name: "Compound — своя иконка",
  render: () => (
    <Tooltip delayShowMs={0} variant="default">
      <Tooltip.Trigger>
        <Button variant="outline" type="button">
          Своя иконка
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <Tooltip.Icon>
          <IoHelpCircleOutline aria-hidden className="text-primary" />
        </Tooltip.Icon>
        <Tooltip.Title>Подсказка</Tooltip.Title>
        <Tooltip.Description>Иконка задаётся через Tooltip.Icon в compound API</Tooltip.Description>
      </Tooltip.Content>
    </Tooltip>
  ),
};
