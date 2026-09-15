# ColorPicker

Выбор цвета в popover: 2D saturation/value area, hue/alpha sliders, hex input, presets. Compound API на базе `Popover`. Экспортируются standalone `ColorSlider`, `ColorSwatch` и color utils.

## Импорт

```tsx
import { ColorPicker, ColorSlider, ColorSwatch, useColorPicker, hsvaToHex, hexToHsva, hsvaToRgba, rgbaToHsva, type ColorPickerProps, type ColorPickerTriggerProps, type ColorPickerContentProps, type ColorPickerSize, type ColorPickerVariant, type ColorPickerClassNames, type ColorSliderTrackProps, type ColorSwatchProps, type ColorSwatchMotion, type ColorSwatchPartMotion, type HSVA, type RGBA } from "burne-ui";
```

## API

### Compound API

```tsx
<ColorPicker defaultValue="#3b82f6" onValueChange={setColor}>
  <ColorPicker.Trigger />
  <ColorPicker.Content showAlpha presets={["#ef4444", "#22c55e", "#3b82f6"]} />
</ColorPicker>
```

### Controlled

```tsx
<ColorPicker value={color} onValueChange={setColor} open={open} onOpenChange={setOpen}>
  <ColorPicker.Trigger swatchSize="large" />
  <ColorPicker.Content showAlpha />
</ColorPicker>
```

### Root props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `value` / `defaultValue` | `#3b82f6` | Hex string |
| `onValueChange` | — | `(hex: string) => void` |
| `open` / `defaultOpen` / `onOpenChange` | — | Popover state |
| `size` | `base` | `small` \| `base` \| `mid` \| `large` |
| `variant` | `default` | `default` \| `gloss` (→ `Popover`) |
| `side` | `bottom` | Popover side |
| `disabled` | `false` | Блокирует trigger |
| `classNames` | — | Слоты |
| `motion` | — | Карта слотов `contentPanel` / `area` / `hexInput` / … + `events`. Нет слота `root` |
| `motionController` | — | Handle с `createMotionController()` / `useMotionControllerHandle()`, не на DOM. Слоты живы, пока `Content` открыт |

### `ColorPicker.Trigger` props

| Prop | Описание |
|------|----------|
| `swatchSize` | `ColorSwatchSize` для preview |
| `className` | На trigger button |

### `ColorPicker.Content` props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `showAlpha` | `false` | Alpha slider + input |
| `presets` | — | Массив hex для quick pick |
| `className` | — | На content wrapper |

Compound внутри Content: `ColorPicker.Area`, `ColorPicker.Preview` (слот `previewSwatch`), `HexInput`, `AlphaInput`, `Presets`.

### `ColorPickerClassNames`

`content`, `contentPanel`, `trigger`, `area`, `areaThumb`, `slidersRow`, `previewSwatch`, `hueSlider`, `alphaSlider`, `inputsRow`, `hexInput`, `hexPrefix`, `hexInputField`, `alphaInput`, `alphaInputField`, `alphaSuffix`, `presets`, `presetSwatch`.

### Standalone `ColorSlider`

```tsx
<ColorSlider channel="hue" value={hue} onValueChange={setHue} size="base">
  <ColorSlider.Track />
</ColorSlider>
```

Channels: `hue`, `saturation`, `value`, `alpha`, `red`, `green`, `blue`.

### Standalone `ColorSwatch`

```tsx
<ColorSwatch color="#3b82f6" size="base" shape="circle" onClick={handlePick} />
```

## variant и размеры

| `ColorPicker` size | Panel width | Area height |
|--------------------|-------------|-------------|
| `small` | `w-52` | `h-32` |
| `base` | `w-64` | `h-40` |
| `mid` | `w-72` | `h-48` |
| `large` | `w-80` | `h-56` |

| `ColorPicker` variant | Поведение |
|-----------------------|-----------|
| `default` | Standard popover panel |
| `gloss` | Gloss popover surface |

`status` нет.

**ColorSwatch sizes:** `xsmall` … `xlarge`. **Shapes:** `square`, `rounded`, `circle`.

## Анимации

### Slot motion

**ColorPicker** — portal-host: Root передаёт карту `motion`, хост — `Content` / слот `contentPanel`.

| Слот | Фазы | Дефолт |
|------|------|--------|
| `contentPanel` | `enter` (opt-in) | empty |
| `area` | `change` при hex; hover/press если заданы. Mount `enter` выключен (drag surface) | empty |
| `areaThumb` | hover/press если заданы. Mount `enter` выключен (drag geometry) | empty |
| `hexInput`, `alphaInput`, `presets`, `previewSwatch` | `enter` / hover / press | empty |
| `hueSlider` / `alphaSlider` | прокидываются в ColorSlider | empty |
| `trigger` | прокидывается в `Popover.Trigger` | `pressSqueeze` на Popover |

