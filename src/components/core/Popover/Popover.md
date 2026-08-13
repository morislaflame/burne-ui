# Popover

Интерактивная плавающая панель: click/pointer toggle, outside dismiss, portal positioning. Compound API с `Header` / `Label` / `Hint` / `Body`. Позиционирование и стрелка переиспользуют `tooltipPosition`.

## Импорт

```tsx
import { Popover, type PopoverProps, type PopoverVariant, type PopoverSize, type PopoverSide, type PopoverContentGap, type PopoverClassNames, type PopoverAlign } from "burne-ui";
```

## API

### Базовое использование

```tsx
<Popover side="bottom" variant="default">
  <Popover.Trigger>
    <Button variant="outline" type="button">
      Настройки
    </Button>
  </Popover.Trigger>
  <Popover.Content>
    <Popover.Header>
      <Popover.Title>Фильтры</Popover.Title>
      <Popover.Description>Изменения применяются сразу</Popover.Description>
    </Popover.Header>
    <Popover.Body>
      Контент панели
    </Popover.Body>
  </Popover.Content>
</Popover>
```

### Controlled

```tsx
const [open, setOpen] = useState(false);

<Popover open={open} onOpenChange={setOpen}>
  <Popover.Trigger>Открыть</Popover.Trigger>
  <Popover.Content>...</Popover.Content>
</Popover>
```

### Root props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `variant` | `default` | `default` \| `gloss` |
| `size` | `base` | `small` \| `base` \| `mid` \| `large` |
| `side` | `bottom` | Сторона якоря |
| `open` / `defaultOpen` | `false` | Controlled / uncontrolled |
| `onOpenChange` | — | Колбэк |
| `anchorRef` | trigger | Внешний anchor для positioning |
| `shouldDismiss` | — | `(target) => boolean` — veto outside dismiss |
| `classNames` | — | Слоты |

### `Popover.Content` props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `showArrow` | `false` | Стрелка к anchor |
| `offset` | token default | Отступ от anchor |
| `gap` | — | Опциональный flex-gap между Header/Body (по умолчанию отступы частей как у Dialog/Card) |
| `matchAnchorWidth` | `false` | `minWidth` = ширина anchor |
| `align` | `center` / `start` | Выравнивание (`FloatingAlign`) |
| `unstyled` | `false` | Без padding частей / gap / minmax; radius + surface остаются |
| `contentRole` | `dialog` | `dialog` \| `undefined` |

### Compound-подчасти

| Часть | Назначение |
|-------|------------|
| `Popover.Trigger` | Toggle button / `asChild` clone |
| `Popover.Content` | Portal + panel shell |
| `Popover.Header` | Label + hint row |
| `Popover.Title` | `h2` заголовок |
| `Popover.Description` | `FieldHint` подзаголовок |
| `Popover.Body` | Основной контент |
| `Popover.Arrow` | Кастомная стрелка |

### `PopoverClassNames`

`root`, `trigger`, `content`, `panelRelative`, `panel`, `glossPanel`, `glossContent`, `arrow`, `header`, `label`, `hint`, `body`.

## Variant / размеры

| Variant | Поверхность |
|---------|-------------|
| `default` | `bg-surface border-token` + `shadow-token-large` |
| `gloss` | `gloss-panel` + gloss interactive handlers |

Sizes влияют на padding частей (`Header` / `Body`), typography (`Popover.Title` / `Hint`), radius и min/max width — общий пресет `PANEL_SIZE_LAYOUT` (с Dialog / AlertDialog / Card).

| size | header / body padding | title / desc |
|------|----------------------|--------------|
| `small` | `headerPadding` / `bodyPadding` | `small` / `xsmall` |
| `base` | same tokens as Dialog/Card | `base` / `small` |
| `mid` | same tokens as Dialog/Card | `mid` / `base` |
| `large` | same tokens as Dialog/Card | `large` / `base` |

Title/Description — отдельная шкала Popover (компактнее Dialog `titleVariant` / `descVariant`). Отступы Header/Body — те же `headerPadding` / `bodyPadding`, что у Dialog и Card. Опциональный `gap` на `Content` добавляет flex-gap между частями.

## Анимации

`popoverAnimations.ts` → `usePopoverContentLifecycle` + trigger squeeze в `popoverParts`.

**DOM:**

