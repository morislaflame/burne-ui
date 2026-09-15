# Link

Текстовая ссылка `<a>` с опциональными иконками, underline, hover-lift и press squeeze. Simple и compound API (`Link.Icon`).

## Импорт

```tsx
import { Link, type LinkProps, type LinkSize, type LinkIconPos, type LinkClassNames, type LinkMotion, type LinkPartMotion } from "burne-ui";
```

## API

### Props

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `href` | `string` | — | URL; обязателен без `asChild` |
| `asChild` | `boolean` | `false` | Стили на единственный child (router `Link`, custom `<a>`); `href` опционален |
| `size` | `small` \| `base` \| `mid` \| `large` | `base` | Текст и иконки |
| `underline` | `boolean` | `false` | Подчёркивание текста |
| `icon` | `ReactNode` | — | Simple API иконка |
| `iconPosition` | `start` \| `end` | `start` | Позиция `icon` |
| `showDefaultIcon` | `boolean` | `false` | `IoArrowForward` ↗ (только без `icon`) |
| `defaultIconPosition` | `start` \| `end` | `end` | Позиция дефолтной иконки |
| `className` | `string` | — | На `<a>` (или child при `asChild`) |
| `classNames` | `LinkClassNames` | — | `root`, `text`, `icon` |
| `motion` | `MotionMapWithEvents<LinkMotion>` | — | Slot map `root` / `text` / `icon`. Ключ `events` — app-команды для `MotionController`. `states` — режимы для `motionState` |
| `motionController` | `MotionController` | — | Handle: `play` / `playSlot` / `playAll` / `set` / `cancel` |
| `motionState` | `string` | — | App-режим (`idle` / `sharing` / `copied`). Тот же ещё раз — тишина |
| `motionPayload` | `unknown` | — | Снимок для фабрики (`ctx.payload`). Типизация — `createMotionFactory` / `MotionPayload`. Объекты копируются и freeze; без смены `motionState` не переигрывает |
| `playInitialState` | `boolean` | `false` | Играть `states[motionState]` на маунте |
| … | `AnchorHTMLAttributes` | — | `target`, `rel`, `onClick`, … |

### `LinkClassNames`

```tsx
type LinkClassNames = {
  root?: string;
  text?: string;
  icon?: string;
};
```

### asChild (роутер)

```tsx
import NextLink from "next/link";

<Link asChild underline showDefaultIcon>
  <NextLink href="/docs">Документация</NextLink>
</Link>
```

### Simple API

```tsx
<Link href="/docs" underline showDefaultIcon>
  Документация
</Link>

<Link href="/back" icon={<IoChevronBack aria-hidden />} size="small">
  Назад
</Link>
```

### Compound API

```tsx
<Link href="/item">
  <Link.Icon iconPosition="start"><IoDocument aria-hidden /></Link.Icon>
  Открыть файл
  <Link.Icon iconPosition="end" />
</Link>
```

Пустой `<Link.Icon />` без children → дефолтная ↗ на этой позиции (`muted` до hover).

## Размеры

| size | Text variant | Иконка |
|------|--------------|--------|
| `small` | `small` | `icon-small` |
| `base` | `base` | `icon-base` |
| `mid` | `mid` | `icon-mid` |
| `large` | `large` | `icon-large` |

## Иконки и цвет

- Текст и якорь: `text-foreground`, `focus-ring`
- Кастомная иконка: `text-foreground`
- Дефолтная / compound без children: `text-muted` → `text-foreground` на `group-hover/link` и `group-focus-visible/link`
- Дефолтная ↗: `rotate-[-45deg]`

Цвет ссылки можно переопределить: `className="text-muted"`.

## Анимации

Публичный slot motion. Свой scope: Root — Provider с defaults + `useLinkAnimations` (`play` hover/press на `root`). Без hover-тени.

### Slot motion

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `root` | `hoverIn` / `hoverOut` / `pressIn` / `pressOut` | `hoverLiftFirstLevel`, `pressSqueeze` (`pressOut: false`) |
| `text` / `icon` | hover/press | нет |

`false` на фазе — skip без kill. Не анимируйте layout в публичных MotionVars.

**Где в коде:** типы — `linkTypes.ts`; scope — `linkContext.tsx`; defaults + host — `linkAnimations.ts`; слоты — `linkAnchorBodyPart.tsx` / `linkIconSlotPart.tsx`; Provider — `Link.tsx`.

```tsx
<Link href="#" motion={{ root: { hoverIn: false, hoverOut: false } }}>
  Instant hover
</Link>
```

