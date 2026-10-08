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
| `status` | `default` | Только цвет. Не ставит `aria-invalid` |
| `invalid` | — | Danger-визуал, `aria-invalid` и `data-invalid=""`. `error` делает то же и показывает сообщение |
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

Поле: `role="spinbutton"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`. `aria-invalid` только от `invalid` / `error`. Стрелки вверх и вниз шагают. Кнопки подписаны Decrease и Increase и не забирают фокус у поля.

## Анимации

### Slot motion

Хост — `shell` (подъём поля). `decrement` и `increment` сжимаются при нажатии. `control`, `label`, `hint` и `error` на том же scope: у каждого слота свои `hoverIn`, `pressIn` и `enter`. `enter` играет при появлении, если фаза задана.

## Файлы

`NumberInput.tsx` держит scope. Рецепты слотов — `numberInputAnimations.ts`.
