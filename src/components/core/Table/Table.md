# Table

Таблица данных с compound API: scroll container, header/columns, body/rows, footer. Поддерживает **sort**, **selection**, row `tone`, variants включая `gloss`.

## Импорт

```tsx
import { Table, TABLE_ROW_TONE_SURFACE, type TableProps, type TableVariant, type TableClassNames, type TableContentProps, type SortDescriptor, type SelectionMode } from "burne-ui";
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
| `motionController` | — | Handle с `createMotionController()` / `useMotionControllerHandle()`, не на DOM. Не `Table.Row` |

### `Table.Content` props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `selectionMode` | `none` | `none` \| `single` \| `multiple` |
| `selectedKeys` | — | Controlled: `Set` или `"all"` |
| `defaultSelectedKeys` | `∅` | Uncontrolled начальный selection |
| `onSelectionChange` | — | Колбэк |
| `sortDescriptor` | — | Controlled: `{ column, direction }` |
| `defaultSortDescriptor` | — | Uncontrolled начальная сортировка |
| `onSortChange` | — | Колбэк сортировки |
| `aria-label` | — | Имя таблицы |

### `TableClassNames`

`root`, `scrollContainer`, `content`, `header`, `headerRow`, `column`, `columnInner`, `columnButton`, `columnLabel`, `columnSortIcon`, `body`, `row`, `cell`, `footer`, `caption`, `emptyCell`.

### Compound-подчасти

| Часть | Назначение |
|-------|------------|
| `Table.ScrollContainer` | Horizontal scroll; `tabIndex` только по необходимости |
| `Table.Content` | Элемент `<table>` + selection/sort context. **Доменное исключение имени `Content`:** здесь это не «тело панели» (`Popover.Content` / `Dialog.Content`) и не текстовая колонка (`Toast.Content` / `Alert.Content`), а именно table-host. |
| `Table.Header` | `<thead>` |
| `Table.HeaderRow` | `<tr>` в header (`className` / `ref`); если не передан — Header оборачивает колонки сам |
| `Table.Column` | `<th>` + sort UI |
| `Table.Label` | Текст заголовка колонки (`className` / `ref` / `motion`); simple children Column оборачиваются автоматически. Слот `classNames.columnLabel`; motion-слот `label`. Это не имя таблицы |
| `Table.Caption` | `<caption>` — имя таблицы. Слот `classNames.caption`; motion-слот `caption` |
| `Table.Body` | `<tbody>` + empty state |
| `Table.Empty` | `<td>` empty placeholder; motion-слот `empty`, CSS `classNames.emptyCell` |
| `Table.Row` | `<tr>` + tone/selection; вложенный motion scope (`motionController`, `playSlot("row")`) |
| `Table.Cell` | `<td>` |
| `Table.Footer` | Footer bar под table |

## Variant / row tone

| Variant | Поверхность |
|---------|-------------|
| `default` | `rounded-large border-token bg-surface overflow-clip` |
| `secondary` | Прозрачный root; header `bg-secondary` на columns |
| `toned` | `border-separate border-spacing-y-xsmall`; row strips через `tone` |
| `gloss` | `gloss-panel gloss-deep` + inner `glossContent` |

`toned` — **доменное исключение** `variant`: несводимая структура (полосы строк через `tone`), не канонический fill `default | outline | secondary | gloss`.

### Row `tone` (`TABLE_ROW_TONE_SURFACE`)

| tone | Фон строки |
|------|------------|
| `default` | `bg-surface` |
| `outline` | `bg-transparent border-token-outline` |
| `secondary` | `bg-secondary` |
| `danger` / `success` / `info` / `warning` | semantic `bg-surface-tint-*` |

В `toned` variant ячейки получают `first:rounded-s-mid last:rounded-e-mid`; hover — `brightness-[0.97]`.

В `gloss` selectable rows: `hover:bg-primary-tint`, selected — `bg-primary-tint` + ring на cell.

## Границы

Table рисует строки, которые ему передали. Сортировка и выбор — состояние на `Table.Content`. Сами данные режет родитель.

- Страницы — `Pagination` в `Table.Footer`. Родитель отдаёт в `Table.Body` срез текущей страницы. Диапазон (`Pagination.Summary`) слева, кнопки справа, одной строкой на ширину таблицы.
- Ширина колонки — `className` на `Table.Column` и `Table.Cell`. Ручки resize нет: ширина это раскладка, не состояние таблицы.
- Выравнивание — `text-start` у заголовка и ячеек. `className="text-center"` или `text-end` на `Table.Column` и на `Table.Cell` того же столбца (или слоты `classNames.column` / `classNames.cell`) меняет оба.
- Раскрытие строки — вторая `Table.Row` или `Expandable` в ячейке. Своего `expanded` у Table нет.

## Анимации

### Slot motion

| Слоты | Фазы | Дефолт |
|-------|------|--------|
| `root`, `scrollContainer`, `content`, `header`, `headerRow`, `body`, `footer`, `caption`; nested `row`; `column` / `cell` / `label` / `empty` (repeated slots, multi-instance) | `enter` (opt-in); row `check` / `uncheck` on selection | empty |

`glossContent` не слот motion. `emptyCell` — CSS для `Table.Empty` (слот `empty`). Поворот sort chevron — слот `columnSortIcon`, фазы `enter` / `leave`, рецепт `chevronRotate`.

`enter` — mount (`useOptionalEnterOnMount`, в том числе у изначально выбранной строки). Selection после mount — `check` / `uncheck` (`skipFirst`, не второй `enter`). `column` / `label` — repeated на scope таблицы; `cell` — repeated на nested row scope (`part.targetRef`).

`false` на фазе — skip без kill и без смены визуала (`enter: false` оставляет таблицу видимой). Enter factory — `opacity` + transform, не `autoAlpha`. Не анимируйте layout (`width` / `height` / `top` / `left` / `margin`) в публичных MotionVars. Кастомный `motion` — opt-in: без пропа дефолтный вид не меняется. Пользовательские `onPointerOver` / `Out` / `Down` / `Up` **мержатся** с motion (не заменяют).

`play()` ищет слот `root` у Table. `playSlot("header")` / `playAll` — chrome (`scrollContainer` / `content` / `header` / `body` / `footer` …) и **repeated** `column` / `label` на том же scope. `Table.Row` создаёт **вложенный** scope: свой `motionController`, `playSlot("row")` (своего `root` нет); `cell` — repeated на scope строки. Один handle ≠ два scope.

Проп `motionController` + ключ `events` на `motion` — app-команды (`table:nudge`, `table:scan`), не фазы. `createMotionEvents`. `waitForComplete` / `cancel` — playground / Storybook **MotionController**. `useMotionController()` в sibling-части (галерея Inside) видит Table; внутри `Table.Row` — scope строки.

```tsx
import { Button, Table, createMotionEvents, useMotionControllerHandle } from "burne-ui";

