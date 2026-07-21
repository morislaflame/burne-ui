# RadioGroup

Группа радиокнопок в native `<fieldset>`: compound API с `Legend`, `Label`, `Hint`, `Error`, `List`. Один выбранный `value`; повторный клик по выбранному снимает выбор (если не `required`).

## Импорт

```tsx
import { RadioGroup, type RadioGroupProps, type RadioGroupOrientation, type RadioGroupHintProps, type RadioGroupErrorProps, type RadioGroupLabelProps, type RadioGroupLegendProps, type RadioGroupListProps } from "burne-ui";
import { Radio } from "burne-ui";
```

## API

### Compound API

```tsx
<RadioGroup defaultValue="card" name="payment" size="base">
  <RadioGroup.Legend>
    <RadioGroup.Label>Способ оплаты</RadioGroup.Label>
    <RadioGroup.Hint>Можно выбрать только один вариант.</RadioGroup.Hint>
  </RadioGroup.Legend>
  <RadioGroup.List>
    <Radio value="card" label="Банковская карта" />
    <Radio value="cash" label="Наличные" />
    <Radio value="invoice" label="Счёт для юрлица" />
  </RadioGroup.List>
</RadioGroup>
```

### Controlled

```tsx
const [payment, setPayment] = useState<string | undefined>("card");

<RadioGroup value={payment} onValueChange={setPayment} name="payment">
  ...
</RadioGroup>
```

Simple API нет.

### Root props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `value` | — | Controlled: `string \| null` |
| `defaultValue` | — | Uncontrolled initial |
| `onValueChange` | — | `(value: string \| undefined) => void` |
| `name` | auto `radio-group-{id}` | Общий `name` для всех `Radio` |
| `required` | `false` | Required mark; native `required` на первом radio |
| `size` | `small` | `small` \| `base` \| `mid` \| `large` |
| `disabled` | `false` | На fieldset + context → `Radio` |
| `hintId` / `errorId` | auto | Для `aria-describedby` |
| `className` | — | На `<fieldset>` |

`variant`, `status` и `classNames` на root **нет**.

### Compound-подчасти

| Часть | DOM | Назначение |
|-------|-----|------------|
| `RadioGroup` | `<fieldset>` | Root |
| `RadioGroup.Legend` | `<legend>` | Accessible name |
| `RadioGroup.Label` | core `Label` | Заголовок в legend |
| `RadioGroup.Hint` | `FieldHint` | Подсказка |
| `RadioGroup.Error` | `FieldError` | Ошибка (`role="alert"`) |
| `RadioGroup.List` | `<div>` | Список опций; `orientation` |
| `RadioGroup.Group` | wrapper | List + error grouping |
| `RadioGroup.Actions` | actions row | Редко |

Дочерние опции — **`Radio`** из core.

### `RadioGroup.List` props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `orientation` | `vertical` | `vertical` \| `horizontal` |
| `className` | — | На list container |

## size и orientation

| `size` | Эффект |
|--------|--------|
| `small` … `large` | Gaps legend/stack через `FIELD_SET_SIZE_LAYOUT` |

| `orientation` | Layout |
|---------------|--------|
| `vertical` | `flex flex-col gap-plus` |
| `horizontal` | `flex flex-row flex-wrap gap-x-mid gap-y-plus` |

Визуал опций — через `Radio` (`variant`, `danger` на отдельной опции).

## Анимации

У `RadioGroup` **нет собственных** анимаций. Motion делегирован `Radio`:

**DOM:**

```
<fieldset aria-describedby=hint error>
  <legend><Label /><Hint /></legend>
  <div class=list>
    <Radio>
      <input type=radio />
      <SelectionIndicator dot />     ← GSAP fill
      <Text ref=textMotion />        ← press squeeze
```

### 1. Dot indicator fill

`SelectionIndicator` (dot) — GSAP при `checked`.

### 2. Text press motion

`useRadioTextMotion` на label text.

### 3. Track fade

`useRadioControlTrackAnimation` при `disabled`.

