# Table

Таблица данных с compound API: scroll container, header/columns, body/rows, footer. Поддерживает **sort**, **selection**, row `tone`, variants включая `gloss`.

## Импорт

```tsx
import {
  Table,
  TABLE_ROW_TONE_SURFACE,
  type TableProps,
  type TableVariant,
  type TableClassNames,
  type TableContentProps,
  type SortDescriptor,
  type SelectionMode,
} from "burne-ui";
```

## API

### Compound API

```tsx
<Table variant="default" className="max-w-2xl">
  <Table.ScrollContainer>
    <Table.Content
      aria-label="Команда"
      selectionMode="multiple"
      selectedKeys={selected}
      onSelectionChange={setSelected}
      sortDescriptor={sort}
      onSortChange={setSort}
    >
      <Table.Header>
        <Table.Column id="name" isRowHeader allowsSorting>
          Имя
        </Table.Column>
        <Table.Column id="role" allowsSorting>
          Роль
        </Table.Column>
      </Table.Header>
      <Table.Body>
        {users.map((user) => (
          <Table.Row key={user.id} id={user.id} tone="default">
            <Table.Cell>{user.name}</Table.Cell>
            <Table.Cell>{user.role}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Content>
  </Table.ScrollContainer>
  <Table.Footer>
    <span className="text-small text-muted">3 записи</span>
  </Table.Footer>
</Table>
```

### Root props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `variant` | `default` | `default` \| `secondary` \| `toned` \| `gloss` |
| `className` | — | Root wrapper |
| `classNames` | — | Слоты |

### `Table.Content` props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `selectionMode` | `none` | `none` \| `single` \| `multiple` |
| `selectedKeys` | — | `Set` или `"all"` |
| `onSelectionChange` | — | Колбэк |
| `sortDescriptor` | — | `{ column, direction }` |
| `onSortChange` | — | Колбэк сортировки |
| `aria-label` | — | Имя таблицы |

### `TableClassNames`

`root`, `glossContent`, `scrollContainer`, `content`, `header`, `headerRow`, `column`, `columnInner`, `columnLabel`, `columnSortChevron`, `body`, `row`, `cell`, `footer`, `emptyCell`.

### Compound-подчасти

| Часть | Назначение |
|-------|------------|
| `Table.ScrollContainer` | Horizontal scroll + `tabIndex` |
| `Table.Content` | `<table>` + selection/sort context |
| `Table.Header` | `<thead>` |
| `Table.Column` | `<th>` + sort UI |
| `Table.Body` | `<tbody>` + empty state |
| `Table.Row` | `<tr>` + tone/selection |
| `Table.Cell` | `<td>` |
| `Table.Footer` | Footer bar под table |

## Variant / row tone

| Variant | Поверхность |
|---------|-------------|
| `default` | `rounded-mid border-token bg-surface overflow-clip` |
| `secondary` | Прозрачный root; header `bg-secondary` на columns |
| `toned` | `border-separate border-spacing-y-xsmall`; row strips через `tone` |
| `gloss` | `gloss-panel gloss-deep` + inner `glossContent` |

### Row `tone` (`TABLE_ROW_TONE_SURFACE`)

| tone | Фон строки |
|------|------------|
| `default` | `bg-surface` |
| `outline` | `bg-transparent border-token` |
| `secondary` | `bg-secondary` |
| `danger` / `success` / `info` / `warning` | semantic `bg-surface-tint-*` |

В `toned` variant ячейки получают `first:rounded-l-mid last:rounded-r-mid`; hover — `brightness-[0.97]`.

В `gloss` selectable rows: `hover:bg-primary-tint`, selected — `bg-primary-tint` + ring на cell.

## Анимации

`tableAnimations.tsx` — единственный GSAP-слой. Остальное — CSS hover/selection.

**DOM (sortable column):**