const events = createMotionEvents({
  "table:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1 },
});

function Nudge() {
  const controller = useMotionControllerHandle();
  return (
    <>
      <Button size="small" variant="outline" onClick={() => controller.play("table:nudge")}>
        Nudge
      </Button>
      <Table motionController={controller} motion={{ events }}>
        <Table.ScrollContainer>
          <Table.Content aria-label="Crew">
            <Table.Header>
              <Table.Column isRowHeader>Name</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row id="ada">
                <Table.Cell>Ada</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </>
  );
}
```


`tableAnimations.tsx` — единственный GSAP-слой. Остальное — CSS hover/selection.

**DOM (sortable column):**

```
<th aria-sort class=group/col>
  <button type=button class=sortButton>   ← APG: focusable control
    <Table.Label>Name</Table.Label>
    <TableSortChevron />
```

**DOM (selectable row):**

```
<table role=grid aria-multiselectable?>   ← при selectionMode ≠ none
  <tr role=row aria-selected tabIndex=0>
    <td role=gridcell>
```

Нет portal, нет press squeeze на rows, нет FLIP при сортировке данных.

### 1. Sort chevron rotation

`TableSortChevron` → `useChevronRotation(descending, chevronRef)`:

**Idle:** chevron `opacity-0`, `group-hover/col:opacity-40`.

**Active sort:** `text-primary opacity-100`.

**Direction change:** GSAP rotate chevron при `sortDirection === "descending"` (иконка `IoChevronUp`).

Слот: `classNames.columnSortIcon`.

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

Controlled / uncontrolled через React (`selectedKeys` / `defaultSelectedKeys`, `onSelectionChange`):

- Per-row `isSelected` / roving focus — через external store + `useSyncExternalStore` (ре-рендер только строк, у которых изменился флаг), не через общий context value с `selectedKeys`
- `Table.Row` / `Table.Cell` — `memo`
- Row: `aria-selected` (в `role="grid"`), `bg-default-hover` или gloss tint
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
| Selection highlight | Store + CSS | — | `selectionMode`, `selectedKeys` |

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

Подчасти: **`className` на `Table.Column` / `Table.Label` / `Table.Row` / `Table.Cell`** поверх слота.

```tsx
<Table.Column isRowHeader>
  <Table.Label className="text-primary font-semibold">Name</Table.Label>
