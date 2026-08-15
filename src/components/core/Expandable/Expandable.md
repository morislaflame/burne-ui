# Expandable

Раскрывающийся блок с кнопкой-триггером и анимированной панелью. Поддерживает **simple API** (props `title` / `description` / `icon`) и **compound API** (`Expandable.Trigger`, `Expandable.Panel`, …).

## Импорт

```tsx
import { Expandable, useExpandableContext, type ExpandableProps, type ExpandableClassNames, type ExpandableMotion, type ExpandableVariant, type ExpandableSize } from "burne-ui";
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
| `motion` | `ExpandableMotion` | — | Слоты `triggerLift` / `chevron` / `panelShell` |

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

Из `COLLAPSIBLE_SIZE_LAYOUT` (отступы в ритме panel header/body; chevron/icon — `CONTROL_SIZE_LAYOUT`):

| size | trigger padding | content padding | title / desc |
|------|-----------------|-----------------|--------------|
| `small` | `px-mid pt-mid pb-base` | `p-mid` | `base` / `small` + `leading-none` |
| `base` | `px-mid pt-mid pb-base` | `p-mid` | `mid` / `small` + `leading-none` |
| `mid` | `px-large pt-large pb-mid` | `p-large` | `large` / `base` + `leading-none` |
| `large` | `px-large pt-large pb-mid` | `p-large` | `large` / `base` + `leading-none` |

## Анимации

Все motion — **GSAP**. Раскрытие, шеврон и press на lift-span — **slot motion** (`expandableAnimations.ts`). Accordion / Disclosure пока на `useCollapsibleHeight` / `useChevronRotation` (та же `animateCollapsibleHeight` / `animateChevronRotation` внутри рецептов).

### Slot motion

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `triggerLift` | `pressIn` (`pressOut` = `false`) | `pressSqueeze` на внутреннем lift-span, не на `<button>` |
| `chevron` | `enter` / `leave` | `chevronRotate` (0° ↔ 180°) |
| `panelShell` | `enter` / `leave` | `collapsibleHeight` (`panelInner` — внутренний target, не публичный слот) |

`false` на фазе → мгновенное состояние (height/rotation), без твина. Первый paint: `useCollapsibleShellRef` / `data-chevron-init`.

Своё раскрытие — factory на `panelShell`. Закрытое состояние кита всё равно `height: 0`; factory должна вернуть tween 0 ↔ измеренная высота (`ctx.targets.panelInner.scrollHeight`) и на `enter` complete снять inline `height` (`clearProps`), иначе панель залипнет.

```tsx
<Expandable
  title="Bounce"
  motion={{
    panelShell: {
      enter: (ctx) => {
        ctx.el.style.overflow = "hidden";
        return gsap.fromTo(
          ctx.el,
          { height: 0 },
          {
            height: () => ctx.targets.panelInner?.scrollHeight ?? 0,
            duration: 0.55,
            ease: "back.out(1.4)",
            onComplete: () => {
              gsap.set(ctx.el, { clearProps: "height" });
              ctx.el.style.removeProperty("overflow");
            },
          },
        );
      },
      leave: (ctx) => {
        ctx.el.style.overflow = "hidden";
        return gsap.to(ctx.el, {
          height: 0,
          duration: 0.28,
          ease: "power2.in",
          onComplete: () => {
            ctx.el.style.height = "0px";
          },
        });
      },
    },
  }}
>
  …
</Expandable>
```

**Где в коде:** типы — `expandableTypes.ts`; scope — `expandableContext.tsx`; defaults + host play — `expandableAnimations.ts`; слоты — `expandableParts.tsx`; Provider — `Expandable.tsx`.

```tsx
<Expandable motion={{ panelShell: { enter: false, leave: false } }} title="Instant panel">
  …
</Expandable>

<Expandable.Chevron
  motion={{
    enter: (ctx) => gsap.to(ctx.el, { rotation: 180, duration: 0.45, ease: "back.out(1.6)" }),
    leave: (ctx) => gsap.to(ctx.el, { rotation: 0, duration: 0.28 }),
  }}
