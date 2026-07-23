# Radio

Радиокнопка с dot-индикатором (`SelectionIndicator`), simple API и compound (`Control` / `Content` / `Label`). Интеграция с `RadioGroup` и `Form`. Структура близка к Checkbox, но всегда `<label>` root и `dot` вместо check.

## Импорт

```tsx
import { Radio, type RadioProps, type RadioVariant, type RadioSize, type RadioClassNames } from "burne-ui";
```

## API

### Simple API

```tsx
<Radio
  name="shipping"
  value="express"
  label="Экспресс-доставка"
  hint="1–2 дня"
  defaultChecked
/>
```

### Compound API

```tsx
<Radio name="shipping" value="express" defaultChecked variant="gloss">
  <Radio.Control>
    <Radio.Indicator />
  </Radio.Control>
  <Radio.Content>
    <Radio.Label required>Курьер</Radio.Label>
    <Radio.Hint>Доставка в день заказа</Radio.Hint>
    <Radio.Error>Недоступно в регионе</Radio.Error>
  </Radio.Content>
</Radio>
```

### Root props (ключевые)

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `variant` | `default` | `default` \| `gloss` |
| `size` | `base` | `small` \| `base` \| `mid` \| `large` |
| `checked` / `defaultChecked` | — | Controlled / uncontrolled (вне группы) |
| `value` | — | Значение option (обязательно с `name` / группой) |
| `name` | — | Группа radios / RadioGroup |
| `onChange` | — | Native change |
| `disabled` | `false` | + track opacity anim |
| `danger` | `false` | Красный label text |
| `label` / `hint` / `error` | — | Simple API |
| `classNames` | — | см. стилизацию |

Повторный клик по выбранному radio **снимает выбор** (если не `required` и не required-группа).

### `RadioClassNames`

`root`, `control`, `controlTrack`, `indicator`, `indicatorFill`, `indicatorMark`, `content`, `label`, `labelText`, `requiredMark`, `hint`, `error`, `simpleLabelWrap`, `simpleLabelText`, `input`.

### Compound-подчасти

| Часть | Роль |
|-------|------|
| `Radio.Control` | Visually hidden input + track + indicator |
| `Radio.Indicator` | `SelectionIndicator` с `dot` |
| `Radio.Content` | Label column |
| `Radio.Label` / `Hint` / `Error` | Текстовые слоты |

`Radio.Indicator` compound: `.Fill`, `.Mark` (от `SelectionIndicator`).

## variant

| variant | Indicator |
|---------|-----------|
| `default` | `SelectionIndicator` variant `base` — border + dot |
| `gloss` | variant `gloss` — `gloss-indicator` |

## Размеры

`RADIO_SIZE_LAYOUT` (= shared `OPTION_CONTROL_SIZE_LAYOUT`): grid gap, title/desc variants.

## Анимации

`radioAnimations.ts` + `SelectionIndicator` + `usePressableElementTextMotion`.

**DOM (simple):**

```
<label root onPointerDown>
  <Radio.Control>
    <input type=radio visually-hidden />
    <span controlTrack ref=trackRef>
      <SelectionIndicator dot selected=mergedChecked />
    </span>
  </Radio.Control>
  <span simpleLabelWrap ref=textMotionRef>
    label + hint + error
  </span>
</label>
```

### 1. Control track opacity (disabled)

`useRadioControlTrackAnimation` — идентично Checkbox:

- disabled: `autoAlpha → 0.48`
- enabled: `→ 1`
- first layout + reduced motion: instant

### 2. Dot indicator

`Radio.Indicator` → `SelectionIndicator` с `dot`:

- fill scale + dot mark scale via `useSelectionIndicatorAnimation`
- при select: fill in + dot visible

### 3. Label text press squeeze

`useRadioTextMotion` → `usePressableElementTextMotion` (hoverLift: false):

- simple: squeeze на `simpleLabelWrap`
- compound: при `useInlineCompoundMotion` — на `Radio.Label` ref

### Сводка

