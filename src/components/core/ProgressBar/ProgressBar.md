# ProgressBar

Индикатор прогресса (`role="progressbar"`): determinate value или **indeterminate** loading. Simple API и compound. Близок к Meter по layout, но семантика и анимации другие.

## Импорт

```tsx
import { ProgressBar, useProgressBarFieldContext, type ProgressBarProps, type ProgressBarTrackProps, type ProgressBarSize, type ProgressBarOrientation, type ProgressBarClassNames } from "burne-ui";
```

## API

### Simple API

```tsx
<ProgressBar
  label="Загрузка"
  showValue
  value={62}
  color="var(--color-info)"
  hint="Зависит от скорости сети"
/>
```

### Indeterminate

```tsx
<ProgressBar label="Синхронизация" indeterminate />
```

### Compound API

```tsx
<ProgressBar value={40} showValue>
  <ProgressBar.Header>
    <ProgressBar.Label>Загрузка файла</ProgressBar.Label>
    <ProgressBar.Value />
  </ProgressBar.Header>
  <ProgressBar.Track value={40} />
  <ProgressBar.Hint>62% завершено</ProgressBar.Hint>
</ProgressBar>
```

### Root props (ключевые)

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `value` | `0` | Прогресс (determinate) |
| `indeterminate` | `false` | Бегущая заливка |
| `min` / `max` | `0` / `100` | Диапазон |
| `orientation` | `horizontal` | `horizontal` \| `vertical` |
| `size` | `base` | Толщина track |
| `thickness` | — | Кастом px/rem |
| `color` | — | CSS color fill |
| `formatValue` | — | Текст value / `aria-valuetext` |
| `showValue` | simple | Header value |
| `classNames` | — | см. стилизацию |

### `ProgressBarClassNames`

`root`, `label`, `header`, `value`, `track`, `fill`, `indeterminateFill`, `hint`, `error`.

### Compound-подчасти

| Часть | Роль |
|-------|------|
| `ProgressBar.Header` | Label + value row |
| `ProgressBar.Label` / `Value` | Заголовок / процент |
| `ProgressBar.Track` | `role="progressbar"` |
| `ProgressBar.Hint` / `Error` | Подсказка / ошибка |

## Meter vs ProgressBar

| | Meter | ProgressBar |
|---|-------|-------------|
| role | `meter` | `progressbar` |
| Семантика | Текущий уровень | Прогресс к цели |
| Indeterminate | нет | да |
| Fill motion | `motionInteractive` | `motionProgressFill` |

## Анимации

`progressBarAnimations.ts` → `useProgressBarFillAnimation`.

**DOM (determinate):**

```
<div role=progressbar track>
  <span fill ref=fillRef>    ← 100% box + GSAP scaleX/scaleY
</div>
```

**DOM (indeterminate):**

```
<div role=progressbar aria-busy track>
  <span indeterminateFill ref=fillRef>   ← translate loop
</div>
```

### 1. Determinate fill

При изменении `value`:

- fill на весь track (`width/height: 100%`); прогресс = `scaleX` (horizontal, origin left) / `scaleY` (vertical, origin bottom)
- **First layout / reduced / `enableProgressFill: false`:** instant `gsap.set`
- Иначе: `gsap.to(fill, { scaleX|scaleY, ...motionProgressFill() })`

`motionProgressFill()` — `progressFillDuration`, `progressFillEase`.

### 2. Indeterminate slide

`indeterminate={true}`:

```ts
gsap.fromTo(fill,
  { x: -fillSize },      // horizontal
  { x: trackSize, duration: 1.5, ease: "expo.inOut", repeat: -1 }
);
```

Константы вынесены в `configureMotion`: `progressIndeterminateDuration` (1500), `progressIndeterminateEase` (`expo.inOut`).

ResizeObserver на track/fill — перезапуск при resize.

Reduced motion / `enableProgressFill: false` / `enableAnimations: false`: без translate loop.

### Кастомизация

```ts
configureMotion({
  progressFillDuration: 400,
  progressFillEase: "power2.out",
  progressIndeterminateDuration: 1500,
  progressIndeterminateEase: "expo.inOut",
  enableProgressFill: true,
});
```

### Сводка

| Режим | Анимация | Настройка |
|-------|----------|-----------|
| Determinate | GSAP `scaleX`/`scaleY` | `progressFillDuration`, `enableProgressFill` |
| Indeterminate | GSAP translate loop | `progressIndeterminateDuration`, `progressIndeterminateEase`, `enableProgressFill` |
| Value text | React re-render | `formatValue` |

## Стилизация и кастомизация

### Два уровня

1. **`className` на root** — `Field`.
2. **`classNames` на root** — все слоты.

### Слоты `ProgressBarClassNames`

| Слот | DOM | Назначение |
|------|-----|------------|
| `root` | `Field` | Padding, border |
| `label` | Label | Typography |
| `header` | Header row | Layout |
| `value` | Value text | Процент / status |
| `track` | progressbar rail | Background |
| `fill` | Determinate fill | Color, opacity |
| `indeterminateFill` | Indeterminate bar | Width fraction, color |
| `hint` / `error` | Secondary | Muted/error |

### Simple API

```tsx
<ProgressBar
  label="Загрузка"
  showValue
  value={62}
  color="var(--color-info)"
  classNames={{
    root: "rounded-mid border border-primary/20 p-base",
    value: "text-info font-semibold",
    track: "bg-primary/10",
    fill: "opacity-95",
    hint: "text-muted/80",
  }}
  hint="Оставшееся время зависит от сети"
/>
```

### Indeterminate styling

```tsx
<ProgressBar
  indeterminate
  label="Обработка"
  classNames={{
    track: "bg-muted/20",
    indeterminateFill: "bg-primary w-1/3",
  }}
/>
```

### Compound API

```tsx
<ProgressBar value={75} classNames={{ fill: "bg-success" }}>
  <ProgressBar.Header>
    <ProgressBar.Label>Экспорт</ProgressBar.Label>
    <ProgressBar.Value />
  </ProgressBar.Header>
  <ProgressBar.Track />
</ProgressBar>
```

### Практические заметки

- **`indeterminateFill` vs `fill`:** разные DOM-элементы — стилизуйте нужный слот.
- **`color` prop** — inline tint; classNames дополняют.
- **Не фиксируйте `transform` / scale на fill в determinate** — управляется анимацией (`scaleX`/`scaleY`).
- **Порядок мержа:** базовые → `classNames` → `className`.

## Доступность

- `role="progressbar"`
- Determinate: `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext`
- Indeterminate: `aria-busy={true}`, без `valuenow`
- Label / describedby как у Meter

## Контекст

`useProgressBarFieldContext()` — `display` с `indeterminate` flag.

## Структура файлов

```
ProgressBar/
├── ProgressBar.tsx
├── index.ts
├── progressBarTypes.ts
├── progressBarStyles.ts
├── progressBarAnimations.ts    # determinate + indeterminate
├── progressBarParts.tsx
├── useProgressBarRootState.ts
├── useProgressBarTrackState.ts
├── progressBarAPI.ts
├── progressBarA11y.ts
└── ProgressBar.stories.tsx
```

## Storybook

`Core Components/ProgressBar` — determinate, indeterminate, vertical, color, `classNames`.
