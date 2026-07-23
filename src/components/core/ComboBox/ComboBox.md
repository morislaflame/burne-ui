# ComboBox

Комбобокс с фильтрацией, клавиатурной навигацией и выпадающим `ListBox` в `Popover`. Simple API (props `options`) и compound (`InputGroup` / `Input` / `Trigger` / `Popover`).

## Импорт

```tsx
import { ComboBox, comboBoxFilteredValues, type ComboBoxOption, type ComboBoxProps, type ComboBoxSimpleProps, type ComboBoxClassNames } from "burne-ui";
```

## API

### Simple API

```tsx
const options = [
  { value: "ru", label: "Россия" },
  { value: "de", label: "Германия", hint: "EU" },
];

<ComboBox
  label="Страна"
  options={options}
  value={country}
  onValueChange={setCountry}
  placeholder="Выберите страну"
/>
```

### Compound API

```tsx
<ComboBox options={options} value={v} onValueChange={setV}>
  <ComboBox.Label>Страна</ComboBox.Label>
  <ComboBox.InputGroup>
    <ComboBox.Input />
    <ComboBox.Trigger />
  </ComboBox.InputGroup>
  <ComboBox.Popover />
  <ComboBox.Hint>Можно искать по названию</ComboBox.Hint>
</ComboBox>
```

### Root props (ключевые)

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `options` | `[]` | `{ value, label, hint?, icon?, disabled?, filterText? }` |
| `value` / `defaultValue` | — | Controlled / uncontrolled значение |
| `onValueChange` | — | Колбэк выбора |
| `open` / `defaultOpen` | `false` | Controlled / uncontrolled попап |
| `onOpenChange` | — | `(open: boolean) => void` |
| `variant` | `default` / gloss из ButtonGroup | как Input |
| `status` | `default` | danger/success/warning tint |
| `size` | `base` | размер shell и текста |
| `disabled` | `false` | |
| `placeholder` | `"Выберите значение"` | |
| `menuMaxHeight` | `min(24rem, 70vh)` | ListBox scroll |
| `name` | — | Form binding |
| `classNames` | — | см. ниже |

### `ComboBoxClassNames`

`root`, `label`, `inputGroup`, `input`, `trigger`, `triggerIcon`, `popover`, `popoverBody`, `listBox`, `listBoxItem`, `listBoxLabel`, `listBoxHint`, `listBoxIcon`, `listBoxEmpty`, `listBoxHeader`, `listBoxHeaderText`, `hint`, `error`.

`ComboBox.Popover` принимает `listBoxProps` (пропы внутреннего `ListBox`, кроме controlled selection / `listId` / `children`) и мержит вложенные `listBox*` слоты в `ListBox.classNames`.

### Compound-подчасти

| Часть | Роль |
|-------|------|
| `ComboBox.InputGroup` | Shell anchor, `role="combobox"`, open squeeze |
| `ComboBox.Input` | Текстовое поле + keyboard |
| `ComboBox.Trigger` | Chevron, toggle open |
| `ComboBox.Popover` | `Popover` + `ListBox` |

## Поведение

- Закрыт: input показывает label выбранной опции (`readOnly`), placeholder muted
- Открыт: input редактируемый, `filterQuery` фильтрует options
- Клавиатура: Arrow/Home/End, Enter выбирает, type-ahead открывает с символом
- `comboBoxFilteredValues(options, query)` — утилита фильтрации

## Анимации

Несколько независимых слоёв: shell (как Input), open squeeze, chevron, popover (Popover/Tooltip motion).

**DOM-структура:**

```
Field
  Label
  <div InputGroup ref=anchorRef role=combobox>   ← shell + open squeeze
    <input ComboBox.Input />
    <button ComboBox.Trigger> chevron
  <Popover.Content>                              ← portal
    <ListBox> …
```

### 1. Shell hover (standard)

`useFieldShellHoverLift(anchorRef, !disabled && !isGloss && !groupSegment)`:

- sm → md + lift на `InputGroup`
- `fieldShellHoverClass(status)` — CSS tint
- Отключено в `ButtonGroup` segment и для gloss (отдельный путь)

### 2. Gloss shell

`useGlossFieldShellMotion(anchorRef, !disabled && isGloss && !groupSegment)`:

- pointer + focus lift (`onShellPointerEnter/Leave`, `onShellFocusIn/Out`)
- `data-gloss-disabled` когда disabled