Thumb `left` / `top` на area — kit-internal (`useColorPickerAreaDrag`), не публичный layout-tween. `previewSwatch` — `ColorPicker.Preview`. Drag на `Area` / `areaThumb` **мержится** с slot pointer phases через `useMotionPart` (`onPointerDown` пользователя → motion press → drag, если не `defaultPrevented`). ColorSwatch в presets сохраняет свой scope.

`play()` ищет слот `root` — у ColorPicker его нет, только `playSlot("contentPanel")` / `playSlot("area")` / `playAll`. Слоты регистрируются, когда панель открыта (`open` / `defaultOpen`). `hueSlider` / `alphaSlider` / ColorSwatch — вложенные scope, не этот handle.

Проп `motionController` + ключ `events` на `motion` — app-команды (`picker:nudge`, `picker:pulse`), не фазы. `createMotionEvents`. События тоже через `playSlot("contentPanel", event)`. `waitForComplete` / `cancel` — playground / Storybook **MotionController**.

```tsx
import { Button, ColorPicker, createMotionEvents, useMotionControllerHandle } from "burne-ui";

const events = createMotionEvents({
  "picker:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1 },
});

function Nudge() {
  const controller = useMotionControllerHandle();
  return (
    <>
      <Button size="small" variant="outline" onClick={() => controller.playSlot("contentPanel", "picker:nudge")}>
        Nudge
      </Button>
      <ColorPicker open defaultValue="#3b82f6" motionController={controller} motion={{ events }}>
        <ColorPicker.Trigger />
        <ColorPicker.Content />
      </ColorPicker>
    </>
  );
}
```

**ColorSlider** — свой scope; Track — nested host.

| Слот | Фазы | Дефолт |
|------|------|--------|
| `root` | `enter` | empty |
| `track` | `enter`; `change` при value | empty |

Simple API: `motionController` форвардится на Track (слота `root` на этом handle нет — `play()` skip, `playSlot("track", …)`). Compound (есть `children`): handle на Root (`root`); Track — свой `motionController`. Карта `events` с корня мержится в Track. Thumb geometry — kit-internal.

```tsx
import { Button, ColorSlider, createMotionEvents, useMotionControllerHandle } from "burne-ui";

const events = createMotionEvents({
  "slider:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1 },
});

function Nudge() {
  const controller = useMotionControllerHandle();
  return (
    <>
      <Button size="small" variant="outline" onClick={() => controller.playSlot("track", "slider:nudge")}>
        Nudge
      </Button>
      <ColorSlider channel="hue" defaultValue={180} motionController={controller} motion={{ events }} />
    </>
  );
}
```

**ColorSwatch** — scope только у interactive (`onClick`). Декоративный `<span>` без Provider. Есть слот `root`: `play()` ок.

```tsx
import { Button, ColorSwatch, createMotionEvents, useMotionControllerHandle } from "burne-ui";

const events = createMotionEvents({
  "swatch:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1 },
});

function Nudge() {
  const controller = useMotionControllerHandle();
  return (
    <>
      <Button size="small" variant="outline" onClick={() => controller.play("swatch:nudge")}>
        Nudge
      </Button>
      <ColorSwatch color="#3b82f6" aria-label="Accent" onClick={() => undefined} motionController={controller} motion={{ events }} />
    </>
  );
}
```

Thumb ColorSlider = `SliderThumbButton`, не дублирует публичный слот Slider thumb.


Motion разбит: pointer drag (без GSAP) + Popover portal + optional swatch GSAP.

**DOM:**

```
<Popover>
  <Trigger>
    <ColorSwatch />                    ← optional GSAP hover (interactive)
  <Content>
    <div class=area>                   ← pointer drag 2D (sat × val)
      <div class=areaThumb />
    <ColorPicker.Preview />            ← слот `previewSwatch`
    <ColorSlider channel=hue />
    <ColorSlider channel=alpha />      ← if showAlpha
    <input hex /> <input alpha />
    <presets row of ColorSwatch />
```

### 1. Popover open/close

`ColorPicker` обёрнут в `Popover` — portal `motionTooltip()`, слот `trigger` прокидывается в `Popover.Trigger`. См. `Popover.md`.

### 2. 2D area drag (`useColorPickerAreaDrag`)

`colorPickerAnimations.ts` — **без GSAP**:

- `pointerdown` / `pointermove` на saturation×value canvas
- Обновляет HSVA → `onValueChange` hex (HSVA — source of truth; hex round-trip не сбрасывает hue 360→0)
- Thumb position — CSS left/top %

### 3. ColorSlider drag

Pointer + keyboard на `SliderThumbButton` (shared Slider patterns).

### 4. Interactive ColorSwatch

Декоративный `<span>` (нет `onClick` и нет accessible name) — без motion scope.

Интерактивная кнопка (`onClick` или `aria-label`): свой scope, слот `root`. Defaults: `hoverLiftFirstLevel` (с hover-тенью) + `pressSqueeze` (`pressOut: false`).

