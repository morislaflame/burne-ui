# Skeleton

Плейсхолдер загрузки: pulse, wave, shimmer или static (`none`). Compound API: `Skeleton.Circle`, `Skeleton.Text`, `Skeleton.Block`, `Skeleton.Region`. **Только CSS-анимации** — без GSAP.

## Импорт

```tsx
import { Skeleton, type SkeletonProps, type SkeletonCircleProps, type SkeletonTextProps, type SkeletonBlockProps, type SkeletonRegionProps, type SkeletonVariant, type SkeletonRadius, type SkeletonClassNames, type SkeletonCircleClassNames, type SkeletonTextClassNames, type SkeletonBlockClassNames, type SkeletonRegionClassNames } from "burne-ui";
```

## API

### Базовое использование

```tsx
<Skeleton animation="wave" className="h-8 w-full" />

<Skeleton animation="pulse" radius="mid" className="h-24 w-full" />
```

### Compound API

```tsx
<Skeleton.Region busy aria-label="Profile">
  <Skeleton.Block animation="wave">
    <div className="flex gap-base">
      <Skeleton.Circle size="h-control-mid w-control-mid" />
      <div className="flex-1">
        <Skeleton.Text lines={3} animation="wave" />
      </div>
    </div>
  </Skeleton.Block>
</Skeleton.Region>
```

### Root props (`Skeleton`)

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `variant` | `wave` | `pulse` \| `wave` \| `shimmer` \| `none` |
| `radius` | `small` | `none` \| `small` \| `mid` \| `full` |
| `className` | — | Размеры, width (Tailwind) |
| `classNames` | — | `root`, `wave` |
| `style` | — | Inline styles |
| `children` | — | Произвольный layout |

### `Skeleton.Circle` props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `variant` | `wave` | Animation variant |
| `size` | `h-[34px] w-control-base` | Tailwind size classes |
| `classNames` | — | `root`, `wave` |

### `Skeleton.Text` props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `variant` | `wave` | Animation variant |
| `lines` | `3` | Количество строк |
| `lastShort` | `true` | Последняя строка `w-3/5` |
| `classNames` | — | `root`, `line`, `wave` |

### `Skeleton.Block` props

| Prop | Описание |
|------|----------|
| `variant` | Animation variant |
| `classNames` | `root`, `wave` |
| `children` | Card/list layout inside |

### `Skeleton.Region` props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `busy` | `true` | `aria-busy` на контейнере-родителе |
| `className` / `classNames.root` | — | Layout обёртки (без декоративного surface) |
| `aria-label` / `aria-labelledby` | — | Имя региона для AT (рекомендуется) |
| `children` | — | Skeleton-плейсхолдеры или загруженный контент |

`Skeleton.Region` — **не** декоративный: без `aria-hidden` / `role="presentation"`. Плейсхолдеры внутри остаются presentation.

```tsx
const [busy, setBusy] = useState(true);

<Skeleton.Region busy={busy} aria-label="Profile">
  {busy ? (
    <>
      <Skeleton.Circle size="h-12 w-12" />
      <Skeleton.Text lines={2} />
    </>
  ) : (
    <ProfileCard />
  )}
</Skeleton.Region>
```

## variant и radius

| variant | Механизм |
|---------|----------|
| `wave` | Overlay slide (`skeleton-wave-slide`, 2s linear) |
| `pulse` | Opacity pulse (`skeleton-pulse`, 1.6s) |
| `shimmer` | Gradient bg-position (`skeleton-shimmer`, 2s) |
| `none` | Static `bg-primary-tint` без анимации |

| radius (только Root) | CSS |
|----------------------|-----|
| `none` | без rounding |
| `small` | `rounded-small` |
| `mid` | `rounded-mid` |
| `full` | `rounded-full` |

Размеры не enum — через `className` / `size` prop (Tailwind: `h-8`, `w-full`, `h-control-base`).

`status` нет.

## Анимации

**Только CSS** (`styles.css` keyframes). Нет `*Animations.ts`, нет GSAP, нет `configureMotion`.

**DOM (wave):**

```
<span class="bg-primary-tint relative overflow-hidden">
  <span class=wave-overlay />    ← absolute, skeleton-wave-slide
</span>
```

**DOM (Skeleton.Text):**

```
<div class=root>
  <span class=line style={{ animationDelay: index * 0.06s }} />
  ...
```

### 1. Wave overlay

Absolute overlay с `-translate-x-full` → slide across. `aria-hidden` на overlay.

### 2. Pulse

Opacity oscillation на root element.

### 3. Shimmer

Animated `background-position` на gradient (`primary-tint` → `primary-tint-strong`).

### 4. Stagger (Text)

