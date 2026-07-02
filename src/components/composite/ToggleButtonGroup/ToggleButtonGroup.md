# ToggleButtonGroup

Группа кнопок-переключателей на базе `ToggleButton`. Склеенная (`separated={false}`) как `ButtonGroup` или с зазором. Режимы **multiple** и **single** (radio-like).

## Импорт

```tsx
import {
  ToggleButtonGroup,
  type ToggleButtonGroupProps,
  type ToggleButtonGroupType,
  type ToggleButtonGroupOrientation,
} from "burne-ui";
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
  <ToggleButton value="bold" leftIcon={<IoTextOutline aria-hidden />}>
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
| `separated` | `false` | `true` — зазор между кнопками |
| `disabled` | `false` | Блокирует группу и все `ToggleButton` |
| `size` | `base` | `small` \| `base` \| `mid` \| `large` → context |
| `variant` | `default` | `default` \| `outline` \| `ghost` \| `gloss` |
| `value` | — | Controlled: `string[]` (multiple) или `string` (single) |
| `defaultValue` | — | Uncontrolled initial |
| `onValueChange` | — | `(value: string \| string[]) => void` |
| `className` | — | На root `<div role="toolbar">` |

`status` и `classNames` на группе **нет**.

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

Кастомизация кнопок — `classNames` на `ToggleButton` (`root`, `fill`, `content`, `leftIcon`, `label`).

## Анимации

Отдельного `toggleButtonGroupAnimations.ts` **нет**. Motion на `ToggleButton`:

**DOM (joined):**

```
<div role=toolbar>
  <ButtonGroupSegmentProvider segment=first>
    <ToggleButton value=bold>
      <span class=fill ref=fillRef />   ← GSAP fill при pressed
      <span contentMotionRef>           ← squeeze
```

### 1. Toggle fill

`useToggleButtonFillAnimation` — GSAP fill при `pressed` / selected.

### 2. Press squeeze

`useFirstLevelInteractiveMotion` на content ref.

### 3. Gloss

`variant="gloss"` на группе → gloss handlers на кнопках.

Группа добавляет: сегментацию (`ButtonGroupSegmentProvider`), keyboard nav при `type="single"`.

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
- Собственный GSAP на root

### Сводка: что настраивается где

| Анимация | Утилита | Ключи `configureMotion` | Локальный prop |
|----------|---------|---------------------------|----------------|
| Toggle fill | `useToggleButtonFillAnimation` | `enableToggleButtonFill` | `pressed` |
| Press squeeze | first-level motion | `pressSqueezeScale` | `disabled` |
| Segment glue | CSS only | — | `separated` |

## Токены и CSS

`toggleButtonGroupStyles.ts` делегирует в `ButtonGroup`:

| Функция | Назначение |
|---------|------------|
| `toggleButtonGroupRootClass` | → `buttonGroupRootClass` |
| `toggleButtonGroupSeparatorClass` | → `buttonGroupSeparatorClass` |

Root: `role="toolbar"`, `aria-orientation`, `aria-disabled`.

## Стилизация и кастомизация

### Один уровень

| Часть | Кастомизация |
|-------|--------------|
| root | `ToggleButtonGroup className` |
| кнопки | `ToggleButton className` / `classNames` |

### Connected horizontal

```tsx
<ToggleButtonGroup
  type="multiple"
  defaultValue={["list"]}
  aria-label="Режим отображения"
  className="w-fit"
>
  <ToggleButton value="list" leftIcon={<IoList aria-hidden />}>Список</ToggleButton>
  <ToggleButton value="grid" leftIcon={<IoGrid aria-hidden />}>Сетка</ToggleButton>
</ToggleButtonGroup>
```

### Separated variants

```tsx
<ToggleButtonGroup separated type="single" variant="outline" aria-label="Тема">
  <ToggleButton value="light">Светлая</ToggleButton>
  <ToggleButton value="dark">Тёмная</ToggleButton>
</ToggleButtonGroup>
```

### Практические заметки

- **`aria-label` обязателен** на toolbar (не валидируется кодом).
- `type="single"`: кнопки `role="radio"`, `aria-checked`; стрелки на root.
- `type="multiple"`: `aria-pressed` на кнопках.
- `data-toggle-button-value` на кнопках — для keyboard navigation.
- `separated` — когда нужны независимые borders/shadows.
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
| Root | `role="toolbar"`, `tabIndex={0\|-1}`, **`aria-label` required** |
| `multiple` | `aria-pressed` на кнопках |
| `single` | `role="radio"`, `aria-checked`; roving `tabIndex` |
| Стрелки | Arrow Left/Right (horizontal) или Up/Down (vertical) при `single` |
| Иконки | `aria-hidden` на decorative `leftIcon` |

## Структура файлов

```
ToggleButtonGroup/
├── ToggleButtonGroup.tsx
├── index.ts
├── toggleButtonGroupTypes.ts
├── toggleButtonGroupStyles.ts
├── toggleButtonGroupAPI.ts
├── toggleButtonGroupA11y.ts
├── toggleButtonGroupContext.tsx
├── toggleButtonGroupParts.tsx      # Separator (internal)
├── useToggleButtonGroupRootState.ts
└── ToggleButtonGroup.stories.tsx
```

## Storybook

`Composite Components/ToggleButtonGroup` — connected H/V, separated, single, single separated, disabled, variants.

Playground: `playground/showcase/demos/toggleButtonGroup/`.
