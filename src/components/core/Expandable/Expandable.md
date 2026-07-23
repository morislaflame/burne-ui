# Expandable

Раскрывающийся блок с кнопкой-триггером и анимированной панелью. Поддерживает **simple API** (props `title` / `description` / `icon`) и **compound API** (`Expandable.Trigger`, `Expandable.Panel`, …).

## Импорт

```tsx
import { Expandable, useExpandableContext, type ExpandableProps, type ExpandableClassNames, type ExpandableVariant, type ExpandableSize } from "burne-ui";
```

## API

### Root props (`Expandable`)

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `variant` | `default` \| `gloss` | `default` | Поверхность корня |
| `size` | `small` \| `base` \| `mid` \| `large` | `base` | Высота триггера, иконки, отступы панели |
| `open` | `boolean` | — | Контролируемое состояние |
| `defaultOpen` | `boolean` | `false` | Начальное (uncontrolled) |
| `onOpenChange` | `(open: boolean) => void` | — | Колбэк смены состояния |
| `disabled` | `boolean` | `false` | Блокирует toggle |
| `compound` | `boolean` | auto | Принудительно compound, если в children есть слоты |
| `title` | `ReactNode` | — | Simple API: заголовок триггера |
| `description` | `ReactNode` | — | Simple API: подзаголовок |
| `icon` | `ReactNode` | — | Simple API: иконка слева |
| `className` | `string` | — | Классы на корневой `<div>` |
| `classNames` | `ExpandableClassNames` | — | Слоты (см. ниже) |

### Compound-подчасти

| Часть | Назначение |
|-------|------------|
| `Expandable.Trigger` | Кнопка заголовка; `hideChevron`, `asChild` |
| `Expandable.Message` | Обёртка grid-слотов в триггере (`display: contents`) |
| `Expandable.Icon` | Иконка-индикатор слева |
| `Expandable.Content` | Группа title + description |
| `Expandable.Title` | Заголовок |
| `Expandable.Description` | Подзаголовок (`text-muted`) |
| `Expandable.Chevron` | Кастомный шеврон (вместо дефолтного) |
| `Expandable.Panel` | Раскрываемая секция (`<section>`) |

### `ExpandableClassNames`

```tsx
type ExpandableClassNames = {
  root?: string;
  glossContent?: string;
  trigger?: string;
  triggerLift?: string;
  triggerRippleOverlay?: string;
  message?: string;
  icon?: string;
  content?: string;
  title?: string;
  description?: string;
  chevron?: string;
  panelShell?: string;
  panel?: string;
};
```

### Simple API

```tsx
<Expandable title="FAQ" description="Частые вопросы" icon={<IoHelp aria-hidden />}>
  <p>Ответ на вопрос…</p>
</Expandable>
```

### Compound API

```tsx
<Expandable defaultOpen>
  <Expandable.Trigger>
    <Ripple color="neutralMuted" />
    <Expandable.Icon><IoStar aria-hidden /></Expandable.Icon>
    <Expandable.Content>
      <Expandable.Title>Заголовок</Expandable.Title>
      <Expandable.Description>Подзаголовок</Expandable.Description>
    </Expandable.Content>
  </Expandable.Trigger>
  <Expandable.Panel>
    Контент панели
  </Expandable.Panel>
</Expandable>
```

Compound определяется автоматически при наличии слотов (`Expandable.Trigger`, `Expandable.Panel`, …) или явно через `compound={true}`.

## variant

| variant | Стили корня |
|---------|-------------|
| `default` | `border-token bg-surface shadow-token-sm rounded-mid` |
| `gloss` | `gloss-panel gloss-deep border-0` + внутренний `gloss-content` |

## Размеры

Из `CONTROL_SIZE_LAYOUT`:

| size | min-h триггера | padX триггера | pad панели | chevron / icon |
|------|----------------|---------------|------------|----------------|
| `small` | `min-h-control-small` | `px-base` | `px-base pb-base pt-small` | `icon-small` |
| `base` | `min-h-control-base` | `px-mid` | `px-mid pb-mid pt-small` | `icon-base` |
| `mid` | `min-h-control-mid` | `px-large` | `px-large pb-large pt-base` | `icon-large` |
| `large` | `min-h-control-large` | `px-xlarge` | `px-xlarge pb-xlarge pt-base` | `icon-large` |

Текст: title — `controlText` размера; description — `small` / `base` по size.

## Анимации

Все motion — **GSAP**. Логика разбита: `expandableAnimations.ts` (триггер, шеврон, панель) + общие утилиты в `utils/`.

