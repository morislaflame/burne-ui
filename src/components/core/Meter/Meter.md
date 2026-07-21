# Meter

Индикатор текущего значения в диапазоне (`role="meter"`). Не путать с ProgressBar: meter показывает **уровень** (память, заряд), а не прогресс задачи. Simple API и compound (`Header` / `Track` / `Hint`).

## Импорт

```tsx
import { Meter, useMeterFieldContext, type MeterRootProps, type MeterTrackProps, type MeterSize, type MeterOrientation, type MeterClassNames } from "burne-ui";
```

## API

### Simple API

```tsx
<Meter
  label="Хранилище"
  showValue
  value={72}
  min={0}
  max={100}
  color="var(--color-info)"
  hint="Read-only шкала"
/>
```

### Compound API

```tsx
<Meter value={45} min={0} max={100} orientation="vertical">
  <Meter.Header>
    <Meter.Label>CPU</Meter.Label>
    <Meter.Value />
  </Meter.Header>
  <Meter.Track value={45} color="var(--color-warning)" />
  <Meter.Hint>Текущая нагрузка</Meter.Hint>
</Meter>
```

### Root props (ключевые)

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `value` | — | Текущее значение (обязательно для track) |
| `min` / `max` | `0` / `100` | Диапазон |
| `orientation` | `horizontal` | `horizontal` \| `vertical` |
| `size` | `base` | `small` \| `base` \| `mid` \| `large` — толщина track |
| `thickness` | — | Кастомная толщина (px/rem) |
| `color` | — | CSS color fill |
| `formatValue` | — | Текст для `Meter.Value` / `aria-valuetext` |
| `showValue` | simple | Показать formatted value в header |
| `label` / `hint` / `error` | — | Simple API |
| `classNames` | — | см. стилизацию |

### `MeterClassNames`

`root`, `label`, `header`, `value`, `track`, `fill`, `hint`, `error`.

### Compound-подчасти

| Часть | Роль |
|-------|------|
| `Meter.Header` | Row label + value |
| `Meter.Label` | Заголовок |
| `Meter.Value` | Formatted value (`display.statusText`) |
| `Meter.Track` | `role="meter"` + fill |
| `Meter.Hint` / `Meter.Error` | Подсказка / ошибка |

## Поведение

- Значение clamp в `[min, max]`
- Fill width/height = percent от диапазона
- **Read-only** — нет user interaction на track
- `Meter.Value` читает `display` из field context (auto sync при value change)

## Анимации

`meterAnimations.ts` → `useMeterFillAnimation`.

**DOM:**

```
Field
  Meter.Header (optional)
  <div role=meter track style=thickness>
    <span fill ref=fillRef style=initial %>   ← GSAP width/height
  </div>
```

### Fill resize (value change)

При изменении `value`:

1. `fillTargetStyle` — target `width` (horizontal) или `height` (vertical)
2. **First layout / reduced motion:** instant inline style
3. Иначе: `gsap.to(fill, { width|height: target, ...motionInteractive() })`

Нет indeterminate mode. Нет thumb/drag.

### Кастомизация

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  interactiveDuration: 320,
  interactiveEase: "power2.out",
});
```

### Сводка

| Анимация | GSAP | `configureMotion` |
|----------|------|-------------------|
| Fill resize | Да | `interactiveDuration`, `interactiveEase` |
| Track | CSS | — |

## Стилизация и кастомизация

### Два уровня

1. **`className` на root** — `Field` wrapper.
2. **`classNames` на root** — `MeterClassNamesProvider`.

Подчасти принимают **`className`** поверх слота.

### Слоты `MeterClassNames`

| Слот | DOM | Назначение |
|------|-----|------------|
| `root` | `Field` | Padding, border, orientation layout |
| `label` | `Meter.Label` | Типографика |
| `header` | `Meter.Header` | Row layout label + value |
| `value` | `Meter.Value` | Цвет/weight значения |
| `track` | `role="meter"` | Rail, ring, thickness |
| `fill` | Fill span | Tint, opacity (`color` prop) |
| `hint` / `error` | Field hint/error | Secondary text |

### Simple API

```tsx
<Meter
  label="Хранилище"
  showValue
  value={72}
  color="var(--color-info)"
  classNames={{
    root: "rounded-mid border border-primary/20 p-base",
    header: "text-primary",
    value: "text-info font-semibold",
    track: "ring-1 ring-primary/15",
    fill: "opacity-90",
    hint: "text-muted/80",
  }}
  hint="Read-only шкала"
/>
```

### Compound API

```tsx
<Meter
  value={85}
  classNames={{
    root: "max-w-md",
    track: "bg-surface-elevated",
    fill: "bg-success/80",
  }}
>
  <Meter.Header>
    <Meter.Label className="font-semibold">Память</Meter.Label>
    <Meter.Value className="text-success" />
  </Meter.Header>
  <Meter.Track />
</Meter>
```

### Практические заметки

- **`color` prop** — inline на fill; `classNames.fill` для opacity/gradient.
- **Vertical:** `orientation="vertical"` — fill по `height`.
- **Не задавайте фиксированный width на fill** — анимируется GSAP/inline.
- **Порядок мержа:** базовые → `classNames.slot` → `className` подчасти.

## Доступность

- `role="meter"` на track
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext`
- `aria-labelledby` от label; `aria-describedby` hint/error
- Fill: `aria-hidden`

## Контекст

`useMeterFieldContext()` — `display`, `orientation`, ids для a11y.

## Структура файлов

```
Meter/
├── Meter.tsx
├── index.ts
├── meterTypes.ts
├── meterStyles.ts
├── meterAnimations.ts       # useMeterFillAnimation
├── meterParts.tsx
├── useMeterRootState.ts
├── useMeterTrackState.ts
├── meterAPI.ts
├── meterA11y.ts
└── Meter.stories.tsx
```

## Storybook

`Core Components/Meter` — horizontal/vertical, sizes, color, compound, `classNames`.
