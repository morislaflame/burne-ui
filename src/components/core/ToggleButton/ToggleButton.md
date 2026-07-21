# ToggleButton

Кнопка с состоянием pressed и анимированной fill-заливкой. Используется standalone и в `ToggleButtonGroup`. Варианты как у вторичных контролов; motion координирует fill с press squeeze.

## Импорт

```tsx
import { ToggleButton, type ToggleButtonProps, type ToggleButtonSize, type ToggleButtonVariant, type ToggleButtonClassNames } from "burne-ui";
```

## API

### Standalone

```tsx
<ToggleButton
  defaultPressed
  variant="outline"
  icon={<IoHeartOutline aria-hidden />}
  onPressedChange={setLiked}
>
  Нравится
</ToggleButton>
```

### В ToggleButtonGroup

```tsx
<ToggleButtonGroup type="multiple" defaultValue={["bold"]}>
  <ToggleButton value="bold">Жирный</ToggleButton>
  <ToggleButton value="italic">Курсив</ToggleButton>
</ToggleButtonGroup>
```

В группе: `value` обязателен; `pressed` / selection из контекста; `role` и `aria-pressed` / `aria-checked` по `type`.

### Props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `pressed` / `defaultPressed` | — | Controlled / uncontrolled |
| `onPressedChange` | — | `(pressed: boolean) => void` |
| `onFillStart` | — | Колбэк в начале fill-анимации |
| `variant` | `default` | `default` \| `outline` \| `ghost` \| `gloss` |
| `size` | `base` | `small` \| `base` \| `mid` \| `large` |
| `fillColor` | auto | CSS color заливки |
| `value` | — | Для ToggleButtonGroup |
| `groupSegment` | — | Сегмент ButtonGroup |
| `icon` / `iconPosition` | — | Simple API: одна иконка (`start` \| `end`, default `start`) |
| `animated` | `true` | Hover lift + squeeze + fill |
| `disabled` | `false` | |
| `classNames` | — | см. стилизацию |

### `ToggleButtonClassNames`

`root`, `fill`, `content`, `icon`, `label`, `text`.

Compound API: `ToggleButton.IconStart` / `IconEnd` / `Text` / `Label` / `Content` / `Fill`.

## variant

| variant | Поведение |
|---------|-----------|
| `default` | Surface + hover shadow lift |
| `outline` | Border, hover lift |
| `ghost` | Transparent |
| `gloss` | `gloss-btn` + gloss squeeze (без hover shadow) |

## Анимации

`toggleButtonAnimations.ts` + `useToggleButtonFillAnimation.ts` + `useFirstLevelInteractiveMotion`.

**DOM:**

```
<button ref=setRefs>
  <span fill ref=fillRef>          ← scale fill (pressed)
  <span content ref=contentMotionRef>
    icon | label | (IconStart / IconEnd compound)
</button>
```

### 1. Fill (pressed state)

`animateToggleButtonFill(fill, pressed)`:

- pressed: `fromTo { scale:0, autoAlpha:0 } → { scale:1, autoAlpha:1 }`
- unpressed: `to { scale:0, autoAlpha:0 }`
- vars: `motionSelectionFill()` — `interactiveDuration * 1.15`, `selectionFillEase`
- `enableToggleButtonFill: false` → instant

**Координация с press:** при `animated` fill стартует в **release-фазе squeeze** (`onPressReleaseStart`), не на pointerdown — чтобы заливка совпала с отпусканием кнопки.

Flow:

1. `pointerdown` → `deferFillFromPressRef = true`, `pendingFill = !pressed`
2. squeeze release → `runPendingFill()` → `animateTo(next)`
3. `click` → `queueFillOnClick` если release уже прошёл
4. `pointerleave` → сброс coordination

### 2. Hover lift + squeeze (1-й уровень)

`useFirstLevelInteractiveMotion`:

- **default/outline/ghost:** sm→md shadow + hover lift + press squeeze
- **gloss:** gloss squeeze, без hover shadow
- **ButtonGroup segment:** squeeze на `contentMotionRef` вместо root

### 3. Отключение

```tsx
<ToggleButton animated={false}>Без motion</ToggleButton>
```

```ts
configureMotion({ enableHoverLift: false, enablePressSqueeze: false, enableToggleButtonFill: false });
```

### Сводка

| Анимация | `configureMotion` |
|----------|-------------------|
| Fill scale | `selectionFillEase`, `interactiveDuration`, `enableToggleButtonFill` |
| Hover/squeeze | `enableHoverLift`, `pressSqueezeScale` |
| Gloss squeeze | gloss interactive tokens |

## Стилизация и кастомизация

### Два уровня

1. **`className`** — мерж в `root` слот кнопки.
2. **`classNames`** — `root`, `fill`, `content`, `icon`, `label`, `text`.

### Слоты

| Слот | DOM | Назначение |
|------|-----|------------|
| `root` | `<button>` | Ring, min-width, segment rounding |
| `fill` | Absolute fill layer | Tint pressed (`fillColor`) |
| `content` | Flex row | Gap icons + label |
| `icon` | Icon wrappers (IconStart / IconEnd) | Size/color |
| `label` | `Text` children | Font weight |

### Пример

```tsx
<ToggleButton
  defaultPressed
  variant="outline"
  icon={<IoHeartOutline aria-hidden />}
  className="min-w-[8rem]"
  classNames={{
    root: "rounded-mid ring-1 ring-danger/25",
    fill: "bg-danger/20",
    content: "gap-small",
    icon: "text-danger",
    label: "font-semibold text-danger",
  }}
>
  Нравится
</ToggleButton>
```

### В ToggleButtonGroup

Стили на каждой кнопке; группа задаёт `size` / `variant` / `disabled` через контекст.

```tsx
<ToggleButtonGroup type="single" variant="ghost" size="small">
  <ToggleButton value="a" classNames={{ label: "text-mid" }}>A</ToggleButton>
  <ToggleButton value="b">B</ToggleButton>
</ToggleButtonGroup>
```

### Практические заметки

- **Не задавайте `style={{ transform, opacity }}` на fill** — React перезапишет GSAP.
- **`fillColor`:** semantic tint; `classNames.fill` для opacity/rounded.
- **Segment glue:** `groupSegment` — rounding от ButtonGroup, не дублируйте на root.
- **Порядок мержа:** variant classes → `classNames` → `className`.

## Доступность

- `role="button"` standalone; в group — `role` по `type` (`group` radiogroup-like)
- `aria-pressed` (multiple) / `aria-checked` (single)
- `tabIndex` в group: roving `0` / `-1`
- Focus ring: `focus-ring`

## Интеграция

| Контекст | Поведение |
|----------|-----------|
| `ToggleButtonGroup` | selection, `tabIndexFor`, shared `variant`/`size` |
| `ButtonGroup` | `groupSegment` glue |

## Структура файлов

```
ToggleButton/
├── ToggleButton.tsx
├── index.ts
├── toggleButtonTypes.ts
├── toggleButtonStyles.ts
├── toggleButtonAnimations.ts      # motion + fill coordination
├── useToggleButtonFillAnimation.ts
├── toggleButtonParts.tsx          # Fill, Content
├── useToggleButtonRootState.ts
├── toggleButtonAPI.ts
├── toggleButtonA11y.ts
└── ToggleButton.stories.tsx
```

## Storybook

`Core Components/ToggleButton` — variants, sizes, gloss, group, icons, `classNames`, fill coordination.