### 3. Open after squeeze (`runComboBoxOpenAfterSqueeze`)

**InputGroup `pointerdown`** (когда `!open`, button 0):

```ts
runComboBoxOpenAfterSqueeze({
  anchorRef,
  disabled,
  isGloss,
  groupSegment,
  setOpen,
  openingRef,
});
```

**Input keyboard** (ArrowDown, Enter, Space, printable char):

- Тот же helper с `preferStandardSqueeze: true` для gloss input (стандартный squeeze вместо gloss)
- `onOpened` → focus input, установка filter/active option

**Алгоритм:**

1. `openingRef` guard от double-trigger
2. Reduced motion → `setOpen(true)` сразу
3. Иначе `animateInteractivePressSqueeze(anchor)` или `animateGlossInteractivePressSqueeze` (только InputGroup click без `preferStandardSqueeze`)
4. После Promise → `setOpen(true)`, `onOpened?.()`

**Trigger button:** открывает **без** squeeze — `setOpen(true)` + focus (toggle close если уже open).

#### Кастомизация open squeeze

```ts
configureMotion({
  interactiveDuration: 280,
  pressSqueezeScale: [1, 0.98, 1],
  enablePressSqueeze: true,
});
```

### 4. Chevron rotation

`ComboBox.Trigger` → `useChevronRotation(open, triggerRef)`:

- GSAP `rotation: 0 | 180` при open/close
- `motionInteractive()` — `interactiveDuration`, `interactiveEase`
- Reduced motion: мгновенный поворот (`applyChevronRotationInstant`)

### 5. Popover enter/leave

`ComboBox.Popover` → `<Popover variant={gloss|default}>`:

- **Open:** `animatePortalOpen` + `motionTooltip()` — `tooltipDuration` (200ms), `interactiveEase`
- **Close:** `animatePortalClose` с теми же vars
- **Position:** `computeTooltipPlacement`, `matchAnchorWidth` на Content; `side` / `align` / `offset` пробрасываются с `ComboBox.Popover`
- **Shadow:** `usePersistentElShadow` — sm на panel

```ts
configureMotion({
  tooltipDuration: 200,
  interactiveEase: "power2.out",
});
```

ListBox items — собственные selection animations (см. ListBox.md).

### Сводка: что настраивается где

| Анимация | Где | `configureMotion` | Примечание |
|----------|-----|-------------------|------------|
| Shell hover | `InputGroup` | `enableHoverLift`, `hoverLiftScale` | !gloss, !segment |
| Gloss shell | `InputGroup` | interactive | variant=gloss |
| Open squeeze | `runComboBoxOpenAfterSqueeze` | `pressSqueezeScale` | click shell / keyboard |
| Chevron | `ComboBox.Trigger` | `interactiveDuration` | rotate |
| Popover | `Popover.Content` | `tooltipDuration` | enter/leave |
| Trigger click open | `ComboBox.Trigger` | — | без squeeze |

## Интеграция

| Контекст | Поведение |
|----------|-----------|
| `Form` | `name`, `value`, `error`, `size` |
| `ButtonGroup` | `variant` gloss, `groupSegment`, без shell hover на segment |

## Стилизация и кастомизация

### Два уровня

1. **`className` на root** — классы на `Field` (мерж с `classNames.root`).
2. **`classNames` на root** — слоты через `ComboBoxClassNamesProvider`.

В compound API **`className` на каждой подчасти** (`InputGroup`, `Input`, `Trigger`, `Popover`) мержится поверх соответствующего слота контекста.

### Слоты `ComboBoxClassNames`

| Слот | DOM / элемент | Когда использовать |
|------|---------------|-------------------|
| `root` | `Field` | Max-width, layout поля |
| `label` | `Label` | Типографика label |
| `inputGroup` | Shell `role="combobox"` | Border, фон, hover shell, squeeze target |
| `input` | `<input>` внутри группы | Текст, placeholder, muted-состояние |
| `trigger` | Кнопка chevron | Hit-area, цвет иконки-триггера |
| `triggerIcon` | `IoChevronDown` | Размер/цвет шеврона |
| `popover` | `Popover.Content` (portal) | `z-popover`, shadow панели |
| `popoverBody` | `Popover.Body` | Padding внутри popover |
| `listBox` | `ListBox` root | Scroll, max-height area, gap пунктов |
| `listBoxItem` / `listBoxLabel` / `listBoxHint` / `listBoxIcon` | Слоты внутреннего ListBox | Стиль пунктов меню |
| `listBoxEmpty` / `listBoxHeader` / `listBoxHeaderText` | Empty / Header ListBox | Пустое состояние и секции |
| `hint` / `error` | `Field.Hint` / `Field.Error` | Подсказка / ошибка |

