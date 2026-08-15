# ToggleButtonGroup

Группа кнопок-переключателей на базе `ToggleButton`. Склеенная (`segmented={false}`) как `ButtonGroup` или с зазором. Режимы **multiple** и **single** (radio-like).

## Импорт

```tsx
import { ToggleButtonGroup, type ToggleButtonGroupProps, type ToggleButtonGroupType, type ToggleButtonGroupOrientation } from "burne-ui";
import { ToggleButton } from "burne-ui";
```

## API

### Базовое использование

```tsx
<ToggleButtonGroup
  type="multiple"
  defaultValue={["bold"]}
  aria-label="Форматирование"
  variant="default"
  size="base"
>
  <ToggleButton value="bold" icon={<IoTextOutline aria-hidden />}>
    Жирный
  </ToggleButton>
  <ToggleButton value="italic">Курсив</ToggleButton>
</ToggleButtonGroup>
```

### Single selection

```tsx
<ToggleButtonGroup
  type="single"
  value={align}
  onValueChange={setAlign}
  aria-label="Выравнивание"
>
  <ToggleButton value="left">Слева</ToggleButton>
  <ToggleButton value="center">По центру</ToggleButton>
  <ToggleButton value="right">Справа</ToggleButton>
</ToggleButtonGroup>
```

Compound API **нет** — только root + дочерние `ToggleButton`.

### Root props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `type` | `multiple` | `multiple` \| `single` |
| `orientation` | `horizontal` | `horizontal` \| `vertical` |
| `segmented` | `false` | `true` — зазор между кнопками |
| `disabled` | `false` | Блокирует группу и все `ToggleButton` |
| `size` | `base` | `small` \| `base` \| `mid` \| `large` → context |
| `variant` | `default` | `default` \| `outline` \| `ghost` \| `gloss` |
| `value` | — | Controlled: `string[]` (multiple) или `string` (single) |
| `defaultValue` | — | Uncontrolled initial |
| `onValueChange` | — | `(value: string \| string[]) => void` |
| `className` | — | На root `<div role="toolbar">` |
| `classNames` | — | Слоты: `root`, `separator` |

`status` на группе нет.

### `ToggleButtonGroupClassNames`

`root`, `separator`.

`separator` — слот layout-разделителя (compound-части нет).

Joined-рамка как у `ButtonGroup`: на `classNames.root` — `rounded-*` и `border-primary` (цвет, без ширины `border`).

### Дочерние элементы

Только **`ToggleButton`** с обязательным `value`. Произвольные Fragment-обёртки flatten через `toggleButtonGroupAPI`.

## variant и размеры

| `variant` | Поведение |
|-----------|-----------|
| `default` | Standard toggle surface |
| `outline` | Border shell |
| `ghost` | Прозрачный |
| `gloss` | `gloss-panel`; separators **не** рендерятся |

| `size` | Прокидывается в каждый `ToggleButton` |

Кастомизация кнопок — `classNames` на `ToggleButton` (`root`, `fill`, `content`, `iconStart`, `iconEnd`, `label`).

## Анимации

### Slot motion

| Слоты | Фазы | Дефолт |
|-------|------|--------|
| `root` | `enter` (opt-in); `change` when selection identity updates | empty |

Motion item ToggleButton остаётся на пункте.

`false` на фазе — skip без kill и без смены визуала. Не анимируйте layout (`width` / `height` / `top` / `left` / `margin`) в публичных MotionVars. Кастомный `motion` — opt-in: без пропа дефолтный вид не меняется.


`toggleButtonGroupAnimations.ts` играет `enter` / `change` на `root` группы. Motion item остаётся на `ToggleButton`:

**DOM (joined):**

```
<div role=toolbar>
  <ButtonGroupSegmentProvider segment=first>
    <ToggleButton value=bold>
      <span class=fill ref=fillRef />   ← GSAP fill при pressed
      <span contentMotionRef>           ← squeeze
```

### 1. Toggle fill

`useToggleButtonFillAnimation` + slot `fill` (`selectionFill` / `motion.fill`). Fill стартует на release squeeze, если `pressIn` — kit-рецепт.

### 2. Press squeeze

Slot motion на `root` (в `ButtonGroup` сегменте — inner content span): `pressSqueeze` / `pressSqueezeGloss`.

### 3. Gloss

