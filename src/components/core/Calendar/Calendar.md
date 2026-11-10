# Calendar

Календарь выбора дат: **single**, **range**, **multiple**. Views: days → months → years. Compound default content или кастомная разметка через `Header` / `Grid` / `Footer`.

Стекло — пакет `burne-ui-skin-gloss`, не вариант кита. Подключение и классы — [docs/SKINS.md](../../../../docs/SKINS.md).

## Импорт

```tsx
import { Calendar, EN_LOCALE, createCalendarLocale, useCalendar, type CalendarProps, type CalendarMode, type CalendarView, type CalendarVariant, type CalendarSize, type CalendarRangeValue, type CalendarLocale, type CalendarClassNames, type CalendarMotion, type CalendarPartMotion } from "burne-ui";
```

## API

### Simple (default content)

```tsx
<Calendar
  selectionMode="single"
  defaultValue={new Date()}
  onValueChange={setDate}
/>
```

### Range

```tsx
<Calendar
  selectionMode="range"
  defaultValue={{ start: null, end: null }}
  onValueChange={setRange}
/>
```

### Compound

```tsx
<Calendar selectionMode="range" variant="outline" size="base" locale="ru">
  <Calendar.Header />
  <Calendar.Grid />
  <Calendar.Footer />
</Calendar>
```

Если `children` не переданы — рендерится `CalendarDefaultContent`.

### Common props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `selectionMode` | `single` | `single` \| `range` \| `multiple`. `range` — доменное значение календаря |
| `variant` | `default` | `default` \| `secondary` \| `outline` |
| `size` | `base` | `small` \| `base` \| `mid` \| `large` |
| `defaultMonth` | today | Начальный месяц view |
| `month` / `onMonthChange` | — | Контролируемый видимый месяц. Без них — `defaultMonth` |
| `view` / `defaultView` / `onViewChange` | `days` | `days` \| `months` \| `years` |
| `locale` | `EN_LOCALE` (`en-GB`) | BCP 47 tag or `createCalendarLocale()` — weekdays, months, Today/Clear |
| `previousIcon` / `nextIcon` | chevron | Замена шеврона. `null` прячет иконку. Motion-слоты остаются `navPrevIcon` / `navNextIcon` |
| `minDate` / `maxDate` | — | Ограничения выбора |
| `classNames` | — | Слоты |
| `motionController` | — | Handle с `createMotionController()` / `useMotionControllerHandle()`, не на DOM. Не `Calendar.Day` |

### Mode-specific value

| `selectionMode` | Значение |
|-----------------|----------|
| `single` | `value` / `onValueChange`: `Date \| null` |
| `range` | `value` / `onValueChange`: `CalendarRangeValue` (`start`, `end`) |
| `multiple` | `values` / `defaultValues` / `onValuesChange`: `Date[]` |

### `CalendarClassNames`

`root`, `header`, `navPrev`, `navNext`, `navIconWrap`, `navIcon`, `title`, `grid`, `weekdayGrid`, `weekdayCell`, `daysGrid`, `dayCellWrapper`, `dayEmpty`, `rangeHalfFill`, `day`, `monthsGrid`, `monthCell`, `yearsGrid`, `yearCell`, `cell`, `cellFill`, `cellText`, `cellTodayDot`, `footer`, `footerToday`, `footerClear`.

### Compound-подчасти

| Часть | Назначение |
|-------|------------|
| `Calendar.Header` | Nav prev/next + title (drill-up view) |
| `Calendar.Grid` | Weekdays + day/month/year cells |
| `Calendar.Footer` | Today / Clear actions |
| `Calendar.Title` | Drill-up month/year control |
| `Calendar.NavPrev` / `NavNext` | Навигация месяца |
| `Calendar.Day` | Ячейка дня. Пропы `today`, `current`, нативный `aria-label`. Nested motion scope (`motionController`, `playSlot("cell")`) |

### `useCalendar()`

