# CheckboxGroup

Группа чекбоксов в `<fieldset>`: compound API с `Legend`, `Label`, `Hint`, `List`. Режимы **multiple** (независимые checkbox) и **single** (radio-like через один `selectedValue`).

## Импорт

```tsx
import {
  CheckboxGroup,
  type CheckboxGroupProps,
  type CheckboxGroupSelection,
  type CheckboxGroupOrientation,
  type CheckboxGroupHintProps,
  type CheckboxGroupLabelProps,
  type CheckboxGroupLegendProps,
  type CheckboxGroupListProps,
} from "burne-ui";
import { Checkbox } from "burne-ui";
```

## API

### Compound API

```tsx
<CheckboxGroup isRequired selection="multiple" size="base">
  <CheckboxGroup.Legend>
    <CheckboxGroup.Label>Способ доставки</CheckboxGroup.Label>
    <CheckboxGroup.Hint>Можно выбрать несколько вариантов.</CheckboxGroup.Hint>
  </CheckboxGroup.Legend>
  <CheckboxGroup.List orientation="vertical">
    <Checkbox name="ship" value="courier" label="Курьер" />
    <Checkbox name="ship" value="pickup" label="Самовывоз" />
    <Checkbox name="ship" value="post" label="Почта" />
  </CheckboxGroup.List>
</CheckboxGroup>
```

### Single selection

```tsx
<CheckboxGroup
  selection="single"
  defaultValue="pickup"
  onValueChange={(v) => console.log(v)}
>
  <CheckboxGroup.Legend>
    <CheckboxGroup.Label>Способ доставки</CheckboxGroup.Label>
  </CheckboxGroup.Legend>
  <CheckboxGroup.List>
    <Checkbox name="ship" value="courier" label="Курьер" />
    <Checkbox name="ship" value="pickup" label="Самовывоз" />
    <Checkbox name="ship" value="post" label="Почта" />
  </CheckboxGroup.List>
</CheckboxGroup>
```

Simple API нет.

### Root props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `selection` | `multiple` | `multiple` \| `single` |
| `value` | — | Controlled (`single` only) |
| `defaultValue` | — | Uncontrolled initial (`single`) |
| `onValueChange` | — | `(value: string \| undefined) => void` (`single`) |
| `isRequired` | `false` | Required mark на Label; native `required` на first checkbox в `single` |
| `size` | `small` | `small` \| `base` \| `mid` \| `large` — gaps legend/list |
| `disabled` | `false` | На fieldset + context → Checkbox |
| `hintId` / `errorId` | auto | Для `aria-describedby` |
| `className` | — | На `<fieldset>` |

`variant` и `classNames` на root **нет**.

### Compound-подчасти

| Часть | DOM | Назначение |
|-------|-----|------------|
| `CheckboxGroup` | `<fieldset>` | Root |
| `CheckboxGroup.Legend` | `<legend>` | Accessible name группы |
| `CheckboxGroup.Label` | core `Label` | Заголовок в legend |
| `CheckboxGroup.Hint` | `FieldHint` | Подсказка |
| `CheckboxGroup.Error` | `FieldError` | Ошибка (`role="alert"`) |
| `CheckboxGroup.List` | `<div>` | Список опций; `orientation` |
| `CheckboxGroup.Group` | `<div>` | Доп. группировка в list |
| `CheckboxGroup.Actions` | `<div>` | Actions row (редко) |

Дочерние опции — **`Checkbox`** из core (не sub-part группы).

### `CheckboxGroup.List` props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `orientation` | `vertical` | `vertical` \| `horizontal` |
| `className` | — | На list container |

## selection и orientation

| `selection` | Поведение |
|-------------|-----------|
| `multiple` | Каждый `Checkbox` независим (`checked` / `defaultChecked` / `name`) |
| `single` | Группа хранит одну `selectedValue`; снятие → `onValueChange(undefined)` |

| `orientation` | Layout (`optionGroupLayout`) |
|---------------|------------------------------|
| `vertical` | `flex flex-col gap-plus` |
| `horizontal` | `flex flex-row flex-wrap gap-x-mid gap-y-plus` |

`status` на группе нет — ошибки через `CheckboxGroup.Error` или поле в Form.

## Анимации

У `CheckboxGroup` **нет собственных** анимаций. Motion от вложенного `Checkbox`:

**DOM:**

```
<fieldset aria-describedby=hint error>
  <legend>
    <Label /> <Hint />
  <div class=list>
    <Checkbox>                           ← core component
      <input type=checkbox />
      <SelectionIndicator fill GSAP />
      <Text ref=textMotion />            ← press squeeze
```

### 1. Checkbox track fade

`useCheckboxControlTrackAnimation` — opacity трека при disabled toggle.

### 2. Text press motion

`useCheckboxTextMotion` / `usePressableElementTextMotion` на label text.

### 3. Selection indicator fill

`SelectionIndicator` — GSAP fill/mark при `checked` toggle.

