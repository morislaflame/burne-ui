# Select

Выпадающий список выбора одного значения. Без фильтрации (в отличие от ComboBox): отображаемое значение — кнопка `Select.Value`. Simple API (`options` на root) и compound (`TriggerGroup` / `Value` / `Trigger` / `Popover`).

## Импорт

```tsx
import { Select, type SelectOption, type SelectProps, type SelectSimpleProps, type SelectClassNames, type SelectMotion } from "burne-ui";
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
| `status` | `default` | danger/success/warning/info — постоянный статусный ring |
| `size` | `base` | размер trigger shell и пунктов ListBox в Popover |
| `disabled` | `false` | |
| `placeholder` | `"Выберите значение"` | muted-текст без выбора |
| `menuMaxHeight` | `min(24rem, 70vh)` | scroll ListBox |
| `name` | — | Form binding |
| `classNames` | — | см. стилизацию |

### `SelectClassNames`

`root`, `label`, `triggerGroup`, `value`, `trigger`, `triggerIcon`, `popover`, `popoverBody`, `listBox`, `listBoxItem`, `listBoxLabel`, `listBoxHint`, `listBoxIcon`, `listBoxEmpty`, `listBoxHeader`, `listBoxHeaderText`, `hint`, `error`.

`Select.Popover` принимает `listBoxProps` (пропы внутреннего `ListBox`, кроме controlled `value` / `onValueChange` / `activeValue` / `listId` / `children`) и мержит вложенные `listBox*` слоты в `ListBox.classNames`.

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
- Клавиатура на Value: ArrowDown/Up, Enter, Space — open; в списке — navigate + Enter выбирает; Escape закрывает; typeahead по первым буквам (string `label` / `value`)
- Нет type-ahead / filter (см. ComboBox)

## Анимации

Публичный slot motion. Root передаёт карту `motion`; хост — `Select.TriggerGroup` (defaults + `play`). Gloss hover/press остаются на `useGlossFieldShellMotion`. Open-after-squeeze играет `triggerGroup.pressIn` (non-gloss) или kit gloss squeeze. Chevron rotation — kit-internal. Menu enter — на Popover, не дублируется.

### Slot motion

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `triggerGroup` | `hoverIn` / `hoverOut` / `pressIn` / `pressOut` | non-gloss: `hoverLiftSecondLevel`, `pressSqueeze` (`pressOut: false`). Gloss hover/press — `false` (field-shell) |
| `value` / `trigger` / `triggerIcon` | hover/press | нет |

`false` на `triggerGroup.hoverIn/Out` — rest-тень остаётся, lift не играет. `false` на `pressIn` — open без squeeze. Не анимируйте layout в публичных MotionVars.

**Где в коде:** типы — `selectTypes.ts`; scope — `selectContext.tsx`; defaults + host — `selectAnimations.ts`; слоты — `selectTriggerParts.tsx`; карта на Root — `Select.tsx`.

```tsx
<Select
  label="Language"
  options={options}
  motion={{
    triggerGroup: { hoverIn: false, hoverOut: false },
  }}
/>
```

Compound: `motion` на `Select.TriggerGroup` — part motion слота `triggerGroup`; на `Select.Value` / `Select.Trigger` — свои слоты.

**ButtonGroup:** при `groupSegment` shell hover/press выключены.

### Chevron / Popover / ListBox

- Chevron: `useChevronRotation` — kit-internal
- Popover enter/leave — публичный slot motion Popover
- ListBox items — slot motion ListBox (если подключён)

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
| `popover` | `Popover.Content` | Shadow, `z-popover` |
| `popoverBody` | `Popover.Body` | Padding меню |
| `listBox` | `ListBox` | Scroll area |
| `listBoxItem` / `listBoxLabel` / `listBoxHint` / `listBoxIcon` | Слоты внутреннего ListBox | Стиль пунктов меню |
| `listBoxEmpty` / `listBoxHeader` / `listBoxHeaderText` | Empty / Header ListBox | Пустое состояние и секции |
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
    <Select.Trigger className="px-large" />
  </Select.TriggerGroup>
  <Select.Popover className="shadow-token-lg" />
</Select>
```

Кастомный список: `children` в `Select.Popover` + стили пунктов через `classNames.listBoxItem` / `listBoxProps.classNames`, либо полная замена пунктов через `ListBox.Item`.

```tsx
<Select options={options} defaultValue="ru">
  <Select.Label>Регион</Select.Label>
  <Select.TriggerGroup>
    <Select.Value />
    <Select.Trigger />
  </Select.TriggerGroup>
  <Select.Popover
    listBoxProps={{ classNames: { item: "rounded-lg bg-primary/5" } }}
  />
</Select>
```

### Практические заметки

- **Value vs TriggerGroup:** squeeze на group; текст значения — `value`.
- **Select vs ComboBox:** нет `input` слота; не используйте Input-стили.
- **ButtonGroup segment:** shell hover отключён на segment; rounding на `TriggerGroup`, radius bridge на `Field` root. `Select` — segment slot группы.
- **Порядок мержа:** базовые → `classNames.slot` → `className` подчасти.

## Интеграция

| Контекст | Поведение |
|----------|-----------|
| `Form` | `name`, `value`, `error`, `size` |
| `ButtonGroup` | `variant` gloss, `groupSegment` |

## Доступность

- `TriggerGroup`: `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-haspopup="listbox"`, `aria-activedescendant` при open, `aria-labelledby` (при Label) / `aria-label` (placeholder), `tabIndex={-1}`, `focus-within-ring` на shell
- `Select.Value`: единственный tab-stop; без собственного `focus-ring` (ring через shell)
- `Select.Trigger`: `aria-label`, `tabIndex={-1}`, `focus-ring-inset`
- `ListBox`: `aria-labelledby` / `aria-label`

## Структура файлов

```
Select/
├── Select.tsx
├── index.ts
├── selectTypes.ts
├── selectStyles.ts
├── selectParts.tsx
├── selectTriggerParts.tsx
├── selectAnimations.ts          # slot table, defaults, host play
├── selectContext.tsx            # createMotionScope
├── useSelectRootState.ts
├── selectAPI.ts
├── selectA11y.ts
└── Select.stories.tsx
```

## Storybook

`Core Components/Select` — simple/compound, status, gloss, Form, `classNames`, keyboard, slot motion gallery.