```
<div class=root>                         ← inline wrapper
  <button|asChild> Trigger               ← squeeze + aria-expanded
  portal → document.body
    <div ref=panelRef role=dialog>       ← fixed position target
      [Popover.Arrow]
      <div class=panel | glossPanel>     ← surface + persistent shadow
        <Popover.Header>
          <h2 Label> <FieldHint>
        <Popover.Body>
```

### 1. Open / close portal

`usePopoverContentLifecycle` (`useLayoutEffect` на `open` + `portalMounted`):

**Open sequence:**

1. `open=true` → `setPortalMounted(true)`
2. `reposition()` — `computeTooltipPlacement`, `position: fixed`, `left`/`top`
3. `animatePortalOpen({ surface: panel, vars: motionTooltip() })` — scale `0.97→1`, fade in
4. Default panel: CSS `shadow-token-large` (как Dialog / Drawer)

**Close sequence:**

1. `open=false` → `animatePortalClose({ autoAlpha: 0, ...motionTooltip() })`
2. `onComplete` → `setPortalMounted(false)` — unmount portal

**Reduced motion:** `isReducedModalMotion()` → `applyReducedPortalMotion` / instant unmount.

#### Кастомизация portal

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  tooltipDuration: 200,
  interactiveEase: "power2.out",
});
```

### 2. Trigger squeeze (`runOpenAfterSqueeze`)

`Popover.Trigger` на `pointerdown` (если закрыт):

1. `e.preventDefault()` при `asChild` — не дублировать squeeze child Button
2. `runOpenAfterSqueeze({ triggerRef, openingRef, setOpen: true })`

**Close:** `click` при `open=true` → immediate close; `Enter`/`Space` toggle.

### 3. Positioning + reflow

`reposition()` на:

- open + `requestAnimationFrame`
- `scroll` (capture), `resize`
- `ResizeObserver` на panel

`matchAnchorWidth` → `minWidth = max(anchor.width, 12rem)`.

`align` prop или auto `start` при `matchAnchorWidth`.

`resolvedSide` — фактическая сторона после flip.

### 4. Shadow / gloss

| variant | Поведение |
|---------|-----------|
| `default` | CSS `shadow-token-large` в покое (floating overlay, как Dialog) |
| `gloss` | `createGlossInteractiveRefCallback` на gloss panel; gloss pointer handlers |

Gloss panel ref: `bindGlossPanelRef` на inner gloss layer.

### 5. Outside dismiss

`pointerdown` на document → close, если target не в trigger/panel и `shouldDismiss(target)` !== false.

`Escape` → close + focus trigger.

### Чего нет

- Hover lift на trigger (только squeeze)
- Ripple (можно добавить в Trigger child)
- Height collapse внутри panel
- FLIP при смене content

### Сводка: что настраивается где

| Анимация | Утилита | Ключи `configureMotion` | Локальный prop |
|----------|---------|---------------------------|----------------|
| Portal enter/exit | `animatePortalOpen/Close` | `tooltipDuration`, `interactiveEase` | `variant` |
| Trigger squeeze | `runOpenAfterSqueeze` | `pressSqueezeScale` | `asChild` |
| Rest shadow | `shadow-token-large` | — | `variant="default"` |
| Gloss interactive | gloss utils | gloss tokens | `variant="gloss"` |
| Reposition | `computeTooltipPlacement` | — | `side`, `align`, `offset` |

## Токены и CSS

| Класс / токен | Назначение |
|---------------|------------|
| `POPOVER_DEFAULT_PANEL_CLASS` | `bg-surface border-token shadow-token-large` + radius из `PANEL_SIZE_LAYOUT` |
| `POPOVER_GLOSS_PANEL_CLASS` | `gloss-panel gloss-deep` |
| `shadow-token-large` | Rest panel shadow (default variant) |
| `burneLightThemePortalProps` | Theme sync в portal |
| `z-popover` stacking | Panel above page / dialog (`--z-popover`) |

## Стилизация и кастомизация

### Два уровня

1. **`className` на подчастях** — `Trigger`, `Content`, `Label`, `Body` merge в слот.
2. **`classNames` на root `Popover`** — все слоты через provider.

`unstyled` на `Content` — без padding `Header`/`Body`, gap и minmax; surface (border/bg/shadow) и **size radius** остаются на panel shell. Свой padding — через `Body` / children.

### Слоты `PopoverClassNames`

| Слот | DOM | Когда использовать |
|------|-----|-------------------|
| `root` | Wrapper | Outer layout (редко) |
| `trigger` | Trigger element | Ring, rounding на кнопке |
| `content` | Portal outer shell | z-index, outer ring |
| `panelRelative` | Relative wrapper вокруг panel | Positioning host между content и panel |
| `panel` | Default inner panel | Surface, border, radius |
| `glossPanel` / `glossContent` | Gloss layers | Glass surface + inner grid |
| `arrow` | Arrow span | Side tint, size |
| `header` | Header row | Label + hint layout |
| `label` | `h2` title | Typography заголовка |
| `hint` | `FieldHint` | Muted subtitle |
| `body` | Body block | Main content padding |

### Default panel с header

```tsx
<Popover
  side="bottom"
  classNames={{
    panel: "border-primary/25",
    label: "text-primary",
    hint: "text-muted/80",
    body: "text-foreground",
  }}
