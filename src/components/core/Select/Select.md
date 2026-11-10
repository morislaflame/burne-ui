# Select

Выпадающий список. Одно значение или несколько (`selectionMode="multiple"`). Без фильтрации (в отличие от ComboBox): отображаемое значение — кнопка `Select.Value`. Simple API (`items` на root) и compound (`TriggerGroup` / `Value` / `Trigger` / `Popover`).

Стекло — пакет `burne-ui-skin-gloss`, не вариант кита. Подключение и классы — [docs/SKINS.md](../../../../docs/SKINS.md).

## Импорт

```tsx
import { Select, type SelectItem, type SelectProps, type SelectSimpleProps, type SelectClassNames, type SelectMotion } from "burne-ui";
```

## API

### Simple API

```tsx
const items = [
  { value: "ru", label: "Русский", hint: "RU" },
  { value: "en", label: "English", disabled: true },
];

<Select
  label="Язык"
  items={items}
  value={lang}
  onValueChange={setLang}
  placeholder="Выберите язык"
/>
```

### Compound API

```tsx
<Select items={items} value={lang} onValueChange={setLang}>
  <Select.Label>Язык</Select.Label>
  <Select.Shell>
    <Select.Value />
    <Select.Trigger />
  </Select.Shell>
  <Select.Popover />
  <Select.Hint>Язык интерфейса</Select.Hint>
</Select>
```

### Root props (ключевые)

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `items` | `[]` | `{ value, label, hint?, icon?, disabled? }` |
| `selectionMode` | `single` | `single` \| `multiple`. Несколько значений: выбор переключает пункт и не закрывает меню |
| `value` / `defaultValue` | — | Одно значение, `string \| null`. Пустой выбор — `null` |
| `onValueChange` | — | `(value: string \| null) => void`, только `single` |
| `values` / `defaultValues` | — | Controlled / uncontrolled список при `selectionMode="multiple"` |
| `onValuesChange` | — | `(values: string[]) => void` |
| `open` / `defaultOpen` | `false` | Controlled / uncontrolled попап |
| `onOpenChange` | — | `(open: boolean) => void` |
| `variant` | — | как Input |
| `invalid` | — | `true` — danger-визуал, `aria-invalid` и `data-invalid=""`. `error` делает то же и показывает сообщение |
| `size` | `base` | размер trigger shell и пунктов ListBox в Popover |
| `disabled` | `false` | |
| `placeholder` | `BurneLabels.selectValue` | muted-текст без выбора. По умолчанию `"Select a value"`, в `BURNE_LABELS_RU` — `"Выберите значение"` |
| `icon` | шеврон | Simple API: узел заменяет шеврон, `null` прячет. Дети `Select.Trigger` по-прежнему заменяют шеврон |
| `menuMaxHeight` | `min(24rem, 70dvh)` | scroll ListBox |
| `portalContainer` | `document.body` | Хост портала меню. Узел внутри документа — contained |
| `virtualized` | `false` | В DOM только видимые items. Строки одной высоты |
| `name` | — | Form binding |
| `classNames` | — | см. стилизацию |
| `motion` | — | Root / simple: карта слотов + `events`. На `Select.Shell` — part motion слота `shell` |
| `motionController` | — | Simple: форвардится на TriggerGroup (хост `shell`). Compound: Root chrome; для shell — второй handle на `Select.Shell`. Не на DOM |

### `SelectClassNames`

`root`, `label`, `shell`, `value`, `trigger`, `triggerIcon`, `triggerIconWrap`, `popover`, `popoverBody`, `listBox`, `listBoxItem`, `listBoxLabel`, `listBoxHint`, `listBoxIcon`, `listBoxEmpty`, `listBoxHeader`, `listBoxHeaderText`, `hint`, `error`.

`Select.Popover` принимает `listBoxProps` (пропы внутреннего `ListBox`, кроме controlled `value` / `values` / `onValueChange` / `onValuesChange` / `activeValue` / `listId` / `selectionMode` / `children`) и мержит вложенные `listBox*` слоты в `ListBox.classNames`.

