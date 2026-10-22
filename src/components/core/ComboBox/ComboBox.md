# ComboBox

Комбобокс с фильтрацией, клавиатурной навигацией и выпадающим `ListBox` в `Popover`. Simple API (props `items`) и compound (`InputGroup` / `Input` / `Trigger` / `Popover`).

Стекло — пакет `burne-ui-skin-gloss`, не вариант кита. Подключение и классы — [docs/SKINS.md](../../../../docs/SKINS.md).

## Импорт

```tsx
import { ComboBox, type ComboBoxItem, type ComboBoxProps, type ComboBoxSimpleProps, type ComboBoxClassNames, type ComboBoxMotion, type ComboBoxPartMotion } from "burne-ui";
```

## API

### Simple API

```tsx
const items = [
  { value: "ru", label: "Россия" },
  { value: "de", label: "Германия", hint: "EU" },
];

<ComboBox
  label="Страна"
  items={items}
  value={country}
  onValueChange={setCountry}
  placeholder="Выберите страну"
/>
```

### Compound API

```tsx
<ComboBox items={items} value={v} onValueChange={setV}>
  <ComboBox.Label>Страна</ComboBox.Label>
  <ComboBox.Shell>
    <ComboBox.Input />
    <ComboBox.Trigger />
  </ComboBox.Shell>
  <ComboBox.Popover />
  <ComboBox.Hint>Можно искать по названию</ComboBox.Hint>
</ComboBox>
```

### Root props (ключевые)

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `items` | `[]` | `{ value, label, hint?, icon?, disabled?, filterText? }` |
| `value` / `defaultValue` | — | Выбранное значение, `string \| null`. Пустой выбор — `null` |
| `onValueChange` | — | `(value: string \| null) => void` |
| `inputValue` / `defaultInputValue` | — | Текст фильтра. Controlled / uncontrolled |
| `onInputValueChange` | — | `(value: string) => void` |
| `open` / `defaultOpen` | `false` | Controlled / uncontrolled попап |
| `onOpenChange` | — | `(open: boolean) => void` |
| `variant` | — | как Input |
| `invalid` | — | `true` — danger-визуал, `aria-invalid` и `data-invalid=""`. `error` делает то же и показывает сообщение |
| `size` | `base` | размер shell, текста и пунктов ListBox в Popover |
| `disabled` | `false` | |
| `placeholder` | `BurneLabels.selectValue` | По умолчанию `"Select a value"` |
| `menuMaxHeight` | `min(24rem, 70dvh)` | ListBox scroll |
| `portalContainer` | `document.body` | Хост портала меню. Узел внутри документа — contained |
| `virtualized` | `false` | В DOM только видимые items. Строки одной высоты |
| `name` | — | Form binding |
| `classNames` | — | см. ниже |
| `motion` | — | Root / simple: карта слотов + `events`. На `ComboBox.Shell` — part motion слота `shell` |
| `motionController` | — | Simple: форвардится на InputGroup (хост `shell`). Compound: Root chrome; для shell — второй handle на `ComboBox.Shell`. Не на DOM |

### `ComboBoxClassNames`

`root`, `label`, `shell`, `input`, `trigger`, `triggerIcon`, `triggerIconWrap`, `popover`, `popoverBody`, `listBox`, `listBoxItem`, `listBoxLabel`, `listBoxHint`, `listBoxIcon`, `listBoxEmpty`, `listBoxHeader`, `listBoxHeaderText`, `hint`, `error`.

`ComboBox.Popover` принимает `listBoxProps` (пропы внутреннего `ListBox`, кроме controlled selection / `listId` / `children`) и мержит вложенные `listBox*` слоты в `ListBox.classNames`.

### Compound-подчасти

| Часть | Роль |
|-------|------|
| `ComboBox.Shell` | Shell anchor, open squeeze |
| `ComboBox.Input` | `<input role="combobox">` + keyboard |
| `ComboBox.Trigger` | Chevron, toggle open. Children заменяют SVG, остаются в `triggerIconWrap` |
| `ComboBox.Popover` | `Popover` + `ListBox` |

## Поведение

- Закрыт: input показывает label выбранной опции, placeholder muted. Поле не `readOnly`: ввод открывает список и становится фильтром
- Открыт: `filterQuery` фильтрует items
- Клавиатура: Arrow/Home/End, Enter выбирает, type-ahead открывает с символом
- `filter` — функция отбора пунктов по тексту поля

## Анимации

Публичный slot motion. Root передаёт карту `motion`; хост — `ComboBox.Shell` (defaults + `play`). Шеврон — слот `triggerIconWrap`, фазы `enter` / `leave`, рецепт `chevronRotate`. Слот `popover` прокидывается на `content` внутреннего Popover (`portalSurfaceEnter` / `portalSurfaceLeave`) и в scope поля не регистрируется.

