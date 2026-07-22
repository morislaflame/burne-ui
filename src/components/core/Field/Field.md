# Field

Компоновка полей формы: обёртка одного поля (`Field`) и группировка (`Field.Set`) с legend, hint, error. **Собственных GSAP-анимаций нет** — layout и a11y-связки; motion живёт в дочерних контролах (`Input`, `Checkbox`, …).

## Импорт

```tsx
import { Field, joinFieldDescribedBy, fieldHintId, fieldErrorId, useFieldSetHintId, useFieldSetErrorId, type FieldProps, type FieldSetProps, type FieldClassNames, type FieldSetClassNames, type FieldHintStatus, type FieldSetSize } from "burne-ui";
```

## API

### `Field` — одно поле

Compound через `Object.assign`:

| Часть | Назначение |
|-------|------------|
| `Field` / `Field` | Вертикальный stack: label → control → hint/error |
| `Field.Label` | Алиас `Label` |
| `Field.Hint` | Подсказка (`text-muted` или semantic) |
| `Field.Error` | Ошибка (`status="danger"`, `role="alert"`) |

```tsx
<Field classNames={{ root: "max-w-sm" }}>
  <Field.Label htmlFor="email">Email</Field.Label>
  <Input>
    <Input.Control id="email" />
  </Input>
  <Field.Hint>Мы не рассылаем спам</Field.Hint>
  <Field.Error>Некорректный адрес</Field.Error>
</Field>
```

#### `Field` props

| Prop | Описание |
|------|----------|
| `className` | На root `div` |
| `classNames.root` | Слот root |
| `classNames.hint` | Слот hint |
| `classNames.error` | Слот error |

### `Field.Set` — группа полей

| Часть | Назначение |
|-------|------------|
| `Field.Set` | `<fieldset>` с авто-раскладкой детей |
| `Field.Set.Legend` | `<legend>` |
| `Field.Set.LegendHeader` | Обёртка заголовка legend |
| `Field.Set.Group` | Вертикальная группа контролов |
| `Field.Set.Actions` | Кнопки / actions справа |

```tsx
<Field.Set size="base" disabled={isPending} classNames={{ stack: "gap-xlarge" }}>
  <Field.Set.Legend>
    <Field.Set.LegendHeader>Контактные данные</Field.Set.LegendHeader>
  </Field.Set.Legend>
  <Field.Set.Group>
    <Field>…</Field>
    <Field>…</Field>
  </Field.Set.Group>
  <Field.Set.Actions>
    <Button type="submit">Сохранить</Button>
  </Field.Set.Actions>
</Field.Set>
```

#### `Field.Set` props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `size` | `base` | `small` \| `base` \| `mid` \| `large` — отступы stack/group/actions |
| `disabled` | — | На `<fieldset>` |
| `hintId` / `errorId` | auto | Для `aria-describedby` у дочерних контролов |
| `classNames` | — | Слоты set, stack, legend, group, actions |

**Авто-раскладка:** `useFieldSetRootState` парсит children — выносит `Legend`, собирает `Group`, `Actions`, остальное в `loose`.

## Анимации

`Field` / `Field.Set` **не содержат GSAP** — это layout + a11y. Motion делегируется дочерним контролам.

**DOM-структура:**

```
Field (div, gap-xsmall)
  Field.Label
  Input / Select / …     ← shell hover здесь
  Field.Hint / Field.Error

Field.Set (fieldset)
  Field.Set.Legend
  Field.Set.Group → Field × N
```

### 1. В самом Field — нет анимаций

Нет `useLayoutEffect` с GSAP, нет hover handlers на `Field`. Появление `Field.Error` — мгновенное (без built-in transition).

### 2. Shell hover у дочерних контролов (2-й уровень)

`Input`, `TextArea`, `Select`, `ComboBox`, `TimeField` используют **`useFieldShellHoverLift`** (`utils/useFieldShellHoverLift.ts`):

**На оболочке поля (shell ref):**

1. **Init:** `initElementShadow(shell, shadowSm())` — покой `shadow-token-sm`
2. **Pointer enter на shell:** `animateInteractiveHoverLift` — sm → md + адаптивный scale
3. **Pointer leave:** обратно к sm, scale 1
4. Классы: `animate-shadow`, `field-shell-transition`, `focus-within-ring`