Каждая line: `animationDelay: index * 0.06s` для каскадного wave.

### Чего нет

- GSAP / `configureMotion`
- Hover / press interaction
- Portal motion
- `classNames` на root кроме `root`/`wave` (Text adds `line`)

### Сводка: что настраивается где

| Поведение | Механизм | Ключи `configureMotion` | Локальный prop |
|-----------|----------|---------------------------|----------------|
| Wave slide | CSS `@keyframes` | — | `animation="wave"` |
| Pulse | CSS `@keyframes` | — | `animation="pulse"` |
| Shimmer | CSS `@keyframes` | — | `animation="shimmer"` |
| Line stagger | inline `animationDelay` | — | `Skeleton.Text` |
| Static | no animation | — | `animation="none"` |

## Токены и CSS

| Класс / токен | Назначение |
|---------------|------------|
| Base | `bg-primary-tint relative overflow-hidden` |
| Wave overlay | absolute inset, gradient slide |
| Shimmer gradient | `var(--color-primary-tint)` → `strong` |
| Circle default | `rounded-full h-control-base w-control-base` |
| Text line | `h-[1em] rounded-small` |
| Last line | `w-3/5` при `lastShort` |
| Block | `rounded-mid px-large py-mid` |

## Стилизация и кастомизация

### Уровни

1. **`className` на каждой части** — размеры, colors override.
2. **`classNames.root` / `wave` / `line`** — слоты per component.

Отдельного root `classNames` provider нет — prop на каждой части.

### Слоты

| Компонент | Слоты | Когда использовать |
|-----------|-------|-------------------|
| `Skeleton` | `root`, `wave` | Custom block color, wave tint |
| `Skeleton.Circle` | `root`, `wave` | Avatar placeholder ring |
| `Skeleton.Text` | `root`, `line`, `wave` | Per-line height/gap |
| `Skeleton.Block` | `root`, `wave` | Card chrome padding |
| `Skeleton.Region` | `root` | Layout wrapper (a11y parent) |

### Card loading layout

```tsx
<Skeleton.Block animation="wave" classNames={{ root: "rounded-large p-large" }}>
  <div className="flex gap-base">
    <Skeleton.Circle size="h-control-large w-control-large" />
    <div className="flex flex-1 flex-col gap-small">
      <Skeleton.Text lines={2} lastShort />
      <Skeleton className="h-32 w-full rounded-mid" />
      <div className="flex gap-small">
        <Skeleton className="h-control-base w-24 rounded-mid" />
        <Skeleton className="h-control-base w-24 rounded-mid" />
      </div>
    </div>
  </div>
</Skeleton.Block>
```

### Semantic colors

```tsx
<Skeleton
  animation="shimmer"
  className="h-4 w-full"
  classNames={{
    root: "bg-info/15",
    wave: "from-info/10 via-info/25 to-info/10",
  }}
/>

<Skeleton.Text
  animation="wave"
  lines={4}
  classNames={{
    line: "bg-success/15 h-3",
    wave: "bg-success/20",
  }}
/>
```

### Практические заметки

- Skeleton (Root / Circle / Text / Block) **декоративный** — `aria-hidden`, `role="presentation"`.
- Объявляйте loading через `Skeleton.Region` (`aria-busy` + `aria-live="polite"`) или свой контейнер с теми же атрибутами.
- `animation="none"` — static placeholder без motion (reduced motion friendly).
- Для списков — `Skeleton.Text` с wave + естественный stagger.
- Размеры задавайте Tailwind на `className` (`h-8`, `w-3/4`), не через size enum.
- **Не ожидайте hover effects** — компонент не интерактивный.

## Интеграции

| Компонент | Сценарий |
|-----------|----------|
| `Card` | Card layout skeleton |
| `Avatar` | `Skeleton.Circle` как avatar placeholder |
| `Table` | Row skeletons в `Table.Body` |

## Доступность

- Декоративные части: `aria-hidden={true}`, `role="presentation"`
- Wave overlay: `aria-hidden`
- **`Skeleton.Region`:** `aria-busy={busy}`, `aria-live="polite"` — родительский контейнер для announcement; задайте `aria-label` / `aria-labelledby`
- При `busy={false}` AT получает сигнал, что обновление региона завершено

## Структура файлов

```
Skeleton/
├── Skeleton.tsx
├── index.ts
├── skeletonTypes.ts
├── skeletonStyles.ts
├── skeletonParts.tsx
├── skeletonA11y.ts
├── useSkeletonRootState.ts
└── Skeleton.stories.tsx
```

## Storybook

`Core Components/Skeleton` — all variants, text lines, circles, card layout, list, block, `Skeleton.Region`, custom sizes, `CustomClassNames`.
