# Button

Интерактивная кнопка первого уровня: варианты поверхности, семантические статусы, converge-ripple и GSAP-анимации hover/press.

## Импорт

```tsx
import { Button } from "burne-ui";
import type {
  ButtonProps,
  ButtonVariant,
  ButtonStatus,
  ButtonSize,
  ButtonClassNames,
  ButtonMotion,
} from "burne-ui";
```

Дополнительно из пакета экспортируются утилиты стилей (для кастомных контролов с тем же shell):

```tsx
import { buttonRootClass, buttonSpinnerClass, controlShellClass, buttonRippleTone } from "burne-ui";
```

## API

Компонент — **simple API** (корневой `<button>`, либо `asChild` — стили на единственном child).

### Props

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `variant` | `default` \| `primary` \| `outline` \| `secondary` \| `ghost` \| `gloss` | `default` | Визуальный стиль поверхности |
| `status` | `default` \| `danger` \| `success` \| `info` \| `warning` | `default` | Семантический тон (цвет, hover, focus, ripple) |
| `size` | `small` \| `base` \| `mid` \| `large` | `base` | Размер; наследуется из `ButtonGroup` / `Form` |
| `ripple` | `boolean` | `false` | Converge-ripple от точки нажатия (`<Ripple />`) |
| `icon` | `ReactNode` | — | Иконка рядом с текстом |
| `iconPosition` | `start` \| `end` | `start` | Позиция `icon` |
| `iconOnly` | `boolean` | `false` | Компактная ширина (`min-w-fit`); обязателен `aria-label` |
| `disabled` | `boolean` | `false` | Блокировка; наследуется из `Form` |
| `groupSegment` | `ButtonGroupSegment` | — | Сегмент в `ButtonGroup` (скругления, glue) |
| `asChild` | `boolean` | `false` | Стили/поведение на единственный child (`<a>`, Next.js `<Link>`) |
| `className` | `string` | — | Доп. классы на корневой `<button>` (или child при `asChild`) |
| `classNames` | `ButtonClassNames` | — | Слоты подчастей |
| `motion` | `ButtonMotion` | — | Карта слотов (`root`, `label`, `icon`, `text`, `loader`, `success`, `error`). Ключ `events` — app-команды для `MotionController`. `states` — режимы для `motionState` |
| `motionController` | `MotionController` | — | Handle: `play` / `playSlot` / `playAll` / `set` / `cancel` |
| `motionState` | `string` | — | App-режим (`idle` / `loading` / `success`). Тот же ещё раз — тишина |
| `motionPayload` | `unknown` | — | Снимок для фабрики (`ctx.payload`). Типизация — `createMotionFactory` / `MotionPayload`. Не замыкать `useState`. Объекты копируются и freeze; без смены `motionState` не переигрывает |
| `playInitialState` | `boolean` | `false` | Играть `states[motionState]` на маунте |
| `type` | `button` \| `submit` \| `reset` | `button` | Нативный type (не передаётся при `asChild`) |
| … | `ButtonHTMLAttributes` | — | Остальные атрибуты кнопки |

### Примеры

```tsx
// Базовая
<Button variant="primary">Сохранить</Button>

// Кнопка-ссылка (Next.js / react-router)
<Button asChild variant="primary">
  <a href="/docs">Документация</a>
</Button>
```

// С иконкой
<Button icon={<IoAdd aria-hidden />}>Добавить</Button>

// Только иконка
<Button iconOnly aria-label="Добавить">
  <IoAdd aria-hidden className="icon-base" />
</Button>

```tsx
import { Button, createMotionStates } from "burne-ui";

const states = createMotionStates({
  idle: {
    label: { autoAlpha: 1, scale: 1, duration: 0.2 },
    loader: { autoAlpha: 0, scale: 0.85, duration: 0.2 },
    success: { autoAlpha: 0, scale: 0.85, duration: 0.2 },
    error: { autoAlpha: 0, scale: 0.85, duration: 0.2 },
  },
  loading: {
    label: { autoAlpha: 0, scale: 0.92, duration: 0.2 },
    loader: { autoAlpha: 1, scale: 1, duration: 0.2 },
    success: { autoAlpha: 0, scale: 0.85, duration: 0.2 },
    error: { autoAlpha: 0, scale: 0.85, duration: 0.2 },
  },
  success: {
    label: { autoAlpha: 0, scale: 0.92, duration: 0.2 },
    loader: { autoAlpha: 0, scale: 0.85, duration: 0.2 },
    success: { autoAlpha: 1, scale: 1, duration: 0.2 },
    error: { autoAlpha: 0, scale: 0.85, duration: 0.2 },
  },
});

<Button
  variant="primary"
  disabled={mode !== "idle"}
  aria-busy={mode === "loading"}
  motionState={mode}
  motion={{ states, root: { pressIn: false } }}
  onClick={() => void save()}
>
  <Button.Label>Сохранить</Button.Label>
  <Button.Loader />
  <Button.Success />
  <Button.Error />
</Button>
```