`variant="gloss"` на группе → gloss-рецепты на кнопках (`hoverLiftGloss` / `pressSqueezeGloss`).

Группа добавляет: сегментацию (`ButtonGroupSegmentProvider`), roving keyboard (стрелки / Home / End) в обоих `type`.

#### Кастомизация

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  pressSqueezeScale: [1, 0.98, 1],
  enableToggleButtonFill: true,
});
```

### Чего нет

- Group-level FLIP при смене selection
- Отдельный motion-scope у группы — карта `motion` на каждом `ToggleButton`

### Сводка: что настраивается где

| Анимация | Утилита | Ключи `configureMotion` | Локальный prop |
|----------|---------|---------------------------|----------------|
| Toggle fill | slot `fill` / `useToggleButtonFillAnimation` | `enableToggleButtonFill` | `motion.fill` |
| Press squeeze | slot `root` | `pressSqueezeScale` | `motion.root` |
| Segment glue | CSS only | — | `segmented` |

## Токены и CSS

Стили root/separator импортируются напрямую из `ButtonGroup/buttonGroupStyles` (`buttonGroupRootClass`, `buttonGroupSeparatorClass`) — отдельный styles-слой не нужен.

Root: `role="toolbar"`, `aria-orientation`, `aria-disabled`. Не fieldset: Legend/Hint/Error API нет (осознанное исключение от option-group fieldset утилит).

## Стилизация и кастомизация

### Один уровень

| Часть | Кастомизация |
|-------|--------------|
| root | `className` / `classNames.root` |
| separator | `classNames.separator` |
| кнопки | `ToggleButton className` / `classNames` |

### Connected horizontal

```tsx
<ToggleButtonGroup
  type="multiple"
  defaultValue={["list"]}
  aria-label="Режим отображения"
  className="w-fit"
>
  <ToggleButton value="list" icon={<IoList aria-hidden />}>Список</ToggleButton>
  <ToggleButton value="grid" icon={<IoGrid aria-hidden />}>Сетка</ToggleButton>
</ToggleButtonGroup>
```

### Segmented variants

```tsx
<ToggleButtonGroup segmented type="single" variant="outline" aria-label="Тема">
  <ToggleButton value="light">Светлая</ToggleButton>
  <ToggleButton value="dark">Тёмная</ToggleButton>
</ToggleButtonGroup>
```

### Практические заметки

- **`aria-label` обязателен** на toolbar (не валидируется кодом).
- `type="single"`: кнопки `role="radio"`, `aria-checked`.
- `type="multiple"`: `aria-pressed`.
- Стрелки / Home / End: только roving focus; Enter/Space на кнопке — select/toggle.
- `data-toggle-button-value` на кнопках — для keyboard navigation.
- `segmented` — когда нужны независимые borders/shadows.
- `disabled` на группе блокирует все toggle buttons.

## Интеграции

| Компонент | Роль |
|-----------|------|
| `ToggleButton` | Дочерние элементы; читает group context |
| `ButtonGroup` | Shared segment styles + `buttonGroupAPI` |
| `ButtonGroupSegmentProvider` | Glue positioning |

## Доступность

| Режим | Поведение |
|-------|-----------|
| Root | `role="toolbar"`, **не** в Tab sequence; **`aria-label` required** |
| Кнопки | Roving `tabIndex` (один tab stop на группу) |
| `multiple` | `aria-pressed`; стрелки двигают фокус; Enter/Space — toggle |
| `single` | `role="radio"`, `aria-checked`; стрелки двигают фокус; Enter/Space — select |
| Стрелки | Arrow Left/Right (horizontal) или Up/Down (vertical); Home/End — крайние |
| Иконки | `aria-hidden` на decorative `icon` |

## Структура файлов

```
ToggleButtonGroup/
├── ToggleButtonGroup.tsx
├── index.ts
├── toggleButtonGroupTypes.ts
├── toggleButtonGroupAPI.ts
├── toggleButtonGroupA11y.ts
├── toggleButtonGroupParts.tsx      # Separator (internal)
├── useToggleButtonGroupRootState.ts
└── ToggleButtonGroup.stories.tsx
```

## Storybook

`Composite Components/ToggleButtonGroup` — connected H/V, segmented, single, single segmented, disabled, variants.

Playground: `playground/showcase/demos/toggleButtonGroup/`.