### 1. Раскрытие панели (height collapse)

Главная анимация контента — `useCollapsibleHeight` в `utils/useCollapsibleHeight.ts`, вызывается из `Expandable.Panel`.

**DOM-структура:**

```
panelShell (overflow-hidden, анимируемая height)
  └── innerRef
        └── <section> …контент…
```

**Открытие (`open: false → true`):**

1. `shell.style.overflow = "hidden"`
2. GSAP `fromTo`: `height: 0` → `height: measureCollapsibleContentHeight(inner)` (динамически по `scrollHeight`)
3. `onComplete` → `releaseExpandedShellHeight`: снимает фиксированную height, возвращает `height: auto` без скачка

**Закрытие (`open: true → false`):**

1. Фиксирует текущую высоту в px
2. GSAP `to`: `height: 0`
3. `onComplete` → `height: 0px`, `overflow: hidden`

**Первый paint:** `useCollapsibleShellRef` синхронно выставляет начальное состояние до отрисовки (чтобы `defaultOpen` не мигал).

#### Кастомизация раскрытия

Глобально через `configureMotion()` **до** рендера приложения:

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  // Длительность open/close панели (мс). По умолчанию 200.
  expandDuration: 320,
  // GSAP easing. По умолчанию "sine.inOut".
  expandOpenEase: "power2.inOut",
  // Полный выключатель collapsible-анимаций (Expandable, Accordion, Disclosure).
  enableExpandable: true,
});
```

Параметры попадают в твин через `motionExpand()` → `{ duration: expandDuration/1000, ease: expandOpenEase }`.

**Reduced motion:** при `prefers-reduced-motion` или `enableExpandable: false` — мгновенный `applyCollapsibleInstantState` без GSAP.

**Программный skip:** в Disclosure доступен `skipAnimRef` у `useCollapsibleHeight`; у Expandable напрямую не экспортируется — только глобальный флаг.

### 2. Триггер — press squeeze

`useExpandableTriggerMotion` → на `pointerdown` сжимает **внутренний** `liftSpan` (`animateInteractivePressSqueeze`), не весь `<button>`. Так ripple-overlay и шеврон не «ломаются» при нажатии.

Кастомизация — общие interactive-токены:

```ts
configureMotion({
  interactiveDuration: 280,       // длительность squeeze
  pressSqueezeScale: [1, 0.98, 1], // rest → compressed → rest
  enablePressSqueeze: true,
});
```

Отключается при `prefers-reduced-motion` или `disabled`.

### 3. Шеврон — rotation

`useChevronRotation(open, ref, () => getMotionConfig().enableExpandable)` — поворот SVG при toggle.

- Easing/duration: `motionInteractive()` (`interactiveDuration`, `interactiveEase`)
- Выключение: `enableExpandable: false` или reduced motion

Кастомный шеврон: `<Expandable.Chevron />` — та же rotation-логика на своём ref.

### 4. Gloss-корень

`variant="gloss"` → `useMergedGlossPanelRef` на root + `glossInteractive.css`. Отдельного height-motion у gloss нет — панель анимируется так же, поверхность gloss статична до hover на триггере (если добавите интерактив отдельно).

### Сводка: что настраивается где

| Анимация | Утилита | Ключи `configureMotion` |
|----------|---------|-------------------------|
| Раскрытие панели | `useCollapsibleHeight` | `expandDuration`, `expandOpenEase`, `enableExpandable` |
| Press squeeze | `animateInteractivePressSqueeze` | `interactiveDuration`, `pressSqueezeScale`, `enablePressSqueeze` |
| Поворот шеврона | `useChevronRotation` | `interactiveDuration`, `interactiveEase`, `enableExpandable` |
| Ripple на триггере | `<Ripple />` | `rippleDefaultDuration`, `enableRipple` (см. Ripple.md) |

## Ripple на триггере

`partitionExpandableTriggerRipple` выносит дочерние `<Ripple />` в overlay (`EXPANDABLE_TRIGGER_RIPPLE_OVERLAY_CLASS`) на всю площадь кнопки. Контент и шеврон остаются в `triggerLift` с `z-[1]`.

## Grid-layout

Триггер использует общую сетку `messageBannerGridLayout` (как Alert, Toast):

- колонки: indicator | title+description | action (шеврон)
- слоты определяются автоматически по наличию `Icon`, `Title`, `Description`, `Chevron`

## Токены и CSS

| Класс / токен | Назначение |
|---------------|------------|
| `shadow-token-sm` | Тень корня (default) |
| `border-token`, `bg-surface` | Поверхность |
| `gloss-panel`, `gloss-deep`, `gloss-content` | Gloss variant |
| `h-control-*`, `px-mid`, `py-base` | Размеры |
| `focus-visible:outline-primary` | Focus на триггере |

## Стилизация и кастомизация

### Два уровня

1. **`className` на root** — мерж с `classNames.root`.
2. **`classNames` на root** — слоты через `ExpandableClassNamesProvider`.

В compound API подчасти (`Expandable.Trigger`, `Expandable.Title`, …) принимают **`className`** поверх слота.

### Слоты `ExpandableClassNames`

| Слот | DOM / элемент | Когда использовать |
|------|---------------|-------------------|
| `root` | Корневой div | Border, max-width, внешний padding |
| `glossContent` | Gloss inner wrap | При `variant="gloss"` |
| `trigger` | `Expandable.Trigger` button | Фон, height, hover surface |
| `triggerLift` | Motion target lift | Осторожно — GSAP shadow target |
| `triggerRippleOverlay` | Ripple clip layer | Shape ripple на триггере |
| `message` | `Expandable.Message` | Grid слотов в trigger |
| `icon` | `Expandable.Icon` | Размер/цвет leading icon |
| `content` | `Expandable.Content` | Title + description stack |
| `title` | `Expandable.Title` | Заголовок |
| `description` | `Expandable.Description` | Подзаголовок muted |
| `chevron` | Chevron / `Expandable.Chevron` | Размер, rotate target |
| `panelShell` | Обёртка panel height anim | Overflow clip |
| `panel` | `Expandable.Panel` section | Padding контента, typography |

`variant`, `size` — высота trigger, иконки, panel padding из токенов.

### Simple API

```tsx
<Expandable
  className="max-w-md"
  classNames={{
    root: "border border-primary/30 rounded-base",
    trigger: "bg-primary/5 hover:bg-primary/10",
    title: "text-primary font-semibold",
    description: "text-muted",
    panel: "bg-primary/5 text-small",
  }}
  title="FAQ"
  description="Частые вопросы"
  icon={<IoHelp aria-hidden />}