Hook из context: `view`, `viewDate`, `selectedDates`, `rangeStart`/`rangeEnd`, `onDayPress`, `onClear`, `onToday`, и др.

## variant и размеры

Канонический visual style. Доменных исключений нет.

| variant | Поверхность root |
|---------|------------------|
| `default` | `rounded-large border-token bg-surface`. Тень в покое (`--shadow-base`) и больше при наведении |
| `secondary` | `bg-secondary` |
| `outline` | `bg-transparent border-token` |

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
- Дефолт `EN_LOCALE` (`en-GB`). `locale="ru"` или `createCalendarLocale("ru")` — имена из Intl, Today/Clear по языку
- `useCalendar()` — доступ к state из compound children

## Анимации

Публичный slot motion. Root — Provider с defaults для `navPrev` / `navNext`. Ячейки — nested scope слота `cell`. `cellFill` играет `selectionFill` (`check` / `uncheck`). `rangeHalfFill` играет `contentFade`.

### Slot motion

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `root` | `hoverIn` / `hoverOut` | `hoverLiftSecondLevel`, `params.liftScale` = 1, `params.shadowSize` = `base`. `motion.root.hoverIn` подменяет hover панели |
| `navPrev` / `navNext` | hover/press | `hoverLiftFirstLevel` (без тени) + `pressSqueeze` (`pressOut: false`) |
| `navPrevIcon` / `navNextIcon` | hover/press / `enter` | нет |
| `header` / `title` / `grid` / `footer` | `enter` / hover/press | нет |
| `footerToday` / `footerClear` | `enter` / hover/press (opt-in) | empty; kit buttons в Footer |
| `cell` | hover/press | то же, что nav (nested scope) |
| `cellText` | hover/press / `enter` | нет; nested cell scope |

`false` на hover — skip без kill. Compound: `motion` на `Calendar.NavPrev` / `Calendar.NavNext` / `Calendar.Header` / `Calendar.Footer`. `cellText` — nested cell scope. Иконки навигации — слоты `navPrevIcon` / `navNextIcon` (не `classNames.navIcon`).

`root` играет hover панели (`hoverLiftSecondLevel`, масштаб 1). `playSlot("header")` / `playAll` — chrome (`header` / `navPrev` / `grid` / `footer` …), не nested ячейки. Каждая ячейка — **вложенный** scope: свой `motionController` на `Calendar.Day`, `playSlot("cell")` / `playSlot("cellText")`. Один handle ≠ два scope. Fill дня и range half-fill не слоты.

Проп `motionController` + ключ `events` на `motion` — app-команды (`calendar:nudge`, `calendar:scan`), не фазы. `createMotionEvents`. `waitForComplete` / `cancel` — playground / Storybook **MotionController**. `useMotionController()` в sibling-части (галерея Inside на `Calendar.Footer`) видит Calendar; внутри `Calendar.Day` — scope ячейки.

Тройка на корне и на интерактивной ячейке (`Calendar.Day`, месяц, год). `motionState`, `motionPayload` и `playInitialState` не попадают на DOM. Смена `motionState` играет `motion.states[имя]`; то же имя ещё раз — тишина. `motionPayload` — снимок для фабрики (`ctx.payload`, `createMotionFactory`); без смены режима не переигрывает. `playInitialState` по умолчанию выключен: на маунте режим не играет.

```tsx
import { Button, Calendar, createMotionEvents, useMotionControllerHandle } from "burne-ui";

const events = createMotionEvents({
  "calendar:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1 },
});

function Nudge() {
  const controller = useMotionControllerHandle();
  return (
    <>
      <Button size="small" variant="outline" onClick={() => controller.playSlot("header", "calendar:nudge")}>
        Nudge
      </Button>
      <Calendar motionController={controller} motion={{ events }}>
        <Calendar.Header />
        <Calendar.Grid />
      </Calendar>
    </>
  );
}
```

**Где в коде:** типы — `calendarTypes.ts`; scope — `calendarContext.tsx`; defaults — `calendarAnimations.ts`; слоты — `calendarParts.tsx`; Provider — `Calendar.tsx`.