#### Кастомизация (на Radio)

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  pressSqueezeScale: [1, 0.98, 1],
  interactiveDuration: 280,
});
```

### Чего нет

- Group-level animation при смене `value`
- Portal motion
- Hover lift на fieldset

### Сводка: что настраивается где

| Анимация | Утилита | Ключи `configureMotion` | Локальный prop |
|----------|---------|---------------------------|----------------|
| Dot fill | `SelectionIndicator` | selection fill tokens | `checked` |
| Text squeeze | `useRadioTextMotion` | `pressSqueezeScale` | `disabled` |
| Track fade | radio animations | `interactiveDuration` | `disabled` |

## Токены и CSS

Отдельного `radioGroupStyles.ts` нет — shared utils:

| Источник | Назначение |
|----------|------------|
| `optionGroupFieldset.tsx` | `FIELD_SET_CLASS`, legend header |
| `optionGroupLayout.ts` | `OPTION_GROUP_ORIENTATION_LAYOUT` |
| `fieldStyles.ts` | `FIELD_SET_SIZE_LAYOUT` per size |
| `Radio` | Визуал каждой опции |

## Стилизация и кастомизация

### Один уровень — `className` per-part

**Нет `classNames`** на RadioGroup root.

| Часть | Кастомизация |
|-------|--------------|
| root | `RadioGroup className` |
| legend / list / hint / error | `className` на подчасти |
| опция | `Radio className` / `classNames` |

### С описаниями (compound Radio)

```tsx
<RadioGroup defaultValue="standard">
  <RadioGroup.Legend>
    <RadioGroup.Label>Тариф</RadioGroup.Label>
  </RadioGroup.Legend>
  <RadioGroup.List>
    <Radio value="standard" label="Стандарт" description="Базовый набор" />
    <Radio value="pro" label="Pro" description="Расширенные лимиты" />
  </RadioGroup.List>
</RadioGroup>
```

### С ошибкой

```tsx
<RadioGroup required>
  <RadioGroup.Legend>
    <RadioGroup.Label>Способ оплаты</RadioGroup.Label>
  </RadioGroup.Legend>
  <RadioGroup.List>
    <Radio value="card" label="Карта" />
  </RadioGroup.List>
  <RadioGroup.Error>Выберите способ оплаты</RadioGroup.Error>
</RadioGroup>
```

### Практические заметки

- Паттерн legend: `Legend` → `Label` + опционально `Hint`.
- `name` на root — общий для всех `Radio` (auto-generate если не задан).
- `required` — `selectValue(undefined)` блокируется; required anchor на первом radio.
- При `required={false}` повторный клик снимает выбор.
- Сравнение с `CheckboxGroup selection="single"`: native radio semantics + arrow keys.
- Стили опций — через `Radio`, не через группу.

## Интеграции

| Компонент | Сценарий |
|-----------|----------|
| `Radio` | Опции в `List`; `useOptionalRadioGroupContext` |
| `Label` / `FieldHint` / `FieldError` | Legend/Hint/Error parts |
| `Form` | Controlled `value`/`onValueChange` или кастом binding |
| `CheckboxGroup` | Альтернатива single через checkbox UI |

Shared: `composite/utils/optionGroupFieldset.tsx`, `optionGroupLayout.ts`.

## Доступность

- Root: native `<fieldset>` + `aria-describedby`
- `Legend`: native `<legend>`
- `Radio`: native `<input type="radio">`, arrow keys в группе
- `Error`: `role="alert"`
- `required`: native `required` на первом radio (`claimRequiredAnchor`)

## Структура файлов

```
RadioGroup/
├── RadioGroup.tsx
├── index.ts
├── radioGroupTypes.ts
├── radioGroupParts.tsx
├── radioGroupContext.tsx
├── useRadioGroupRootState.ts
└── RadioGroup.stories.tsx

composite/utils/ — shared with CheckboxGroup (`optionGroupFieldset`, `optionGroupParts`, `useOptionGroup*`)
```

## Storybook

`Composite Components/RadioGroup` — playground, card layout, horizontal, descriptions, required, error, controlled, sizes, accessibility.
