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

<DatePicker mode="range" label="Период" value={range} onValueChange={setRange} />
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
| `mode` | `single` | `single` или `range` |
| `value` / `defaultValue` | — | День (`Date \| null`) или `{ start, end }` |
| `onValueChange` | — | Колбэк выбранного значения |
| `open` / `defaultOpen` | `false` | Попап |
| `onOpenChange` | — | `(open: boolean) => void` |
| `variant` | `default` | как Input: `default` \| `outline` \| `secondary` |
| `status` | `default` | Только цвет. Не ставит `aria-invalid` |
| `invalid` | — | Danger-визуал, `aria-invalid` и `data-invalid=""`. `error` делает то же и показывает сообщение |
| `size` | `base` | Поле и календарь |
| `placeholder` | `Select a date` / `Select a range` | Текст пустого поля |
| `locale` | `EN_LOCALE` (`en-GB`) | Тег (`"ru"`) или `CalendarLocale`. Поле `15 Oct 2026`, имена календаря из Intl |
| `minDate` / `maxDate` | — | Прокидываются в `Calendar` |
| `defaultMonth` | — | Месяц до выбора |
| `side` | `bottom` | Сторона попапа. Панель выравнивается по началу поля |
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
| `DatePicker.Trigger` | Кнопка: текст значения и шеврон |
| `DatePicker.Popover` | Календарь в попапе |
| `DatePicker.Hint` | Подсказка |
| `DatePicker.Error` | Сообщение ошибки |

## Поведение

`variant` — оболочка поля, как у Input: `default`, `outline`, `secondary`. `size` меняет поле и календарь: `small`, `base`, `mid`, `large`.

Кнопка: `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls` на панель, `data-state` `open` / `closed`. `aria-invalid` только от `invalid` / `error`. Клавиатура открывает попап и переносит фокус на первый день. Escape и клик снаружи закрывают. Формат на кнопке — `12 Oct 2026`, диапазон через тире.

## Анимации

Свой scope на корне. Хост — слот `trigger` (оболочка поля второго уровня: тень в покое, рост при наведении, `pressSqueeze`).

### Slot motion

`trigger` — `hoverIn` / `hoverOut` `hoverLiftSecondLevel`, `pressIn` `pressSqueeze`. `icon` — `enter` / `leave` `chevronRotate`. `label`, `hint`, `error` без рецепта по умолчанию: своя карта `hoverIn`, `pressIn` или `enter` играет на этой части. `enter` стартует при появлении, если фаза задана.

Popover и Calendar играют свою motion. В карту `DatePicker` они не входят.

## Файлы

`DatePicker.tsx` — провайдер scope. `datePickerAnimations.ts` — слоты и рецепты. `datePickerParts.tsx` — кнопка, попап, подписи. `datePickerStyles.ts` — классы оболочки.
