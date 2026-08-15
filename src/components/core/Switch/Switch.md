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
| `motion` | — | Карта слотов. Хост — `Switch.Track` |

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

Из `SWITCH_LAYOUT` / `switchGeometry` — track `2×` thumb diameter (`--selection-indicator-*`); скругление track/thumb — `--selection-indicator-radius-*`; title/desc/gap — из shared `OPTION_CONTROL_SIZE_LAYOUT`.

| size | Track proportion |
|------|------------------|
| `small` … `large` | `w-[calc(2*var(--selection-indicator-{size}))]` |

## Анимации

`switchAnimations.ts` → slot motion (`SWITCH_MOTION_DEFAULTS`). Root передаёт карту `motion`; хост — `Switch.Track` (defaults + `params.getTravelPx`). Squeeze `thumbShell` и opacity disabled track — внутренний GSAP, не публичные фазы.

**DOM:**

```
<label root>
  Switch.Control (label htmlFor)
    <input type=checkbox hidden />
    <span track>                         ← хост play check/uncheck
      <span fill>                        ← слот `fill`
      <span thumb>                       ← слот `thumb` (translateX)
        SelectionThumb (thumbShell)      ← press squeeze, не слот
        Switch.Icon off/on               ← слоты `iconOff` / `iconOn`
```

### Slot motion

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `thumb` | `check` / `uncheck` | `switchThumb` (`params.getTravelPx`) |
| `fill` | `check` / `uncheck` | `switchFill` |
| `iconOn` | `check` / `uncheck` | `switchIconOn` |
| `iconOff` | `check` / `uncheck` | `switchIconOff` |

Travel thumb — `measureSwitchTravel(track, thumbShell)` (+ ResizeObserver). Factory на `thumb` читает `ctx.params.getTravelPx()`. `false` на фазе **не** ставит состояние — хост сам делает instant (`applySwitchThumbInstant` / fill / icon). First layout / reduced / `enableSwitchThumb: false` — тоже instant.

**Где в коде:** типы — `switchTypes.ts`; scope — `switchContext.tsx`; defaults + host play — `switchAnimations.ts`; Track-provider — `switchParts.tsx`; карта на корне — `Switch.tsx`.

```tsx
<Switch motion={{ thumb: { check: false, uncheck: false } }} />

<Switch
  motion={{
    thumb: {
      check: (ctx) => {
        const travel =
          typeof ctx.params.getTravelPx === "function" ? Number(ctx.params.getTravelPx()) || 0 : 0;
        return gsap.to(ctx.el, { x: travel, duration: 0.45, ease: "back.out(1.6)", force3D: false });
      },
      uncheck: (ctx) => gsap.to(ctx.el, { x: 0, duration: 0.22, force3D: false }),
    },
  }}
/>
```

### Thumb press squeeze

`squeezeToken` инкремент на `pointerdown` input → `animateInteractivePressSqueeze(thumbShell)`.

### Label text squeeze

`useSwitchTextMotion` → `usePressableElementTextMotion` на root label (как Checkbox).

### Disabled

Track opacity `0.48` instant на `trackRef`.

### Сводка

| Анимация | `configureMotion` | Проп |
|----------|-------------------|------|
| Thumb slide | `switchThumbDuration`, `switchThumbEase`, `enableSwitchThumb` | `motion.thumb` |
| Track fill / icons | `interactiveDuration`, `interactiveEase`, `enableSwitchThumb` | `motion.fill` / `iconOn` / `iconOff` |
| Press squeeze | `pressSqueezeScale`, `enablePressSqueeze` | внутренний `thumbShell` |

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
├── Switch.tsx               # карта motion через Provider (Root без defaults)
├── index.ts
├── switchTypes.ts           # SwitchMotion / SwitchCheckMotion
├── switchStyles.ts
├── switchGeometry.ts        # travel measure, SWITCH_LAYOUT
├── switchAnimations.ts      # SWITCH_MOTION_DEFAULTS, useSwitchTrackAnimations
├── switchParts.tsx          # Track-хост + useMotionPart
├── useSwitchRootState.ts
├── switchAPI.ts
├── switchA11y.ts
├── switchContext.tsx        # createMotionScope("Switch")
└── Switch.stories.tsx
```

## Storybook

`Core Components/Switch` — simple/compound, gloss, icons, color, `labelPosition`, `classNames`, slot motion gallery.