| Анимация | Утилита | `configureMotion` |
|----------|---------|-------------------|
| Track disabled fade | `useRadioControlTrackAnimation` | `interactiveDuration` |
| Dot/fill | `useSelectionIndicatorAnimation` | `selectionFillDuration` |
| Label squeeze | `usePressableElementTextMotion` | `pressSqueezeScale` |

## Стилизация и кастомизация

### Два уровня

1. **`className` на root** — grid `<label>` (мерж с `classNames.root`).
2. **`classNames`** — `RadioClassNamesProvider`.

Подчасти — **`className`**; `Radio.Indicator` — вложенные `classNames` для root/fill/mark.

### Слоты `RadioClassNames`

| Слот | DOM | Назначение |
|------|-----|------------|
| `root` | `<label>` | Grid, padding, card border |
| `control` | Control cell | Alignment |
| `controlTrack` | Track вокруг indicator | Ring/border |
| `indicator` | SelectionIndicator shell | Size, gloss |
| `indicatorFill` | Fill layer | Checked tint |
| `indicatorMark` | Dot mark | Dot color/size |
| `content` | Content column | Gap hint/error |
| `label` / `labelText` | Label | Typography, danger |
| `requiredMark` | `*` | Asterisk color |
| `hint` / `error` | Secondary lines | Muted/error text |
| `simpleLabelWrap` / `simpleLabelText` | Simple column | Подпись simple API |
| `input` | Hidden radio | Positioning |

### Simple API

```tsx
<Radio
  name="delivery"
  value="express"
  defaultChecked
  label="Экспресс-доставка"
  hint="Слот label в simple API."
  className="max-w-md"
  classNames={{
    root: "rounded-mid border border-primary/20 p-base",
    controlTrack: "border-primary/40",
    label: "text-info",
    labelText: "font-semibold underline decoration-info/30",
    hint: "text-muted/80",
  }}
/>
```

### Compound API

```tsx
<Radio
  name="classnames"
  value="custom"
  defaultChecked
  variant="gloss"
  classNames={{
    root: "rounded-large border-primary/40 bg-primary/5 p-large shadow-token-md",
    control: "ring-primary/30",
    controlTrack: "border-primary/50",
    indicator: "rounded-mid",
    indicatorFill: "rounded-[inherit]",
    labelText: "text-primary font-semibold",
    hint: "text-foreground/80",
  }}
>
  <Radio.Control>
    <Radio.Indicator />
  </Radio.Control>
  <Radio.Content>
    <Radio.Label>Курьер</Radio.Label>
    <Radio.Hint>Все слоты через classNames.</Radio.Hint>
  </Radio.Content>
</Radio>
```

### Практические заметки

- **Radio vs Checkbox:** только single choice в группе; indicator — dot, не check.
- **RadioGroup:** `name` / `value` / selected из контекста; стили на каждом `Radio`.
- **Clear selection:** повторный click — UX opt-out; не ломайте `onChange` preventDefault без нужды.
- **Порядок мержа:** базовые → `classNames.slot` → `className` подчасти.

## Интеграция

| Контекст | Поведение |
|----------|-----------|
| `RadioGroup` | `selectedValue`, `name`, `disabled`, `required` |
| `Form` | `name`, errors → `danger` на label |

```tsx
<RadioGroup label="Доставка" name="shipping" defaultValue="standard">
  <Radio value="standard" label="Стандарт" />
  <Radio value="express" label="Экспресс" />
</RadioGroup>
```

## Доступность

- Native `<input type="radio">` — focus, arrow keys в группе
- Имя из видимой подписи (обёртка `<label>` / `Radio.Label`); `aria-label` из `value` — только fallback без подписи
- `aria-describedby` hint/error
- `data-selected` на label при checked

## Структура файлов

```
Radio/
├── Radio.tsx
├── index.ts
├── radioTypes.ts
├── radioStyles.ts
├── radioAnimations.ts       # track + text motion
├── radioParts.tsx
├── useRadioRootState.ts
├── radioAPI.ts
├── radioA11y.ts
└── Radio.stories.tsx
```

## Storybook

`Core Components/Radio` — simple/compound, gloss, RadioGroup, clear selection, `classNames`, a11y.