**Hover-фон:** `fieldShellHoverClass` — CSS `hoverVariantBg` по status (`danger-tint-hover`, …), не GSAP.

Field **не передаёт** props в контрол для motion — контрол сам подключает hook при `!disabled`.

#### Кастомизация shell hover (глобально)

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  hoverLiftScale: 1.025,
  hoverLiftEase: "sine.inOut",
  interactiveDuration: 280,
  enableHoverLift: true,
});
```

**Локально на контроле:** `disabled` / read-only — shell hover обычно `enabled: !disabled`.

**Reduced motion / touch:** `shouldSkipInteractiveHoverLift()` — тень sm без lift.

### 3. Другие контролы внутри Field.Set

| Контрол | Анимация | Где настраивать |
|---------|----------|-----------------|
| `Checkbox` / `Radio` | selection indicator fill | `motionSelectionFill`, `enableToggleButtonFill` |
| `Switch` | thumb travel | `switchThumbDuration`, `switchThumbEase` |
| `Button` в `Field.Set.Actions` | 1-й уровень lift/squeeze | см. Button.md |

`Field.Set` передаёт только `size` через context — не motion.

### 4. Кастомная анимация hint/error

Встроенной нет. Пример через Tailwind:

```tsx
<Field.Error className="animate-in fade-in duration-200">
  Обязательное поле
</Field.Error>
```

### Сводка: что настраивается где

| Анимация | Где живёт | `configureMotion` | Связь с Field |
|----------|-----------|-------------------|---------------|
| Shell hover sm→md | `useFieldShellHoverLift` | `enableHoverLift`, `hoverLiftScale` | обёртка Input и др. |
| Shell hover bg | `fieldShellHoverClass` | — | CSS, status tint |
| Checkbox/Radio fill | контрол | `selectionFillEase` | child в Field |
| Switch thumb | Switch | `switchThumbDuration` | child в Field |
| Hint/Error appear | — | — | только CSS вручную |

## Размеры (`Field.Set`)

`FIELD_SET_SIZE_LAYOUT`:

| size | stack gap | group gap | actions gap | отступ после legend |
|------|-----------|-----------|-------------|---------------------|
| `small` | `gap-mid` | `gap-base` | `gap-base` | `mt-mid` |
| `base` | `gap-large` | `gap-plus` | `gap-plus` | `mt-large` |
| `mid` | `gap-xlarge` | `gap-mid` | `gap-mid` | `mt-xlarge` |
| `large` | `gap-xlarge` | `gap-large` | `gap-large` | `mt-xlarge` |

`Field` (одиночный) — фиксированный `gap-xsmall` между label / control / hint.

## Токены и CSS

| Элемент | Классы |
|---------|--------|
| Field root | `flex w-full flex-col gap-xsmall` |
| Fieldset | `m-0 min-w-0 border-0 p-0`, `disabled:opacity-55` |
| Hint default | `text-muted` |
| Hint danger/success/warning | `text-danger` / `text-success` / `text-warning` |
| Legend | `m-0 block w-full` |

## Доступность

### Helpers

```tsx
import { joinFieldDescribedBy, fieldHintId, fieldErrorId } from "burne-ui";

const hintId = fieldHintId("my-field");
const errId = fieldErrorId("my-field");

<Input.Control
  aria-describedby={joinFieldDescribedBy(hintId, errId)}
/>
```

`joinFieldDescribedBy(...ids)` — склеивает непустые id через пробел.

`useFieldSetHintId()` / `useFieldSetErrorId()` — auto-id для Set.

### Field.Error

По умолчанию `role="alert"` — объявление ошибки screen reader.

### Field.Set

Нативный `<fieldset disabled>` блокирует вложенные контролы.

## Стилизация и кастомизация

Field — layout-примитив: два независимых набора слотов для **`Field`** и **`Field.Set`**.

### `Field` (обёртка одного поля)

#### Два уровня

1. **`className` на root** — мерж с `classNames.root`.
2. **`classNames`** — `root`, `hint`, `error` через `FieldClassNamesProvider`.

Используется внутри Input, TextArea, ComboBox и напрямую:

```tsx
<Field
  className="max-w-sm"
  classNames={{
    root: "rounded-mid border-token p-plus gap-small",
    hint: "text-xs text-muted",
    error: "font-medium",
  }}