Проп `motionController` + ключ `events` на `motion` — app-команды (`nav:nudge`), не фазы. `createMotionEvents`. `play` / `playAll` принимают `MotionPlayEvent`. См. [Motion](/docs/motion#motionevents).

```tsx
import { Button, Link, createMotionEvents, useMotionControllerHandle } from "burne-ui";

const events = createMotionEvents({
  "nav:nudge": { y: -8, duration: 0.16, yoyo: true, repeat: 1 },
});

function Nudge() {
  const controller = useMotionControllerHandle();
  return (
    <>
      <Button size="small" variant="outline" onClick={() => controller.play("nav:nudge")}>
        Nudge
      </Button>
      <Link href="#" motionController={controller} motion={{ events, root: { pressIn: false } }}>
        Docs
      </Link>
    </>
  );
}
```

`play()` ищет слот `root`. `playSlot("icon")` / `playSlot("text")` — доменные слоты. `playAll` + `stagger` / `exclude`, timeline `nav:copied` через `ctx.targets`, `waitForComplete` — playground / Storybook **MotionController**.

`motionState` + `motion.states` — поза ссылки из React/store (`idle` / `sharing` / `copied`). Не путать с `nav:copied` events. Слот `text` — **SplitText** по символам (плагин в приложении, `overflow-visible` на `classNames.text`). `revert()` в `onCleanup` только если char-ноды ещё в слоте (React мог уже сменить подпись). Если фабрика читает снимок — `createMotionFactory` / `motionPayload`. Живой слайд — галерея MotionController. Рецепт: [Motion and state managers](/docs/motion-state#плагины--текст-на-state).

```tsx
import { Link, createMotionStates } from "burne-ui";

const states = createMotionStates({
  idle: { text: (ctx) => splitReveal(ctx, false) },
  sharing: { text: (ctx) => splitReveal(ctx, true) },
  copied: { text: (ctx) => splitReveal(ctx, false) },
});

<Link href="#" motionState={mode} motion={{ states, root: { pressIn: false } }}>
  {mode === "copied" ? "Copied" : "Share docs"}
</Link>
```

Сырой GSAP в Slot motion: **SplitText** по символам текста (kit hoverLift выключен, `overflow-visible` на `classNames.text`).

## Токены и CSS

| Класс | Назначение |
|-------|------------|
| `text-foreground` | цвет ссылки |
| `focus-ring` | focus visible |
| `rounded-mid` | hit area |
| `underline decoration-current/70` | при `underline` |
| `gap-xsmall` | между иконкой и текстом |

## Стилизация и кастомизация

### Два уровня

1. **`className`** — доп. классы на `<a>` (мерж с `classNames.root`).
2. **`classNames`** — слоты `root`, `text`, `icon`.

Link — один компонент; «compound» меняет только разметку иконок внутри якоря.

### Слоты `LinkClassNames`

| Слот | DOM / элемент | Когда использовать |
|------|---------------|-------------------|
| `root` | `<a>` | Gap, padding, border, hover-lift target |
| `text` | `Text` (children) | Шрифт, underline override |
| `icon` | Обёртка иконки (start/end) | Размер, muted/hover цвет |

`size`, `underline` — базовая типографика и подчёркивание из `linkStyles.ts`.

### Simple API

```tsx
<Link
  href="/docs"
  underline
  icon={<IoDocument aria-hidden />}
  className="max-w-xs"
  classNames={{
    root: "gap-small rounded-mid border border-primary/20 p-xsmall text-info",
    text: "font-semibold",
    icon: "text-warning",
  }}
>
  Документация
</Link>
```

Иконки через props `icon` / `iconPosition` / `showDefaultIcon` — стили обёрток через `icon`.

### Compound API

```tsx
<Link
  href="/item"
  classNames={{
    root: "gap-large",
    text: "text-primary",
    icon: "text-muted group-hover:text-foreground",
  }}
>
  <Link.Icon iconPosition="start">
    <IoFolder aria-hidden />
  </Link.Icon>
  Открыть файл
  <Link.Icon iconPosition="end" />
</Link>
```

Пустой `<Link.Icon iconPosition="end" />` — дефолтная ↗; `muted` до hover задаётся стилями `icon`.

`Link.Icon` не имеет отдельного слота в `LinkClassNames` — стилизуйте иконку через `icon` или оберните children.

### Практические заметки

- **Motion:** hover-lift и squeeze на `root` — не переопределяйте `transform` на корне без нужды.
- **External links:** `target="_blank"` + `rel="noopener noreferrer"` — через обычные anchor props.
- **Порядок мержа:** базовые → `classNames.slot` → `className` на `<Link>`.

## Доступность

- Нативный `<a href>`
- Иконки: `aria-hidden`
- Focus: `focus-ring` на якоре
- Внешние ссылки: `target="_blank"` + `rel="noopener noreferrer"`

## Структура файлов

```
Link/
├── Link.tsx
├── index.ts
├── linkTypes.ts
├── linkStyles.ts
├── linkAPI.ts              # compound icon resolve
├── linkParts.tsx
├── linkAnimations.ts       # slot defaults + host play
├── linkContext.tsx         # createMotionScope
├── useLinkRootState.ts
├── linkA11y.ts
└── Link.stories.tsx
```

## Storybook

`Core Components/Link` — default icon, underline, compound, размеры, кастомные иконки, slot motion gallery, `motionController`, светлая тема.