>
  <p>Ответ на вопрос…</p>
</Expandable>
```

### Compound API

```tsx
<Expandable
  variant="gloss"
  classNames={{
    root: "max-w-lg",
    trigger: "px-xlarge",
    panelShell: "border-t border-token",
  }}
>
  <Expandable.Trigger className="gap-large">
    <Expandable.Icon><IoSettings aria-hidden /></Expandable.Icon>
    <Expandable.Content>
      <Expandable.Title className="text-mid">Настройки</Expandable.Title>
      <Expandable.Description>Расширенная компоновка</Expandable.Description>
    </Expandable.Content>
    <Expandable.Chevron className="text-muted" />
  </Expandable.Trigger>
  <Expandable.Panel className="p-xlarge">
    Контент панели
  </Expandable.Panel>
</Expandable>
```

`hideChevron` на Trigger — кастомный chevron через `Expandable.Chevron` и слот `chevron`.

### Практические заметки

- **Panel height anim:** не задавайте фиксированную `height` на `panelShell` — ломает `useCollapsibleHeight`.
- **Ripple:** `<Ripple />` внутри Trigger; стили clip — `triggerRippleOverlay`.
- **Gloss:** `variant="gloss"` — не переопределяйте gloss-классы на trigger без нужды.
- **Порядок мержа:** базовые → `classNames.slot` → `className` подчасти.

## Доступность

- Триггер: `<button type="button">`.
- `aria-expanded`, `aria-controls` — при наличии `Panel`.
- `id` / `aria-labelledby` / `aria-hidden` / `inert` на панели.
- Клавиатура: `Enter` / `Space` на триггере.
- `asChild` на Trigger — клонирует props на дочерний элемент.

## Контекст

`useExpandableContext()` — `open`, `disabled`, `hasPanel`, `size`, `variant`, `toggle`, `headerId`, `panelId`.

## Структура файлов

```
Expandable/
├── Expandable.tsx
├── index.ts
├── expandableTypes.ts
├── expandableStyles.ts
├── expandableAPI.ts
├── expandableA11y.ts
├── expandableContext.tsx
├── expandableParts.tsx
├── expandableAnimations.ts
├── useExpandableRootState.ts
└── Expandable.stories.tsx
```

## Storybook

`Core Components/Expandable` — simple/compound, gloss, ripple, размеры, controlled/uncontrolled.
