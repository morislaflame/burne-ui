# Checkbox

Чекбокс с `SelectionIndicator`, simple API (`label` / `hint` / `error` на root) и compound (`Control` / `Content` / `Label`). Интеграция с `CheckboxGroup` и `Form`.

## Импорт

```tsx
import { Checkbox, type CheckboxProps, type CheckboxVariant, type CheckboxSize, type CheckboxClassNames } from "burne-ui";
```

## API

### Simple API

```tsx
<Checkbox
  label="Согласие на обработку данных"
  hint="Обязательно для регистрации"
  defaultChecked
  name="consent"
  required
/>
```

Root рендерится как `<label>` с grid: control + text column.

### Compound API

```tsx
<Checkbox defaultChecked variant="outline" status={hasError ? "danger" : "default"}>
  <Checkbox.Control>
    <Checkbox.Indicator />
  </Checkbox.Control>
  <Checkbox.Content>
    <Checkbox.Label required>Email-рассылка</Checkbox.Label>
    <Checkbox.Hint>Можно отписаться в любой момент</Checkbox.Hint>
    <Checkbox.Error>Нужно согласие</Checkbox.Error>
  </Checkbox.Content>
</Checkbox>
```

Compound → `<fieldset>` + grid; `Checkbox.Content` может рендериться как nested `<label htmlFor={inputId}>`.

### Root props (ключевые)

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `variant` | `default` | `default` \| `secondary` \| `outline` \| `gloss` |
| `size` | `base` | `small` \| `base` \| `mid` \| `large` |
| `checked` / `defaultChecked` | — | Controlled / uncontrolled |
| `onChange` | — | Native change event |
| `disabled` | `false` | + opacity track animation |
| `danger` | `false` | Красный label text (или из Form error) |
| `icon` | — | Кастомная иконка отмеченного состояния (канон `icon`, как у `SelectionIndicator`; не путать с Switch `iconOn`/`iconOff`) |
| `label` / `hint` / `error` | — | Simple API |
| `name` / `value` | — | Form / CheckboxGroup |
| `classNames` | — | см. стилизацию |

### `CheckboxClassNames`

`root`, `control`, `controlTrack`, `indicator`, `indicatorFill`, `indicatorMark`, `content`, `label`, `labelText`, `requiredMark`, `hint`, `error`, `simpleLabelWrap`, `simpleLabelText`, `input`.

### Compound-подчасти

| Часть | Роль |
|-------|------|
| `Checkbox.Control` | Cell + hidden/overlay input + indicator |
| `Checkbox.Indicator` | `SelectionIndicator` (`.Fill`, `.Mark`) |
| `Checkbox.Content` | Label column / wrapper |
| `Checkbox.Label` | Текст + required `*` |
| `Checkbox.Hint` / `Error` | Вторичные строки grid |

## variant

| variant | Indicator style |
|---------|-----------------|
| `default` | Filled primary tint |
| `secondary` | Secondary surface |
| `outline` | Border ring |
| `gloss` | Gloss indicator shell |

Маппинг: `checkboxVariantToIndicator()` → `SelectionIndicator` variant.

## Размеры

`CHECKBOX_SIZE_LAYOUT`: grid gap, title/desc text variants, indicator size per `size`.

## Анимации

`checkboxAnimations.ts` + `SelectionIndicator` + `usePressableElementTextMotion`.

**DOM (simple):**

```
<label root onPointerDown>
  <Checkbox.Control>
    <span controlTrack ref=trackRef>   ← opacity anim
      <input type=checkbox />
      <SelectionIndicator />
    </span>
  </Checkbox.Control>
  <span simpleLabelWrap ref=textMotionRef>  ← squeeze target
    label + hint + error
  </span>
</label>
```

### 1. Control track opacity (disabled)

`useCheckboxControlTrackAnimation`:

- При смене `isDisabled`: GSAP `autoAlpha` → `0.48` disabled / `1` enabled
- First layout: instant set без anim
- Reduced motion: instant opacity, kill GSAP

### 2. Label text press squeeze

`useCheckboxTextMotion` → `usePressableElementTextMotion`:

- **enabled:** simple always (на label root); compound — если `useInlineCompoundMotion` (нет внешнего label wrap)
- **hoverLift: false** — только squeeze на `textMotionRef`
- `onPointerDown` на root `<label>` / `<fieldset>`

### 3. Check indicator

`Checkbox.Indicator` → `SelectionIndicator` + `useSelectionIndicatorAnimation`:

