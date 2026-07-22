# Switch

Переключатель on/off с анимированным thumb по track. Simple API (`label` + props control) и compound (`Control` / `Track` / `Thumb` / `Content`). Поддержка `gloss`, кастомного `color`, иконок on/off.

## Импорт

```tsx
import { Switch, SWITCH_LAYOUT, type SwitchProps, type SwitchSimpleProps, type SwitchSize, type SwitchLabelPosition, type SwitchClassNames } from "burne-ui";
```

## API

### Simple API

```tsx
<Switch
  label="Тёмная тема"
  hint="Сохраняется в профиле"
  defaultChecked
  gloss
  iconOff={<IoMoon aria-hidden />}
  iconOn={<IoSunny aria-hidden />}
/>
```

Props control (`checked`, `iconOff`, `color`, `gloss`, …) можно передать на root в simple mode.

### Compound API

```tsx
<Switch defaultChecked gloss labelPosition="right">
  <Switch.Control iconOff={<IoMoon aria-hidden />} iconOn={<IoSunny aria-hidden />} />
  <Switch.Content>
    <Switch.Label>Push-уведомления</Switch.Label>
    <Switch.Hint>Можно отключить в настройках</Switch.Hint>
  </Switch.Content>
</Switch>
```

Низкоуровневая разметка track:

```tsx
<Switch.Control>
  <Switch.Track size="base" gloss>
    <Switch.Fill />
    <Switch.Thumb>
      <Switch.Icon when="off">…</Switch.Icon>
      <Switch.Icon when="on">…</Switch.Icon>
    </Switch.Thumb>
  </Switch.Track>
</Switch.Control>
```

### Root props (ключевые)

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `size` | `base` | `small` \| `base` \| `mid` \| `large` |
| `labelPosition` | `right` | `left` \| `right` — control vs text column |
| `disabled` | `false` | opacity track + block input |
| `gloss` | `false` | gloss track/fill/thumb |
| `color` | — | CSS custom fill (`switchFillColorStyle`) |
| `thickness` | — | Кастомная высота thumb (px/rem) |
| `iconOff` / `iconOn` | — | Иконки в thumb для off/on. **Исключение словаря иконок:** у Checkbox / SelectionIndicator одна иконка отмеченного состояния — `icon`; у Switch две независимые иконки состояний — `iconOn` / `iconOff` (+ `Switch.Icon when`). |
| `label` / `hint` / `error` | — | Simple API |
| `classNames` | — | см. стилизацию |

### `SwitchClassNames`

`root`, `control`, `input`, `track`, `fill`, `thumb`, `thumbShell`, `icon`, `content`, `label`, `labelText`, `hint`, `error`, `simpleLabelWrap`, `simpleLabelText`.

`Switch.Control` принимает локальный `classNames` pick: `control`, `input`, `track`, `fill`, `thumb`, `thumbShell`, `icon` — мержится с root.

### Compound-подчасти

| Часть | Роль |
|-------|------|
| `Switch.Control` | `<label htmlFor>` + hidden checkbox + track |
| `Switch.Track` | Rail, animations host |
| `Switch.Fill` | Цветная заливка track при checked |
| `Switch.Thumb` | `SelectionThumb` + slide |
| `Switch.Icon` | `when="off"|"on"` + crossfade |
| `Switch.Content` | Label column |
| `Switch.Label` / `Hint` / `Error` | Текст |

## Размеры

Из `SWITCH_LAYOUT` / `switchGeometry` — track `2×` thumb diameter (`--selection-indicator-*`).

| size | Track proportion |
|------|------------------|
| `small` … `large` | `w-[calc(2*var(--selection-indicator-{size}))]` |

## Анимации

`switchAnimations.ts` — track bundle + text squeeze.

**DOM:**

```
<label root>
  Switch.Control (label htmlFor)
    <input type=checkbox hidden />
    <span track ref=trackRef>
      <span trackFill ref=trackFillRef>     ← opacity fade
      <span thumb ref=thumbRef>             ← translateX slide
        SelectionThumb (thumbShell, thumbFill)
        Switch.Icon off/on refs
```

### 1. Thumb slide

`useSwitchTrackAnimations` → `syncThumbPosition`:

- `travelPx = measureSwitchTravel(track, thumbShell)` (+ ResizeObserver)
- checked: `gsap.to(thumb, { x: travelPx, ...motionSwitchThumb() })`
- unchecked: `x: 0`
- First layout / reduced motion: instant `translate(x, 0)`

