# Radio

Радиокнопка с dot-индикатором (`SelectionIndicator`), simple API и compound (`Control` / `Content` / `Label`). Интеграция с `RadioGroup` и `Form`. Структура близка к Checkbox, но всегда `<label>` root и `dot` вместо check.

## Импорт

```tsx
import { Radio, type RadioProps, type RadioVariant, type RadioSize, type RadioClassNames, type RadioMotion } from "burne-ui";
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
| `motion` | — | `indicator` / `indicatorFill` / `indicatorMark` / `label` / `hint` / `error` (`check` / `uncheck`). `events` — app-команды |
| `motionController` | — | Simple API: форвардится на SelectionIndicator. Compound: Root chrome (`label` / `hint` / `error`); Indicator — второй handle |

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

`Radio.Indicator` → `SelectionIndicator` с `dot` + slot motion (`selectionFill` / `selectionMark`). Карта на корне Radio прокидывается как `indicator` / `indicatorFill` / `indicatorMark`. Compound: `motion` на `Radio.Indicator` / `.Fill` / `.Mark`.

**Где в коде:** карта слотов — `radioAnimations.ts` (`RADIO_MOTION_SLOT_MAP`, `resolveRadioIndicatorMotion`); scope chrome — `radioContext.tsx` (`label` / `hint` / `error`); host fill/mark — `selectionIndicatorAnimations.ts`.

Simple API — `motionController` форвардится в SelectionIndicator: `play()` играет слот `root`, `playSlot("fill")`. Compound chrome — handle на Root (`playSlot("label")`); индикатор — отдельный handle на `Radio.Indicator`. Явный `<Radio.Indicator motionController>` побеждает форвард с корня.

Проп `motionController` + ключ `events` на `motion` — app-команды (`radio:nudge`), не фазы. `createMotionEvents`. События на simple API играть через `playSlot("root", event)`. playground / Storybook **MotionController**.

```tsx
import { Button, Radio, createMotionEvents, useMotionControllerHandle } from "burne-ui";

const events = createMotionEvents({
  "radio:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1 },
});

function Nudge() {
  const controller = useMotionControllerHandle();
  return (
    <>
      <Button size="small" variant="outline" onClick={() => controller.playSlot("root", "radio:nudge")}>
        Nudge
      </Button>
      <Radio name="plan" value="pro" label="Pro" defaultChecked motionController={controller} motion={{ events }} />
    </>
  );
}
```

```tsx
<Radio
  name="plan"
  value="pro"
  label="Custom fill"
  motion={{
    indicatorFill: {
      check: (ctx) =>
        ctx.fromTo({ scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.4 }),
      uncheck: (ctx) => ctx.to({ scale: 0, autoAlpha: 0, duration: 0.22 }),
    },
    label: {
      check: (ctx) => tweenCssColor(ctx.el, "var(--color-primary)", { duration: 0.28 }),
      uncheck: (ctx) =>
        tweenCssColor(ctx.el, "var(--color-foreground)", {
          duration: 0.22,
          clearOnComplete: true,
        }),
    },
    hint: {
      check: (ctx) => tweenCssColor(ctx.el, "var(--color-primary)", { duration: 0.28 }),
      uncheck: (ctx) =>
        tweenCssColor(ctx.el, "var(--color-muted-foreground)", {
          duration: 0.22,
          clearOnComplete: true,
        }),
    },
  }}
/>
```

См. [Motion](/docs/motion) и `SelectionIndicator`.

### 3. Label text press squeeze

`useRadioTextMotion` → `usePressableElementTextMotion` (hoverLift: false):

- simple: squeeze на `simpleLabelWrap`
- compound: при `useInlineCompoundMotion` — на `Radio.Label` ref

### Сводка

| Анимация | Утилита | `configureMotion` |
|----------|---------|-------------------|
| Track disabled fade | `useRadioControlTrackAnimation` | `interactiveDuration` |
| Dot/fill | `Radio.Indicator` → SelectionIndicator | `selectionFillDuration` |
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
├── radioContext.tsx         # createMotionScope("Radio") + label; indicator embed
├── radioAnimations.ts       # RADIO_MOTION_SLOT_MAP + track/label motion
├── radioParts.tsx
├── useRadioRootState.ts
├── radioAPI.ts
├── radioA11y.ts
└── Radio.stories.tsx
```

## Storybook

`Core Components/Radio` — simple/compound, gloss, RadioGroup, clear selection, `classNames`, a11y, slot motion gallery.