## variant и status

- **`variant`** — визуальный стиль: фон, бордер, тень.
- **`status`** — семантика: danger / success / info / warning накладываются поверх variant.

| variant | Поверхность | Тень при hover | Примечание |
|---------|-------------|----------------|------------|
| `default` | `bg-surface`, `border-token` | да | Базовая кнопка |
| `primary` | `bg-primary` | да | Акцентная |
| `outline` | прозрачный фон, `border-token-outline` | да | Hover: `bg-transparent-hover`; при status ≠ default бордер/текст по статусу |
| `secondary` | `bg-secondary` | да | Вторичная |
| `ghost` | прозрачный, без бордера | да | Hover: `bg-transparent-hover` |
| `gloss` | CSS-класс `gloss-btn` | нет (gloss-motion) | Статус через `gloss-btn-*` |

При `status !== "default"` hover-вариант пересчитывается (например, `primary` + `danger` → fill-danger).

## Размеры

Размеры берутся из `CONTROL_SIZE_LAYOUT` (`utils/sizeLayout`):

| size | Высота | min-width (кнопка) | Текст (`Text`) | Иконка в слоте | Радиус |
|------|--------|--------------------|----------------|----------------|--------|
| `small` | `min-h-control-small` | `min-w-button-small` | `small` | `icon-slot-small` | `rounded-small` |
| `base` | `min-h-control-base` | `min-w-button-base` | `base` | `icon-slot-base` | `rounded-base` |
| `mid` | `min-h-control-mid` | `min-w-button-mid` | `mid` | `icon-slot-mid` | `rounded-large` |
| `large` | `min-h-control-large` | `min-w-button-large` | `mid` | `icon-slot-large` | `rounded-large` |

При `iconOnly` минимальная ширина не применяется (`min-w-fit`).

**Каскад размера:** `size` prop → `ButtonGroup` context → `Form` context → `"base"`.

**Каскад variant:** `variant` prop → `ButtonGroup` context → `"default"`.

## Анимации

Все motion — **GSAP**. Hover/press на корне — **slot motion** (`buttonAnimations.ts`). Слои `loader` / `success` / `error` — compound-части: CSS rest скрыт, видимость через `motion.states`.

**DOM-структура (упрощённо):**

```
<button>                          ← refs, pointer handlers, shadow (если не groupSegment)
  <Ripple />                      ← опционально, z-0
  <span contentMotionRef>         ← squeeze target при groupSegment (`motion.root` целится сюда)
    grid: label (+ loader / success / error, если приложение смонтировало части)
```

### Slot motion

Слот: `root` (кнопка; в `ButtonGroup` сегменте — внутренний content span). Вложенные `label` / `icon` / `text` регистрируются через `useMotionPart`; хост рассылает hover/press (`exclude` `root` + overlay-слои). `loader` / `success` / `error` — публичные слоты для `motion.states`, не для kit-crossfade.

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `root` | `hoverIn` / `hoverOut` | `hoverLiftFirstLevel` или `hoverLiftGloss` |
| `root` | `pressIn` | `pressSqueeze` или `pressSqueezeGloss` (полный in+release; `pressOut` по умолчанию `false`) |
| `label` / `icon` / `text` | hover / press | нет; хост **рассылает** |
| `loader` / `success` / `error` | hover / press | нет; CSS rest скрыт, поза — `motion.states` |

`pressOut: false` — kit squeeze сам отпускает. Если курсор ещё на кнопке, отпуск возвращает hover-позу. `hoverIn: false` оставляет покой: масштаб hover не появляется после press. Клавиатура `Enter`/`Space` играет `pressIn`.

**Где в коде:** типы — `buttonTypes.ts`; scope — `buttonContext.tsx`; defaults + host — `buttonAnimations.ts` (`resolveButtonMotionDefaults`, `useButtonAnimations`); слоты — `buttonParts.tsx`; Provider — `Button.tsx`.

```tsx
<Button motion={{ root: { pressIn: false } }}>Без squeeze</Button>

<Button
  motion={{
    root: {
      hoverIn: { y: -3, duration: 0.18 },
      hoverOut: { y: 0 },
    },
  }}
>
  Custom y
</Button>
```