`motionSwitchThumb()` — `switchThumbDuration`, `switchThumbEase` в `configureMotion`.

### 2. Track fill opacity

При `checked` toggle:

- on: `fromTo trackFill { autoAlpha:0 } → { autoAlpha:1 }`
- off: `to { autoAlpha:0 }`
- `motionInteractive()`

### 3. Icon crossfade

`iconOffRef` / `iconOnRef`:

- checked: off fade out + scale 0.88; on fade in from 0.88
- unchecked: обратно
- `motionInteractive()`

### 4. Thumb press squeeze

`squeezeToken` инкремент на `pointerdown` input → `animateInteractivePressSqueeze(thumbShell)`.

### 5. Label text squeeze

`useSwitchTextMotion` → `usePressableElementTextMotion` на root label (как Checkbox).

### 6. Disabled

Track opacity `0.48` instant на `trackRef`.

### Сводка

| Анимация | `configureMotion` |
|----------|-------------------|
| Thumb slide | `switchThumbDuration`, `switchThumbEase` |
| Fill/icons | `interactiveDuration`, `interactiveEase` |
| Press squeeze | `pressSqueezeScale`, `enablePressSqueeze` |
| SelectionThumb fill | interactive (внутри thumb) |

## Стилизация и кастомизация

### Два уровня

1. **`className` на root** — grid `<label>` (в `switchRootGridClass`).
2. **`classNames` на root** — все слоты; `Switch.Control` может переопределить track-слоты локально.

### Слоты `SwitchClassNames`

| Слот | DOM | Назначение |
|------|-----|------------|
| `root` | Root label grid | Padding, border, gap |
| `control` | Control label cell | Alignment |
| `input` | Hidden checkbox | Hit overlay |
| `track` | Track rail | Ring, gloss surface |
| `fill` | Track fill layer | Checked color (`color` prop) |
| `thumb` | Thumb wrapper | Position (не ломайте transform) |
| `thumbShell` | SelectionThumb shell | Border, gloss |
| `icon` | Icon wrapper in thumb | Color on/off |
| `content` | Content column | Label stack |
| `label` / `labelText` | Label | Typography |
| `hint` / `error` | Secondary | Muted/error |
| `simpleLabelWrap` / `simpleLabelText` | Simple column | Подпись simple |

### Simple API

```tsx
<Switch
  defaultChecked
  label="Push-уведомления"
  hint="classNames.label на ячейке подписи"
  classNames={{
    root: "rounded-mid border border-primary/25 p-base",
    track: "ring-1 ring-primary/20",
    fill: "bg-primary/90",
    label: "text-success",
    labelText: "font-semibold",
    hint: "text-muted/80",
  }}
/>
```

### Compound API

```tsx
<Switch
  defaultChecked
  gloss
  classNames={{
    root: "rounded-mid border border-primary/25 p-base",
    track: "ring-1 ring-primary/20",
    fill: "bg-primary/90",
    labelText: "text-primary font-semibold",
    hint: "text-muted/80",
  }}
>
  <Switch.Control />
  <Switch.Content>
    <Switch.Label>Тёмная тема</Switch.Label>
    <Switch.Hint>Все слоты через classNames.</Switch.Hint>
  </Switch.Content>
</Switch>
```

### Практические заметки

- **Не override `transform` на `thumb`** — GSAP slide по `x`.
- **`color` prop** — inline style на fill; `classNames.fill` дополняет.
- **`labelPosition="left"`** — mirror grid: text слева, control справа.
- **Порядок мержа:** root `classNames` → `Control.classNames` → part `className`.

## Доступность

- Native `input type="checkbox"` + `role="switch"` semantics via label
- `aria-describedby` hint/error
- Иконки: `aria-hidden`

## Структура файлов

```
Switch/
├── Switch.tsx
├── index.ts
├── switchTypes.ts
├── switchStyles.ts
├── switchGeometry.ts          # travel measure, SWITCH_LAYOUT
├── switchAnimations.ts        # track + text motion
├── switchParts.tsx
├── useSwitchRootState.ts
├── switchAPI.ts
├── switchA11y.ts
└── Switch.stories.tsx
```

## Storybook

`Core Components/Switch` — simple/compound, gloss, icons, color, `labelPosition`, `classNames`.