```tsx
<ColorSwatch
  color="#3b82f6"
  onClick={() => {}}
  motion={{ root: { hoverIn: false, hoverOut: false } }}
/>
```

**Где в коде:** `colorSwatchTypes.ts`, `colorSwatchContext.tsx`, `colorSwatchAnimations.ts`, `ColorSwatch.tsx`.

### Чего нет

- GSAP на area thumb / hue slider position
- Ripple встроенный
- `status` semantic surfaces

### Сводка: что настраивается где

| Анимация | Утилита | Ключи `configureMotion` | Локальный prop |
|----------|---------|---------------------------|----------------|
| Popover portal | `Popover` | `tooltipDuration` | `variant` |
| 2D area drag | `useColorPickerAreaDrag` | — | pointer events |
| Slider thumb | ColorSlider | — | `channel` |
| Swatch hover/press | slot motion `root` | `enableHoverLift` / `enablePressSqueeze` | `motion` |

## Токены и CSS

| Класс / токен | Назначение |
|---------------|------------|
| Panel | size radius (`panelSizeLayout`) + pad; Popover shell keeps radius even with `unstyled` |
| Area | `rounded-small bg-secondary` |
| Inputs | `font-mono`, `border-token` |
| Presets row | `gap-xsmall` flex |
| ColorSlider track | `SELECTION_INDICATOR_RADIUS_CLASS` + `overflow-hidden` (как Slider rail) |
| `sliderTrackHitAreaClass` | Shared с `Slider` |

## Стилизация и кастомизация

### Два уровня

1. **`classNames` на `ColorPicker` root** — все слоты панели и trigger.
2. **`className` на `Trigger` / `Content`** — доп. классы подчастей.

`ColorSwatch` / `ColorSlider` — собственный `className` (standalone).

### Слоты (ключевые)

| Слот | DOM | Когда использовать |
|------|-----|-------------------|
| `trigger` | Popover trigger | Ring, size override |
| `contentPanel` | Inner panel | Border, padding |
| `area` | 2D picker | Custom gradient frame |
| `areaThumb` | Thumb handle | Size, border ring |
| `hueSlider` / `alphaSlider` | Slider rows | Track height/color |
| `hexInputField` | Hex input | Monospace, width |
| `presets` / `presetSwatch` | Preset row | Gap, swatch size |

### С alpha и presets

```tsx
<ColorPicker
  value={color}
  onValueChange={setColor}
  size="mid"
  classNames={{
    contentPanel: "border border-primary/20",
    area: "ring-1 ring-primary/15",
    hexInputField: "text-primary font-mono",
    presetSwatch: "ring-1 ring-background",
  }}
>
  <ColorPicker.Trigger swatchSize="large" />
  <ColorPicker.Content
    showAlpha
    presets={["#ef4444", "#22c55e", "#3b82f6", "#a855f7"]}
  />
</ColorPicker>
```

### Практические заметки

- `useColorPicker()` — доступ к HSVA/hex из compound children.
- Utils: `hsvaToHex`, `hexToHsva`, `rgbaToHsva` и др. для кастом UI.
- `disabled` блокирует только trigger; для read-only не открывайте popover.
- Presets — массив hex strings; клик сразу меняет value.
- **Popover positioning** — не override `left`/`top` на content.

## Интеграции

| Компонент | Сценарий |
|-----------|----------|
| `Popover` | Portal + слот `trigger` |
| `Slider` | `ColorSlider` track/thumb |
| `Input` | Hex field styling patterns |

## Доступность

- Trigger: `aria-label="Выбранный цвет: {hex}"`
- Content: `aria-label="Color selection"`
- 2D area: focusable thumb (`role="slider"`, `aria-valuetext` для saturation×brightness), стрелки по осям (Shift/Page — крупный шаг)
- Hex input: `aria-label="Hex code of the color"`
- Alpha input: `aria-label="Transparency (%)"`
- ColorSlider thumb: `role="slider"` + channel labels
- ColorSwatch: `aria-label` при interactive; иначе `aria-hidden`
- Focus: `focus-ring` / `focus-visible`

## Структура файлов

```
ColorPicker/
├── ColorPicker.tsx
├── index.ts
├── colorPickerTypes.ts
├── colorPickerStyles.ts
├── colorPickerAnimations.ts
├── colorPickerParts.tsx
├── colorPickerContext.tsx
├── colorPickerAPI.ts
├── colorPickerA11y.ts
├── useColorPickerRootState.ts
├── colorUtils.ts
├── ColorSlider.tsx
├── colorSliderTypes.ts
├── colorSliderStyles.ts
├── ColorSwatch.tsx
├── colorSwatchTypes.ts / colorSwatchContext.tsx / colorSwatchAnimations.ts
└── ColorPicker.stories.tsx
```

## Storybook

`Core Components/ColorPicker` — basic, alpha, presets, sizes, uncontrolled, ColorSlider channels, ColorSwatch shapes, `CustomClassNames`.