### Compound-подчасти

| Часть | Роль |
|-------|------|
| `Select.Shell` | Shell anchor, open squeeze |
| `Select.Value` | Кнопка `role="combobox"` + keyboard |
| `Select.Trigger` | Chevron, toggle open. Children заменяют SVG, остаются в `triggerIconWrap` |
| `Select.Popover` | `Popover` + `ListBox` |

## Поведение

- Закрыт: `Select.Value` показывает `label` выбранной опции или `placeholder` (muted). При `selectionMode="multiple"` — подписи в порядке `items`, через запятую
- Открыт: `ListBox` с `activeValue`, keyboard navigation
- Клавиатура на Value: ArrowDown/Up, Enter, Space — open; в списке — navigate + Enter выбирает; Escape закрывает; typeahead по первым буквам (string `label` / `value`)
- `selectionMode="multiple"`: Enter и клик переключают пункт и оставляют меню открытым
- Нет type-ahead / filter (см. ComboBox)

## Анимации

Публичный slot motion. Root передаёт карту `motion`; хост — `Select.Shell` (defaults + `play`). Шеврон — слот `triggerIconWrap`, фазы `enter` / `leave`, рецепт `chevronRotate`. Слот `popover` прокидывается на `content` внутреннего Popover (`portalSurfaceEnter` / `portalSurfaceLeave`) и в scope поля не регистрируется.

### Slot motion

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `shell` | `hoverIn` / `hoverOut` / `pressIn` / `pressOut` | — |
| `value` / `trigger` | hover/press | нет |
| `triggerIconWrap` | `enter` / `leave` | `chevronRotate` |
| `label` / `hint` / `error` | `enter` / hover/press | нет; Root scope |
| `popover` | `enter` / `leave` | `portalSurfaceEnter` / `portalSurfaceLeave`. Ключ не регистрируется в scope поля: карта уходит на внутренний Popover `content`. `Select.Popover` `motion` побеждает карту корня |

`false` на `shell.hoverIn/Out` — rest-тень остаётся, lift не играет. `false` на `pressIn` — open без squeeze. Не анимируйте layout в публичных MotionVars.

**Где в коде:** типы — `selectTypes.ts`; scope — `selectContext.tsx`; defaults + host — `selectAnimations.ts`; слоты — `selectTriggerParts.tsx`; карта на Root — `Select.tsx`.

```tsx
<Select
  label="Language"
  items={items}
  motion={{
    shell: { hoverIn: false, hoverOut: false },
  }}
/>
```

Compound: `motion` на `Select.Shell` — part motion слота `shell`; на `Select.Value` / `Select.Trigger` — свои слоты. На `Select.Label` / `Hint` / `Error` — chrome Root scope.

Слота `root` нет: `play()` ищет `"root"` и skip. Simple API — `playSlot("shell", …)` / `playSlot("value", …)`. Compound chrome — handle на Root (`playSlot("label")`); shell-хост — отдельный handle на `Select.Shell`. Один handle ≠ два scope. `playSlot("popover")` на контроллере поля цели не найдёт: панель живёт в scope Popover. Меню меняет `motion.popover` на корне или `motion` на `Select.Popover`.

Проп `motionController` + ключ `events` на `motion` — app-команды (`select:nudge`, `select:pulse`), не фазы. `createMotionEvents`. События на simple API играть через `playSlot("shell", event)` (карта `events` с корня мержится в TriggerGroup). `waitForComplete` / `cancel` — playground / Storybook **MotionController**.

Тройка на корне и на группе триггера. Simple API мержит карту корня в неё. `motionState`, `motionPayload` и `playInitialState` не попадают на DOM. Смена `motionState` играет `motion.states[имя]`; то же имя ещё раз — тишина. `motionPayload` — снимок для фабрики (`ctx.payload`, `createMotionFactory`); без смены режима не переигрывает. `playInitialState` по умолчанию выключен: на маунте режим не играет.

