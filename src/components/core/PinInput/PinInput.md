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
  <PinInput.Group />
  <PinInput.Hint>Sent to your phone</PinInput.Hint>
</PinInput>
```

`Group` рисует `length` ячеек. `separator` встаёт один раз, после первой половины.

### Root props (ключевые)

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `value` / `defaultValue` | `""` | Строка без дыр. Растёт с начала |
| `onValueChange` | — | `(value: string) => void` |
| `length` | `6` | Число ячеек, от 1 до 12 |
| `type` | `number` | `number` — цифры. `text` — буквы и цифры |
| `mask` | — | Точки. Ячейка остаётся `type="text"`, браузер не предлагает сохранённый пароль |
| `placeholder` | — | Один символ в пустой ячейке |
| `separator` | — | Узел между половинами |
| `variant` | `default` | как Input: `default` \| `outline` \| `secondary` |
| `status` | `default` | Только цвет. Не ставит `aria-invalid` |
| `invalid` | — | Danger-визуал, `aria-invalid` и `data-invalid=""`. `error` делает то же и показывает сообщение |
| `size` | `base` | Сторона ячейки |
| `name` | — | Скрытый input с собранной строкой |
| `classNames` | — | см. стилизацию |
| `motion` | — | Карта слотов + `events`. Хост — корень |
| `motionController` | — | На корне, тот же scope. Не на DOM |

Вставка в середину заменяет символ и оставляет хвост. Клик дальше конца ставит фокус на первую пустую ячейку. Вставка с буфера заполняет ряд с текущей ячейки. Backspace убирает символ в фокусе или последний, если фокус уже на пустой. Стрелки, Home и End ходят по ячейкам. Один tab stop на весь ряд.

### `PinInputClassNames`

`root`, `label`, `group`, `field`, `separator`, `hint`, `error`.

### Compound-подчасти

| Часть | Роль |
|-------|------|
| `PinInput.Label` | Подпись ряда |
| `PinInput.Group` | Ячейки и разделитель |
| `PinInput.Hint` | Подсказка |
| `PinInput.Error` | Сообщение ошибки |

## Поведение

`variant` — оболочка ячейки, как у Input: `default`, `outline`, `secondary`. `size` — сторона ячейки: `small`, `base`, `mid`, `large`.

Ряд: `role="group"`. У ячейки `aria-label` «Digit i of n» или «Character i of n». `aria-invalid` только от `invalid` / `error`. `autoComplete="one-time-code"` стоит на первой ячейке.

## Анимации

### Slot motion

Хост — корень. Ячейка `field` поднимается при наведении, у каждой свой подъём. `group`, `label`, `hint` и `error` на том же scope. `enter` играет при появлении, если фаза задана. Повторные `field` — `ctx.getTargets("field")`.

## Файлы

`PinInput.tsx` держит scope. Рецепты слотов — `pinInputAnimations.ts`.
