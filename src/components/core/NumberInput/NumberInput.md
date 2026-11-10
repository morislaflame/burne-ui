# NumberInput

Числовое поле со степперами. Simple API рисует подпись, минус, поле и плюс. Compound — `Label`, `Decrement`, `Control`, `Increment`, `Hint`, `Error`.

## Импорт

```tsx
import { NumberInput, type NumberInputProps, type NumberInputClassNames, type NumberInputMotion } from "burne-ui";
```

## API

### Simple API

```tsx
<NumberInput label="Количество" min={0} max={10} step={1} value={qty} onValueChange={setQty} />
```

### Compound API

```tsx
<NumberInput min={0} value={qty} onValueChange={setQty}>
  <NumberInput.Label>Количество</NumberInput.Label>
  <NumberInput.Decrement />
  <NumberInput.Control />
  <NumberInput.Increment />
  <NumberInput.Hint>Целые</NumberInput.Hint>
</NumberInput>
```

`Decrement`, `Control` и `Increment` собираются в одну оболочку в том порядке, в котором встретились.

### Root props (ключевые)

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `value` / `defaultValue` | `null` | Число или пусто |
| `onValueChange` | — | `(value: number \| null) => void` |
| `min` / `max` | — | Границы. Кнопка на границе выключена |
| `step` | `1` | Шаг кнопок и стрелок. На blur значение садится на сетку шага |
| `variant` | `default` | как Input: `default` \| `outline` \| `secondary` |
| `invalid` | — | Danger-кольцо, `aria-invalid` и `data-invalid=""`. `error` делает то же и показывает сообщение |
| `size` | `base` | Высота поля |
| `readOnly` | — | Поле можно выделить, степперы выключены |
| `name` | — | Нативный input. Form `setValue` пишет число или `""` |
| `classNames` | — | см. стилизацию |
| `motion` | — | Карта слотов + `events`. Хост — оболочка `shell` |
| `motionController` | — | На корне, тот же scope. Не на DOM |

Пустое поле: плюс ставит `min` или `0`, минус ставит `max` или `0`. Дальше шаг прибавляется и вычитается. Пока поле в фокусе, можно набрать промежуточный текст (`1.`). На blur значение ограничивается и садится на шаг. Ширина поля по содержимому; `className="w-full"` растягивает его.

### `NumberInputClassNames`

`root`, `label`, `shell`, `control`, `decrement`, `increment`, `hint`, `error`.

### Compound-подчасти

| Часть | Роль |
|-------|------|
| `NumberInput.Label` | Подпись, `htmlFor` на поле |
| `NumberInput.Decrement` | Минус. Вне tab sequence |
| `NumberInput.Control` | Поле `spinbutton` |
| `NumberInput.Increment` | Плюс. Вне tab sequence |
| `NumberInput.Hint` | Подсказка |
| `NumberInput.Error` | Сообщение ошибки |

## Поведение

`variant` — оболочка поля, как у Input: `default`, `outline`, `secondary`. `size` — высота: `small`, `base`, `mid`, `large`.

## Анимации

### Slot motion

Хост — `shell` (подъём поля). `decrement` и `increment` сжимаются при нажатии. `control`, `label`, `hint` и `error` на том же scope: у каждого слота свои `hoverIn`, `pressIn` и `enter`. `enter` играет при появлении, если фаза задана.

## data-*

На корне и на поле: `data-invalid`, `data-disabled`, `data-readonly`, `data-required` — пустая строка, когда флаг включён. На корне ещё `data-variant` и `data-size`.

## MotionController

Ручка на корне. Слота `root` в `NumberInputMotion` нет: `play()` без слота пропускается. Оболочка — `playSlot("shell")`, кнопки — `playSlot("decrement")` и `playSlot("increment")`.

Тройка на корне, тот же scope. `motionState`, `motionPayload` и `playInitialState` не попадают на DOM. Смена `motionState` играет `motion.states[имя]`; то же имя ещё раз — тишина. `motionPayload` — снимок для фабрики (`ctx.payload`, `createMotionFactory`); без смены режима не переигрывает. `playInitialState` по умолчанию выключен: на маунте режим не играет.

```tsx
const qty = useMotionControllerHandle();

<NumberInput motionController={qty} label="Количество" />
```

## Доступность

- Поле: `role="spinbutton"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`. Подпись — `htmlFor`.
- `aria-invalid` только от `invalid` или `error`. Подсказка и ошибка — в `aria-describedby`, когда части подключены.
- Стрелки вверх и вниз шагают. Кнопки подписаны Decrease и Increase и не забирают фокус у поля.

## Структура файлов

```
NumberInput/
├── NumberInput.tsx
├── index.ts
├── NumberInput.stories.tsx
├── numberInputTypes.ts
├── numberInputStyles.ts
├── numberInputA11y.ts
├── numberInputAPI.ts
├── numberInputContext.tsx
├── numberInputAnimations.ts
├── numberInputParts.tsx
├── useNumberInputRootState.ts
├── numberInputAPI.test.ts
├── numberInput.test.tsx
└── NumberInput.md
```

## Формат

`formatOptions` уходит в `Intl.NumberFormat` для уже принятого числа. `locale` по умолчанию `en`. Фокус показывает сырое число, blur снова форматирует. `aria-valuetext` — отформатированная строка.
