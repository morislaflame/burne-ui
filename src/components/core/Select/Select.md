# Select

Выпадающий список. Одно значение или несколько (`multiple`). Без фильтрации (в отличие от ComboBox): отображаемое значение — кнопка `Select.Value`. Simple API (`options` на root) и compound (`TriggerGroup` / `Value` / `Trigger` / `Popover`).

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
| `multiple` | `false` | Несколько значений. Выбор переключает пункт и не закрывает меню |
| `values` / `defaultValues` | — | Controlled / uncontrolled список при `multiple` |
| `onValuesChange` | — | `(values: string[]) => void` |
| `open` / `defaultOpen` | `false` | Controlled / uncontrolled попап |
| `onOpenChange` | — | `(open: boolean) => void` |
| `variant` | `default` / gloss из ButtonGroup | как Input |
| `status` | `default` | Только цвет: danger/success/warning/info — постоянный статусный ring. Не ставит `aria-invalid` |
| `invalid` | — | `true` — danger-визуал, `aria-invalid` и `data-invalid=""`. `error` делает то же и показывает сообщение |
| `size` | `base` | размер trigger shell и пунктов ListBox в Popover |
| `disabled` | `false` | |
| `placeholder` | `"Выберите значение"` | muted-текст без выбора |
| `menuMaxHeight` | `min(24rem, 70dvh)` | scroll ListBox |
| `virtualized` | `false` | В DOM только видимые options. Строки одной высоты |
| `name` | — | Form binding |
| `classNames` | — | см. стилизацию |
| `motion` | — | Root / simple: карта слотов + `events`. На `Select.TriggerGroup` — part motion слота `triggerGroup` |
| `motionController` | — | Simple: форвардится на TriggerGroup (хост `triggerGroup`). Compound: Root chrome; для shell — второй handle на `Select.TriggerGroup`. Не на DOM |

### `SelectClassNames`

`root`, `label`, `triggerGroup`, `value`, `trigger`, `triggerIcon`, `triggerIconWrap`, `popover`, `popoverBody`, `listBox`, `listBoxItem`, `listBoxLabel`, `listBoxHint`, `listBoxIcon`, `listBoxEmpty`, `listBoxHeader`, `listBoxHeaderText`, `hint`, `error`.

`Select.Popover` принимает `listBoxProps` (пропы внутреннего `ListBox`, кроме controlled `value` / `onValueChange` / `activeValue` / `listId` / `multiple` / `children`) и мержит вложенные `listBox*` слоты в `ListBox.classNames`.

### Compound-подчасти

| Часть | Роль |
|-------|------|
| `Select.TriggerGroup` | Shell anchor, open squeeze |
| `Select.Value` | Кнопка `role="combobox"` + keyboard |
| `Select.Trigger` | Chevron, toggle open |
| `Select.Popover` | `Popover` + `ListBox` |

## Поведение

- Закрыт: `Select.Value` показывает `label` выбранной опции или `placeholder` (muted). При `multiple` — подписи в порядке `options`, через запятую
- Открыт: `ListBox` с `activeValue`, keyboard navigation
- Клавиатура на Value: ArrowDown/Up, Enter, Space — open; в списке — navigate + Enter выбирает; Escape закрывает; typeahead по первым буквам (string `label` / `value`)
- `multiple`: Enter и клик переключают пункт и оставляют меню открытым
- Нет type-ahead / filter (см. ComboBox)

## Анимации

Публичный slot motion. Root передаёт карту `motion`; хост — `Select.TriggerGroup` (defaults + `play`). Gloss hover/press остаются на `useGlossFieldShellMotion`. Open-after-squeeze играет `triggerGroup.pressIn` (non-gloss) или kit gloss squeeze. Шеврон — слот `triggerIcon`, фазы `enter` / `leave`, рецепт `chevronRotate`. Menu enter — на Popover, не дублируется.

### Slot motion

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `triggerGroup` | `hoverIn` / `hoverOut` / `pressIn` / `pressOut` | non-gloss: `hoverLiftSecondLevel`, `pressSqueeze` (`pressOut: false`). Gloss hover/press — `false` (field-shell) |
| `value` / `trigger` / `triggerIcon` | hover/press | нет |
| `label` / `hint` / `error` | `enter` / hover/press | нет; Root scope |

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

Compound: `motion` на `Select.TriggerGroup` — part motion слота `triggerGroup`; на `Select.Value` / `Select.Trigger` — свои слоты. На `Select.Label` / `Hint` / `Error` — chrome Root scope.

Слота `root` нет: `play()` ищет `"root"` и skip. Simple API — `playSlot("triggerGroup", …)` / `playSlot("value", …)`. Compound chrome — handle на Root (`playSlot("label")`); shell-хост — отдельный handle на `Select.TriggerGroup`. Один handle ≠ два scope. Меню — Popover, не этот scope.

Проп `motionController` + ключ `events` на `motion` — app-команды (`select:nudge`, `select:pulse`), не фазы. `createMotionEvents`. События на simple API играть через `playSlot("triggerGroup", event)` (карта `events` с корня мержится в TriggerGroup). `waitForComplete` / `cancel` — playground / Storybook **MotionController**.

```tsx
import { Button, Select, createMotionEvents, useMotionControllerHandle } from "burne-ui";

const events = createMotionEvents({
  "select:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1 },
});

function Nudge() {
  const controller = useMotionControllerHandle();
  return (
    <>
      <Button size="small" variant="outline" onClick={() => controller.playSlot("triggerGroup", "select:nudge")}>
        Nudge
      </Button>
      <Select label="Framework" options={options} motionController={controller} motion={{ events }} />
    </>
  );
}
```

**ButtonGroup:** при `groupSegment` shell hover/press выключены.

### Chevron / Popover / ListBox

- Chevron: слот `triggerIcon`, рецепт `chevronRotate` (`enter` / `leave`)
- Popover enter/leave — публичный slot motion Popover
- ListBox items — slot motion ListBox (если подключён)

## Стилизация и кастомизация

### Два уровня

1. **`className` на root** — `Field` (мерж с `classNames.root`).
2. **`classNames` на root** — `SelectClassNamesProvider`.

Подчасти принимают **`className`** поверх слота контекста.

`Select.Trigger` и `Select.Value` публикуют `data-state="open" | "closed"`. Поворот шеврона без JS — класс на кнопке, у которой есть атрибут:

```tsx
<Select.Trigger className="data-[state=open]:rotate-180" />
```

### Слоты `SelectClassNames`

| Слот | DOM | Назначение |
|------|-----|------------|
| `root` | `Field` | Max-width, gap поля |
| `label` | `Label` | Типографика |
| `triggerGroup` | Shell | Border, hover, squeeze target |
| `value` | `Select.Value` `role="combobox"` | Текст значения, muted placeholder |
| `trigger` | Chevron button | Hit-area триггера |
| `triggerIcon` | `IoChevronDown` | Размер/цвет шеврона |
| `triggerIconWrap` | Обёртка шеврона | Отступ, motion-хост |
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

- `Select.Value`: `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-haspopup="listbox"`, `aria-activedescendant` при open, `aria-invalid` / `aria-required` / `aria-describedby`, `aria-labelledby` (при Label) / `aria-label` (placeholder). Единственный tab-stop. `disabled` — нативный, без `aria-disabled`. Ring — `focus-within-ring` на shell
- `error` или `invalid` ставят `aria-invalid` на `Select.Value` и пустой `data-invalid` на корне. `status` этого не делает
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

`Core Components/Select` — simple/compound, status, gloss, Form, `classNames`, keyboard, Slot motion, MotionController.