Проп `motionController` + ключ `events` на `motion` — app-команды (`cta:nudge`), не фазы. `createMotionEvents`. `play` / `playAll` принимают `MotionPlayEvent`. См. [Motion](/docs/motion-events).

`motionState` + `motion.states` — поза кнопки из React/store (`idle` / `loading` / `success`). Слои `Button.Loader` / `Success` / `Error` **не** монтируются в simple API: приложение само ставит compound-части и перечисляет их в каждом режиме (слот без ключа в новом state не сбрасывается). Несколько слотов на одном режиме: `root` + `text` (перелив / фабрика с GSAP-плагином). Подпись для TextPlugin — `motionPayload` (`from` / `to`) + `createMotionFactory`. Плагины — в приложении, рецепт: [Motion and state managers](/docs/motion-state#плагины--текст-на-state).

```tsx
import { Button, createMotionStates } from "burne-ui";

const states = createMotionStates({
  idle: {
    root: { scale: 1, duration: 0.2 },
    text: { autoAlpha: 1, duration: 0.2 },
  },
  busy: {
    root: { scale: 0.97, duration: 0.2 },
    text: { autoAlpha: 0.4, duration: 0.45, yoyo: true, repeat: -1, ease: "sine.inOut" },
  },
});

<Button motionState={mode} motion={{ states, root: { pressIn: false } }}>
  {mode === "busy" ? "Working…" : "Idle"}
</Button>
```

```tsx
import { Button, createMotionEvents, useMotionControllerHandle } from "burne-ui";

const events = createMotionEvents({
  "cta:nudge": { y: -8, duration: 0.16, yoyo: true, repeat: 1 },
});

function Nudge() {
  const controller = useMotionControllerHandle();
  return (
    <>
      <Button size="small" variant="outline" onClick={() => controller.play("cta:nudge")}>
        Nudge
      </Button>
      <Button motionController={controller} motion={{ events, root: { pressIn: false } }}>
        Pay
      </Button>
    </>
  );
}
```

`playAll("hoverIn", { stagger })` по `icon` / `text`, async `cta:saving` → success (timeline на иконке и тексте) и `waitForComplete` — playground / Storybook **MotionController**.

Цвет — `tweenCssColor`, не сырой `gsap.to({ color })`. Иконка и текст — отдельные слоты (хост рассылает hover с кнопки):

```tsx
<Button
  variant="outline"
  status="success"
  icon={<IoCheckmarkCircleOutline aria-hidden />}
  classNames={{ root: "border-token-success", icon: "text-success", text: "font-w-strong" }}
  motion={{
    root: {
      hoverIn: (ctx) => {
        const tl = ctx.timeline();
        tl.to(ctx.el, { y: -2, duration: 0.2 }, 0);
        tl.add(tweenCssColor(ctx.el, "var(--color-success)"), 0);
        return tl;
      },
      hoverOut: (ctx) => {
        const tl = ctx.timeline();
        tl.to(ctx.el, { y: 0, duration: 0.2 }, 0);
        tl.add(tweenCssColor(ctx.el, "var(--color-foreground)", { clearOnComplete: true }), 0);
        return tl;
      },
    },
    icon: {
      hoverIn: (ctx) =>
        ctx.to({ rotation: 16, scale: 1.14, duration: 0.32, ease: "back.out(2)" }),
      hoverOut: (ctx) => ctx.to({ rotation: 0, scale: 1, duration: 0.2 }),
    },
  }}
>
  Confirm
</Button>

<Button
  classNames={{ label: "gap-small" }}
  motion={{
    icon: { hoverIn: { rotate: -12, duration: 0.28 } },
    text: { hoverIn: { x: 4, duration: 0.22 } },
  }}
>
  <Button.Label>
    <Button.Icon className="text-primary"><IoRocketOutline /></Button.Icon>
    <Button.Text className="font-w-strong">Launch</Button.Text>
  </Button.Label>
</Button>
```

**Тень 1-го уровня:** `shadowMotionFor("none")` — `initElementShadow(--shadow-none)` на mount ставит токен `--el-shadow` и статичный rest-слой. Hover / press — отдельные слои (`--shadow-lift` / `--shadow-none`); GSAP кросс-фейдит только `opacity`. Класс `animate-shadow`. Gloss — свои три CSS-тени (`--gloss-shadow-rest|hover|press`), рецепты `hoverLiftGloss` / `pressSqueezeGloss`.

**ButtonGroup:** lift/squeeze на content span, не на glue-корне.

### 1. Hover lift + press squeeze

`useButtonAnimations` — цель: root `<button>` или `contentMotionRef` при `groupSegment`.

**Pointer enter (hover lift):** адаптивный `scale` (cap = `hoverLiftScale`), тень `firstLevelHoverShadow()` (`--shadow-none` → `--shadow-sm`).

**Pointer down (press squeeze):** 3 keyframes scale `1 → adaptiveSqueeze → 1`. После release, если курсор внутри — возвращает hover lift.

**Gloss:** вместо тени — `hoverLiftGloss` / `pressSqueezeGloss`.

**ButtonGroup:** lift/squeeze на content span, не на glue-корне.

#### Кастомизация hover/squeeze

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  interactiveDuration: 280,
  interactiveEase: "power2.out",
  hoverLiftEase: "sine.inOut",
  hoverLiftScale: 1.025,
  pressSqueezeScale: [1, 0.98, 1],
  enableHoverLift: true,
  enablePressSqueeze: true,
});
```

**Глобально:** `enableAnimations: false` — vars через `gsap.set`, hover skip на таче/reduced.

**Reduced motion / touch:** `shouldSkipInteractiveHoverLift()` глушит pointer-hover (включая кастомные vars). Press по-прежнему смотрит `enablePressSqueeze` / `prefers-reduced-motion`.

### 2. Converge ripple (`ripple={true}`)

Встроенный `<Ripple />` в clip-слое (`overflow-hidden rounded-[inherit]` на самом Ripple, не на корне кнопки — иначе обрежется hover-элевация). Слушатель `pointerdown` на кнопке → волна от точки клика.

**Анимация точки** (`ConvergeRippleLayer`, `direction` default `"out"` у Ripple в Button):

- `scale`: `0.12 → 1` (out) или `1 → 0.12` (in)
- `autoAlpha`: `opacityFrom → 0`
- `ease`: `ensureRippleEase()` из `rippleEaseCss`
- `duration`: prop `rippleDefaultDuration` (default 700 ms)

Цвет: `buttonConvergeRippleColor(variant, status)`. Отключено при `disabled`.

```ts
configureMotion({
  rippleDefaultDuration: 700,
  rippleDefaultOpacityFrom: 0.42,
  rippleEaseCss: "cubic-bezier(0.25, 0.55, 0.35, 0.95)",
  enableRipple: true,
});
```

### 3. Overlay layers (`Button.Loader` / `Success` / `Error`)

Simple API монтирует только label. Overlay-части — compound: CSS rest = `invisible opacity-0`, показ — `motion.states` (`autoAlpha` / `scale`). В каждом режиме перечислите все четыре слота, иначе поза останется на пропущенном.

`disabled` задаёт приложение. `aria-busy` при `motionState="loading"` ставит кит.

Живой пример — playground / Storybook **motionState save**.

### Сводка: что настраивается где

| Анимация | Файл / утилита | Ключи `configureMotion` | Условие |
|----------|----------------|---------------------------|---------|
| Hover lift | slot motion `hoverLiftFirstLevel` / `hoverLiftGloss` | `hoverLiftScale`, `hoverLiftEase`, `enableHoverLift` | `!blocked` |
| Press squeeze | slot motion `pressSqueeze` / `pressSqueezeGloss` | `pressSqueezeScale`, `interactiveDuration`, `enablePressSqueeze` | `!blocked` |
| Ripple | `<Ripple />` | `rippleDefaultDuration`, `rippleDefaultOpacityFrom`, `enableRipple` | `ripple` |
| Overlay save | `motion.states` + compound Loader/Success/Error | — | приложение |
| Gloss motion | `glossInteractiveMotion` | те же interactive | `variant="gloss"` |

## Токены и CSS-классы

### Цветовые токены (ripple)

| Токен | Использование |
|-------|---------------|
| `converge-ripple-neutral` | default, outline, secondary, ghost, gloss |
| `converge-ripple-primary-fill` | primary + default status |
| `converge-ripple-danger` | status danger |
| `converge-ripple-success` | status success |
| `converge-ripple-info` | status info |
| `converge-ripple-warning` | status warning |

### Семантические поверхности (`semanticStatusSurface`)

Для `status !== "default"`: `SEMANTIC_STATUS_SURFACE_TINT`, `SEMANTIC_STATUS_FILL`, `SEMANTIC_STATUS_OUTLINE_BORDER`, `SEMANTIC_STATUS_TEXT`, `SEMANTIC_STATUS_FILL_TEXT`.

### Focus

`BUTTON_STATUS_FOCUS_OUTLINE`: retarget `--color-focus-ring` на `--color-focus-ring-{status}` (default — soft primary token).

### Gloss

Классы: `gloss-btn`, `gloss-btn-danger`, `gloss-btn-success`, `gloss-btn-info`, `gloss-btn-warning`.

### Размерные токены

`--control-height-*`, `min-w-button-*`, spacing (`px-mid`, `py-small`, …). Размер иконки в слоте — `icon-slot-small` … `icon-slot-large` (переменная `--icon-size` на обёртке). Свой размер: `classNames.icon="icon-slot-large"` или `icon-large` на самом `<svg>`.

## Стилизация и кастомизация

Два уровня: **`className` на корне** и **`classNames` на слотах**. Compound-части (`Button.Icon`, `Button.Text`, `Button.Label`, …) принимают **`className`** поверх слота.

```tsx
<Button
  variant="outline"
  status="danger"
  size="mid"
  className="min-w-button-mid"
  classNames={{ icon: "icon-slot-large text-danger", text: "font-w-strong" }}
  icon={<IoSave aria-hidden />}