#### Кастомизация (на Checkbox)

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  pressSqueezeScale: [1, 0.98, 1],
  interactiveDuration: 280,
});
```

### Чего нет

- Group-level animation при смене `selection`
- Portal / popover
- Hover lift на fieldset

### Сводка: что настраивается где

| Анимация | Утилита | Ключи `configureMotion` | Локальный prop |
|----------|---------|---------------------------|----------------|
| Indicator fill | `SelectionIndicator` | selection fill tokens | `checked` |
| Text squeeze | `useCheckboxTextMotion` | `pressSqueezeScale` | `disabled` |
| Track fade | checkbox animations | — | `disabled` |

## Токены и CSS

Отдельного `checkboxGroupStyles.ts` нет — shared utils:

| Источник | Классы |
|----------|--------|
| `optionGroupFieldset.tsx` | `FIELD_SET_CLASS`, legend/header gaps per `size` |
| `optionGroupLayout.ts` | List vertical/horizontal flex |
| `Field` / `Label` | Legend header stack |
| `Checkbox` | Визуал каждой опции |

| size | Legend/list gaps |
|------|------------------|
| `small` | compact stack |
| `base` | default |
| `mid` / `large` | увеличенные gaps |

## Стилизация и кастомизация

### Один уровень — `className` per-part

**Нет `classNames` API** на CheckboxGroup root.

| Часть | Кастомизация |
|-------|--------------|
| root | `CheckboxGroup className` |
| legend / list / hint / error | `className` на подчасти |
| каждая опция | `Checkbox className` / `classNames` |

### Multiple + hint

```tsx
<CheckboxGroup size="base" className="rounded-mid border border-token p-mid">
  <CheckboxGroup.Legend>
    <CheckboxGroup.Label>Теги</CheckboxGroup.Label>
    <CheckboxGroup.Hint>Выберите один или несколько.</CheckboxGroup.Hint>
  </CheckboxGroup.Legend>
  <CheckboxGroup.List>
    <Checkbox name="tags" value="design" label="Дизайн" />
    <Checkbox name="tags" value="dev" label="Разработка" />
  </CheckboxGroup.List>
</CheckboxGroup>
```

### Horizontal

```tsx
<CheckboxGroup>
  <CheckboxGroup.Legend>
    <CheckboxGroup.Label>Размер</CheckboxGroup.Label>
  </CheckboxGroup.Legend>
  <CheckboxGroup.List orientation="horizontal">
    <Checkbox name="size" value="s" label="S" />
    <Checkbox name="size" value="m" label="M" />
    <Checkbox name="size" value="l" label="L" />
  </CheckboxGroup.List>
</CheckboxGroup>
```

### С ошибкой

```tsx
<CheckboxGroup>
  <CheckboxGroup.Legend>
    <CheckboxGroup.Label>Согласия</CheckboxGroup.Label>
  </CheckboxGroup.Legend>
  <CheckboxGroup.List>
    <Checkbox name="terms" label="Пользовательское соглашение" />
  </CheckboxGroup.List>
  <CheckboxGroup.Error>Примите условия для продолжения</CheckboxGroup.Error>
</CheckboxGroup>
```

### В Form (`single` + required)

```tsx
<Form.Field name="consent" rules={{ required: true }}>
  <CheckboxGroup selection="single" isRequired>
    <CheckboxGroup.Legend>
      <CheckboxGroup.Label>Согласие</CheckboxGroup.Label>
    </CheckboxGroup.Legend>
    <CheckboxGroup.List>
      <Checkbox name="consent" value="yes" label="Согласен" />
    </CheckboxGroup.List>
  </CheckboxGroup>
</Form.Field>
```

> Чекбоксы **внутри** `CheckboxGroup` не bindятся к Form автоматически — используйте отдельные поля или кастомную логику.

### Практические заметки

- Паттерн legend: `Legend` → `Label` + опционально `Hint`.
- `single`: все `Checkbox` должны иметь уникальный `value`.
- `isRequired` в `single` — native `required` только на **первом** checkbox (`claimRequiredAnchor`).
- `multiple`: каждый checkbox со своим `name` или общим `name` + разными `value` — по сценарию.
- Стили опций — через `Checkbox` `classNames`, не через группу.
- Сравнение с `RadioGroup`: checkbox UI + optional single-selection mode.

## Интеграции

| Компонент | Сценарий |
|-----------|----------|
| `Checkbox` | Опции в `List` |
| `Label` / `FieldHint` / `FieldError` | Через Legend/Hint/Error parts |
| `Form` | Ограниченная интеграция (см. выше) |
| `RadioGroup` | Альтернатива для strict single-select |

Shared: `optionGroupFieldset.tsx`, `optionGroupLayout.ts` (с `RadioGroup`).

## Доступность

- Root: native `<fieldset>`
- `Legend`: native `<legend>` — accessible name группы
- `aria-describedby` на fieldset → hint + error ids
- `Checkbox`: native `<input type="checkbox">`, `aria-describedby`, labels
- `Error`: `role="alert"` через `FieldError`
- `single` + `isRequired`: required anchor на первом checkbox

## Структура файлов

```
CheckboxGroup/
├── CheckboxGroup.tsx
├── index.ts
├── checkboxGroupTypes.ts
├── checkboxGroupParts.tsx
├── checkboxGroupContext.tsx
├── useCheckboxGroupRootState.ts
└── CheckboxGroup.stories.tsx

composite/utils/
├── optionGroupFieldset.tsx
├── optionGroupLayout.ts
├── optionGroupParts.tsx
├── useOptionGroupSingleValue.ts
└── useOptionGroupRequiredAnchor.ts
```

## Storybook

`Composite Components/CheckboxGroup` — playground, single selection, required, without hint, horizontal, sizes.
