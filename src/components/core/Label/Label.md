# Label

Подпись поля формы: `<label htmlFor>` или `<span id>` для legend-подобных заголовков. Маркер обязательности `*`, интеграция с `FieldLabelContext` из Input и других контролов.

## Импорт

```tsx
import {
  Label,
  LabelSlot,
  FieldLabelContext,
  useOptionalFieldLabelContext,
  type LabelProps,
  type LabelClassNames,
  type FieldLabelContextValue,
} from "burne-ui";
```

## API

Simple API + минимальный compound (`Label.Slot` — null-компонент для разметки).

### Props

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `htmlFor` | `string` | из context | ID контрола; при наличии рендерится `<label>` |
| `id` | `string` | из context | ID подписи (`aria-labelledby`); на `<label>` и на `<span>` |
| `isRequired` | `boolean` | `false` / context | Показывает `*` (`text-danger`) |
| `className` | `string` | — | На root |
| `classNames` | `LabelClassNames` | — | Слоты: `root`, `text`, `required` |
| `children` | `ReactNode` | — | Текст подписи |

### `LabelClassNames`

```tsx
type LabelClassNames = {
  root?: string;
  text?: string;
  required?: string;
};
```

### Примеры

```tsx
// Явная привязка
<Label htmlFor="email" isRequired>Email</Label>
<Input><Input.Control id="email" /></Input>

// Через Input (label prop → внутренний Label + context)
<Input label="Имя" placeholder="…" />

// Span без привязки (заголовок секции)
<Label id="section-title">Контактные данные</Label>

// Field.Label — алиас Label
<Field>
  <Field.Label htmlFor="name">Имя</Field.Label>
  …
</Field>
```

### Compound

`Label.Slot` — маркер с `displayName = "Label"` для compound-разметки в полях (рендерит `null`).

## Рендер: label vs span

| Условие | Элемент | Назначение |
|---------|---------|------------|
| `htmlFor` задан | `<label id htmlFor>` | Клик фокусирует контрол; `id` для `aria-labelledby` |
| только `id` | `<span id>` | Подпись без прямой привязки |

Текст: `Text` variant `base`, `font-medium`. Required: `*` с `aria-hidden` (семантика через `required` на контроле / `isRequired` в форме).

## FieldLabelContext

Контролы (`Input`, `ComboBox`, `Slider`, `Meter`, …) поднимают context:

```tsx
type FieldLabelContextValue = {
  controlId?: string;
  labelId?: string;
  isRequired?: boolean;
};
```

`useLabelRootState` мержит props с context: `htmlFor ?? ctx.controlId`, `id ?? ctx.labelId`, `isRequired ?? ctx.isRequired`.

`useOptionalFieldLabelContext()` — для Checkbox/Radio label-связки без throw.

## Анимации

**В Label нет GSAP и hover motion** — статичная типографика.

**DOM-структура:**

```
<label|span> (inline-flex, gap-x-xsmall)
  <Text span> подпись
  <span * aria-hidden>   ← optional isRequired
```

### Что не анимируется

- Появление маркера `*`
- Смена `isRequired`
- Focus на связанном контроле (стили focus — на Input shell, не на Label)

### Связанная motion у соседей

| Сосед | Анимация |
|-------|----------|
| `Input` shell | `useFieldShellHoverLift` (sm→md) |
| `Checkbox` / `Radio` label area | `usePressableElementTextMotion` (squeeze) |

Кастомный transition на текст подписи — только через `classNames.text` / CSS:

```tsx
<Label classNames={{ text: "transition-colors duration-200" }}>
  Email
</Label>
```

### Сводка

| Анимация | В Label | Где настраивать |
|----------|---------|-----------------|
| GSAP | нет | — |
| Hover lift | нет | контрол (Input и др.) |
| CSS transition | вручную | `classNames` |

## Токены и CSS

| Класс | Назначение |
|-------|------------|
| `inline-flex flex-wrap items-baseline gap-x-xsmall` | root |
| `font-medium` | текст |
| `text-danger` | маркер `*` |
| `text-base` | через `Text` variant |

## Стилизация и кастомизация

### Два уровня

1. **`className` на root** — мерж с `classNames.root` на `<label>` (или span при отсутствии `htmlFor`).
2. **`classNames`** — `root`, `text`, `required` через `LabelClassNamesProvider`.

Label — leaf-компонент без compound API; используется standalone и как `Input.Label`, `TextArea.Label` и т.д.

### Слоты `LabelClassNames`

| Слот | DOM / элемент | Когда использовать |
|------|---------------|-------------------|
| `root` | `<label>` / span | Flex layout, padding, border вокруг label |
| `text` | `Text` внутри label | Шрифт, цвет текста |
| `required` | Маркер `*` | Цвет обязательности |

### Standalone

```tsx
<Label
  htmlFor="email"
  isRequired
  className="mb-small"
  classNames={{
    root: "rounded-mid border border-primary/30 px-base py-xsmall",
    text: "text-primary font-semibold",
    required: "text-warning",
  }}
>
  Email
</Label>
```

### Внутри полей (Input, TextArea, ComboBox)

Слот `label` на root поля прокидывается в Label:

```tsx
<Input
  classNames={{ label: "uppercase tracking-wide text-mid" }}
  label="Email"
/>

// Compound — вложенные classNames Label мержатся с контекстом Input:
<Input classNames={{ label: "text-muted" }}>
  <Input.Label
    classNames={{ text: "font-bold", required: "text-danger" }}
  >
    Email
  </Input.Label>
  <Input.Control />
</Input>
```

Порядок: `Input.classNames.label` → `Label.classNames.root` → `Input.Label className`.

### Практические заметки

- **`htmlFor`:** без него Label рендерится как span — для `aria-labelledby` на группе.
- **`*`:** `aria-hidden`; дублируйте `required` / `aria-required` на контроле.
- **FieldLabelContext:** Input/TextArea подставляют `htmlFor` автоматически — не дублируйте id вручную.

## Доступность

- `<label htmlFor>` — нативная связь с контролом
- `*` — `aria-hidden={true}`; обязательность дублируйте `required` / `aria-required` на input
- Для span-режима: `id` на Label + `aria-labelledby` на группе полей

## Структура файлов

```
Label/
├── Label.tsx
├── index.ts
├── labelTypes.ts
├── labelStyles.ts
├── labelParts.tsx
├── labelContext.tsx
├── labelA11y.ts
├── useLabelRootState.ts
└── Label.stories.tsx
```

## Storybook

`Core Components/Label` — default, required, с Input, span-режим, `classNames`.
