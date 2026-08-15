# Button

Интерактивная кнопка первого уровня: варианты поверхности, семантические статусы, async-состояния, converge-ripple и GSAP-анимации hover/press.

## Импорт

```tsx
import { Button } from "burne-ui";
import type {
  ButtonProps,
  ButtonVariant,
  ButtonStatus,
  ButtonSize,
  ButtonAsyncState,
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
| `asyncState` | `idle` \| `loading` \| `success` \| `error` | — | Контролируемое async-состояние |
| `onAsyncStateChange` | `(state) => void` | — | Колбэк при смене async (uncontrolled) |
| `onAsyncClick` | `(e) => Promise<boolean>` | — | Uncontrolled async: `true` → success, `false` → error |
| `asyncFeedbackMs` | `number` | `2000` | Задержка возврата в `idle` после success/error |
| `groupSegment` | `ButtonGroupSegment` | — | Сегмент в `ButtonGroup` (скругления, glue) |
| `asChild` | `boolean` | `false` | Стили/поведение на единственный child (`<a>`, Next.js `<Link>`) |
| `className` | `string` | — | Доп. классы на корневой `<button>` (или child при `asChild`) |
| `classNames` | `ButtonClassNames` | — | Слоты подчастей |
| `motion` | `ButtonMotion` | — | Карта слотов (`root`: `hoverIn` / `hoverOut` / `pressIn` / `pressOut`) |
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

// Async (uncontrolled)
<Button
  ripple
  onAsyncClick={async () => {
    await save();
    return true; // success; false → error
  }}
>
  Сохранить
</Button>

// Async (controlled)
const [state, setState] = useState<ButtonAsyncState>("idle");
<Button asyncState={state} onClick={run} disabled={state !== "idle"} />
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
| `small` | `h-control-small` | `min-w-button-small` | `small` | `icon-small` | `rounded-small` |
| `base` | `h-control-base` | `min-w-button-base` | `base` | `icon-base` | `rounded-base` |
| `mid` | `h-control-mid` | `min-w-button-mid` | `mid` | `icon-mid` | `rounded-mid` |
| `large` | `h-control-large` | `min-w-button-large` | `mid` | `icon-large` | `rounded-large` |

При `iconOnly` минимальная ширина не применяется (`min-w-fit`).

**Каскад размера:** `size` prop → `ButtonGroup` context → `Form` context → `"base"`.

**Каскад variant:** `variant` prop → `ButtonGroup` context → `"default"`.

## Анимации

Все motion — **GSAP**. Hover/press на корне — **slot motion** (`buttonAnimations.ts`). Async-слои и expand-ripple остаются внутренней GSAP-логикой, не публичными фазами.

**DOM-структура (упрощённо):**

```
<button>                          ← refs, pointer handlers, shadow (если не groupSegment)
  <Ripple />                      ← опционально, z-0
  <span clipLayer>                ← expand ripples async
  <span contentMotionRef>         ← squeeze target при groupSegment (`motion.root` целится сюда)
    grid: label | loader | success | error
```

### Slot motion

Слот: `root` (кнопка; в `ButtonGroup` сегменте — внутренний content span).

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `root` | `hoverIn` / `hoverOut` | `hoverLiftFirstLevel` или `hoverLiftGloss` |
| `root` | `pressIn` | `pressSqueeze` или `pressSqueezeGloss` (полный in+release; `pressOut` по умолчанию `false`) |

`pressOut: false` — kit squeeze сам отпускает. Клавиатура `Enter`/`Space` играет `pressIn`.

**Где в коде:** типы — `buttonTypes.ts`; scope — `buttonContext.tsx`; defaults + host — `buttonAnimations.ts` (`resolveButtonMotionDefaults`, `useButtonAnimations`); Provider — `Button.tsx`.

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

`classNames` / `className` на частях можно сочетать с factory: слот только `root`, внутренние узлы — через `querySelector` / `data-part`. Цвет — `tweenCssColor`, не сырой `gsap.to({ color })`.

```tsx
<Button
  variant="outline"
  status="success"
  icon={<IoCheckmarkCircleOutline aria-hidden />}
  classNames={{ root: "border-token-success", icon: "text-success", text: "font-w-strong" }}
  motion={{
    root: {
      hoverIn: (ctx) => {
        const tl = gsap.timeline();
        const svg = ctx.el.querySelector("svg");
        if (svg) tl.to(svg, { rotate: 16, scale: 1.14, duration: 0.32, ease: "back.out(2)" }, 0);
        tl.add(tweenCssColor(ctx.el, "var(--color-success)"), 0);
        return tl;
      },
      hoverOut: (ctx) => {
        const svg = ctx.el.querySelector("svg");
        const tl = gsap.timeline();
        if (svg) tl.to(svg, { rotate: 0, scale: 1, duration: 0.2 }, 0);
        tl.add(tweenCssColor(ctx.el, "var(--color-foreground)", { clearOnComplete: true }), 0);
        return tl;
      },
    },
  }}
>
  Confirm
</Button>

<Button classNames={{ label: "gap-small" }} motion={{ root: { hoverIn: (ctx) => gsap.to(ctx.el.querySelector("[data-part=icon]"), { rotate: -12 }) } }}>
  <Button.Label>
    <Button.Icon data-part="icon" className="text-primary"><IoRocketOutline /></Button.Icon>
    <Button.Text className="font-w-strong">Launch</Button.Text>
  </Button.Label>
