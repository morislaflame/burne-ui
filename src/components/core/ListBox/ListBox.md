# ListBox

Список выбора (`role="listbox"`): single / multiple, keyboard-friendly items, опциональный selection indicator. Используется standalone и внутри Select / ComboBox / Dropdown.

## Импорт

```tsx
import {
  ListBox,
  useListBox,
  type ListBoxRootProps,
  type ListBoxItemProps,
  type ListBoxSize,
  type ListBoxVariant,
  type ListBoxClassNames,
} from "burne-ui";
```

## API

### Simple API (items с props)

```tsx
<ListBox
  label="Язык"
  defaultValue="ru"
  selectionIndicator
  onValueChange={setLang}
>
  <ListBox.Item value="ru" label="Русский" hint="Кириллица" />
  <ListBox.Item value="en" label="English" />
</ListBox>
```

### Compound API (секции)

```tsx
<ListBox multiple defaultValue={["ru"]} selectionIndicator>
  <ListBox.Section>
    <ListBox.Header>Доступные языки</ListBox.Header>
    <ListBox.Item value="ru">
      <ListBox.ItemIndicator />
      <ListBox.Label>Русский</ListBox.Label>
      <ListBox.Hint>Кириллица</ListBox.Hint>
    </ListBox.Item>
    <ListBox.Separator />
    <ListBox.Empty>Нет опций</ListBox.Empty>
  </ListBox.Section>
</ListBox>
```

### Root props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `size` | `base` | `small` \| `base` \| `mid` \| `large` |
| `variant` | `default` | `default` \| `gloss` |
| `multiple` | `false` | Multi-select (`string[]`) |
| `value` / `defaultValue` | — | Controlled / uncontrolled |
| `onValueChange` | — | `(string \| string[]) => void` |
| `selectionIndicator` | `false` | Radio/check indicator слева |
| `activeValue` / `onActiveValueChange` | — | Keyboard hover option (Select/ComboBox) |
| `disabled` | `false` | Блокирует все items |
| `listId` | auto | id для `aria-*` |
| `label` | — | `aria-label` если нет labelledby |
| `classNames` | — | см. стилизацию |

### Compound-подчасти

| Часть | Роль |
|-------|------|
| `ListBox.Section` | `role="group"` + `aria-labelledby` |
| `ListBox.Header` | Заголовок секции |
| `ListBox.Separator` | Разделитель |
| `ListBox.Empty` | Пустое состояние |
| `ListBox.Item` | `role="option"` button |
| `ListBox.Label` / `Hint` / `Icon` | Слоты grid item |
| `ListBox.ItemIndicator` | `SelectionIndicator` (compound: `.Fill`, `.Mark`) |

### `useListBox()`

Контекст внутри `ListBox`: `selected`, `selectItem`, `activeValue`, `showIndicator`, `indicatorMode` (`radio` | `multi`).

## variant

| variant | Root |
|---------|------|
| `default` | `flex flex-col gap-xsmall` |
| `gloss` | `gloss-panel gloss-deep rounded-mid p-plus` + gloss ref refresh |

## Размеры

`size` влияет на padding items и размер `SelectionIndicator` в item.

## Анимации

`listBoxAnimations.ts` + `SelectionIndicator` + shared `usePressableElementTextMotion`.

**DOM item (simple):**

```
<button role=option>
  [ItemIndicator]
  ListBox.Label   ← labelMotionRef (squeeze target)
  ListBox.Hint
  ListBox.Icon
</button>
```

### 1. Gloss root

`useListBoxRootGlossRef(isGloss)` → `useMergedGlossPanelRef` — refresh gloss state на root при `variant="gloss"`.

### 2. Item label press squeeze

`useListBoxItemAnimations` → `usePressableElementTextMotion`:

- **enabled** когда `!disabled && hasLabel`
- **hoverLift: false** — только press squeeze на label ref
- `onPointerDown` на item → squeeze label text

Reduced motion: skip GSAP.

### 3. Selection indicator (check / radio)

`ListBox.ItemIndicator` → `SelectionIndicator` → `useSelectionIndicatorAnimation`:

- **select:** `fill` scale 0→1, `mark` (check icon) scale in
- **deselect:** reverse с `motionInteractive()`