```tsx
import { Button, Select, createMotionEvents, useMotionControllerHandle } from "burne-ui";

const events = createMotionEvents({
  "select:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1 },
});

function Nudge() {
  const controller = useMotionControllerHandle();
  return (
    <>
      <Button size="small" variant="outline" onClick={() => controller.playSlot("shell", "select:nudge")}>
        Nudge
      </Button>
      <Select label="Framework" items={items} motionController={controller} motion={{ events }} />
    </>
  );
}
```

**ButtonGroup:** при `groupSegment` shell hover/press выключены.

### Chevron / Popover / ListBox

- Chevron: слот `triggerIconWrap`, рецепт `chevronRotate` (`enter` / `leave`)
- Панель меню: слот `popover` на карте Select → внутренний Popover `content`. Дефолт `portalSurfaceEnter` / `portalSurfaceLeave`. `Select.Popover` `motion` побеждает карту корня. Другие Popover этот ключ не получают
- ListBox items — slot motion ListBox (если подключён)

## Стилизация и кастомизация

### Два уровня

1. **`className` на root** — `Field` (мерж с `classNames.root`).
2. **`classNames` на root** — `SelectClassNamesProvider`.

Подчасти принимают **`className`** поверх слота контекста.

`Select.Trigger` и `Select.Value` публикуют `data-state="open" | "closed"`. Children у `Select.Trigger` заменяют дефолтный SVG; kit крутит обёртку `triggerIconWrap` (`chevronRotate`). CSS на кнопке крутит весь Trigger, не только иконку:

```tsx
<Select.Trigger className="data-[state=open]:rotate-180" />
```

### Слоты `SelectClassNames`

| Слот | DOM | Назначение |
|------|-----|------------|
| `root` | `Field` | Max-width, gap поля |
| `label` | `Label` | Типографика |
| `shell` | Shell | Border, hover, squeeze target |
| `value` | `Select.Value` `role="combobox"` | Текст значения, muted placeholder |
| `trigger` | Chevron button | Hit-area триггера |
| `triggerIcon` | `IoChevronDown` | Цвет шеврона |
| `triggerIconWrap` | Обёртка шеврона | Размер (`icon-slot-*`), motion `chevronRotate` |
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
    shell: "ring-1 ring-primary/20",
    value: "text-primary font-medium",
    trigger: "text-primary",
    triggerIconWrap: "icon-slot-large",
    popover: "ring-1 ring-primary/15",
    listBox: "p-small",
  }}
  label="Кастомные слоты"
  items={items}
  defaultValue="ru"
/>
```

### Compound API

```tsx
<Select
  items={items}
  classNames={{ shell: "border-primary/30" }}
>
  <Select.Label className="font-semibold">Регион</Select.Label>
  <Select.Shell className="shadow-token-sm">
    <Select.Value className="text-left" placeholder="—" />
    <Select.Trigger className="px-large" />
  </Select.Shell>
  <Select.Popover className="shadow-token-lg" />
</Select>
```

Кастомный список: `children` в `Select.Popover` + стили пунктов через `classNames.listBoxItem` / `listBoxProps.classNames`, либо полная замена пунктов через `ListBox.Item`.

```tsx
<Select items={items} defaultValue="ru">
  <Select.Label>Регион</Select.Label>
  <Select.Shell>
    <Select.Value />
    <Select.Trigger />
  </Select.Shell>
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
| `ButtonGroup` | — |

## Доступность

- `Select.Value`: `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-haspopup="listbox"`, `aria-activedescendant` при open, `aria-invalid` / `aria-required` / `aria-describedby`, `aria-labelledby` (при Label) / `aria-label` (placeholder). Единственный tab-stop. `disabled` — нативный, без `aria-disabled`. Ring — `focus-within-ring` на shell
- `error` или `invalid` ставят `aria-invalid` на `Select.Value`, пустой `data-invalid` на корне и danger-кольцо на оболочке
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

`Core Components/Select` — simple/compound, invalid, Form, `classNames`, keyboard, Slot motion, MotionController.

## Опции

`items` принимает плоский список и группы `{ label, items }`. `clearable` показывает кнопку очистки: одно значение становится пустым, `multiple` — `[]`.