/>
```

`classNames` / `className` на частях сочетаются с factory. `panelInner` — внутренний target рецепта высоты, его можно трогать из factory шеврона через `ctx.targets.panelInner` (высота панели остаётся `collapsibleHeight`).

```tsx
<Expandable
  title="FAQ"
  classNames={{
    root: "border-token-primary",
    trigger: "bg-primary/5",
    title: "text-primary font-w-strong",
    chevron: "text-primary",
    panel: "border-t border-primary/20 bg-primary/5",
  }}
  motion={{
    chevron: {
      enter: (ctx) => {
        const tl = gsap.timeline();
        tl.to(ctx.el, { rotation: 180, duration: 0.48, ease: "back.out(1.8)" }, 0);
        if (ctx.targets.panelInner) {
          tl.fromTo(ctx.targets.panelInner, { y: -8, autoAlpha: 0.25 }, { y: 0, autoAlpha: 1, duration: 0.32 }, 0.06);
        }
        return tl;
      },
      leave: (ctx) => {
        const tl = gsap.timeline();
        tl.to(ctx.el, { rotation: 0, duration: 0.28 }, 0);
        if (ctx.targets.panelInner) tl.to(ctx.targets.panelInner, { y: -6, autoAlpha: 0.25, duration: 0.18 }, 0);
        return tl;
      },
    },
  }}
>
  …
</Expandable>

<Expandable classNames={{ root: "border-token-info", trigger: "bg-info/5" }}>
  <Expandable.Trigger>
    <Expandable.Title data-part="title" className="font-w-strong text-info">…</Expandable.Title>
    <Expandable.Chevron
      className="text-info"
      motion={{
        enter: (ctx) => {
          const title = ctx.el.closest("button")?.querySelector("[data-part=title]");
          const tl = gsap.timeline();
          tl.to(ctx.el, { rotation: 180, duration: 0.42, ease: "back.out(1.6)" }, 0);
          if (title) tl.add(tweenCssColor(title, "var(--color-info)"), 0);
          return tl;
        },
        leave: (ctx) => gsap.to(ctx.el, { rotation: 0, duration: 0.22 }),
      }}
    />
  </Expandable.Trigger>
  <Expandable.Panel className="border-t border-info/20 bg-info/5">…</Expandable.Panel>
</Expandable>
```

**DOM панели:**

```
panelShell (overflow-hidden, анимируемая height)
  └── panelInner (внутренний target рецепта)
        └── <section> …контент…
```

#### Кастомизация раскрытия

```ts
configureMotion({
  expandDuration: 320,
  expandOpenEase: "power2.inOut",
  enableExpandable: true,
});
```

**Reduced motion / `enableExpandable: false`:** мгновенный `applyCollapsibleInstantState` / `applyChevronRotationInstant`.

Не задавайте фиксированную `height` на `panelShell` — ломает `collapsibleHeight`.

### Gloss-корень

`variant="gloss"` → `useMergedGlossPanelRef` на root + `glossInteractive.css`. Панель по высоте — тот же `collapsibleHeight`.

### Сводка: что настраивается где

| Анимация | Рецепт / утилита | Ключи `configureMotion` |
|----------|------------------|-------------------------|
| Раскрытие панели | `collapsibleHeight` | `expandDuration`, `expandOpenEase`, `enableExpandable` |
| Press squeeze | `pressSqueeze` на `triggerLift` | `interactiveDuration`, `pressSqueezeScale`, `enablePressSqueeze` |
| Поворот шеврона | `chevronRotate` | `interactiveDuration`, `interactiveEase`, `enableExpandable` |
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
| `focus-ring` + `rounded-[inherit]` | Focus на триггере (скругление как у root) |

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

`variant`, `size` — trigger/content padding и title из `COLLAPSIBLE_SIZE_LAYOUT`; иконки — `CONTROL_SIZE_LAYOUT`.

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

- **Panel height anim:** не задавайте фиксированную `height` на `panelShell` — ломает `collapsibleHeight`.
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
├── Expandable.tsx              # Provider: motion + EXPANDABLE_MOTION_DEFAULTS
├── index.ts
├── expandableTypes.ts          # ExpandableMotion
├── expandableStyles.ts
├── expandableAPI.ts
├── expandableA11y.ts
├── expandableContext.tsx       # createMotionScope("Expandable")
├── expandableParts.tsx         # useMotionPart на слотах
├── expandableAnimations.ts     # defaults, host play
├── useExpandableRootState.ts
└── Expandable.stories.tsx
```

## Storybook

`Core Components/Expandable` — simple/compound, gloss, ripple, размеры, controlled/uncontrolled.