### Slot motion

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `shell` | `hoverIn` / `hoverOut` / `pressIn` / `pressOut` | — |
| `input` / `trigger` | hover/press | нет |
| `triggerIconWrap` | `enter` / `leave` | `chevronRotate` |
| `label` / `hint` / `error` | `enter` / hover/press | нет; Root scope |
| `popover` | `enter` / `leave` | `portalSurfaceEnter` / `portalSurfaceLeave`. Ключ не регистрируется в scope поля: карта уходит на внутренний Popover `content`. `ComboBox.Popover` `motion` побеждает карту корня |

`false` на `shell.hoverIn/Out` — rest-тень остаётся, lift не играет. `false` на `pressIn` — open без squeeze. Не анимируйте layout в публичных MotionVars.

**Где в коде:** типы — `comboBoxTypes.ts`; scope — `comboBoxContext.tsx`; defaults + host — `comboBoxAnimations.ts`; слоты — `comboBoxParts.tsx`; карта на Root — `ComboBox.tsx`.

```tsx
<ComboBox
  label="Framework"
  items={items}
  motion={{
    shell: { hoverIn: false, hoverOut: false },
  }}
/>
```

Compound: `motion` на `ComboBox.Shell` — part motion слота `shell`; на `ComboBox.Input` / `ComboBox.Trigger` — свои слоты. На `ComboBox.Label` / `Hint` / `Error` — chrome Root scope.

Слота `root` нет: `play()` ищет `"root"` и skip. Simple API — `playSlot("shell", …)` / `playSlot("input", …)`. Compound chrome — handle на Root (`playSlot("label")`); shell-хост — отдельный handle на `ComboBox.Shell`. Один handle ≠ два scope. `playSlot("popover")` на контроллере поля цели не найдёт: панель живёт в scope Popover. Меню меняет `motion.popover` на корне или `motion` на `ComboBox.Popover`.

Проп `motionController` + ключ `events` на `motion` — app-команды (`combo:nudge`, `combo:pulse`), не фазы. `createMotionEvents`. События на simple API играть через `playSlot("shell", event)` (карта `events` с корня мержится в InputGroup). `waitForComplete` / `cancel` — playground / Storybook **MotionController**.

Тройка на корне и на группе поля. Simple API мержит карту корня в неё. `motionState`, `motionPayload` и `playInitialState` не попадают на DOM. Смена `motionState` играет `motion.states[имя]`; то же имя ещё раз — тишина. `motionPayload` — снимок для фабрики (`ctx.payload`, `createMotionFactory`); без смены режима не переигрывает. `playInitialState` по умолчанию выключен: на маунте режим не играет.

```tsx
import { Button, ComboBox, createMotionEvents, useMotionControllerHandle } from "burne-ui";

const events = createMotionEvents({
  "combo:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1 },
});

function Nudge() {
  const controller = useMotionControllerHandle();
  return (
    <>
      <Button size="small" variant="outline" onClick={() => controller.playSlot("shell", "combo:nudge")}>
        Nudge
      </Button>
      <ComboBox label="Framework" items={items} motionController={controller} motion={{ events }} />
    </>
  );
}
```

**ButtonGroup:** при `groupSegment` shell hover/press выключены.

### Chevron / Popover / ListBox

- Chevron: слот `triggerIconWrap`, рецепт `chevronRotate` (`enter` / `leave`)
- Панель меню: слот `popover` на карте ComboBox → внутренний Popover `content`. Дефолт `portalSurfaceEnter` / `portalSurfaceLeave`. `ComboBox.Popover` `motion` побеждает карту корня. Другие Popover этот ключ не получают
- ListBox items — slot motion ListBox (если подключён)

## Интеграция

| Контекст | Поведение |
|----------|-----------|
| `Form` | `name`, `value`, `error`, `size` |
| `ButtonGroup` | — |

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
| `shell` | Shell | Border, фон, hover shell, squeeze target |
| `input` | `<input role="combobox">` | Текст, placeholder, muted-состояние |
| `trigger` | Кнопка chevron | Hit-area, цвет иконки-триггера |
| `triggerIcon` | `IoChevronDown` | Цвет шеврона |
| `triggerIconWrap` | Обёртка шеврона | Размер (`icon-slot-*`), motion `chevronRotate` |
| `popover` | `Popover.Content` (portal) | `z-popover`, shadow панели |
| `popoverBody` | `Popover.Body` | Padding внутри popover |
| `listBox` | `ListBox` root | Scroll, max-height area, gap пунктов |
| `listBoxItem` / `listBoxLabel` / `listBoxHint` / `listBoxIcon` | Слоты внутреннего ListBox | Стиль пунктов меню |
| `listBoxEmpty` / `listBoxHeader` / `listBoxHeaderText` | Empty / Header ListBox | Пустое состояние и секции |
| `hint` / `error` | `Field.Hint` / `Field.Error` | Подсказка / ошибка |