`variant`, `status`, `size` наследуют токены Input. Popover получает `variant="gloss"` автоматически, если combobox gloss.

### Simple API

Simple рендерит фиксированную разметку: `Label` → `InputGroup` + `Input` + `Trigger` → `Popover` → hint/error. Стили — только через `classNames` на root:

```tsx
<ComboBox
  className="max-w-sm"
  classNames={{
    root: "gap-small",
    inputGroup: "border-primary/40 bg-primary/5",
    input: "text-primary placeholder:text-primary/50",
    trigger: "text-primary hover:text-primary",
    triggerIcon: "icon-plus",
    popoverBody: "bg-primary/5",
    listBox: "p-small",
    hint: "text-foreground/70",
  }}
  label="Язык интерфейса"
  hint="Слоты настроены через classNames"
  options={options}
  variant="outline"
/>
```

`menuMaxHeight` — через prop (`style` на ListBox внутри), не через `classNames`.

### Compound API

Полный контроль разметки и стилей по частям:

```tsx
<ComboBox
  options={options}
  value={value}
  onValueChange={setValue}
  classNames={{
    root: "max-w-md",
    inputGroup: "ring-1 ring-primary/20",
    listBox: "max-h-48",
  }}
>
  <ComboBox.Label className="text-mid font-medium">
    Страна
  </ComboBox.Label>

  <ComboBox.InputGroup className="shadow-token-sm">
    <ComboBox.Input className="font-medium" placeholder="Поиск…" />
    <ComboBox.Trigger className="px-mid" />
  </ComboBox.InputGroup>

  <ComboBox.Popover className="shadow-token-lg">
    {/* children опционально — свой ListBox.Item layout */}
  </ComboBox.Popover>

  <ComboBox.Hint className="text-xs">Можно искать по названию</ComboBox.Hint>
</ComboBox>
```

Кастомный список: передайте `children` в `ComboBox.Popover` вместо дефолтного map по `options` — стили пунктов через `classNames.listBoxItem` / `listBoxProps.classNames`, либо `ListBox.Item`.

```tsx
<ComboBox.Popover
  listBoxProps={{ classNames: { item: "rounded-lg" } }}
/>
```

`ComboBox.Label` — вложенные `classNames` компонента `Label`, как у Input.

### Практические заметки

- **inputGroup vs input:** squeeze и shell hover — на `inputGroup`; фильтр и текст — на `input`.
- **Trigger:** `tabIndex={-1}`; стилизуйте кнопку, не ломая `focus-ring`.
- **Popover:** `matchAnchorWidth` включён по умолчанию; `side` / `align` / `offset` — как у Popover; ширину панели меняйте через `popover` / `popoverBody`, не через anchor.
- **ListBox:** selection-indicator и item motion — в компоненте ListBox; `listBox` слот — обёртка скролла.
- **ButtonGroup segment:** shell hover на `inputGroup` отключён; rounding задаёт сегмент.
- **Порядок мержа:** базовые стили → `classNames.slot` → `className` подчасти.

## Доступность

- `InputGroup`: `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-haspopup="listbox"`
- `Input`: `aria-autocomplete="list"`, `aria-activedescendant` при open
- `Trigger`: `aria-label` open/close, `tabIndex={-1}`
- `ListBox`: `aria-labelledby` / `aria-label`

## Структура файлов

```
ComboBox/
├── ComboBox.tsx
├── index.ts
├── comboBoxTypes.ts
├── comboBoxStyles.ts
├── comboBoxAnimations.ts     # runComboBoxOpenAfterSqueeze
├── comboBoxParts.tsx         # InputGroup, Input, Trigger, Popover
├── useComboBoxRootState.ts
├── comboBoxAPI.ts
├── comboBoxA11y.ts
└── ComboBox.stories.tsx
```

## Storybook

`Core Components/ComboBox` — simple/compound, filter, gloss, status, Form, `classNames`.
