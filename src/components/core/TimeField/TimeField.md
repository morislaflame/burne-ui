# TimeField

Поле ввода времени с сегментами (часы / минуты / секунды). **Dual API:** simple props (`label`, `hint`, `error`) на root или compound `Label` / `Control` / `Hint` / `Error`. Shell motion как у `Input` / `Field`.

## Импорт

```tsx
import {
  TimeField,
  TimeFieldControl,
  TimeFieldHint,
  TimeFieldError,
  type TimeFieldRootProps,
  type TimeFieldControlProps,
  type TimeFieldSize,
  type TimeFieldStatus,
  type TimeFieldVariant,
  type TimeFieldFormat,
  type TimeFieldClassNames,
} from "burne-ui";
```

## API

### Simple API

```tsx
<TimeField
  label="Время начала"
  hint="Формат 24 часа"
  value={time}
  onValueChange={setTime}
  format="HH:mm"
  prefix={<IoTimeOutline aria-hidden />}
/>
```

### Compound API

```tsx
<TimeField value={time} onValueChange={setTime} variant="segmented">
  <TimeField.Label>Время</TimeField.Label>
  <TimeField.Control prefix={<IoTimeOutline aria-hidden />} />
  <TimeField.Hint>24-часовой формат</TimeField.Hint>
  <TimeField.Error>Некорректное время</TimeField.Error>
</TimeField>
```

### Root props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `label` / `hint` / `error` | — | Simple API slots |
| `value` / `defaultValue` | `"00:00"` | `"HH:mm"` или `"HH:mm:ss"` |
| `onValueChange` | — | `(value: string) => void` |
| `format` | `HH:mm` | `HH:mm` \| `HH:mm:ss` |
| `size` | `base` | `small` \| `base` \| `mid` \| `large` |
| `variant` | `default` | `default` \| `outline` \| `segmented` \| `gloss` |
| `status` | `default` | `default` \| `danger` \| `success` \| `warning` |
| `disabled` | `false` | Блокирует control |
| `compact` | `false` | `w-fit` вместо `w-full` |
| `isRequired` | `false` | `aria-required` на сегментах |
| `prefix` / `suffix` | — | Affix slots в control |
| `id` | auto | Связь label/control |
| `className` | — | На root |
| `classNames` | — | Слоты |

### `TimeFieldClassNames`

`root`, `label`, `shell`, `prefix`, `suffix`, `segments`, `segment`, `segmentSeparator`, `keyboardInput`, `hint`, `error`.

## variant / status / размеры

| variant | Shell |
|---------|-------|
| `default` | `bg-surface border-token` |
| `outline` | `bg-transparent border-token` |
| `segmented` | Ячейки сегментов с разделителями |
| `gloss` | `gloss-control` + gloss shell motion |

| status | Эффект |
|--------|--------|
| `default` | Standard surface |
| `danger` / `success` / `warning` | `bg-surface-tint-*` на shell/affix |

| size | Shell height | Segment text |
|------|--------------|--------------|
| `small` … `large` | `TIME_FIELD_SHELL_H` + `CONTROL_SIZE_LAYOUT` | mono `tabular-nums` |

| format | Сегменты |
|--------|----------|
| `HH:mm` | hours, minutes |
| `HH:mm:ss` | + seconds |

## Анимации

`timeFieldAnimations.ts` → `useTimeFieldShellMotion`. Сегменты — без GSAP.

**DOM:**

```
<Field root>
  <Label />
  <fieldset class=shell ref=shellRef>     ← hover lift / squeeze / gloss
    <span class=prefix />
    <div class=segments>
      <span role=spinbutton class=segment>  ← focus: bg-primary
      <span class=segmentSeparator aria-hidden>:</span>
    <input class=keyboardInput aria-hidden />  <!-- iOS keyboard -->
    <span class=suffix />
  <Hint /> <Error role=alert />
```

### 1. Shell motion (`useTimeFieldShellMotion`)

| variant | Поведение |
|---------|-----------|
| `gloss` | `useGlossFieldShellMotion` — gloss scale/surface |
| остальные | `useFieldShellHoverLift` + `animateInteractivePressSqueeze` на `pointerdown` |

Shared с `Input` / `TextArea` field shell utils.