>
  Сохранить
</Button>
```

### Слоты `ButtonClassNames`

| Слот | DOM |
|------|-----|
| `root` | `<button>` (мержится с `className`) |
| `content` | Внутренний content span |
| `label` | Слой лейбла (иконка + текст) |
| `icon` | Обёртка иконки |
| `text` | Текстовый span |
| `loader` / `success` / `error` | Overlay-слои (compound; CSS rest скрыт) |

| Prop | Что стилизует |
|------|---------------|
| `variant` | Surface: default, outline, secondary, gloss, primary |
| `status` | Semantic tint / border |
| `size` | Height, padding, icon size, min-width |
| `iconOnly` | Квадратный hit-area |
| `groupSegment` | Glue в ButtonGroup (rounding сегмента) |
| `className` | Доп. классы на корне |
| `classNames` | Слоты подчастей |

Simple: `icon` + `iconPosition`. Compound: `Button.Icon` / `Button.Text` внутри `Button.Label`.

### Compound-подобные паттерны

Для нестандартной разметки внутри кнопки используйте children, стилизуя обёртки сами:

```tsx
<Button variant="ghost" className="justify-between gap-xlarge px-xlarge">
  <span className="flex flex-col items-start text-left">
    <span className="font-semibold">Заголовок</span>
    <span className="text-small text-muted">Подпись</span>
  </span>
  <IoChevronForward aria-hidden />