</Button>
```

**Тень 1-го уровня:** `shadowMotionFor("none")` — `initElementShadow(--shadow-none)` на mount; hover → `--shadow-lift`. Класс `animate-shadow`. Gloss — без этой тени, рецепты `hoverLiftGloss` / `pressSqueezeGloss`.

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

Встроенный `<Ripple />` в clip-слое. Слушатель `pointerdown` на кнопке → волна от точки клика.

**Анимация точки** (`ConvergeRippleLayer`, `direction` default `"out"` у Ripple в Button):

- `scale`: `0.12 → 1` (out) или `1 → 0.12` (in)
- `autoAlpha`: `opacityFrom → 0`
- `ease`: `ensureRippleEase()` из `rippleEaseCss`
- `duration`: prop `rippleDefaultDuration` (default 700 ms)

Цвет: `buttonConvergeRippleColor(variant, status)`. Отключено при `blocked` или `asyncState !== "idle"`.

```ts
configureMotion({
  rippleDefaultDuration: 700,
  rippleDefaultOpacityFrom: 0.42,
  rippleEaseCss: "cubic-bezier(0.25, 0.55, 0.35, 0.95)",
  enableRipple: true,
});
```

### 3. Async crossfade (label ↔ loader ↔ success/error)

Четыре слоя в CSS grid, refs через `createButtonAsyncLayerRefCallback`:

| Слой | `asyncState` | scale in | scale out |
|------|--------------|----------|-----------|
| label | `idle` | 1 | 0.92 |
| loader | `loading` | 1 | 0.85 |
| success | `success` | 1 | 0.85 |
| error | `error` | 1 | 0.85 |

**Первый paint (SSR / до motion):** неактивные слои скрыты Tailwind-классом `invisible opacity-0` по `asyncState` (`asyncMotionReady === false`).

**После sync:** `asyncMotionReady` → GSAP владеет `autoAlpha` (классы hide снимаются, чтобы crossfade не снэпился).

**Переход:** GSAP `to` на каждом слое — `autoAlpha` + `scale`, vars = `motionInteractive()`.

**Первый mount:** мгновенный `gsap.set` без анимации, затем `asyncMotionReady`.

**Uncontrolled `onAsyncClick`:** loading → then success/error + `pushExpandRipple`.

```ts
configureMotion({
  enableAsyncButtonCrossfade: true,
  interactiveDuration: 280,  // длительность crossfade
});
```

**Reduced motion:** мгновенная смена видимости без GSAP.

### 4. Feedback expand ring

После `loading → success|error` — `ButtonExpandRippleLayer` (свой `useState`, imperative `push`) рендерит `ButtonFeedbackExpandRipple` из центра кнопки; dismiss не ре-рендерит корень Button:

- `fromTo`: `scale: 0, autoAlpha: 0.5` → `scale: 1, autoAlpha: 0`
- Размер: `centerCoverDiameter(w, h)` — покрывает всю кнопку
- Цвет: `color-mix(success|danger 55%)`
- `ease`: `ensureRippleEase()`, duration: `motionFeedbackExpand()`

```ts
configureMotion({
  enableFeedbackExpand: true,
  feedbackExpandDuration: 720,
});
```

### Сводка: что настраивается где

| Анимация | Файл / утилита | Ключи `configureMotion` | Условие |
|----------|----------------|---------------------------|---------|
| Hover lift | slot motion `hoverLiftFirstLevel` / `hoverLiftGloss` | `hoverLiftScale`, `hoverLiftEase`, `enableHoverLift` | `!blocked` |
| Press squeeze | slot motion `pressSqueeze` / `pressSqueezeGloss` | `pressSqueezeScale`, `interactiveDuration`, `enablePressSqueeze` | `!blocked` |
| Ripple | `<Ripple />` | `rippleDefaultDuration`, `rippleDefaultOpacityFrom`, `enableRipple` | `ripple` |
| Async crossfade | `buttonAnimations` layoutEffect | `enableAsyncButtonCrossfade`, `interactiveDuration` | `asyncState` |
| Expand ring | `ButtonFeedbackExpandRipple` | `enableFeedbackExpand`, `feedbackExpandDuration` | — |
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

`--control-height-*`, `min-w-button-*`, spacing (`px-mid`, `py-small`, …), `icon-small` / `icon-base` / `icon-large`.

## Стилизация и кастомизация

Два уровня: **`className` на корне** и **`classNames` на слотах**. Compound-части (`Button.Icon`, `Button.Text`, `Button.Label`, …) принимают **`className`** поверх слота.

```tsx
<Button
  variant="outline"
  status="danger"
  size="mid"
  className="min-w-button-mid"
  classNames={{ icon: "text-danger", text: "font-w-strong" }}
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
| `loader` / `success` / `error` | Async-слои |

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
- `aria-busy={true}` при `asyncState === "loading"`.
- При `iconOnly` — обязателен осмысленный `aria-label`.
- Иконки в `icon` и async-слоях — `aria-hidden`.
- Focus ring через `focus-ring` + status outline.
- При blocked (`disabled` или busy async) — `disabled` + `pointer-events-none`, opacity 50%.

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
├── buttonA11y.ts
├── buttonContext.tsx       # createMotionScope("Button")
├── buttonParts.tsx
├── buttonAnimations.ts     # defaults, host play, async crossfade
├── useButtonRootState.ts
└── Button.stories.tsx
```

## Storybook

`Core Components/Button` — варианты, статусы, размеры, async, gloss, светлая/тёмная тема (`data-theme="light"`).
