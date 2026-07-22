# Select

Выпадающий список выбора одного значения. Без фильтрации (в отличие от ComboBox): отображаемое значение — кнопка `Select.Value`. Simple API (`options` на root) и compound (`TriggerGroup` / `Value` / `Trigger` / `Popover`).

## Импорт

```tsx
import { Select, type SelectOption, type SelectProps, type SelectSimpleProps, type SelectClassNames } from "burne-ui";
```

## API

### Simple API

```tsx
const options = [
  { value: "ru", label: "Русский", hint: "RU" },
  { value: "en", label: "English", disabled: true },
];

<Select
  label="Язык"
  options={options}
  value={lang}
  onValueChange={setLang}
  placeholder="Выберите язык"
/>
```

### Compound API

```tsx
<Select options={options} value={lang} onValueChange={setLang}>
  <Select.Label>Язык</Select.Label>
  <Select.TriggerGroup>
    <Select.Value />
    <Select.Trigger />
  </Select.TriggerGroup>
  <Select.Popover />
  <Select.Hint>Язык интерфейса</Select.Hint>
</Select>
```

### Root props (ключевые)

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `options` | `[]` | `{ value, label, hint?, icon?, disabled? }` |
| `value` / `defaultValue` | — | Controlled / uncontrolled значение |
| `onValueChange` | — | Колбэк выбора |
| `open` / `defaultOpen` | `false` | Controlled / uncontrolled попап |
| `onOpenChange` | — | `(open: boolean) => void` |
| `variant` | `default` / gloss из ButtonGroup | как Input |
| `status` | `default` | danger/success/warning tint |
| `size` | `base` | размер trigger shell |
| `disabled` | `false` | |
| `placeholder` | `"Выберите значение"` | muted-текст без выбора |
| `menuMaxHeight` | `min(24rem, 70vh)` | scroll ListBox |
| `name` | — | Form binding |
| `classNames` | — | см. стилизацию |

### `SelectClassNames`

`root`, `label`, `triggerGroup`, `value`, `trigger`, `triggerIcon`, `popover`, `popoverBody`, `listBox`, `hint`, `error`.

### Compound-подчасти

| Часть | Роль |
|-------|------|
| `Select.TriggerGroup` | Shell anchor, `role="combobox"`, open squeeze |
| `Select.Value` | Кнопка с label выбранной опции + keyboard |
| `Select.Trigger` | Chevron, toggle open |
| `Select.Popover` | `Popover` + `ListBox` |

## Поведение

- Закрыт: `Select.Value` показывает `label` выбранной опции или `placeholder` (muted)
- Открыт: `ListBox` с `activeValue`, keyboard navigation
- Клавиатура на Value: ArrowDown/Up, Enter, Space — open; в списке — navigate + Enter выбирает; Escape закрывает
- Нет type-ahead / filter (см. ComboBox)

## Анимации

Слои: shell (как Input), open squeeze, chevron, popover, ListBox items.

**DOM-структура:**

```
Field
  Label
  <div TriggerGroup ref=anchorRef role=combobox>
    <button Select.Value />      ← focus + keyboard
    <button Select.Trigger> chevron
  <Popover.Content>
    <ListBox> …
```

### 1. Shell hover (standard)

`useFieldShellHoverLift(anchorRef, !disabled && !isGloss && !groupSegment)` на `TriggerGroup`:

- sm → md + lift
- `fieldShellHoverClass(status)` — CSS tint

### 2. Gloss shell

`useGlossFieldShellMotion` — pointer + focus lift на `TriggerGroup`.

### 3. Open after squeeze (`runSelectOpenAfterSqueeze`)

**TriggerGroup `pointerdown`** (когда `!open`):

```ts
runSelectOpenAfterSqueeze({
  anchorRef, disabled, isGloss, groupSegment,
  setOpen, onOpened: finishOpen, openingRef,
});
```

**Select.Value keyboard** (ArrowDown/Up, Enter, Space) — тот же helper без `groupSegment` в squeeze path для gloss (gloss squeeze если gloss && !segment).

**Select.Trigger:** открывает **без** squeeze — `setOpen(true)` + focus Value.

Алгоритм: `openingRef` guard → reduced motion → instant open → иначе `animateGlossInteractivePressSqueeze` или `animateInteractivePressSqueeze` → `setOpen(true)` → `onOpened` (focus Value, set active option).

