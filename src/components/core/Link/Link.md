# Link

Текстовая ссылка `<a>` с опциональными иконками, underline, hover-lift и press squeeze. Simple и compound API (`Link.Icon`).

## Импорт

```tsx
import { Link, LinkIcon, type LinkProps, type LinkSize, type LinkIconPosition, type LinkClassNames } from "burne-ui";
```

## API

### Props

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `href` | `string` | — | Обязательный URL |
| `size` | `small` \| `base` \| `mid` \| `large` | `base` | Текст и иконки |
| `underline` | `boolean` | `false` | Подчёркивание текста |
| `icon` | `ReactNode` | — | Simple API иконка |
| `iconPosition` | `start` \| `end` | `start` | Позиция `icon` |
| `showDefaultIcon` | `boolean` | `false` | `IoArrowForward` ↗ (только без `icon`) |
| `defaultIconPosition` | `start` \| `end` | `end` | Позиция дефолтной иконки |
| `className` | `string` | — | На `<a>` |
| `classNames` | `LinkClassNames` | — | `root`, `text`, `iconStart`, `iconEnd` |
| … | `AnchorHTMLAttributes` | — | `target`, `rel`, `onClick`, … |

### `LinkClassNames`

```tsx
type LinkClassNames = {
  root?: string;
  text?: string;
  iconStart?: string;
  iconEnd?: string;
};
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
  <Link.Icon position="start"><IoDocument aria-hidden /></Link.Icon>
  Открыть файл
  <Link.Icon position="end" />
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

- Текст и якорь: `text-primary`, `focus-ring`
- Кастомная иконка: `text-primary`
- Дефолтная / compound без children: `text-muted` → `text-primary` на `group-hover/link` и `group-focus-visible/link`
- Дефолтная ↗: `rotate-[-45deg]`

Цвет ссылки можно переопределить: `className="text-muted"`.

## Анимации

Motion: `linkAnimations.ts` → `usePressableElementTextMotion` с **`hoverLift: true`**.

**DOM-структура:**

```
<a ref=anchorRef>              ← pointer handlers; transform target = сам <a>
  [LinkIconSlot start]
  <Text> текст
  [LinkIconSlot end]
```

Весь якорь (`inline-flex`) получает scale transform — текст и иконки двигаются вместе.

### 1. Hover lift

**Pointer enter** (если не `defaultPrevented`):

1. `shouldSkipInteractiveHoverLift()` — skip на reduced-motion / touch / tablet
2. `animateInteractiveHoverLift(anchor, true, hoverLiftScale)` — фиксированный scale из config (не adaptive как Button)

**Pointer leave:** `animateInteractiveHoverLift(anchor, false, hoverLiftScale)`.

**Без тени** — Link не использует `--el-shadow` / `useShadowMotion` (в отличие от Button/Alert).

### 2. Press squeeze

**Pointer down:**

1. `animateInteractivePressSqueeze(anchor, { pointerInside, liftScale })`
2. Трёхфазный scale: rest → compressed → rest
3. После release: если pointer inside — восстанавливает hover lift

Adaptive squeeze по размеру элемента (~2.4px cap) — как у Button.

### 3. Иконки — CSS-only

Цвет иконок: `TEXT_COLOR_TRANSITION` + `group-hover/link` — **не GSAP**.

### Кастомизация

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  hoverLiftScale: 1.025,        // lift на hover (фиксированный для Link)
  hoverLiftEase: "sine.inOut",
  interactiveDuration: 280,     // squeeze duration
  pressSqueezeScale: [1, 0.98, 1],
  enableHoverLift: true,
  enablePressSqueeze: true,
});
```

**Reduced motion / touch:** lift и squeeze отключены (`prefersReducedInteractiveHoverLift`, viewport ≤ tablet).

**Локально:** motion всегда enabled в `useLinkAnimations`; disabled-состояния у Link нет — для неактивной ссылки используйте стили + `aria-disabled` / `pointer-events-none` вручную.

### Сводка: что настраивается где

| Анимация | Утилита | `configureMotion` | Примечание |
|----------|---------|-------------------|------------|
| Hover lift | `usePressableElementTextMotion` | `hoverLiftScale`, `enableHoverLift` | без shadow |
| Press squeeze | `animateInteractivePressSqueeze` | `pressSqueezeScale`, `interactiveDuration` | на `<a>` |
| Icon color | CSS `group-hover/link` | — | не GSAP |

## Токены и CSS

| Класс | Назначение |
|-------|------------|
| `text-primary` | цвет ссылки |
| `focus-ring` | focus visible |
| `rounded-mid` | hit area |
| `underline decoration-current/70` | при `underline` |
| `gap-xsmall` | между иконкой и текстом |

## Стилизация и кастомизация

### Два уровня

1. **`className`** — доп. классы на `<a>` (мерж с `classNames.root`).
2. **`classNames`** — слоты `root`, `text`, `iconStart`, `iconEnd`.

Link — один компонент; «compound» меняет только разметку иконок внутри якоря.

### Слоты `LinkClassNames`

| Слот | DOM / элемент | Когда использовать |
|------|---------------|-------------------|
| `root` | `<a>` | Gap, padding, border, hover-lift target |
| `text` | `Text` (children) | Шрифт, underline override |
| `iconStart` | Обёртка левой иконки | Размер, muted/hover цвет |
| `iconEnd` | Обёртка end-иконки | Дефолтная ↗ или `icon` при `iconPosition="end"` |

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
    iconStart: "opacity-80",
    iconEnd: "text-warning",
  }}
>
  Документация
</Link>
```

Иконки через props `icon` / `iconPosition` / `showDefaultIcon` — стили обёрток через `iconStart` / `iconEnd`.

### Compound API

```tsx
<Link
  href="/item"
  classNames={{
    root: "gap-mid",
    text: "text-primary",
    iconStart: "text-muted group-hover:text-foreground",
  }}
>
  <Link.Icon position="start">
    <IoFolder aria-hidden />
  </Link.Icon>
  Открыть файл
  <Link.Icon position="end" />
</Link>
```

Пустой `<Link.Icon position="end" />` — дефолтная ↗; `muted` до hover задаётся стилями `iconEnd`.

`Link.Icon` не имеет отдельного слота в `LinkClassNames` — стилизуйте иконку через `iconStart` / `iconEnd` или оберните children.

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
├── linkAnimations.ts
├── useLinkRootState.ts
├── linkContext.tsx
├── linkA11y.ts
└── Link.stories.tsx
```

## Storybook

`Core Components/Link` — default icon, underline, compound, размеры, кастомные иконки, светлая тема.