>
  <Popover.Trigger>
    <Button variant="outline" type="button">Настройки</Button>
  </Popover.Trigger>
  <Popover.Content>
    <Popover.Header>
      <Popover.Title>Фильтры</Popover.Title>
      <Popover.Description>Изменения применяются сразу</Popover.Description>
    </Popover.Header>
    <Popover.Body>Контент панели</Popover.Body>
  </Popover.Content>
</Popover>
```

### `matchAnchorWidth` + `unstyled` (как Dropdown)

```tsx
<Popover classNames={{ content: "ring-1 ring-primary/20" }}>
  <Popover.Trigger>Меню</Popover.Trigger>
  <Popover.Content matchAnchorWidth unstyled>
    <Popover.Body className="rounded-mid border border-token bg-surface p-base shadow-token-md">
      Кастомная поверхность
    </Popover.Body>
  </Popover.Content>
</Popover>
```

### `anchorRef` + `shouldDismiss`

```tsx
const anchorRef = useRef<HTMLDivElement>(null);

<div ref={anchorRef}>Custom anchor</div>
<Popover anchorRef={anchorRef} shouldDismiss={(t) => !nestedPortalContains(t)}>
  ...
</Popover>
```

### Практические заметки

- `anchorRef` — panel к произвольному элементу, не только trigger.
- `shouldDismiss` — veto для nested portals (Dropdown submenu pattern).
- `contentRole={undefined}` — убрать dialog semantics для decorative panels.
- `unstyled` + свой layout в `Body` для кастомных меню.
- **Не override `position`/`left`/`top`/`transform` на content** — positioning + GSAP scale.
- Gloss: стили panel на `glossPanel`, контент в `glossContent`.
- **Порядок мержа:** variant panel → `classNames.slot` → `className` подчасти.

## Интеграции

| Компонент | Сценарий |
|-----------|----------|
| `Dropdown` | Меню действий (отдельный компонент) |
| `Select` / `ComboBox` | Popover-like positioning patterns |
| `Breadcrumbs` | Ellipsis menu через `Dropdown` |

## Доступность

- Trigger: `aria-expanded`, `aria-haspopup="dialog"`, `aria-controls={popoverId}` when open
- Content: `role="dialog"` (default), `aria-labelledby`, `aria-describedby`
- `Popover.Title` / `Hint` связываются через `labelId` / `hintId`
- При open — фокус на первый focusable внутри панели
- При close — возврат фокуса на trigger / `anchorRef`
- `Escape` закрывает
- Outside `pointerdown` dismiss (с учётом `shouldDismiss`)
- Portal theme sync через `burneLightThemePortalProps`
- **`asChild`:** child должен быть фокусируемым интерактивным элементом (`Button`, `Link`, native `<button>`). Нефокусируемый child (например `Avatar` без `tabIndex`) не получит keyboard focus / ring — используйте default Trigger или явно задайте `tabIndex={0}` + `focus-ring` на child.

## Структура файлов

```
Popover/
├── Popover.tsx
├── index.ts
├── popoverTypes.ts
├── popoverStyles.ts
├── popoverAnimations.ts       # lifecycle + positioning
├── popoverParts.tsx
├── usePopoverRootState.ts
├── popoverAPI.ts
├── popoverA11y.ts
├── popoverContext.tsx
└── Popover.stories.tsx
```

## Storybook

`Core Components/Popover` — default/gloss, controlled, anchorRef, matchAnchorWidth, arrow, light theme, `classNames`.