</Button>
```

### Экспортируемые style helpers

Для своих контролов с тем же layout:

```tsx
import { buttonRootClass, controlShellClass, buttonRippleTone } from "burne-ui";

const shell = controlShellClass("base");
const root = buttonRootClass("base", false);
const rippleColor = buttonRippleTone("primary", "danger");
```

### Отключение анимаций

Глобально:

```ts
configureMotion({ enableAnimations: false });
// или точечно:
configureMotion({ enableHoverLift: false, enablePressSqueeze: false });
```

Локального пропа на кнопке нет — только `configureMotion` / `prefers-reduced-motion`.

## Доступность

- Нативный `<button>` с корректным `type`.
- `aria-busy` ставит кит, когда `motionState="loading"`.
- При `iconOnly` — обязателен осмысленный `aria-label`.
- Иконки в `icon` и overlay-слоях — `aria-hidden`.
- Focus ring через `focus-ring` + status outline.
- При `disabled` — `disabled` + `pointer-events-none`, opacity 50%.

## Интеграция с контекстами

| Контекст | Что наследует Button |
|----------|----------------------|
| `ButtonGroup` | `variant`, `size`, `groupSegment`, glue/rounding |
| `Form` | `size`, `disabled`, `isSubmitting` → blocked |

## Структура файлов компонента

```
Button/
├── Button.tsx              # Provider: motion + resolveButtonMotionDefaults + params
├── index.ts
├── buttonTypes.ts          # ButtonMotion / ButtonPartMotion
├── buttonStyles.ts
├── buttonAPI.ts
├── buttonContext.tsx       # createMotionScope("Button")
├── buttonParts.tsx
├── buttonAnimations.ts     # defaults, host play
├── useButtonRootState.ts
└── Button.stories.tsx
```

## Storybook

`Core Components/Button` — варианты, статусы, размеры, motionState save, gloss, светлая/тёмная тема (`data-theme="light"`).