```
<th class=group/col>
  <span class=columnInner>
    <span class=columnLabel>Name</span>
    <TableSortChevron ref=chevron>   ← IoChevronUp, GSAP rotate
      <IoChevronUp />
```

**DOM (selectable row):**

```
<tr aria-selected class=row>         ← React state, CSS bg
  <td class=cell>                    ← ring-primary при selected (toned)
```

Нет portal, нет press squeeze на rows, нет FLIP при сортировке данных.

### 1. Sort chevron rotation

`TableSortChevron` → `useChevronRotation(descending, chevronRef)`:

**Idle:** chevron `opacity-0`, `group-hover/col:opacity-40`.

**Active sort:** `text-primary opacity-100`.

**Direction change:** GSAP rotate chevron при `sortDirection === "descending"` (иконка `IoChevronUp`).

Слот: `classNames.columnSortChevron`.

#### Кастомизация

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  interactiveDuration: 280,
  interactiveEase: "power2.out",
});
```

**Reduced motion:** rotation может быть instant внутри `useChevronRotation` при `prefers-reduced-motion`.

### 2. Row / cell hover (CSS)

| Variant | Hover |
|---------|-------|
| `default` / `secondary` / `gloss` | `hoverVariant()` на row через styles |
| `toned` | `hover:brightness-[0.97]` на cells (`motion-reduce:hover:brightness-100`) |
| `gloss` selectable | `hover:bg-primary-tint` |

Нет GSAP scale/lift на строках.

### 3. Selection state

Controlled через React (`selectedKeys`, `onSelectionChange`):

- Row: `aria-selected`, `bg-default-hover` или gloss tint
- Cell (toned): `ring-2 ring-inset ring-primary` при selected
- Checkbox column — через `selectionMode`, без fill animation

### Чего нет

- Row press squeeze
- Portal / popover motion
- Анимация reorder строк при sort (только chevron)
- Ripple

### Сводка: что настраивается где

| Анимация | Утилита | Ключи `configureMotion` | Локальный prop |
|----------|---------|---------------------------|----------------|
| Chevron rotate | `useChevronRotation` | `interactiveDuration`, `interactiveEase` | `allowsSorting` на Column |
| Row hover tint | CSS `hoverVariant` / brightness | — | `variant`, `tone` |
| Selection highlight | React + CSS | — | `selectionMode`, `selectedKeys` |

## Токены и CSS

| Класс / токен | Назначение |
|---------------|------------|
| `TABLE_ROOT_VARIANT_CLASS` | Surface per variant |
| `TABLE_COLUMN_SORTABLE_CLASS` | `cursor-pointer`, `hover:text-foreground` |
| `TABLE_COLUMN_SORT_CHEVRON_*` | Idle/active chevron opacity |
| `TABLE_ROW_SELECTED_CLASS` | `bg-default-hover` |
| `TABLE_CELL_SELECTED_RING_CLASS` | Inset ring на selected cell |
| `TABLE_FOOTER_CLASS` | `border-t-token`, flex actions row |
| `shadow-token-sm` | На default root (не 2nd level lift) |

## Стилизация и кастомизация

### Два уровня

1. **`className` на `Table`** — root wrapper (`max-w-*`, margin).
2. **`classNames` на root** — все слоты через `TableClassNamesProvider`.

Подчасти: **`className` на `Table.Column` / `Table.Row` / `Table.Cell`** поверх слота.

### Слоты `TableClassNames`

| Слот | DOM | Когда использовать |
|------|-----|-------------------|
| `root` | Outer wrapper | Border, radius, max-width container |
| `glossContent` | Gloss inner | Padding в gloss variant |
| `scrollContainer` | Scroll div | Scrollbar, horizontal padding |
| `content` | `<table>` | Border-collapse, width |
| `header` | `<thead>` | Sticky header helpers |
| `headerRow` | Header `<tr>` | Bottom border, bg strip |
| `column` | `<th>` | Header typography, padding |
| `columnInner` | Flex row label+chevron | Gap, alignment |
| `columnLabel` | Label span | Font weight, truncate |
| `columnSortChevron` | Chevron wrapper | Size/color sort icon |
| `body` | `<tbody>` | Empty state container |
| `row` | `<tr>` | Row hover, tone override |
| `cell` | `<td>` | Cell padding, text color |
| `footer` | Footer bar | Summary/actions layout |
| `emptyCell` | Empty placeholder td | Centered empty message |

### Compound table (sort + selection)

```tsx
<Table
  variant="default"
  classNames={{
    root: "rounded-mid border border-info/25 shadow-token-sm",
    headerRow: "bg-info/10",
    column: "text-info font-semibold",
    columnSortChevron: "text-info",
    row: "hover:bg-info/5",
    cell: "text-foreground/90",
    footer: "bg-info/5",
  }}
  className="max-w-2xl"
