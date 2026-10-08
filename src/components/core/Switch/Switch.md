# Switch

Переключатель on/off с анимированным thumb по track. Simple API (`label` + props control) и compound (`Control` / `Track` / `Thumb` / `Content`). Поддержка `variant` (скин), кастомного `color`, иконок on/off.

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
  variant="default"
  iconOff={<IoMoon aria-hidden />}
  iconOn={<IoSunny aria-hidden />}
/>
```

Props control (`checked`, `iconOff`, `color`, `variant`, …) можно передать на root в simple mode.

### Compound API

```tsx
<Switch defaultChecked variant="default" labelPosition="right">
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
  <Switch.Track size="base" variant="default">
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
| `variant` | `default` | Kit surface или имя скина |
| `color` | — | CSS custom fill (`switchFillColorStyle`) |
| `thickness` | — | Кастомная высота thumb (px/rem) |
| `iconOff` / `iconOn` | — | Иконки в thumb для off/on. **Исключение словаря иконок:** у Checkbox / SelectionIndicator одна иконка отмеченного состояния — `icon`; у Switch две независимые иконки состояний — `iconOn` / `iconOff` (+ `Switch.Icon when`). |
| `label` / `hint` / `error` | — | Simple API |
| `classNames` | — | см. стилизацию |
| `motion` | — | Карта слотов. Хост — `Switch.Track`. `events` — app-команды `MotionController` |
| `motionController` | — | Simple API: форвардится на Track. Compound: Root chrome (`label` / `hint` / `error`); Track — второй handle |

### `SwitchClassNames`

`root`, `control`, `input`, `track`, `fill`, `thumb`, `thumbShell`, `iconOff`, `iconOn`, `content`, `label`, `labelText`, `hint`, `error`, `simpleLabelWrap`, `simpleLabelText`.

`Switch.Control` принимает локальный `classNames` pick: `control`, `input`, `track`, `fill`, `thumb`, `thumbShell`, `iconOff`, `iconOn` — мержится с root.

### Compound-подчасти

| Часть | Роль |
|-------|------|
| `Switch.Control` | Compound: wrapping `<label>` around hidden checkbox + track. Simple: `<span>` внутри root `<label htmlFor>` |
| `Switch.Track` | Rail, animations host |
| `Switch.Fill` | Цветная заливка track при checked |
| `Switch.Thumb` | `SelectionThumb` + slide |
| `Switch.Icon` | `when="off"|"on"` + crossfade |
| `Switch.Content` | Колонка текста (`display: contents` — padding, border, background и width не рисуются). Без `Switch.Label` — сам `<label htmlFor>` |
| `Switch.Label` | `<label htmlFor={switchId}>` из контекста (не simple API) |
| `Switch.Hint` / `Error` | Вторичный текст |

## Размеры

Из `SWITCH_LAYOUT` / `switchGeometry` — track `2×` thumb diameter (`--selection-indicator-*`); скругление track/thumb — `--selection-indicator-radius-*`; title/desc/gap — из shared `OPTION_CONTROL_SIZE_LAYOUT`.

| size | Track proportion |
|------|------------------|
| `small` … `large` | `w-[calc(2*var(--selection-indicator-{size}))]` |

## Анимации

`switchAnimations.ts` → slot motion (`SWITCH_MOTION_DEFAULTS`). Root передаёт карту `motion`. Track — nested host (defaults + `params.getTravelPx`) для `fill` / `thumb` / `iconOn` / `iconOff`. Chrome `label` / `hint` / `error` регистрируются на **Root** scope — Track их не наследует. Squeeze `thumbShell` и opacity disabled track — внутренний GSAP, не публичные фазы.

**DOM:**

```
<fieldset root>                         ← compound
  Switch.Control (<label> wraps input+track)
    <input id type=checkbox hidden />
    <span track>                         ← хост play check/uncheck
      <span fill>                        ← слот `fill`
      <span thumb>                       ← слот `thumb` (translateX)
        SelectionThumb (thumbShell)      ← press squeeze, не слот
        Switch.Icon off/on               ← слоты `iconOff` / `iconOn`
  Switch.Label (<label htmlFor={switchId}>) / Hint / Error
<label root htmlFor>                    ← simple
  Control <span> + label text
```

### Slot motion

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `thumb` | `check` / `uncheck` | `switchThumb` (`params.getTravelPx`) |
| `fill` | `check` / `uncheck` | `switchFill` |
| `iconOn` | `check` / `uncheck` | `switchIconOn` |
| `iconOff` | `check` / `uncheck` | `switchIconOff` |
| `track` | `check` / `uncheck` (+ `enter` / pointer если задать) | нет; Track host, как Meter `track` |
| `label` / `hint` / `error` | `check` / `uncheck` (+ `enter` / pointer если задать) | нет; Root scope, не Track |

