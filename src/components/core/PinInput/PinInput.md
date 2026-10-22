# PinInput

Поле из ячеек: один символ на клетку. Simple API рисует подпись, ряд ячеек, подсказку и ошибку. Compound — `Label`, `Group`, `Hint`, `Error`.

## Импорт

```tsx
import { PinInput, type PinInputProps, type PinInputClassNames, type PinInputMotion } from "burne-ui";
```

## API

### Simple API

```tsx
<PinInput label="Verification code" length={6} name="otp" onValueChange={setCode} />
```

### Compound API

```tsx
<PinInput length={6} separator="–" value={code} onValueChange={setCode}>
  <PinInput.Label>Verification code</PinInput.Label>
  <PinInput.Shell />
  <PinInput.Hint>Sent to your phone</PinInput.Hint>
</PinInput>
```

`Group` рисует `length` ячеек. `separator` встаёт один раз, после первой половины.

### Root props (ключевые)

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `value` / `defaultValue` | `""` | Строка без дыр. Растёт с начала |
| `onValueChange` | — | `(value: string) => void` |
| `onComplete` | — | Когда заполнена последняя пустая ячейка. Повторная замена символа в уже полном коде не зовёт колбэк |
| `length` | `6` | Число ячеек, от 1 до 12 |
| `charset` | `number` | `number` — цифры. `text` — буквы и цифры |
| `mask` | — | Точки. Ячейка остаётся `type="text"`, браузер не предлагает сохранённый пароль |
| `placeholder` | — | Один символ в пустой ячейке |
| `separator` | — | Узел между половинами |
| `variant` | `default` | как Input: `default` \| `outline` \| `secondary` |
| `invalid` | — | Danger-визуал, `aria-invalid` и `data-invalid=""`. `error` делает то же и показывает сообщение |
| `size` | `base` | Сторона ячейки |
| `name` | — | Скрытый input с собранной строкой |
| `classNames` | — | см. стилизацию |
| `motion` | — | Карта слотов + `events`. Хост — корень |
| `motionController` | — | На корне, тот же scope. Не на DOM |

Вставка в середину заменяет символ и оставляет хвост. Клик дальше конца ставит фокус на первую пустую ячейку. Вставка с буфера заполняет ряд с текущей ячейки. Backspace убирает символ в фокусе или последний, если фокус уже на пустой. Стрелки, Home и End ходят по ячейкам. Один tab stop на весь ряд.

### `PinInputClassNames`

`root`, `label`, `shell`, `control`, `separator`, `hint`, `error`.

### Compound-подчасти

| Часть | Роль |
|-------|------|
| `PinInput.Label` | Подпись ряда |
| `PinInput.Shell` | Ячейки и разделитель |
| `PinInput.Control` | Одна ячейка. `className` — только эта ячейка; `classNames.control` — все |
| `PinInput.Hint` | Подсказка |
| `PinInput.Error` | Сообщение ошибки |

`PinInput.Shell` без `PinInput.Control` рисует `length` ячеек сам. Если поля переданы, ряд состоит из них: число полей совпадает с `length`. `index` можно не задавать — группа нумерует по порядку. `separator` по-прежнему встаёт после первой половины.

## Поведение

`variant` — оболочка ячейки, как у Input: `default`, `outline`, `secondary`. `size` — сторона ячейки: `small`, `base`, `mid`, `large`.

## Анимации

### Slot motion

Хост — корень. Ячейка `control` поднимается при наведении, у каждой свой подъём. `shell`, `label`, `hint` и `error` на том же scope. `enter` играет при появлении, если фаза задана. Повторные `control` — `ctx.getTargets("control")`.

## data-*

На корне: `data-invalid`, `data-disabled`, `data-readonly`, `data-required` — пустая строка, когда флаг включён, плюс `data-variant` и `data-size`.

## MotionController

Ручка на корне. Слота `root` в `PinInputMotion` нет: `play()` без слота пропускается. Ячейки — повторный слот `control`: `playSlot("control")` играет каждую, `getTargets("control")` — из фабрики. Оболочка ряда — `playSlot("shell")`.

Тройка на корне, тот же scope. `motionState`, `motionPayload` и `playInitialState` не попадают на DOM. Смена `motionState` играет `motion.states[имя]`; то же имя ещё раз — тишина. `motionPayload` — снимок для фабрики (`ctx.payload`, `createMotionFactory`); без смены режима не переигрывает. `playInitialState` по умолчанию выключен: на маунте режим не играет.

```tsx
const code = useMotionControllerHandle();

<PinInput motionController={code} label="Verification code" />
```

## Доступность

- Ряд: `role="group"`. Подпись ряда связана с группой.
- У ячейки `aria-label` «Digit i of n» или «Character i of n». Один tab stop на весь ряд.
- `aria-invalid` только от `invalid` или `error`. Подсказка и ошибка — в `aria-describedby`, когда части подключены.
- `autoComplete="one-time-code"` стоит на первой ячейке. При `mask` ячейка остаётся `type="text"`.

## Структура файлов

```
PinInput/
├── PinInput.tsx
├── index.ts
├── PinInput.stories.tsx
├── pinInputTypes.ts
├── pinInputStyles.ts
├── pinInputA11y.ts
├── pinInputAPI.ts
├── pinInputContext.tsx
├── pinInputAnimations.ts
├── pinInputParts.tsx
├── usePinInputRootState.ts
├── pinInputAPI.test.ts
├── pinInput.test.tsx
└── PinInput.md
```
