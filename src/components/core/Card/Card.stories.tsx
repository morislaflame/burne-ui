import type { ComponentType, FormEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";

import { Form } from "@/components/composite/Form/Form";
import { Badge } from "@/components/core/Badge";
import { Button } from "@/components/core/Button/Button";
import { Input } from "@/components/core/Input";
import { Ripple } from "@/components/core/Ripple";
import { Separator } from "@/components/core/Separator";
import { Text } from "@/components/core/Text";
import { Card, type CardVariant } from ".";
import { PIN_IMAGE1, PIN_IMAGE2, PIN_IMAGE3, PIN_IMAGE4 } from "@/utils/mockImages";
import { IoArrowForward, IoTimeOutline } from "react-icons/io5";

const CARD_RIPPLE_COLOR: Record<CardVariant, "neutral"> = {
  default: "neutral",
  outline: "neutral",
  secondary: "neutral",
};

const darkThemeDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="w-full max-w-md">
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
      <div className="w-full max-w-md">
        <Story />
      </div>
    </div>
  ),
] as const;

/** Широкая область для сеток и горизонтальных лейаутов. */
const wideDarkDecorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[14rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="w-full max-w-6xl px-small">
        <Story />
      </div>
    </div>
  ),
] as const;

const meta = {
  title: "Core Components/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [...darkThemeDecorator],
  argTypes: {
    pressable: {
      control: "boolean",
      description:
        "Hover-lift + тень и squeeze при нажатии; role=\"button\", активация Enter/Space. Риппл — отдельно (`<Ripple />` первым ребёнком внутри карточки + контент в `z-[1]`).",
    },
    onPress: { action: "press" },
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card>
      <Card.Header>
        <Card.Title>Заголовок карточки</Card.Title>
        <Card.Description>
          Краткое описание или подзаголовок в вторичном цвете.
        </Card.Description>
      </Card.Header>
    </Card>
  ),
};

export const WithFooter: Story = {
  name: "С футером",
  render: () => (
    <Card>
      <Card.Header>
        <Card.Title>Документ</Card.Title>
        <Card.Description>Обновлён 10 мая 2026</Card.Description>
      </Card.Header>
      <Card.Footer className="flex items-center justify-end gap-base">
        <Button variant="ghost" size="base" ripple>
          Отмена
        </Button>
        <Button variant="primary" size="base" ripple>
          Открыть
        </Button>
      </Card.Footer>
    </Card>
  ),
};

export const Outline: Story = {
  name: "Outline",
  render: () => (
    <Card variant="outline">
      <Card.Header>
        <Card.Title>Прозрачная заливка</Card.Title>
        <Card.Description>Только обводка — как вторичный блок.</Card.Description>
      </Card.Header>
    </Card>
  ),
};

export const Secondary: Story = {
  name: "Secondary",
  render: () => (
    <Card variant="secondary">
      <Card.Header>
        <Card.Title>Вторичная поверхность</Card.Title>
        <Card.Description>Тот же стиль, что у Alert/Badge secondary.</Card.Description>
      </Card.Header>
    </Card>
  ),
};

export const Pressable: Story = {
  name: "Нажимаемая (pressable)",
  render: function PressableDemo() {
    const [n, setN] = useState(0);
    return (
      <div className="flex flex-col gap-mid">
        <p className="text-center text-small tabular-nums text-muted" aria-live="polite">
          Нажатий (любая из карточек ниже): {n}
        </p>
        <Card pressable onPress={() => setN((c) => c + 1)}>
          <Ripple color={CARD_RIPPLE_COLOR.default} direction="out"/>
          <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
            <Card.Header>
              <Card.Title>Карточка-кнопка</Card.Title>
              <Card.Description>
                Наведение — lift и тень; клик — squeeze и onPress; риппл задаётся{" "}
                <code className="text-xs">&lt;Ripple /&gt;</code> снаружи.
              </Card.Description>
            </Card.Header>
          </div>
        </Card>
        <Card variant="outline" pressable onPress={() => setN((c) => c + 1)}>
          <Ripple color={CARD_RIPPLE_COLOR.outline} direction="out"/>
          <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
            <Card.Header>
              <Card.Title>Outline + pressable</Card.Title>
              <Card.Description>Тот же паттерн, стеклянная обводка.</Card.Description>
            </Card.Header>
          </div>
        </Card>
        <Card variant="secondary" pressable onPress={() => setN((c) => c + 1)}>
          <Ripple color={CARD_RIPPLE_COLOR.secondary} direction="out"/>
          <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
            <Card.Header>
              <Card.Title>Secondary + pressable</Card.Title>
              <Card.Description>Тон риппла под вторичную поверхность.</Card.Description>
            </Card.Header>
          </div>
        </Card>
      </div>
    );
  },
};