Travel thumb — `measureSwitchTravel(track, thumbShell)` (+ ResizeObserver). Factory на `thumb` читает `ctx.params.getTravelPx()`. `false` на фазе **не** ставит состояние — хост сам делает instant (`applySwitchThumbInstant` / fill / icon). First layout / reduced / `enableSwitchThumb: false` — тоже instant.

У Track нет слота `root`: `play()` skip. Simple API — `playSlot("track", …)`. Compound chrome — handle на Root (`playSlot("label")`); thumb-хост — отдельный handle на `Switch.Track`. Явный `<Switch.Track motionController>` побеждает форвард с корня. SelectionThumb внутри Switch **не** получает этот handle.

Проп `motionController` + ключ `events` на `motion` — app-команды (`switch:nudge`), не фазы. `createMotionEvents`. События на simple API играть через `playSlot("track", event)` (карта `events` с корня мержится в Track). `waitForComplete` / `cancel` — playground / Storybook **MotionController**.

```tsx
import { Button, Switch, createMotionEvents, useMotionControllerHandle } from "burne-ui";

const events = createMotionEvents({
  "switch:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1 },
});

function Nudge() {
  const controller = useMotionControllerHandle();
  return (
    <>
      <Button size="small" variant="outline" onClick={() => controller.playSlot("track", "switch:nudge")}>
        Nudge
      </Button>
      <Switch label="Notify" defaultChecked motionController={controller} motion={{ events }} />
    </>
  );
}
```

**Где в коде:** типы — `switchTypes.ts`; scope — `switchContext.tsx`; defaults + host play — `switchAnimations.ts`; Track-provider — `switchParts.tsx`; карта на корне — `Switch.tsx`.

```tsx
<Switch motion={{ thumb: { check: false, uncheck: false } }} />

<Switch
  motion={{
    thumb: {
      check: (ctx) => {
        const travel = ctx.params.getTravelPx?.() ?? 0;
        return ctx.to({ x: travel, duration: 0.45, ease: "back.out(1.6)" });
      },
      uncheck: (ctx) => ctx.to({ x: 0, duration: 0.22 }),
    },
  }}
/>

<Switch
  label="Accent"
  hint="Hint follows check."
  motion={{
    label: {
      check: (ctx) => ctx.to({ y: -1, duration: 0.18 }),
      uncheck: (ctx) => ctx.to({ y: 0, duration: 0.16 }),
    },
    hint: {
      check: (ctx) => ctx.to({ opacity: 1, duration: 0.2 }),
      uncheck: (ctx) => ctx.to({ opacity: 0.72, duration: 0.16 }),
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
| Label / hint / error | — | `motion.label` / `hint` / `error` (Root scope) |
| Press squeeze | `pressSqueezeScale`, `enablePressSqueeze` | внутренний `thumbShell` |

## Стилизация и кастомизация

### Два уровня

1. **`className` на root** — grid: simple — `<label htmlFor>`, compound — `<fieldset>`.
2. **`classNames` на root** — все слоты; `Switch.Control` может переопределить track-слоты локально.

### Слоты `SwitchClassNames`

| Слот | DOM | Назначение |
|------|-----|------------|
| `root` | Root label / fieldset grid | Padding, border, gap |
| `control` | Control label cell | Alignment |
| `input` | Hidden checkbox | Hit overlay |
| `track` | Track rail | Ring, track surface |
| `fill` | Track fill layer | Checked color (`color` prop) |
| `thumb` | Thumb wrapper | Position (не ломайте transform) |
| `thumbShell` | SelectionThumb shell | Border / skin shell |
| `iconOff` / `iconOn` | Glyph inside the thumb | Off and on icons |
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
    root: "rounded-large border border-primary/25 p-base",
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
  variant="default"
  classNames={{
    root: "rounded-large border border-primary/25 p-base",
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

- Native `input type="checkbox"` + `role="switch"`
- Simple: root `<label htmlFor={switchId}>`
- Compound: `Switch.Label` / `Switch.Content` — `<label htmlFor>` из `switchId` в контексте (не вложенный label в root)
- `aria-describedby` hint/error
- `required` — нативный `required` и `aria-required` на input
- Иконки: `aria-hidden`
- Forced colors (Windows HCM): checked track — `Highlight` (`[role="switch"][aria-checked="true"] + *`)

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

`Core Components/Switch` — simple/compound, variants, icons, color, `labelPosition`, `classNames`, slot motion gallery.