>
  <Table.ScrollContainer>
    <Table.Content
      aria-label="Команда"
      selectionMode="multiple"
      selectedKeys={selected}
      onSelectionChange={setSelected}
      sortDescriptor={sort}
      onSortChange={setSort}
    >
      <Table.Header>
        <Table.Column id="name" isRowHeader allowsSorting>Имя</Table.Column>
        <Table.Column id="role" allowsSorting>Роль</Table.Column>
      </Table.Header>
      <Table.Body>
        {users.map((user) => (
          <Table.Row key={user.id} id={user.id}>
            <Table.Cell>{user.name}</Table.Cell>
            <Table.Cell>{user.role}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Content>
  </Table.ScrollContainer>
  <Table.Footer>
    <span className="text-small text-muted">3 записи</span>
  </Table.Footer>
</Table>
```

### Toned rows с semantic tone

```tsx
<Table variant="toned" classNames={{ row: "cursor-pointer" }}>
  <Table.ScrollContainer>
    <Table.Content aria-label="Статусы">
      <Table.Header>...</Table.Header>
      <Table.Body>
        <Table.Row id="1" tone="danger">
          <Table.Cell>Ошибка синхронизации</Table.Cell>
        </Table.Row>
        <Table.Row id="2" tone="success">
          <Table.Cell>Готово</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Content>
  </Table.ScrollContainer>
</Table>
```

### Практические заметки

- **`Table.ScrollContainer` обязателен** для horizontal overflow на узких экранах (`tabIndex={0}`).
- **Sort:** `allowsSorting` + controlled `sortDescriptor` / `onSortChange`; без них chevron decorative.
- **`isRowHeader`** на первой колонке — screen reader row headers.
- **`renderEmptyState` на `Table.Body`** — кастом empty UI (`emptyCell` слот).
- **Gloss:** children table внутри `glossContent` автоматически; не дублируйте `gloss-panel` в `classNames.root`.
- **Не задавайте `transform` на `columnSortChevron`** — конфликт с GSAP rotate.
- **Порядок мержа:** variant styles → `classNames.slot` → `className` подчасти.

## Интеграции

| Компонент | Сценарий |
|-----------|----------|
| `Pagination` | Paging под table footer |
| `Checkbox` | Selection UI (via selectionMode) |
| `Badge` | Status в cells |

## Доступность

- `Table.Content`: `aria-label` на `<table>`
- Sortable columns: `aria-sort`
- Selected rows: `aria-selected`
- Row header column: `isRowHeader`
- Scroll container: `tabIndex={0}` для keyboard scroll

## Структура файлов

```
Table/
├── Table.tsx
├── index.ts
├── tableTypes.ts
├── tableStyles.ts
├── tableAnimations.tsx       # TableSortChevron
├── tableParts.tsx
├── useTableRootState.ts
├── useTableContentState.ts
├── tableContext.tsx
├── tableAPI.ts
├── tableA11y.ts
└── Table.stories.tsx
```

## Storybook

`Core Components/Table` — variants, sort, selection, tones, gloss, empty state, `classNames`.