export const PressableWithNestedCard: Story = {
  name: "Нажимаемая с карточкой внутри",
  render: function PressableNestedDemo() {
    const [n, setN] = useState(0);
    return (
      <div className="flex flex-col gap-mid">
        <p className="text-center text-small tabular-nums text-muted" aria-live="polite">
          Нажатий по внешней карточке: {n}
        </p>
        <Card pressable onPress={() => setN((c) => c + 1)}>
          <Ripple color={CARD_RIPPLE_COLOR.default} direction="out"/>
          <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
            <Card.Header>
              <Card.Title>Внешняя pressable</Card.Title>
              <Card.Description>
                Клик по области вне внутренней карточки увеличивает счётчик сверху. Внутренняя карточка
                статическая — только текст.
              </Card.Description>
            </Card.Header>
            <Card.Body>
              <Card className="mt-plus">
                <p className="px-mid py-plus text-base leading-normal text-foreground">
                  Вложенная обычная карточка без заголовка и описания — только этот абзац текста для
                  проверки вложенной поверхности и отступов.
                </p>
              </Card>
            </Card.Body>
          </div>
        </Card>
      </div>
    );
  },
};

export const WithImageBody: Story = {
  name: "С изображением в теле",
  render: () => (
    <Card>
      <Card.Header>
        <Card.Title>Progress is a mindset</Card.Title>
        <Card.Description>
          Редакционный кадр в теле карточки (как в примере Expandable).
        </Card.Description>
      </Card.Header>
      <Card.Body className="px-0 pb-0 pt-base">
        <img
          src={PIN_IMAGE1}
          alt="Портрет в глянцевом красном шлеме, текст на визоре"
          className="max-h-[min(380px,48vh)] w-full object-cover"
          loading="lazy"
        />
      </Card.Body>
    </Card>
  ),
};