Режим: `radio` (single) или `multi` (multiple) из context.

### 4. Active highlight (CSS)

`isActive` (keyboard focus option) → `bg-default-hover` — без GSAP.

### Сводка

| Анимация | Утилита | `configureMotion` |
|----------|---------|-------------------|
| Gloss root | `useMergedGlossPanelRef` | gloss CSS |
| Label squeeze | `usePressableElementTextMotion` | `pressSqueezeScale` |
| Indicator | `useSelectionIndicatorAnimation` | `interactiveDuration` |
| Active row | CSS `LISTBOX_ITEM_ACTIVE_CLASS` | — |

## Стилизация и кастомизация

### Два уровня

1. **`className` на root** — мерж с `classNames.root` на `ListBox`.
2. **`classNames`** — все слоты через `ListBoxClassNamesProvider`.

Подчасти (`ListBox.Item`, `ListBox.Header`, …) — **`className`** поверх слота.

### Слоты `ListBoxClassNames`

| Слот | Элемент | Назначение |
|------|---------|------------|
| `root` | `role="listbox"` | Padding, border, gloss surface |
| `section` | `role="group"` | Gap секции |
| `header` | Header wrapper | Padding заголовка |
| `headerText` | `Text` в header | Типографика секции |
| `separator` | Divider | Margin/border |
| `empty` | Empty state | Центрирование, muted |
| `item` | Item button | Rounded, active/hover |
| `label` | Item label | Font weight, color |
| `hint` | Item hint | Muted secondary |
| `icon` | Trailing icon | Размер иконки |
| `itemIndicator` | Indicator shell grid | Cell layout |
| `itemIndicatorShell` | `SelectionIndicator` root | Border ring |
| `itemIndicatorFill` | Fill layer | Checked background |
| `itemIndicatorMark` | Check/dot mark | Icon color |

### Standalone

```tsx
<ListBox
  defaultValue="ru"
  label="Язык интерфейса"
  selectionIndicator
  classNames={{
    root: "rounded-mid border border-primary/20 p-base",
    headerText: "text-primary",
    item: "rounded-lg",
    label: "font-semibold",
    hint: "text-muted/80",
    itemIndicatorShell: "border-primary/40",
  }}
>
  <ListBox.Section>
    <ListBox.Header>Доступные языки</ListBox.Header>
    <ListBox.Item value="ru" label="Русский" hint="Кириллица" />
    <ListBox.Item value="en" label="English" />
  </ListBox.Section>
</ListBox>
```

### Compound item layout

```tsx
<ListBox.Item value="de" className="py-large">
  <ListBox.ItemIndicator
    classNames={{ itemIndicatorFill: "bg-primary/20" }}
  />
  <ListBox.Label className="text-mid">Deutsch</ListBox.Label>
  <ListBox.Icon><IoFlag aria-hidden /></ListBox.Icon>
</ListBox.Item>
```

### В Select / ComboBox

Стили list — через `classNames.listBox` на Select/ComboBox root; пункты — дефолтный map или кастомный `Popover` children.

### Практические заметки

- **`selectionIndicator`:** без него слот indicator не рендерится в simple API.
- **Active vs selected:** active — keyboard hover (`bg-default-hover`); selected — `aria-selected` + indicator.
- **Gloss:** root gloss не наследуется в Popover автоматически — `variant` на `ListBox` внутри popover body.
- **Порядок мержа:** базовые → `classNames.slot` → `className` подчасти.

## Доступность

- Root: `role="listbox"`, `aria-label` / `aria-labelledby`
- Item: `role="option"`, `aria-selected`, `id={listId}-opt-{value}`
- Section: `aria-labelledby` от Header id
- Active option: синхронизация с parent combobox через `aria-activedescendant`

## Структура файлов

```
ListBox/
├── ListBox.tsx
├── index.ts
├── listBoxTypes.ts
├── listBoxStyles.ts
├── listBoxAnimations.ts       # gloss ref + item squeeze
├── listBoxParts.tsx
├── useListBoxRootState.ts
├── useListBoxItemState.ts
├── listBoxAPI.ts
├── listBoxA11y.ts
└── ListBox.stories.tsx
```

## Storybook

`Core Components/ListBox` — single/multiple, sections, gloss, indicator, `classNames`.
