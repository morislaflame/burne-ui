# Calendar

Календарь выбора дат: **single**, **range**, **multiple**. Views: days → months → years. Compound default content или кастомная разметка через `Header` / `Grid` / `Footer`.

## Импорт

```tsx
import { Calendar, RU_LOCALE, useCalendar, type CalendarProps, type CalendarMode, type CalendarView, type CalendarVariant, type CalendarSize, type CalendarRangeValue, type CalendarLocale, type CalendarClassNames, type CalendarMotion, type CalendarPartMotion } from "burne-ui";
```

## API

### Simple (default content)

```tsx
<Calendar
  mode="single"
  defaultValue={new Date()}
  onValueChange={setDate}
/>
```

### Range

```tsx
<Calendar
  mode="range"
  defaultValue={{ start: null, end: null }}
  onValueChange={setRange}
/>
```

### Compound

```tsx
<Calendar mode="range" variant="outline" size="base" locale={RU_LOCALE}>
  <Calendar.Header />
  <Calendar.Grid />
  <Calendar.Footer />
</Calendar>
```

Если `children` не переданы — рендерится `CalendarDefaultContent`.

### Common props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `variant` | `default` | `default` \| `secondary` \| `outline` \| `gloss` |
| `size` | `base` | `small` \| `base` \| `mid` \| `large` |
| `defaultMonth` | today | Начальный месяц view |
| `initialView` | `days` | `days` \| `months` \| `years` |
| `locale` | built-in RU | Weekdays, months, Today/Clear labels |
| `minDate` / `maxDate` | — | Ограничения выбора |
| `classNames` | — | Слоты |

### Mode-specific value

| Mode | `value` / `onValueChange` |
|------|---------------------------|
| `single` | `Date \| null` |
| `range` | `CalendarRangeValue` (`start`, `end`) |
| `multiple` | `Date[]` |

### `CalendarClassNames`

`root`, `glossContent`, `header`, `navPrev`, `navNext`, `headerTitle`, `grid`, `weekdayGrid`, `weekdayCell`, `daysGrid`, `dayCellWrapper`, `rangeHalfFill`, `dayCell`, `monthsGrid`, `monthCell`, `yearsGrid`, `yearCell`, `cell`, `cellFill`, `cellText`, `cellTodayDot`, `footer`, `footerToday`, `footerClear`.

### Compound-подчасти

| Часть | Назначение |
|-------|------------|
| `Calendar.Header` | Nav prev/next + title (drill-up view) |
| `Calendar.Grid` | Weekdays + day/month/year cells |
| `Calendar.Footer` | Today / Clear actions |

### `useCalendar()`

Hook из context: `view`, `viewDate`, `selectedDates`, `rangeStart`/`rangeEnd`, `onDayPress`, `onClear`, `onToday`, и др.

## variant и размеры

| variant | Поверхность root |
|---------|------------------|
| `default` | `rounded-large border-token bg-surface shadow-token-sm` |
| `secondary` | `bg-secondary` |
| `outline` | `bg-transparent border-token` |
| `gloss` | `gloss-panel gloss-deep` + `glossContent` |

| size | `min-w` | root padding | day cell |
|------|---------|--------------|----------|
| `small` | `15.5rem` | `p-small` | `max-w-control-small` |
| `base` | `18rem` | `p-large` | `max-w-control-base` |
| `mid` | `21rem` | `p-large` | `max-w-control-mid` |
| `large` | `24rem` | `p-xlarge` | `max-w-control-large` |

Nav buttons: `CALENDAR_NAV_BTN` per size. Weekday labels — uppercase muted `weekdayCell`.

## Поведение

- Click title в header — switch view: `days` → `months` → `years`
- Range mode: hover preview + half-fill между `rangeStart` и hover/current day
- Disabled days вне `minDate`/`maxDate` — `aria-disabled`, без handlers
- `RU_LOCALE` экспортируется; кастомный `locale` для других языков
- `useCalendar()` — доступ к state из compound children

## Анимации

Публичный slot motion. Root — Provider с defaults для `navPrev` / `navNext`. Ячейки — nested scope слота `cell`. Fill выбранного дня (`useToggleButtonFillAnimation`) и range half-fill GSAP — kit-internal.

### Slot motion

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `navPrev` / `navNext` | hover/press | `hoverLiftFirstLevel` (без тени) + `pressSqueeze` (`pressOut: false`) |
| `cell` | hover/press | то же |

`false` на hover — skip без kill. Compound: `motion` на `Calendar.NavPrev` / `Calendar.NavNext`.

**Где в коде:** типы — `calendarTypes.ts`; scope — `calendarContext.tsx`; defaults — `calendarAnimations.ts`; слоты — `calendarParts.tsx`; Provider — `Calendar.tsx`.

```tsx
<Calendar motion={{ cell: { hoverIn: false, hoverOut: false } }} />
```

## Токены и CSS