function QuickSubscribeCard() {
  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);

  return (
    <Card>
      <Card.Header>
        <Card.Title>Подписка</Card.Title>
        <Card.Description>
          Короткая форма внутри Card.Body с компонентом Form.
        </Card.Description>
      </Card.Header>
      <Card.Body className="border-t-token pt-mid">
        <Form onSubmit={onSubmit} aria-label="Подписка на рассылку">
          <Input>
            <Input.Label>Email</Input.Label>
            <Input.Control
              name="email"
              inputType="text"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </Input>
          <Button type="submit" variant="primary" size="mid" className="w-full" ripple>
            Подписаться
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export const WithFormBody: Story = {
  name: "С формой в теле",
  render: () => <QuickSubscribeCard />,
};

/** Обложка на всю ширину, текст и действия ниже — кастомный порядок блоков. */
export const ImageCoverOnTop: Story = {
  name: "Обложка сверху (full bleed)",
  render: () => (
    <Card className="max-w-lg overflow-hidden">
      <div className="relative aspect-[16/10] w-full shrink-0 bg-muted">
        <img
          src={PIN_IMAGE2}
          alt="Абстрактный портрет в тёплых тонах"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <Card.Header>
        <div className="flex flex-wrap items-center gap-xsmall">
          <Badge status="info" size="small">
            Редакция
          </Badge>
          <span className="inline-flex items-center gap-xsmall text-muted text-tools">
            <IoTimeOutline className="icon-small shrink-0" aria-hidden />
            8 мин
          </span>
        </div>
        <Card.Title className="mt-xsmall">Материал недели</Card.Title>
        <Card.Description>
          Крупное изображение без отступов по краям карточки; подпись и мета — в{" "}
          <code className="text-xs">Card.Header</code>.
        </Card.Description>
      </Card.Header>
      <Card.Footer className="flex items-center justify-between gap-base">
        <Text as="span" variant="tools" className="text-muted">
          Автор: студия
        </Text>
        <Button variant="ghost" size="base" ripple>
          Читать
          <IoArrowForward className="ml-xsmall inline icon-small align-middle" aria-hidden />
        </Button>
      </Card.Footer>
    </Card>
  ),
};

/** Горизонтальный сплит: медиа слева, контент справа (адаптивно столбиком на узком экране). */
export const HorizontalMediaSplit: Story = {
  name: "Горизонтальный сплит (медиа + текст)",
  decorators: [...wideDarkDecorator],
  render: () => (
    <Card className="">
      <div className="flex min-w-0 flex-col min-[520px]:flex-row">
        <div className="relative aspect-[5/3] min-h-[11rem] w-full shrink-0 min-[520px]:aspect-auto min-[520px]:min-h-[14rem] min-[520px]:w-[44%]">
          <img
            src={PIN_IMAGE3}
            alt="Композиция с мягким светом и геометрией"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <Card.Header>
            <Card.Title>Курс: визуальная иерархия</Card.Title>
            <Card.Description>
              Лейаут «изображение + колонка текста»
            </Card.Description>
          </Card.Header>
          <Card.Body className="flex-1 pt-0">
            <ul className="list-inside list-disc space-y-xsmall text-small leading-normal text-muted">
              <li>Токены отступов из Body</li>
              <li>Футер с кнопками прижат внизу колонки</li>
            </ul>
          </Card.Body>
          <Card.Footer className="mt-0 flex justify-end gap-base border-t-token">
            <Button variant="primary" size="base" ripple>
              Записаться
            </Button>
          </Card.Footer>
        </div>
      </div>
    </Card>
  ),
};

/** Две колонки превью внутри тела — кастомная сетка в `Card.Body`. */
export const BodyImageGrid: Story = {
  name: "Сетка 2×1 изображений в теле",
  decorators: [...wideDarkDecorator],
  render: () => (
    <Card className="max-w-3xl">
      <Card.Header>
        <Card.Title>Галерея вариантов</Card.Title>
        <Card.Description>
          В <code className="text-xs">Card.Body</code> — сетка из двух кадров из{" "}
          <code className="text-xs">mockImages</code>.
        </Card.Description>
      </Card.Header>
      <Card.Body className="border-t-token px-mid pb-mid pt-mid">
        <div className="grid grid-cols-1 gap-small min-[480px]:grid-cols-2">
          <figure className="min-w-0 overflow-hidden rounded-base border-token flex flex-col gap-xsmall">
            <img
              src={PIN_IMAGE1}
              alt="Портрет в красном шлеме"
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
            <figcaption className="px-base py-xsmall text-tools text-muted">Кадр A</figcaption>
          </figure>
          <figure className="min-w-0 overflow-hidden rounded-base border-token flex flex-col gap-xsmall">
            <img
              src={PIN_IMAGE4}
              alt="Минималистичная сцена"
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
            <figcaption className="px-base py-xsmall text-tools text-muted">Кадр B</figcaption>
          </figure>
        </div>
      </Card.Body>
    </Card>
  ),
};

/** Бейджи статуса и плотный ряд действий — кастомизация шапки и футера. */
export const WithBadgesAndMeta: Story = {
  name: "Бейджи и мета",
  render: () => (
    <Card variant="outline">
      <Card.Header>
        <div className="flex flex-wrap items-center gap-xsmall">
          <Badge status="success" size="small">
            Онлайн
          </Badge>
          <Badge status="warning" size="small">
            Бета
          </Badge>
          <Badge variant="secondary" size="small">
            API v2
          </Badge>
        </div>
        <Card.Title className="mt-small">Сервис уведомлений</Card.Title>
        <Card.Description>
          Комбинация <code className="text-xs">Badge</code> и вторичного текста; вариант карточки{" "}
          <code className="text-xs">outline</code>.
        </Card.Description>
      </Card.Header>
      <Card.Footer className="flex flex-wrap items-center justify-between gap-base">
        <span className="text-tools text-muted">Последний деплой: сегодня</span>
        <div className="flex flex-wrap gap-xsmall">
          <Button variant="ghost" size="small" ripple>
            Логи
          </Button>
          <Button variant="secondary" size="small" ripple>
            Настройки
          </Button>
        </div>
      </Card.Footer>
    </Card>
  ),
};

/** Акцентная метрика + подпись — кастомный блок внутри Body. */
export const MetricHighlight: Story = {
  name: "Метрика (KPI)",
  render: () => (
    <Card variant="secondary" className="max-w-xs">
      <Card.Body className="gap-mid">
        <div>
          <Text as="span" variant="tools" className="font-medium uppercase tracking-wide text-muted">
            Конверсия
          </Text>
          <div className="mt-xsmall flex items-baseline gap-xsmall">
            <Text as="span" variant="header-2" className="tabular-nums">
              4,8
            </Text>
            <Text as="span" variant="base" className="text-success">
              +12%
            </Text>
          </div>
        </div>
        <Separator />
        <Card.Description className="text-foreground">
          Сравнение с прошлой неделей
        </Card.Description>
      </Card.Body>
    </Card>
  ),
};

/** Список шагов с разделителями — композиция без изображений. */
export const StepsWithSeparators: Story = {
  name: "Шаги с разделителями",
  render: () => (
    <Card>
      <Card.Header>
        <Card.Title>Чеклист публикации</Card.Title>
        <Card.Description>Три шага и <code className="text-xs">Separator</code> между блоками.</Card.Description>
      </Card.Header>
      <Card.Body className="px-mid pb-mid pt-0">
        <div className="rounded-base border-token px-base py-small flex flex-col gap-xsmall">
          <p className="text-small font-medium text-foreground">1. Черновик</p>
          <p className="mt-xsmall text-tools text-muted">Текст и медиа собраны.</p>
        </div>
        <Separator className="my-small" />
        <div className="rounded-base border-token px-base py-small flex flex-col gap-xsmall">
          <p className="text-small font-medium text-foreground">2. Редакция</p>
          <p className="mt-xsmall text-tools text-muted">Правки и согласование.</p>
        </div>
        <Separator className="my-small" />
        <div className="rounded-base border-token px-base py-small flex flex-col gap-xsmall">
          <p className="text-small font-medium text-foreground">3. Выход</p>
          <p className="mt-xsmall text-tools text-muted">Публикация и рассылка.</p>
        </div>
      </Card.Body>
    </Card>
  ),
};

/** Pressable + обложка + риппл — интерактивная карточка-«плитка». */
export const PressableWithCoverImage: Story = {
  name: "Pressable с обложкой",
  render: function PressableCoverDemo() {
    const [n, setN] = useState(0);
    return (
      <Card pressable className="max-w-md" onPress={() => setN((c) => c + 1)}>
        <Ripple color={CARD_RIPPLE_COLOR.default} direction="out"/>
        <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
          <div className="relative aspect-[2/1] w-full shrink-0">
            <img
              src={PIN_IMAGE4}
              alt="Ночная сцена с неоном"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <Card.Header>
            <Card.Title>Открыть проект</Card.Title>
            <Card.Description>
              Нажатий: <span className="tabular-nums">{n}</span>. Клавиатура: Enter / Space.
            </Card.Description>
          </Card.Header>
        </div>
      </Card>
    );
  },
};

/** Четыре карточки — все варианты поверхности и четыре изображения из mock. */
export const MosaicFourCards: Story = {
  name: "Мозаика: 4 карточки × 4 изображения",
  decorators: [...wideDarkDecorator],
  render: () => {
    const tiles: {
      variant: CardVariant;
      src: string;
      alt: string;
      title: string;
      desc: string;
    }[] = [
      {
        variant: "default",
        src: PIN_IMAGE1,
        alt: "Портрет в красном шлеме",
        title: "Default",
        desc: "Плотная surface и обводка.",
      },
      {
        variant: "outline",
        src: PIN_IMAGE2,
        alt: "Тёплый портрет",
        title: "Outline",
        desc: "Стеклянная обводка.",
      },
      {
        variant: "secondary",
        src: PIN_IMAGE3,
        alt: "Свет и геометрия",
        title: "Secondary",
        desc: "Accent-wash.",
      },
      {
        variant: "default",
        src: PIN_IMAGE4,
        alt: "Неоновая сцена",
        title: "Снова default",
        desc: "Четвёртое фото из набора.",
      },
    ];
    return (
      <div className="grid grid-cols-1 gap-mid sm:grid-cols-2">
        {tiles.map((t) => (
          <Card key={t.title + t.variant} variant={t.variant}>
            <div className="relative aspect-[5/3] w-full shrink-0">
              <img
                src={t.src}
                alt={t.alt}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <Card.Header>
              <Card.Title>{t.title}</Card.Title>
              <Card.Description>{t.desc}</Card.Description>
            </Card.Header>
          </Card>
        ))}
      </div>
    );
  },
};

/** Светлая тема: горизонтальный сплит с изображением. */
export const LightHorizontalCard: Story = {
  name: "Светлая тема: сплит с фото",
  decorators: [...lightThemeDecorator],
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div className="mx-auto w-full max-w-3xl">
      <Card>
        <div className="flex min-w-0 flex-col min-[480px]:flex-row">
          <div className="relative aspect-video w-full shrink-0 min-[480px]:w-2/5">
            <img
              src={PIN_IMAGE2}
              alt="Иллюстрация для светлой темы"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <Card.Header className="min-[480px]:flex-1">
            <Card.Title>Карточка на светлом фоне</Card.Title>
            <Card.Description>
              Тот же лейаут, что в «Горизонтальный сплит», с декоратором светлой темы.
            </Card.Description>
          </Card.Header>
          <Card.Body className="pt-0">
            <Button className="mt-small w-full min-[480px]:w-auto" variant="primary" size="base" ripple>
              Действие
            </Button>
          </Card.Body>
        </div>
      </Card>
    </div>
  ),
};