>
  <Label htmlFor="x">Имя</Label>
  <input id="x" className="…" />
  <Field.Hint>Подсказка</Field.Hint>
  <Field.Error>Ошибка</Field.Error>
</Field>
```

| Слот | Элемент | Назначение |
|------|---------|------------|
| `root` | `Field` div | Gap, max-width, внешняя рамка |
| `hint` | `Field.Hint` | Текст подсказки |
| `error` | `Field.Error` | Текст ошибки (`role="alert"`) |

`Field.Hint` / `Field.Error` принимают свой **`className`** поверх слота.

Input/TextArea/ComboBox прокидывают `classNames.hint` / `classNames.error` в те же `Field.*` части.

### `Field.Set` (группа полей)

#### Два уровня

1. **`className` на `<fieldset>`** — мерж с `classNames.root`.
2. **`classNames`** — `root`, `stack`, `legend`, `legendHeader`, `group`, `actions`.

```tsx
<Field.Set
  className="max-w-md"
  size="mid"
  classNames={{
    legend: "text-primary font-semibold",
    legendHeader: "gap-xsmall",
    stack: "gap-xlarge",
    group: "gap-mid",
    actions: "justify-start pt-small",
  }}
>
  <Field.Legend>
    <Field.LegendHeader>
      <Label>Контактные данные</Label>
      <Field.Hint as="span">Слоты через classNames</Field.Hint>
    </Field.LegendHeader>
  </Field.Legend>
  <Field.Group>
    <Input>…</Input>
  </Field.Group>
  <Field.Actions>
    <Button type="button">Сохранить</Button>
  </Field.Actions>
</Field.Set>
```

| Слот | Элемент | Назначение |
|------|---------|------------|
| `root` | `<fieldset>` | Layout на корне (`max-w-*`, gap и т.п.) |
| `stack` | Внутренний layout-div | Gap между Group/Actions (без compound-части) |
| `legend` | `<legend>` | Заголовок группы |
| `legendHeader` | Обёртка в legend | Label + hint в одной строке |
| `group` | `Field.Group` | Gap между полями |
| `actions` | `Field.Actions` | Кнопки внизу группы |

`Field.Legend`, `Field.Group`, `Field.Actions` — свой **`className`** поверх слота.

#### Ограничение нативного `<fieldset>`

`Field.Set` — семантическая группировка, не card-like контейнер. У нативного fieldset `<legend>` рендерится **вне** content box: `border` и `padding` на `root`/`className` **не оборачивают legend** и не дают «карточку» вокруг всей группы. Между legend и контентом браузер добавляет свой отступ content box (плюс `mt-*` на stack от `size`).

Для визуальной рамки вокруг legend + полей оберните `Field.Set` во внешний `div`/`Card` с border и padding — внутри оставьте fieldset без border.

### Практические заметки

- **Размер Set:** `size` на `Field.Set` влияет на gap токенов — согласуйте с `Form` size.
- **Border на root:** не используйте `border`/`p-*` на `root`, если ожидаете обёртку legend — см. ограничение выше.
- **Не путать с Input:** `Field.classNames` не стилизует shell input — только layout Field; shell — в `Input.classNames.shell`.
- **Порядок мержа:** базовые → `classNames.slot` → `className` подчасти.

## Интеграция с Form

`Form` передаёт `size`, `disabled`, `isSubmitting` в контекст — дочерние `Input`/`Button` наследуют. `Field.Set` размер задавайте явно или согласуйте с `Form` size.

## Структура файлов

```
Field/
├── Field.tsx
├── fieldParts.tsx
├── fieldTypes.ts
├── fieldStyles.ts
├── fieldAPI.ts
├── fieldA11y.ts
├── fieldContext.tsx
├── useFieldSetRootState.ts
└── Field.stories.tsx
```

## Storybook

`Core Components/Field` — Field, Field.Set с legend/group/actions, hint/error status, размеры Set.
