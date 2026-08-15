# ToggleButton

Кнопка с состоянием pressed и анимированной fill-заливкой. Используется standalone и в `ToggleButtonGroup`. Варианты как у вторичных контролов; motion координирует fill с press squeeze.

## Импорт

```tsx
import { ToggleButton, type ToggleButtonProps, type ToggleButtonSize, type ToggleButtonVariant, type ToggleButtonClassNames, type ToggleButtonMotion, type ToggleButtonPartMotion } from "burne-ui";
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
| `size` | `base` | `small` \| `base` \| `mid` \| `large` — height/pad/icon + `rounded-{size}` |
| `fillColor` | auto | CSS color заливки |
| `value` | — | Для ToggleButtonGroup |
| `groupSegment` | — | Сегмент ButtonGroup |
| `icon` / `iconPosition` | — | Simple API: одна иконка (`start` \| `end`, default `start`) |
| `disabled` | `false` | |
| `classNames` | — | см. стилизацию |
| `motion` | — | Карта слотов `root` / `fill` / `content` / `label` / `iconStart` / `iconEnd` / `text` |

### `ToggleButtonClassNames`

`root`, `fill`, `content`, `iconStart`, `iconEnd`, `label`, `text`.

Compound API: `ToggleButton.IconStart` / `IconEnd` / `Text` / `Label` / `Content` / `Fill`.

## variant

| variant | Поведение |
|---------|-----------|
| `default` | Surface + hover shadow lift |
| `outline` | Border; hover `bg-transparent-hover` |
| `ghost` | Transparent; hover `bg-transparent-hover` |
| `gloss` | `gloss-btn` + gloss squeeze (без hover shadow) |

## Анимации

`toggleButtonAnimations.ts` + `useToggleButtonFillAnimation.ts`. Публичный slot motion.

**DOM:**

```
<button ref=setRefs>                 ← слот `root` (в ButtonGroup — content span)
  <span fill>                        ← слот `fill` (check / uncheck)
  <span content>
    icon | label | Text
</button>
```

### Slot motion

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `root` | `hoverIn` / `hoverOut` | `hoverLiftFirstLevel` или `hoverLiftGloss` |
| `root` | `pressIn` | `pressSqueeze` / `pressSqueezeGloss` (`pressOut` по умолчанию `false`) |
| `fill` | `check` / `uncheck` | `selectionFill` |
| `content` / `label` / `iconStart` / `iconEnd` / `text` | hover; `check` / `uncheck` с хоста | нет |

Fill стартует в **release-фазе squeeze** (`params.onReleaseStart`), после `click`. `fill: { check: false, uncheck: false }` — хост ставит instant (`applyToggleButtonFillInstant`), без kill. Если `pressIn` не kit-squeeze — fill на click сразу.

**Где в коде:** типы — `toggleButtonTypes.ts`; scope — `toggleButtonContext.tsx`; defaults + host — `toggleButtonAnimations.ts`; слоты — `toggleButtonParts.tsx`; Provider — `ToggleButton.tsx`.

```tsx
<ToggleButton motion={{ fill: { check: false, uncheck: false } }}>Instant fill</ToggleButton>

<ToggleButton
  motion={{
    fill: {
      check: (ctx) => gsap.fromTo(ctx.el, { scale: 0, transformOrigin: "50% 100%" }, { scale: 1 }),
      uncheck: (ctx) => gsap.to(ctx.el, { scale: 0, transformOrigin: "50% 100%" }),
    },
  }}
>
  Fill from bottom
</ToggleButton>
```

Цвет текста — **`tweenCssColor`**, не сырой `gsap.to({ color: "var(--…)" })`.

### Координация fill с press

1. `pointerdown` → если `pressIn` = kit squeeze, `deferFillFromPressRef = true`
2. `click` → `queueFillOnClick(next)`
3. squeeze release → `runPendingFill()` → `play("fill", check|uncheck)` + broadcast на `iconStart` / `iconEnd` / `text` / `label`
4. `pointerleave` → сброс coordination

Визуальный pressed (`displayPressed`) обновляется когда fill реально стартует.

### Отключение

```ts
configureMotion({ enableAnimations: false });
configureMotion({ enableHoverLift: false, enablePressSqueeze: false, enableToggleButtonFill: false });
```

## Стилизация и кастомизация

### Два уровня

1. **`className`** — мерж в `root` слот кнопки.
2. **`classNames`** — `root`, `fill`, `content`, `iconStart`, `iconEnd`, `label`, `text`.

### Слоты

| Слот | DOM | Назначение |
|------|-----|------------|
| `root` | `<button>` | Ring, min-width, segment rounding |
| `fill` | Absolute fill layer | Tint pressed (`fillColor`) |
| `content` | Flex row | Gap icons + label |
| `iconStart` | `IconStart` (simple `icon` при `iconPosition="start"`) | Size/color |
| `iconEnd` | `IconEnd` (simple `icon` при `iconPosition="end"`) | Size/color |
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
    iconStart: "text-danger",
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
- `tabIndex` в group: roving `0` / `-1` (и `single`, и `multiple`)
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
├── toggleButtonAnimations.ts      # defaults + host play
├── useToggleButtonFillAnimation.ts
├── toggleButtonContext.tsx        # createMotionScope
├── toggleButtonParts.tsx          # useMotionPart
├── useToggleButtonRootState.ts
├── toggleButtonAPI.ts
├── toggleButtonA11y.ts
└── ToggleButton.stories.tsx
```

## Storybook

`Core Components/ToggleButton` — variants, sizes, gloss, group, icons, `classNames`, fill coordination, slot motion gallery.