export const LightTheme: Story = {
  name: "Светлая тема (Default)",
  decorators: [...lightThemeDecorator],
  render: () => (
    <Card>
      <Card.Header>
        <Card.Title>Заголовок карточки</Card.Title>
        <Card.Description>
          Обычная карточка без эффекта при наведении.
        </Card.Description>
      </Card.Header>
      <Card.Footer className="flex items-center justify-end gap-base">
        <Button variant="ghost" size="base" ripple>Отмена</Button>
        <Button variant="primary" size="base" ripple>Открыть</Button>
      </Card.Footer>
    </Card>
  ),
};

export const LightThemeVariants: Story = {
  name: "Светлая тема (все варианты)",
  decorators: [...lightThemeDecorator],
  render: () => (
    <div className="flex flex-col gap-mid">
      <Card variant="default">
        <Card.Header>
          <Card.Title>Default</Card.Title>
          <Card.Description>Статическая карточка, без подъёма при наведении.</Card.Description>
        </Card.Header>
      </Card>
      <Card variant="outline">
        <Card.Header>
          <Card.Title>Outline</Card.Title>
          <Card.Description>Прозрачный фон и обводка.</Card.Description>
        </Card.Header>
      </Card>
      <Card variant="secondary">
        <Card.Header>
          <Card.Title>Secondary</Card.Title>
          <Card.Description>Accent-wash на surface.</Card.Description>
        </Card.Header>
      </Card>
    </div>
  ),
};