| Класс / токен | Назначение |
|---------------|------------|
| `CALENDAR_ROOT_SURFACE` | Variant backgrounds + `shadow-token-sm` |
| `CALENDAR_RANGE_HALF_FILL_CLASS` | `absolute inset-y-0 bg-default-hover` |
| `CALENDAR_HEADER_TITLE_INTERACTIVE_CLASS` | Drill-up title hover |
| `CALENDAR_CELL_FILL_CLASS` | Fill layer под текстом дня |
| `CALENDAR_CELL_TODAY_DOT_CLASS` | Marker «сегодня» |
| `gloss-panel gloss-deep` | Gloss variant shell |
| `max-w-control-*` | Square day/month/year hit targets |

## Стилизация и кастомизация

### Два уровня

1. **`className` на `Calendar`** — root panel (`calendarRootClass`).
2. **`classNames` на root** — header, grid, cells, footer через provider.

Compound-подчасти (`Header`, `Grid`, `Footer`) не принимают отдельный `classNames` prop — только root `classNames` + context.

### Слоты `CalendarClassNames`

| Слот | DOM | Когда использовать |
|------|-----|-------------------|
| `root` | Root panel | Outer border, custom min-width |
| `glossContent` | Gloss inner flex | Padding в gloss variant |
| `header` | Header row | Gap nav/title |
| `navPrev` / `navNext` | Nav buttons | Icon button size/color |
| `headerTitle` | Title button | Month/year label typography |
| `grid` | Grid container | Vertical rhythm |
| `weekdayGrid` / `weekdayCell` | Weekday row | Muted labels, uppercase |
| `daysGrid` | 7-column grid | Gap between weeks |
| `dayCellWrapper` | Cell + range bands | Position relative для half-fill |
| `rangeHalfFill` | Range band | Custom range preview color |
| `dayCell` | Day button | Radius, aspect ratio |
| `monthCell` / `yearCell` | Picker cells | Month/year view buttons |
| `cell` | Shared cell shell | Общие стили всех cell kinds |
| `cellFill` | Fill span | Selected bg shape (не transform!) |
| `cellText` | Day number Text | Font size per size |
| `cellTodayDot` | Today marker | Dot color/position |
| `footer` | Footer row | Today/Clear layout |
| `footerToday` / `footerClear` | Action buttons | Link-style actions |

### Simple (default content)

```tsx
<Calendar
  mode="single"
  variant="outline"
  size="base"
  defaultValue={new Date()}
  classNames={{
    root: "border-primary/30 shadow-token-md",
    dayCell: "rounded-full",
    cellFill: "rounded-full bg-primary",
  }}
/>
```

### Compound range с кастомными слотами

```tsx
<Calendar
  mode="range"
  locale={RU_LOCALE}
  classNames={{
    root: "rounded-large border-primary/30 bg-primary/5 shadow-token-md",
    headerTitle: "font-semibold text-primary",
    weekdayCell: "text-primary/70 uppercase tracking-wide",
    dayCell: "rounded-full",
    cellFill: "rounded-full bg-primary",
    rangeHalfFill: "bg-primary/15",
    footerToday: "text-primary font-medium",
    footerClear: "text-muted hover:text-foreground",
  }}
>
  <Calendar.Header />
  <Calendar.Grid />
  <Calendar.Footer />
</Calendar>
```

Controlled range для форм:

```tsx
const [range, setRange] = useState<CalendarRangeValue>({ start: null, end: null });

<Calendar mode="range" value={range} onValueChange={setRange} />
```

### Практические заметки

- **Без `children`** рендерится `CalendarDefaultContent` (Header + Grid + Footer).
- **`locale`:** экспорт `RU_LOCALE`; для EN передайте свой объект labels/weekdays.
- **`variant="gloss"`:** content в `glossContent`; стили panel на root.
- **`minDate` / `maxDate`:** disabled cells не focusable, без press handlers.
- **Range hover preview:** half-fill bands управляются context; не удаляйте `dayCellWrapper` positioning.
- **Не override `cellFill` transform** — fill animation из ToggleButton util.
- **Порядок мержа:** size/variant tokens → `classNames.slot` → per-cell `className` (если API добавит).

## Интеграции

| Компонент | Сценарий |
|-----------|----------|
| `DateField` / forms | Embedded picker |
| `Popover` | Calendar в dropdown panel |
| `ToggleButton` | Shared fill animation util |

## Доступность

- Nav buttons: `aria-label` (back/forward)
- Day grid: `role="grid"` / `row` / `columnheader` / `gridcell` (APG Date Picker)
- Cells: `aria-label` с полной датой; `aria-selected` на `gridcell`
- Roving `tabIndex`: одна tab-остановка в сетке дней
- Keyboard (days): ←/→ ±день, ↑/↓ ±неделя, Home/End — границы недели, PageUp/Down ±месяц (Shift — ±год), Enter/Space — выбор
- Months / years: тот же grid-паттерн + стрелки по ячейкам
- Disabled cells: не focusable
- Footer: Today / Clear как buttons

## Структура файлов

```
Calendar/
├── Calendar.tsx
├── index.ts
├── calendarTypes.ts
├── calendarStyles.ts
├── calendarAnimations.ts
├── calendarParts.tsx
├── useCalendarRootState.ts
├── calendarContext.tsx
├── calendarAPI.ts
├── calendarA11y.ts
├── calendarLocale.ts
└── Calendar.stories.tsx
```

## Storybook

`Core Components/Calendar` — single/range/multiple, sizes, variants, views, gloss, `classNames`.
