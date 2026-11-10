# DatePicker

Поле с календарём в попапе. Simple API рисует подпись, кнопку и `Calendar`. Compound — `Label`, `Trigger`, `Popover`, `Hint`, `Error`.

Режимы: `single` (день) и `range` (начало и конец). Несколько дат чипами — это другой компонент.

## Импорт

```tsx
import { DatePicker, type DatePickerProps, type DatePickerClassNames, type DatePickerMotion } from "burne-ui";
```

## API

### Simple API

```tsx
<DatePicker label="Дата" value={day} onValueChange={setDay} />

<DatePicker selectionMode="range" label="Период" value={range} onValueChange={setRange} />
```

### Compound API

```tsx
<DatePicker value={day} onValueChange={setDay}>
  <DatePicker.Label>Дата</DatePicker.Label>
  <DatePicker.Trigger />
  <DatePicker.Popover />
  <DatePicker.Hint>Один день</DatePicker.Hint>
</DatePicker>
```

### Root props (ключевые)

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `selectionMode` | `single` | `single` или `range`. `range` — доменное значение |
| `value` / `defaultValue` | — | День (`Date \| null`) или диапазон `{ start, end }`. Пустой диапазон — `{ start: null, end: null }`. Это доменное исключение режима `range` |
| `onValueChange` | — | Колбэк выбранного значения |
| `open` / `defaultOpen` | `false` | Попап |
| `onOpenChange` | — | `(open: boolean) => void` |
| `variant` | `default` | как Input: `default` \| `outline` \| `secondary` |
| `invalid` | — | Danger-визуал, `aria-invalid` и `data-invalid=""`. `error` делает то же и показывает сообщение |
| `size` | `base` | Поле и календарь |
| `placeholder` | `BurneLabels.selectDate` / `selectDateRange` | Текст пустого поля. По умолчанию `"Select a date"` / `"Select a range"` |
| `icon` | шеврон | Узел рядом со значением заменяет шеврон, `null` прячет. Текст значения остаётся |
| `locale` | `EN_LOCALE` (`en-GB`) | Тег (`"ru"`) или `CalendarLocale`. Поле `15 Oct 2026`, имена календаря из Intl |
| `minDate` / `maxDate` | — | Прокидываются в `Calendar` |
| `defaultMonth` | — | Месяц до выбора |
| `side` | `bottom` | Сторона попапа. Панель выравнивается по началу поля |
| `portalContainer` | `document.body` | Хост портала календаря |
| `name` | — | Скрытый input: `YYYY-MM-DD` или `start/end`. Form `setValue` пишет ту же строку |
| `classNames` | — | см. стилизацию |
| `motion` | — | Карта слотов + `events`. Хост — кнопка `trigger` |
| `motionController` | — | На корне, тот же scope, что у кнопки. Не на DOM |

Попап закрывается, когда значение полное: выбран день или у диапазона есть оба конца. Повторный клик по тому же дню сбрасывает его в `null` и оставляет календарь открытым. Clear в календаре тоже не закрывает попап.

### `DatePickerClassNames`

`root`, `label`, `trigger`, `value`, `icon`, `popover`, `calendar`, `hint`, `error`.

`calendar` — класс корня вложенного `Calendar`. Свои слоты календаря — через compound `DatePicker.Popover` и свой `Calendar`.

### Compound-подчасти

| Часть | Роль |
|-------|------|
| `DatePicker.Label` | Подпись, `htmlFor` на кнопку |
| `DatePicker.Trigger` | Combobox: текст значения и шеврон |
| `DatePicker.Popover` | Календарь в попапе |
| `DatePicker.Hint` | Подсказка |
| `DatePicker.Error` | Сообщение ошибки |

## Поведение

`variant` — оболочка поля, как у Input: `default`, `outline`, `secondary`. `size` меняет поле и календарь: `small`, `base`, `mid`, `large`. Формат на кнопке — `12 Oct 2026`, диапазон через тире.

## Анимации

Свой scope на корне. Хост — слот `trigger` (оболочка поля второго уровня: тень в покое, рост при наведении, `pressSqueeze`).

### Slot motion

`trigger` — `hoverIn` / `hoverOut` `hoverLiftFirstLevel`, `pressIn` `pressSqueeze`. `icon` — `enter` / `leave` `chevronRotate`. `label`, `hint`, `error` без рецепта по умолчанию: своя карта `hoverIn`, `pressIn` или `enter` играет на этой части. `enter` стартует при появлении, если фаза задана.

`popover` — панель. Ключ не регистрируется в scope поля: карта уходит на внутренний Popover `content`. Дефолт `portalSurfaceEnter` / `portalSurfaceLeave`. `DatePicker.Popover` `motion` побеждает карту корня. `playSlot("popover")` на контроллере поля цели не найдёт.

`calendar` — оболочка вложенного Calendar (`root`). Дефолта нет: enter играет, только когда фаза задана в `motion.calendar`. Свой enter Calendar при этом не дублируется. Кастомные `children` у `DatePicker.Popover` календарь кита заменяют, и слот на них не попадает.

## data-*

На кнопке: `data-state` `open` \| `closed`, `data-invalid` / `data-required` / `data-disabled` — пустая строка, когда флаг включён. На корне: `data-variant`, `data-size`.

## MotionController

Ручка на корне, scope кнопки. Слота `root` в `DatePickerMotion` нет: `play()` без слота пропускается. Поле — `playSlot("trigger")`. `playSlot("popover")` и `playSlot("calendar")` на этом контроллере цели не находят: карта уходит во внутренний Popover и в Calendar.

Тройка на корне, scope кнопки. `motionState`, `motionPayload` и `playInitialState` не попадают на DOM. Смена `motionState` играет `motion.states[имя]`; то же имя ещё раз — тишина. `motionPayload` — снимок для фабрики (`ctx.payload`, `createMotionFactory`); без смены режима не переигрывает. `playInitialState` по умолчанию выключен: на маунте режим не играет.

```tsx
const field = useMotionControllerHandle();

<DatePicker motionController={field} label="Дата" />
```

## Доступность

- Триггер: `role="combobox"`, `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls` на панель. Подпись связана через `htmlFor`. Роль combobox нужна, чтобы `aria-invalid` и `aria-required` были допустимы.
- `aria-invalid` только от `invalid` или `error`. Подсказка и ошибка попадают в `aria-describedby`, когда части подключены.
- Клавиатура открывает попап и переносит фокус на первый день. Escape и клик снаружи закрывают.
- Скрытый input с `name` несёт `YYYY-MM-DD` или `start/end`.

## Структура файлов

```
DatePicker/
├── DatePicker.tsx
├── index.ts
├── DatePicker.stories.tsx
├── datePickerTypes.ts
├── datePickerStyles.ts
├── datePickerA11y.ts
├── datePickerAPI.ts
├── datePickerContext.tsx
├── datePickerAnimations.ts
├── datePickerParts.tsx
├── useDatePickerRootState.ts
├── datePicker.test.tsx
└── DatePicker.md
```

## Выбор

`readOnly` не открывает календарь и не меняет значение. `selectionMode="multiple"` хранит несколько дат в `values` / `onValuesChange`. `isDateUnavailable` передаётся в календарь.