</Table.Column>
```

### Слоты `TableClassNames`

| Слот | DOM | Когда использовать |
|------|-----|-------------------|
| `root` | Outer wrapper | Border, radius, max-width container |
| `scrollContainer` | Scroll div | Scrollbar, horizontal padding |
| `content` | `<table>` | Border-collapse, width |
| `header` | `<thead>` | Sticky header helpers |
| `headerRow` | Header `<tr>` (`Table.HeaderRow`) | Bottom border, bg strip |
| `column` | `<th>` | Header typography, padding |
| `columnInner` | Flex row label+chevron | Gap, alignment. Общий для кнопки сортировки и статичного span |
| `columnButton` | Кнопка сортировки | Только `allowsSorting` |
| `columnLabel` | `Table.Label` | Font weight, color, truncate |
| `columnSortIcon` | Chevron wrapper | Size/color sort icon |
| `body` | `<tbody>` | Empty state container |
| `row` | `<tr>` | Row hover, tone override |
| `cell` | `<td>` | Cell padding, text color |
| `footer` | Footer bar | Summary/actions layout |
| `caption` | `<caption>` | Подпись таблицы |
| `emptyCell` | Empty placeholder td | Centered empty message |

### Compound table (sort + selection)

```tsx
<Table
  variant="default"
  classNames={{
    root: "rounded-large border border-info/25 shadow-token-sm",
    headerRow: "bg-info/10",
    column: "text-info font-semibold",
    columnSortIcon: "text-info",
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

- **`Table.ScrollContainer`** — для horizontal overflow; не ставьте `tabIndex={0}` по умолчанию (перехватывает Tab). Нужен keyboard-scroll без интерактива внутри — передайте `tabIndex={0}` явно.
- **Sort:** `allowsSorting` + `sortDescriptor` / `defaultSortDescriptor` / `onSortChange`; без `allowsSorting` chevron decorative.
- **`isRowHeader`** на первой колонке — screen reader row headers.
- **`renderEmptyState` на `Table.Body`** — кастом empty UI. Для motion слота `empty` верните `<Table.Empty>` (CSS — `classNames.emptyCell`).
- **`virtualized` на `Table.Body`** — вместе с `items` и render-функцией. Скролл — ближайший предок с `overflow-y: auto` (`Table.ScrollContainer` + max-height). Строки одной высоты. Заголовок колонок остаётся сверху (`sticky`).
- **Края при скролле:** `Table.ScrollContainer` не тянется elastic overscroll (`overscroll-none`), ячейки не отрываются от рамки на macOS и iOS.
- **Gloss:** children table внутри `glossContent` автоматически; не дублируйте `gloss-panel` в `classNames.root`.
- **Не задавайте `transform` на `columnSortIcon`** — конфликт с GSAP rotate.
- **Порядок мержа:** variant styles → `classNames.slot` → `className` подчасти.

## Интеграции

| Компонент | Сценарий |
|-----------|----------|
| `Pagination` | Paging под table footer |
| `Checkbox` | Selection UI (via selectionMode) |
| `Badge` | Status в cells |

## Доступность

- `Table.Content`: `aria-label` на `<table>`, либо `Table.Caption` (`<caption>`)
- `Table.Label` — подпись колонки, не имя таблицы
- Sortable columns: `aria-sort` на `<th>` + `<button>` (Tab / Enter/Space; ←/→ между кнопками сортировки)
- Selection: `role="grid"` (+ `aria-multiselectable` при multiple); rows — `role="row"` + `aria-selected`; roving `tabIndex` (одна tab-остановка) + ↑/↓ / Home/End; Enter/Space — выбор
- Cells: `role="gridcell"` при selection
- Row header column: `isRowHeader`
- Scroll container: без tab-stop по умолчанию (опционально `tabIndex={0}` для scroll-only)

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

`Core Components/Table` — variants, sort, selection, tones, gloss, empty state, `classNames`, slot motion gallery.