#### Кастомизация

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  hoverLiftScale: 1.02,
  pressSqueezeScale: [1, 0.99, 1],
  enableHoverLift: true,
});
```

**Reduced motion:** `prefersReducedInteractiveHoverLift()` — без squeeze.

### 2. Segment focus

React state — `bg-primary text-primary-foreground` на focused segment. Без GSAP.

### Чего нет

- Portal / popover
- Ripple встроенный
- Анимация смены цифр (instant value update)
- Second-level persistent shadow

### Сводка: что настраивается где

| Анимация | Утилита | Ключи `configureMotion` | Локальный prop |
|----------|---------|---------------------------|----------------|
| Shell hover lift | `useFieldShellHoverLift` | `hoverLiftScale`, `enableHoverLift` | `variant`, `disabled` |
| Shell press squeeze | `animateInteractivePressSqueeze` | `pressSqueezeScale` | `disabled` |
| Gloss shell | `useGlossFieldShellMotion` | gloss tokens | `variant="gloss"` |
| Segment focus | CSS | — | keyboard focus |

## Токены и CSS

| Класс / токен | Назначение |
|---------------|------------|
| `TIME_FIELD_SHELL_H` | Height per size |
| `FIELD_SHELL_FOCUS_CLASS` | Focus ring на fieldset |
| `FIELD_SHELL_TRANSITION_CLASS` | Shadow transition |
| `fieldShellHoverClass` | Hover shadow (не в покое) |
| `font-mono tabular-nums` | Segment typography |
| Focus segment | `bg-primary text-primary-foreground` |
| Disabled | `opacity-55 shadow-token-sm` |

## Стилизация и кастомизация

### Два уровня

1. **`className` на `TimeField`** — root layout.
2. **`classNames` на root** — label, shell, segments, hint, error.

`TimeField.Control` принимает `className` на fieldset shell.

### Слоты `TimeFieldClassNames`

| Слот | DOM | Когда использовать |
|------|-----|-------------------|
| `root` | Field root | Gap label/control |
| `label` | Label | Typography |
| `shell` | `<fieldset>` | Border tint, radius |
| `prefix` / `suffix` | Affix spans | Icon slots |
| `segments` | Segments row | Gap, alignment |
| `segment` | Spinbutton span | Cell padding |
| `segmentSeparator` | `:` span | Muted separator |
| `keyboardInput` | Hidden input | iOS font-size hack |
| `hint` / `error` | FieldHint/Error | Status colors |

### Segmented + affixes

```tsx
<TimeField
  variant="segmented"
  format="HH:mm:ss"
  status="success"
  classNames={{
    shell: "border-success/30",
    segment: "rounded-small",
    prefix: "text-success",
    hint: "text-success/80",
  }}
  prefix={<IoTimeOutline aria-hidden />}
  value={time}
  onValueChange={setTime}
/>
```

### Validation compound

```tsx
<TimeField status="danger" classNames={{ shell: "border-danger/40", error: "text-danger" }}>
  <TimeField.Label>Время дедлайна</TimeField.Label>
  <TimeField.Control />
  <TimeField.Error>Укажите время в будущем</TimeField.Error>
</TimeField>
```

### Практические заметки

- Значение всегда string `"HH:mm"` / `"HH:mm:ss"` с zero-padding.
- Keyboard: ArrowUp/Down, PageUp/Down, цифры, Tab между сегментами.
- `compact` — inline time в toolbar/forms.
- `segmented` — отдельные ячейки; `outline` — прозрачный shell.
- **Не задавайте `transform` на shell** при gloss/default motion.
- Hidden `keyboardInput` — для мобильной клавиатуры (`font-size: 16px`).

## Интеграции

| Компонент | Сценарий |
|-----------|----------|
| `Field` / `Label` | Shared field layout |
| `Input` | Shared shell hover/squeeze |
| `Calendar` | Date+time forms (отдельные поля) |

## Доступность

- Shell: `aria-label="Время"` или `aria-labelledby`
- Segments: `role="spinbutton"`, `aria-valuemin/max/now/text`
- `aria-required`, `aria-invalid` при `status="danger"`
- Separators: `aria-hidden`
- Hidden input: `aria-hidden`, `tabIndex={-1}`
- Error: `role="alert"` через `FieldError`
- `aria-describedby` — hint + error ids

## Структура файлов

```
TimeField/
├── TimeField.tsx
├── index.ts
├── timeFieldTypes.ts
├── timeFieldStyles.ts
├── timeFieldAnimations.ts
├── timeFieldParts.tsx
├── timeFieldContext.tsx
├── timeFieldAPI.ts
├── timeFieldA11y.ts
├── useTimeFieldRootState.ts
├── useTimeFieldControlState.ts
└── TimeField.stories.tsx
```

## Storybook

`Core Components/TimeField` — dual API, segmented, outline, affixes, compact, seconds, validation, statuses, sizes, variants, disabled, `CustomClassNames`.