### 4. Chevron rotation

`Select.Trigger` → `useChevronRotation(open)` — GSAP `rotation: 0|180`, `motionInteractive()`.

### 5. Popover enter/leave

`Select.Popover` → `Popover` с `motionTooltip()` — как ComboBox.
Пропсы позиционирования: `side` (`top` | `right` | `bottom` | `left`, по умолчанию `bottom`), `align`, `offset`.

### 6. ListBox items

Selection indicator + label press squeeze — см. ListBox.md.

### Сводка

| Анимация | Где | `configureMotion` |
|----------|-----|-------------------|
| Shell hover | `TriggerGroup` | `enableHoverLift`, `hoverLiftScale` |
| Gloss shell | `TriggerGroup` | interactive |
| Open squeeze | `runSelectOpenAfterSqueeze` | `pressSqueezeScale` |
| Chevron | `Select.Trigger` | `interactiveDuration` |
| Popover | `Popover.Content` | `tooltipDuration` |
| List items | `ListBox.Item` | `pressSqueezeScale` |

## Стилизация и кастомизация

### Два уровня

1. **`className` на root** — `Field` (мерж с `classNames.root`).
2. **`classNames` на root** — `SelectClassNamesProvider`.

Подчасти принимают **`className`** поверх слота контекста.

### Слоты `SelectClassNames`

| Слот | DOM | Назначение |
|------|-----|------------|
| `root` | `Field` | Max-width, gap поля |
| `label` | `Label` | Типографика |
| `triggerGroup` | Shell combobox | Border, hover, squeeze target |
| `value` | `Select.Value` button | Текст значения, muted placeholder |
| `trigger` | Chevron button | Hit-area триггера |
| `triggerIcon` | `IoChevronDown` | Размер/цвет шеврона |
| `popover` | `Popover.Content` | Shadow, z-index |
| `popoverBody` | `Popover.Body` | Padding меню |
| `listBox` | `ListBox` | Scroll area |
| `hint` / `error` | `Field.Hint` / `Field.Error` | Подсказка / ошибка |

### Simple API

```tsx
<Select
  className="max-w-sm"
  classNames={{
    triggerGroup: "ring-1 ring-primary/20",
    value: "text-primary font-medium",
    trigger: "text-primary",
    popover: "ring-1 ring-primary/15",
    listBox: "p-small",
  }}
  label="Кастомные слоты"
  options={options}
  defaultValue="ru"
/>
```

### Compound API

```tsx
<Select
  options={options}
  classNames={{ triggerGroup: "border-primary/30" }}
>
  <Select.Label className="font-semibold">Регион</Select.Label>
  <Select.TriggerGroup className="shadow-token-sm">
    <Select.Value className="text-left" placeholder="—" />
    <Select.Trigger className="px-mid" />
  </Select.TriggerGroup>
  <Select.Popover className="shadow-token-lg" />
</Select>
```

Кастомный список: `children` в `Select.Popover` + стили пунктов через `ListBox.Item` / `classNames.listBox`.

### Практические заметки

- **Value vs TriggerGroup:** squeeze на group; текст значения — `value`.
- **Select vs ComboBox:** нет `input` слота; не используйте Input-стили.
- **ButtonGroup segment:** shell hover отключён на segment.
- **Порядок мержа:** базовые → `classNames.slot` → `className` подчасти.

## Интеграция

| Контекст | Поведение |
|----------|-----------|
| `Form` | `name`, `value`, `error`, `size` |
| `ButtonGroup` | `variant` gloss, `groupSegment` |

## Доступность

- `TriggerGroup`: `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-haspopup="listbox"`
- `Select.Value`: `aria-activedescendant` при open, `aria-invalid`, `aria-required`
- `Select.Trigger`: `aria-label`, `tabIndex={-1}`
- `ListBox`: `aria-labelledby` / `aria-label`

## Структура файлов

```
Select/
├── Select.tsx
├── index.ts
├── selectTypes.ts
├── selectStyles.ts
├── selectAnimations.ts      # runSelectOpenAfterSqueeze
├── selectParts.tsx
├── useSelectRootState.ts
├── selectAPI.ts
├── selectA11y.ts
└── Select.stories.tsx
```

## Storybook

`Core Components/Select` — simple/compound, status, gloss, Form, `classNames`, keyboard.
