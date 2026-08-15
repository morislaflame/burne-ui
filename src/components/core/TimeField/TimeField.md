# TimeField

Поле ввода времени с сегментами (часы / минуты / секунды). **Dual API:** simple props (`label`, `hint`, `error`) на root или compound `Label` / `Control` / `Hint` / `Error`. Shell motion как у `Input` / `Field`.

## Импорт

```tsx
import { TimeField, type TimeFieldProps, type TimeFieldControlProps, type TimeFieldSize, type TimeFieldStatus, type TimeFieldVariant, type TimeFieldFormat, type TimeFieldClassNames, type TimeFieldMotion, type TimeFieldPartMotion } from "burne-ui";
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
| `required` | `false` | `aria-required` на сегментах |
| `prefix` / `suffix` | — | Affix slots в control |
| `segmentSeparator` | `":"` | Символ/узел между сегментами (класс — слот `classNames.segmentSeparator`) |
| `id` | auto | Связь label/control |
| `className` | — | На root |
| `classNames` | — | Слоты |
| `motion` | — | per-slot motion (`shell`, `prefix`, `suffix`, `segments`) |

### `TimeFieldClassNames`

`root`, `label`, `shell`, `shellInner`, `prefix`, `suffix`, `segments`, `segmentGroup`, `segment`, `segmentSeparator`, `keyboardInput`, `hint`, `error`.

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
| `danger` / `success` / `info` / `warning` | нейтральный фон/border + постоянный статусный ring |

| size | Shell height | Segment text |
|------|--------------|--------------|
| `small` … `large` | `TIME_FIELD_SHELL_H` + `CONTROL_SIZE_LAYOUT` | mono `tabular-nums` |

| format | Сегменты |
|--------|----------|
| `HH:mm` | hours, minutes |
| `HH:mm:ss` | + seconds |

## Анимации

Публичный slot motion. Root передаёт карту `motion`; хост — `TimeField.Control` (defaults + `play`). Gloss hover/press остаются на `useGlossFieldShellMotion`. Фокус сегмента — CSS, без GSAP.

### Slot motion

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `shell` | `hoverIn` / `hoverOut` / `pressIn` / `pressOut` | non-gloss: `hoverLiftSecondLevel`, `pressSqueeze` (`pressOut: false`). Gloss hover/press — `false` (field-shell) |
| `prefix` / `suffix` / `segments` | hover/press | нет |

`false` на `shell.hoverIn/Out` — rest-тень остаётся, lift не играет. Не анимируйте layout в публичных MotionVars.

**Где в коде:** типы — `timeFieldTypes.ts`; scope — `timeFieldContext.tsx`; defaults + host — `timeFieldAnimations.ts`; слоты — `timeFieldParts.tsx`; карта на Root — `TimeField.tsx`.

```tsx
<TimeField
  label="Start"
  defaultValue="09:30"
  motion={{
    shell: { hoverIn: false, hoverOut: false },
  }}
/>
```

Compound: `motion` на `TimeField.Control` — part motion слота `shell`.

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
| `shellInner` | Flex row внутри fieldset | Раскладка prefix/segments/suffix |
| `prefix` / `suffix` | Affix spans | Icon slots |
| `segments` | Segments row | Gap, alignment |
| `segmentGroup` | Обёртка сегмента + separator | Inline group |
| `segment` | Spinbutton span | Cell padding |
| `segmentSeparator` | Separator span | Muted separator **класс** (символ — проп `segmentSeparator`) |
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
- Hidden `keyboardInput` — для мобильной клавиатуры (`field-control-mobile-no-zoom`, ≥16px на touch).

## Интеграции

| Компонент | Сценарий |
|-----------|----------|
| `Field` / `Label` | Shared field layout |
| `Input` | Shared shell hover/squeeze |
| `Calendar` | Date+time forms (отдельные поля) |

## Доступность

- Shell (`<fieldset>`): `aria-labelledby` при Label / `aria-label` fallback — **без** `label htmlFor` на fieldset (не labelable)
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

`Core Components/TimeField` — dual API, segmented, outline, affixes, compact, seconds, validation, statuses, sizes, variants, disabled, `CustomClassNames`, slot motion gallery.
