# Slider

Слайдер значения (single или range) с draggable thumb, fill по rail, опциональными marks. Simple API и compound (`Header` / `Track` / `Thumb`). Горизонтальная и вертикальная ориентация.

## Импорт

```tsx
import { Slider, sliderThicknessToCss, type SliderProps, type SliderSingleProps, type SliderRangeProps, type SliderOrientation, type SliderSize, type SliderClassNames, type SliderMotion, type SliderPartMotion } from "burne-ui";
```

## API

### Simple API

```tsx
<Slider
  label="Громкость"
  showValue
  defaultValue={55}
  min={0}
  max={100}
  step={5}
  marks={[0, 25, 50, 75, 100]}
/>
```

### Range

```tsx
<Slider
  range
  defaultValue={[20, 80]}
  label="Диапазон"
  showValue
/>
```

### Compound API

```tsx
<Slider defaultValue={40} min={0} max={100}>
  <Slider.Header>
    <Slider.Label>Яркость</Slider.Label>
    <Slider.Value />
  </Slider.Header>
  <Slider.Track icon={<IoSunny aria-hidden />} gloss />
  <Slider.Hint>Перетащите ползунок</Slider.Hint>
</Slider>
```

Низкоуровневый track:

```tsx
<Slider.Track min={0} max={100} value={v} onValueChange={setV}>
  <Slider.Rail />
  <Slider.Fill />
  <Slider.Thumb />
  <Slider.Icon>…</Slider.Icon>
</Slider.Track>
```

Range compound: `<Slider.Thumb thumb="start" />` + `<Slider.Thumb thumb="end" />`.

### Root props (ключевые)

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `orientation` | `horizontal` | `horizontal` \| `vertical` |
| `size` | `base` | thumb/size tokens |
| `thickness` | — | Высота/ширина rail (px/rem) |
| `min` / `max` / `step` | `0` / `100` / `1` | Диапазон |
| `marks` | — | Snap points |
| `range` | `false` | Два thumb |
| `value` / `defaultValue` | — | `number` или `[number, number]` |
| `formatValue` | — | Формат текста в `Slider.Value` |
| `gloss` | `false` | Gloss thumb shell |
| `icon` | — | Иконка в thumb |
| `disabled` | `false` | |
| `showValue` | simple | Показать value в header |
| `classNames` | — | см. стилизацию |
| `motion` | — | Карта слотов. Compound: `motion` на `Slider.Thumb` — part motion этого thumb |

### `SliderClassNames`

`root`, `label`, `header`, `value`, `hint`, `error`, `track`, `rail`, `fill`, `thumb`, `thumbShell`, `mark`.

`Slider.Track` принимает локальный pick: `track`, `rail`, `fill`, `thumb`, `thumbShell`, `mark`.

## Анимации

Публичный slot motion. Defaults на Root. Thumb press — `pressSqueeze` (`pressOut: false`). Fill `left` / `width` / `bottom` / `height` — kit-internal (`applySliderFillStyle`), не публичные MotionVars. Disabled opacity на `thumbShell` — внутренний GSAP.

### Slot motion

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `thumb` | `pressIn` / `pressOut` | `pressSqueeze` (`pressOut: false`); `disabled` → `false` |
| `track` / `rail` / `fill` / `icon` / `header` / `value` | hover/press | нет |

`false` на `thumb.pressIn` — squeeze не играет. Compound: `motion` на `Slider.Thumb` — part motion этого thumb (range start/end независимо).

**Где в коде:** типы — `sliderTypes.ts`; scope — `sliderContext.tsx`; defaults — `sliderAnimations.ts`; слоты — `sliderParts.tsx` / `sliderThumbParts.tsx` / `sliderTrackParts.tsx`; Provider — `Slider.tsx`. Drag позиции — `useSliderTrackState.ts`.

```tsx
<Slider
  label="Volume"
  showValue
  motion={{
    thumb: { pressIn: false },
  }}
/>
```

```ts
configureMotion({ pressSqueezeScale: [1, 0.98, 1], interactiveDuration: 280 });
```

## Стилизация и кастомизация

### Два уровня

1. **`className` на root** — `Field` wrapper.
2. **`classNames` на root** — все слоты; `Slider.Track` может переопределить track-слоты.

### Слоты `SliderClassNames`

| Слот | DOM | Назначение |
|------|-----|------------|
| `root` | Field root | Padding, border |
| `label` | `Slider.Label` | Label typography |
| `header` | `Slider.Header` | Row label + value |
| `value` | `Slider.Value` | Formatted value text |
| `hint` / `error` | Field hint/error | Secondary |
| `track` | Track hit area | Ring, gloss, orientation size |
| `rail` | Rail background | Track bg |
| `fill` | Selected range fill | Primary tint |
| `thumb` | Thumb button | Hit area |
| `thumbShell` | SelectionThumb | Gloss/border |
| `mark` | Tick marks | Position dots |

### Simple API

```tsx
<Slider
  label="Громкость"
  showValue
  defaultValue={55}
  classNames={{
    root: "rounded-mid border border-primary/25 p-base",
    label: "text-primary",
    value: "font-semibold text-primary",
    track: "ring-1 ring-primary/20",
    rail: "bg-primary/10",
    fill: "bg-primary/80",
  }}
/>
```

### Compound API

```tsx
<Slider
  defaultValue={55}
  min={0}
  max={100}
  classNames={{
    root: "rounded-mid border border-primary/25 p-base",
    header: "text-primary",
    value: "font-semibold text-primary",
    track: "ring-1 ring-primary/20",
    rail: "bg-primary/10",
    fill: "bg-primary/80",
    hint: "text-muted/80",
  }}
>
  <Slider.Header>
    <Slider.Label>Громкость</Slider.Label>
    <Slider.Value />
  </Slider.Header>
  <Slider.Track />
  <Slider.Hint>Все слоты через classNames.</Slider.Hint>
</Slider>
```

`thumbClassName` на root/track props — доп. классы на thumb button (вне `classNames.thumb` merge chain на track).

### Практические заметки

- **Fill/thumb position** — inline styles от логики; не задавайте фиксированный `width` на fill.
- **Vertical:** `orientation="vertical"` — fill по `height`/`bottom`.
- **Range:** два thumb; fill между start/end values.
- **Порядок мержа:** root `classNames` → `Track.classNames` → part `className`.

## Доступность

- Thumb: `role="slider"`, `aria-valuemin/max/now`, `aria-valuetext`
- `aria-labelledby` от `Slider.Label` / `aria-label`
- Keyboard: ←/→ и ↑/↓ (симметрия осей по APG), Home/End, PageUp/Down (step×10; при marks — соседняя метка)
- Marks: visual only; value snap при drag

## Утилиты

```tsx
sliderThicknessToCss(thickness)  // number | string → CSS
```

## Структура файлов

```
Slider/
├── Slider.tsx                  # Root: карта + defaults
├── index.ts
├── sliderTypes.ts
├── sliderStyles.ts
├── sliderAnimations.ts         # defaults, fill apply, thumbShell opacity
├── sliderContext.tsx           # createMotionScope
├── sliderParts.tsx             # Header/Value/Track slots
├── sliderThumbParts.tsx        # thumb pressPhases
├── sliderTrackParts.tsx        # rail/fill/icon
├── useSliderRootState.ts
├── useSliderTrackState.ts      # drag, fill geometry
├── sliderAPI.ts
├── sliderA11y.ts
└── Slider.stories.tsx
```

## Storybook

`Core Components/Slider` — single/range, vertical, marks, gloss, compound, `classNames`, slot motion gallery.
