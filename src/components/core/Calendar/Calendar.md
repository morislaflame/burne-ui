# Calendar

Календарь выбора дат: **single**, **range**, **multiple**. Views: days → months → years. Compound default content или кастомная разметка через `Header` / `Grid` / `Footer`.

## Импорт

```tsx
import { Calendar, RU_LOCALE, useCalendar, type CalendarProps, type CalendarMode, type CalendarView, type CalendarVariant, type CalendarSize, type CalendarRangeValue, type CalendarLocale, type CalendarClassNames } from "burne-ui";
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

`calendarAnimations.ts` + `useToggleButtonFillAnimation` из ToggleButton utils.

**DOM (day cell):**

```
<div class=dayCellWrapper>             ← range half-fill bands (absolute)
  <CalendarRangeHalfFill side=left|right />
  <button class=dayCell ref=btn>       ← hover lift + squeeze
    <span class=cellFill ref=fill />   ← GSAP fill при selected
    <Text class=cellText>12</Text>
    <span class=cellTodayDot />        ← today marker
```

**DOM (nav):**

```
<Calendar.Header>
  <button class=navPrev ref>           ← hover lift + squeeze
  <button class=headerTitle>           ← drill-up view (CSS hover only)
  <button class=navNext ref>
```

### 1. Nav buttons (`useCalendarNavButtonAnimations`)

**Pointer enter:** `animateInteractiveHoverLift(el, true)` — scale lift без second-level shadow (1st level).

**Pointer leave:** lift reverse.

**Pointer down:** `animateInteractivePressSqueeze(el, { pointerInside })`.

**Disabled:** handlers no-op.

Слоты: `classNames.navPrev`, `navNext`.

#### Кастомизация nav/cell interactive

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  hoverLiftScale: 1.03,
  pressSqueezeScale: [1, 0.96, 1],
  interactiveDuration: 280,
  enableHoverLift: true,
  enablePressSqueeze: true,
});
```

**Reduced motion:** `shouldSkipInteractiveHoverLift()` / `prefersReducedInteractiveHoverLift()` — без lift/squeeze.

### 2. Day / month / year cells (`useCalendarInteractiveCellAnimations`)

Тот же pipeline что nav: hover lift + press squeeze на `<button>`.

`CalendarInteractiveCellInner` объединяет:

- motion handlers
- `useToggleButtonFillAnimation(selected, fillRef)` на `cellFill`
- today dot при `isToday && !selected`

`cellKind`: `day` | `month` | `year` → разные слоты (`dayCell`, `monthCell`, `yearCell`).

### 3. Selection fill (`useToggleButtonFillAnimation`)

`cellFill` span — GSAP scale/opacity fill при `selected` / `aria-pressed`:

- Аналогично `ToggleButton` / `Switch` fill
- **Не переопределяйте `transform` на `cellFill` в CSS**

```ts
configureMotion({
  enableToggleButtonFill: true,
  // selection fill ease/duration — shared toggle tokens
});
```

### 4. Range half-fill (`CalendarRangeHalfFill`)

В `mode="range"` между `rangeStart` и hover/current day:

**DOM:** absolute band `rangeHalfFill` (`bg-default-hover`) слева/справа от cell.

**Visible toggle:** `motionContentFade()` → `autoAlpha` 0↔1.

**First layout:** instant opacity (без fade на mount).

**Reduced motion:** instant show/hide.

Использует `tooltipDuration` + `interactiveEase` из `motionContentFade()` (не отдельные `contentFade*` ключи).

### 5. Header title drill-up

Click title → `days` → `months` → `years`. Только CSS `hover:text-primary` — без GSAP.

### Чего нет

- Portal motion (inline panel)
- Ripple
- FLIP при смене month grid
- Second-level persistent shadow на root (есть `shadow-token-sm` в CSS)

### Сводка: что настраивается где

| Анимация | Утилита | Ключи `configureMotion` | Локальный prop |
|----------|---------|---------------------------|----------------|
| Nav hover/squeeze | `useCalendarNavButtonAnimations` | `hoverLiftScale`, `pressSqueezeScale` | `disabled` на nav |
| Cell hover/squeeze | `useCalendarInteractiveCellAnimations` | interactive tokens | `disabled` на day |
| Selected fill | `useToggleButtonFillAnimation` | `enableToggleButtonFill` | `selected` state |
| Range band fade | `motionContentFade` | `tooltipDuration`, `interactiveEase` | `mode="range"` |
| Today dot | CSS static | — | `isToday` |

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
