# Loading

Индикатор загрузки: CSS-спиннер или три прыгающие точки на GSAP. Используется в кнопках (async), Toast, inline-состояниях.

## Импорт

```tsx
import { Loading, type LoadingProps, type LoadingVariant, type LoadingSize, type LoadingColor } from "burne-ui";
```

## API

Simple API — один `<span role="status">`.

### Props

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `variant` | `spinner` \| `dots` | `spinner` | Тип индикатора |
| `size` | `small` \| `base` \| `mid` \| `large` | `base` | Размер |
| `color` | см. ниже | `primary` | Семантический цвет |
| `label` | `string` | `"Loading"` | `aria-label` для screen reader |
| `className` | `string` | — | На root |

### `LoadingColor`

`primary` | `foreground` | `muted` | `secondary` | `danger` | `success` | `info` | `warning`

### Примеры

```tsx
<Loading />

<Loading type="dots" size="mid" color="success" label="Сохранение…" />

// В Toast при loading
<Toast status="default" loading title="Загрузка" />
```

## variant

| variant | Реализация | Motion |
|---------|------------|--------|
| `spinner` | CSS `animate-spin` | keyframes Tailwind |
| `dots` | 3 × `<span data-loading-dot>` | GSAP wave |

## Размеры

### Spinner

Из `CONTROL_SIZE_LAYOUT`: `spinnerIcon` + `spinnerBorder` (`border-2`).

### Dots

`LOADING_DOTS_LAYOUT` — размер точки, gap, амплитуда прыжка:

| size | jumpPx | scalePeak | dot size |
|------|--------|-----------|----------|
| `small` | 5 | 1.25 | `icon-xsmall * 0.45` |
| `base` | 7 | 1.3 | `icon-xsmall * 0.6` |
| `mid` | 9 | 1.35 | `icon-xsmall * 0.75` |
| `large` | 12 | 1.4 | `icon-small * 0.75` |

Высота track: `dotSize + jumpPx` (inline style).

## Анимации

### 1. Spinner (`type="spinner"`)

**DOM:**

```
<span role="status">
  <span class="animate-spin border-current border-t-transparent" />
```

- CSS `@keyframes spin` через класс `animate-spin`
- `motion-reduce:animate-none` — остановка при reduced motion
- **Не GSAP**, не `configureMotion`

Цвет: `text-{color}` на ring (`border-current`).

### 2. Dots wave (`type="dots"`)

**DOM:**

```
<span role="status">
  <span ref=trackRef>           ← flex items-end, fixed height
    <span data-loading-dot /> × 3
```

`useLoadingDotsAnimation(trackRef, size)` в `loadingAnimations.ts`.

**Цикл на каждой точке** (`runLoadingDotsWave`):

1. Keyframes GSAP:
   - **up:** `y: 0 → -jumpPx`, `scale: 1 → scalePeak`, `halfCycleSec`, `easeUp`
   - **down:** `y → 0`, `scale → 1`, `halfCycleSec`, `easeDown`
2. `repeat: -1` (бесконечно)
3. `delay: staggerSec * index` — волна 1 → 2 → 3
4. `transformOrigin: "50% 100%"` (от низа точки)

Параметры из `motionLoadingDots()`:

| Параметр | Default | Описание |
|----------|---------|----------|
| `loadingDotsDuration` | 900 ms | полный цикл up+down одной точки |
| `staggerSec` | duration / 3 | задержка между точками |
| `halfCycleSec` | duration / 2 | длительность up или down |
| `loadingDotsEaseUp` | `power2.out` | подъём |
| `loadingDotsEaseDown` | `power2.in` | спуск |
| `enableLoadingDots` | `true` | выключатель GSAP |

**Reduced motion:** точки статичны (`y: 0`, `scale: 1`), tweens не создаются.

**Реакция на config:** `useSyncExternalStore(subscribeMotionConfig)` — при `configureMotion()` tweens пересоздаются.

#### Кастомизация dots

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  loadingDotsDuration: 1200,     // медленнее волна (stagger = 400ms)
  loadingDotsEaseUp: "power2.out",
  loadingDotsEaseDown: "power2.in",
  enableLoadingDots: true,       // false → статичные точки
});
```

**Не в config:** `jumpPx`, `scalePeak` per size — константы в `LOADING_DOTS_LAYOUT` (`loadingStyles.ts`).

### 3. Где используется Loading

| Место | variant | color |
|-------|---------|-------|
| `Button` async loader | spinner | по variant кнопки |
| `Toast` `loading` | spinner | по `toastLoadingColor(status)` |
| Standalone | оба | prop `color` |

### Сводка: что настраивается где

| Анимация | variant | `configureMotion` | Hardcode |
|----------|---------|-------------------|----------|
| Spin | `spinner` | — | CSS `animate-spin` |
| Dots wave | `dots` | `loadingDotsDuration`, eases, `enableLoadingDots` | `jumpPx`, `scalePeak` per size |
| Reduced motion | оба | — | `motion-reduce` / prefers-reduced |

## Токены и CSS

| Элемент | Классы / токены |
|---------|-----------------|
| Spinner | `rounded-full border-current border-t-transparent` |
| Dots | `bg-primary` / semantic, `rounded-full` |
| Spacing dots | `gap-xsmall`, `var(--icon-size-xsmall)` |
| Root | `inline-flex shrink-0 items-center justify-center` |

## Стилизация и кастомизация

### `LoadingClassNames`

`root`, `spinner`, `dots`, `dot`.

`className` мержится в `root`.

### Что можно настроить

| Способ | Что меняет |
|--------|------------|
| `variant` | `spinner` (кольцо) или `dots` (три точки) |
| `size` | Размер spinner / dots layout |
| `color` | Semantic tint (`primary`, `info`, `danger`, …) |
| `className` | Opacity, margin, display на root |
| `label` | Только a11y (`aria-label`), не визуальный текст |

```tsx
<Loading
  type="dots"
  size="large"
  color="info"
  className="opacity-90 mx-auto"
  label="Идёт синхронизация"
/>
```

### Spinner vs dots

- **Spinner:** ring рисуется CSS; `className` влияет на весь блок, не на отдельное кольцо.
- **Dots:** layout из `LOADING_DOTS_LAYOUT`; jump-анимация через GSAP — `configureMotion({ interactiveDuration })`.

### Встраивание

```tsx
<Button disabled className="gap-small">
  <Loading type="spinner" size="small" color="foreground" className="shrink-0" />
  Сохранение…
</Button>
```

Для кастомного ring/dots цвета предпочтительнее prop `color`, не raw Tailwind на дочерних элементах (они `aria-hidden`).

## Доступность

- Root: `role="status"`, `aria-live="polite"`, `aria-label={label}`
- Визуальные части: `aria-hidden`
- Задавайте осмысленный `label`: «Сохранение…», «Загрузка списка»

## Структура файлов

```
Loading/
├── Loading.tsx
├── index.ts
├── loadingTypes.ts
├── loadingStyles.ts          # LOADING_DOTS_LAYOUT
├── loadingParts.tsx          # Spinner, Dots
├── loadingAnimations.ts      # useLoadingDotsAnimation
└── Loading.stories.tsx
```

## Storybook

`Core Components/Loading` — spinner/dots, размеры, матрица цветов, `configureMotion` для dots.