`variant` и `size` наследуют токены Input.

### Simple API

Simple рендерит фиксированную разметку: `Label` → `InputGroup` + `Input` + `Trigger` → `Popover` → hint/error. Стили — только через `classNames` на root:

```tsx
<ComboBox
  className="max-w-sm"
  classNames={{
    root: "gap-small",
    shell: "border-primary/40 bg-primary/5",
    input: "text-primary placeholder:text-primary/50",
    trigger: "text-primary hover:text-primary",
    triggerIconWrap: "icon-slot-large",
    triggerIcon: "text-primary",
    popoverBody: "bg-primary/5",
    listBox: "p-small",
    hint: "text-foreground/70",
  }}
  label="Язык интерфейса"
  hint="Слоты настроены через classNames"
  items={items}
  variant="outline"
/>
```

`menuMaxHeight` — через prop (`style` на ListBox внутри), не через `classNames`.

### Compound API

Полный контроль разметки и стилей по частям:

```tsx
<ComboBox
  items={items}
  value={value}
  onValueChange={setValue}
  classNames={{
    root: "max-w-md",
    shell: "ring-1 ring-primary/20",
    listBox: "max-h-48",
  }}
>
  <ComboBox.Label className="text-mid font-medium">
    Страна
  </ComboBox.Label>

  <ComboBox.Shell className="shadow-token-sm">
    <ComboBox.Input className="font-medium" placeholder="Поиск…" />
    <ComboBox.Trigger className="px-large" />
  </ComboBox.Shell>

  <ComboBox.Popover className="shadow-token-lg">
    {/* children опционально — свой ListBox.Item layout */}
  </ComboBox.Popover>

  <ComboBox.Hint className="text-xs">Можно искать по названию</ComboBox.Hint>
</ComboBox>
```

Кастомный список: передайте `children` в `ComboBox.Popover` вместо дефолтного map по `items` — стили пунктов через `classNames.listBoxItem` / `listBoxProps.classNames`, либо `ListBox.Item`.

```tsx
<ComboBox.Popover
  listBoxProps={{ classNames: { item: "rounded-lg" } }}
/>
```

`ComboBox.Label` — вложенные `classNames` компонента `Label`, как у Input.

### Практические заметки

- **shell vs input:** squeeze и shell hover — на `shell`; фильтр и текст — на `input`.
- **Trigger:** `tabIndex={-1}`; стилизуйте кнопку, не ломая `focus-ring`.
- **Popover:** `matchAnchorWidth` включён по умолчанию; `side` / `align` / `offset` — как у Popover; ширину панели меняйте через `popover` / `popoverBody`, не через anchor.
- **ListBox:** selection-indicator и item motion — в компоненте ListBox; `listBox` слот — обёртка скролла.
- **ButtonGroup segment:** shell hover на `shell` отключён; rounding на `InputGroup`, radius bridge на `Field` root (`rounded-[inherit]`).
- **Порядок мержа:** базовые стили → `classNames.slot` → `className` подчасти.

## Доступность

- `Input`: `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-haspopup="listbox"`, `aria-autocomplete="list"`, `aria-activedescendant` на том же узле при open, `aria-invalid` / `aria-required` / `aria-describedby`. `disabled` — нативный, без `aria-disabled`
- `error` или `invalid` ставят `aria-invalid` на input, пустой `data-invalid` на корне и danger-кольцо на оболочке
- `Trigger`: `aria-label` open/close, `tabIndex={-1}`
- `ListBox`: `aria-labelledby` / `aria-label`

## Структура файлов

```
ComboBox/
├── ComboBox.tsx
├── index.ts
├── comboBoxTypes.ts
├── comboBoxStyles.ts
├── comboBoxContext.tsx       # createMotionScope
├── comboBoxAnimations.ts     # slot table, defaults, host play
├── comboBoxParts.tsx         # InputGroup, Input, Trigger, Popover
├── useComboBoxRootState.ts
├── useComboBoxInputState.ts
├── comboBoxAPI.ts
├── comboBoxA11y.ts
└── ComboBox.stories.tsx
```

## Storybook

`Core Components/ComboBox` — simple/compound, filter, invalid, Form, `classNames`, Slot motion, MotionController.

## Фильтр

`filter(option, query)` заменяет текстовый поиск. `allowsCustomValue` по Enter записывает введённый текст, если он не совпал с пунктом. `loading` показывает статус вместо списка.