- checked: fill + check mark scale in
- unchecked: scale out
- `motionInteractive()` duration/ease

### Сводка

| Анимация | Утилита | `configureMotion` |
|----------|---------|-------------------|
| Track fade disabled | `useCheckboxControlTrackAnimation` | `interactiveDuration` |
| Label squeeze | `usePressableElementTextMotion` | `pressSqueezeScale` |
| Check mark | `useSelectionIndicatorAnimation` | `selectionFillDuration` |

## Стилизация и кастомизация

### Два уровня

1. **`className` на root** — grid layout на `<label>` / `<fieldset>` (мерж с `classNames.root`).
2. **`classNames`** — `CheckboxClassNamesProvider`.

Подчасти принимают **`className`**; `Checkbox.Indicator` — вложенные `classNames` для fill/mark.

### Слоты `CheckboxClassNames`

| Слот | DOM | Назначение |
|------|-----|------------|
| `root` | `<label>` / `<fieldset>` | Grid gap, padding, border карточки |
| `control` | Control cell | Alignment |
| `controlTrack` | Track span | Border ring вокруг input |
| `indicator` | SelectionIndicator shell | Size, rounded |
| `indicatorFill` | Fill layer | Checked background |
| `indicatorMark` | Check icon | Color |
| `content` | Content column | Gap label/hint/error |
| `label` | Label span | Cell typography wrapper |
| `labelText` | `Text` в label | Font, status color |
| `requiredMark` | `*` | Цвет asterisk |
| `hint` / `error` | Field hint/error | Secondary lines |
| `simpleLabelWrap` | Simple text column | Wrapper label+hint |
| `simpleLabelText` | Simple primary text | Подпись simple API |
| `input` | Hidden/overlay input | Rare — positioning |

### Simple API

```tsx
<Checkbox
  defaultChecked
  label="Email-рассылка"
  hint="classNames.label и labelText в simple API."
  className="max-w-md"
  classNames={{
    root: "rounded-mid border border-primary/20 p-base",
    controlTrack: "border-primary/40",
    label: "text-primary",
    labelText: "font-semibold underline decoration-primary/30",
    hint: "text-muted/80",
  }}
/>
```

### Compound API

```tsx
<Checkbox
  defaultChecked
  variant="outline"
  classNames={{
    root: "rounded-large border-primary/40 bg-primary/5 p-mid shadow-token-md",
    control: "ring-primary/30",
    controlTrack: "border-primary/50",
    indicator: "rounded-mid",
    indicatorFill: "rounded-[inherit]",
    labelText: "text-primary font-semibold",
    hint: "text-foreground/80",
  }}
>
  <Checkbox.Control>
    <Checkbox.Indicator />
  </Checkbox.Control>
  <Checkbox.Content>
    <Checkbox.Label>Согласие на рассылку</Checkbox.Label>
    <Checkbox.Hint>Все слоты через classNames.</Checkbox.Hint>
  </Checkbox.Content>
</Checkbox>
```

`Checkbox.Indicator classNames={{ indicatorMark: "text-primary" }}` мержится с root `classNames`.

### Практические заметки

- **Simple vs compound root:** simple — `<label>`; compound — `<fieldset>` (a11y group).
- **danger:** красит `labelText`; Form error auto-включает status.
- **CheckboxGroup:** `value` + single selection mode; стили на каждом `Checkbox` отдельно.
- **Не ломайте grid:** `root` задаёт `checkboxGridClass` — осторожно с `display` override.
- **Порядок мержа:** базовые → `classNames.slot` → `className` подчасти.

## Интеграция

| Контекст | Поведение |
|----------|-----------|
| `Form` | `name`, `checked`, `error` → status |
| `CheckboxGroup` | single/multi selection, `disabled`, `required` |

## Доступность

- Native `<input type="checkbox">` — focus, Space toggle
- `aria-describedby` hint/error; `aria-labelledby` / `aria-label`
- `aria-invalid` при status + error
- Compound fieldset: `aria-labelledby` от `Checkbox.Label`

## Структура файлов

```
Checkbox/
├── Checkbox.tsx
├── index.ts
├── checkboxTypes.ts
├── checkboxStyles.ts
├── checkboxAnimations.ts    # track opacity + text motion
├── checkboxParts.tsx
├── useCheckboxRootState.ts
├── checkboxAPI.ts
├── checkboxA11y.ts
└── Checkbox.stories.tsx
```

## Storybook

`Core Components/Checkbox` — simple/compound, variants, sizes, gloss, CheckboxGroup, `classNames`, status.