```tsx
<Calendar motion={{ cell: { hoverIn: false, hoverOut: false } }} />
```

## Токены и CSS

| Класс / токен | Назначение |
|---------------|------------|
| `CALENDAR_ROOT_SURFACE` | Фоны вариантов. Тень панели — `--shadow-base` в покое, больше при наведении; масштаб панели не меняется |
| `CALENDAR_RANGE_HALF_FILL_CLASS` | `absolute inset-y-0 bg-default-hover` |
| `CALENDAR_HEADER_TITLE_INTERACTIVE_CLASS` | Drill-up title hover |
| `CALENDAR_CELL_FILL_CLASS` | Fill layer под текстом дня |
| `CALENDAR_CELL_TODAY_DOT_CLASS` | Marker «сегодня» |
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
| `header` | Header row | Gap nav/title |
| `navPrev` / `navNext` | Nav buttons | Icon button size/color |
| `navIconWrap` | Обёртка дефолтного шеврона | Размер hit-иконки |
| `navIcon` | Дефолтный шеврон | Цвет иконки |
| `title` | Title button | Month/year label typography |
| `grid` | Grid container | Vertical rhythm |
| `weekdayGrid` / `weekdayCell` | Weekday row | Muted labels, uppercase |
| `daysGrid` | 7-column grid | Gap between weeks |
| `dayCellWrapper` | Cell + range bands | Position relative для half-fill |
| `dayEmpty` | Пустая ячейка вне месяца | Отступ сетки |
| `rangeHalfFill` | Range band | Custom range preview color |
| `day` | Day button | Radius, aspect ratio |
| `monthsGrid` | Сетка месяцев | Раскладка month view |
| `yearsGrid` | Сетка лет | Раскладка year view |
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
  selectionMode="single"
  variant="outline"
  size="base"
  defaultValue={new Date()}
  classNames={{
    root: "border-primary/30 shadow-token-md",
    day: "rounded-full",
    cellFill: "rounded-full bg-primary",
  }}
/>
```

### Compound range с кастомными слотами

```tsx
<Calendar
  selectionMode="range"
  locale="ru"
  classNames={{
    root: "rounded-large border-primary/30 bg-primary/5 shadow-token-md",
    title: "font-semibold text-primary",
    weekdayCell: "text-primary/70 uppercase tracking-wide",
    day: "rounded-full",
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

<Calendar selectionMode="range" value={range} onValueChange={setRange} />
```

### Практические заметки

- **Без `children`** рендерится `CalendarDefaultContent` (Header + Grid + Footer).
- **`locale`:** дефолт `EN_LOCALE` (`en-GB`). Тег (`"ru"`) или объект из `createCalendarLocale`.
- **`minDate` / `maxDate`:** disabled cells не focusable, без press handlers.
- **Range hover preview:** half-fill bands управляются context; не удаляйте `dayCellWrapper` positioning.
- **Не override `cellFill` transform** — заливка идёт через `selectionFill` (`check` / `uncheck`). Полоса диапазона `rangeHalfFill` — `contentFade`.
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
- Пустая ячейка вне месяца: `gridcell` с `aria-hidden`, без имени. Это отступ сетки, не день
- Roving `tabIndex`: одна tab-остановка в сетке дней
- Keyboard (days): ←/→ ±день, ↑/↓ ±неделя, Home/End — границы недели, PageUp/Down ±месяц (Shift — ±год), Enter/Space — выбор
- Months / years: тот же grid-паттерн + стрелки по ячейкам
- Disabled cells: не focusable
- Footer: Today / Clear как buttons
- Forced colors (Windows HCM): selected/pressed cell fill — `Highlight` (`data-selection-fill` + `data-pressed`)

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

`Core Components/Calendar` — single/range/multiple, sizes, variants, views, `classNames`, slot motion gallery, MotionController.

## Даты

`isDateUnavailable(date)` оставляет день в сетке и запрещает выбор. День получает `disabled`.
