# Tooltip

Подсказка по **hover** и **focus**. Рендерится в portal (`document.body`), позиционируется относительно триггера. Compound API: `Tooltip.Trigger` + `Tooltip.Content`; опционально grid-слоты как у `Alert` (`Icon`, `Title`, `Description`).

## Импорт

```tsx
import { Tooltip, type TooltipProps, type TooltipVariant, type TooltipSize, type TooltipSide, type TooltipClassNames, type TooltipTriggerProps, type TooltipContentProps } from "burne-ui";
```

## API

### Базовое использование

```tsx
<Tooltip delayShowMs={240} variant="default" side="top">
  <Tooltip.Trigger>
    <Button variant="outline" type="button">
      Наведи или сфокусируй
    </Button>
  </Tooltip.Trigger>
  <Tooltip.Content showArrow>
    <Tooltip.Arrow />
    Подсказка
  </Tooltip.Content>
</Tooltip>
```

### Compound с title / description

```tsx
<Tooltip status="info" variant="gloss" delayShowMs={0}>
  <Tooltip.Trigger>
    <Button type="button">Статус</Button>
  </Tooltip.Trigger>
  <Tooltip.Content showArrow>
    <Tooltip.Arrow />
    <Tooltip.Icon />
    <Tooltip.Title>Информация</Tooltip.Title>
    <Tooltip.Description>Дополнительный контекст</Tooltip.Description>
  </Tooltip.Content>
</Tooltip>
```

### Root props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `variant` | `default` | `default` \| `outline` \| `secondary` \| `danger` \| `success` \| `info` \| `warning` |
| `status` | `default` | `default` | `danger` | `success` | `info` | `warning` |
| `size` | `base` | `small` \| `base` \| `mid` \| `large` |
| `side` | `top` | `top` \| `bottom` \| `left` \| `right` (+ auto-flip) |
| `delayShowMs` | `240` | Задержка перед показом |
| `icon` | — | Иконка для semantic variants |
| `showIcon` | auto | Показать/скрыть indicator |
| `classNames` | — | Слоты (см. ниже) |

### Compound-подчасти

| Часть | Назначение |
|-------|------------|
| `Tooltip.Trigger` | Hover/focus target; `aria-describedby` |
| `Tooltip.Content` | Portal wrapper + positioning |
| `Tooltip.Panel` | Поверхность bubble (simple title/description внутри) |
| `Tooltip.Arrow` | Стрелка к триггеру |
| `Tooltip.Icon` / `Indicator` | Semantic icon slot |
| `Tooltip.Message` | Grid wrapper (`display: contents`) |
| `Tooltip.Title` / `Description` | Текстовые слоты |

### `TooltipClassNames`

`root`, `trigger`, `content`, `arrow`, `panel`, `glossPanel`, `glossContent`, `message`, `indicator`, `icon`, `title`, `description`.

`root` и `trigger` применяются к триггеру (в т.ч. при `cloneElement` единственного child).

## Variant / status / размеры

### Variant

Semantic variants (`danger`, `success`, `info`, `warning`) автоматически показывают status icon через `SEMANTIC_STATUS_ICONS` (react-icons/io5), если не передан кастомный `icon`. Дефолтный SVG принимает слот `classNames.icon`.

### Surface

| Surface | Поведение |
|---------|-----------|
| `default` | `bg-surface` + persistent `shadowSm` |
| `gloss` | `gloss-panel` + gloss interactive ref на panel |

Размер влияет на padding panel, typography (`Text` variants) и icon box.

| size | Panel padding | Title Text |
|------|---------------|------------|
| `small` | compact | `small` |
| `base` | default | `base` |
| `mid` / `large` | увеличенные | `mid` |

## Анимации

`tooltipAnimations.ts` → `useTooltipPortalMotion` + `tooltipPosition.ts`.

**DOM:**

```
<div class=root>                         ← wraps trigger
  <button|span|asChild> Trigger        ← aria-describedby when open
  portal → document.body
    <div role=tooltip id=tooltipId ref=tipRef>
      [Tooltip.Arrow]
      <Tooltip.Panel | gloss-panel>
        <Tooltip.Message>              ← display:contents grid
          <Tooltip.Icon />
          <Tooltip.Title />
          <Tooltip.Description />
```

Нет trigger squeeze (в отличие от Popover) — show по hover/focus.

### 1. Show / hide pipeline

**Schedule show:**

1. `pointerenter` / `focus` → `scheduleShow()` после `delayShowMs`
2. `pointerleave` / `blur` / `Escape` → `hide()` + cancel timer

**Portal mount + animate:**

1. `open=true` → mount portal
2. `computeTooltipPlacement()` — fixed `left`/`top`, auto side flip
3. `animatePortalOpen({ scale: 0.97→1, ...motionTooltip() })`
4. Close: `animatePortalClose({ autoAlpha: 0 })` → unmount

**Reduced motion:** `applyReducedPortalMotion` / instant unmount.

#### Кастомизация timing

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  tooltipDuration: 200,
  interactiveEase: "power2.out",
});
```

Локально: `delayShowMs` на root (default `240`).

### 2. Shadow / gloss surface

| surface | Поведение |
|---------|-----------|
| `default` | `usePersistentElShadow(tipRef, shadowSm)` — persistent sm на bubble |
| `gloss` | `createGlossInteractiveRefCallback` на gloss panel |

Tooltip — **2nd level** floating surface с постоянной тенью в rest (как Popover default).

### 3. Reposition on reflow

На `open`, `scroll`, `resize` — пересчёт placement без re-mount.

Arrow position синхронизируется с `resolvedSide`.

### 4. Semantic icon

Status variants auto-inject icon (`SEMANTIC_STATUS_ICONS`, io5). Icon cell не анимируется отдельно.

### Чего нет

- Trigger press squeeze
- Hover lift на trigger
- Ripple
- Outside click dismiss (tooltip не modal)

### Сводка: что настраивается где

| Анимация | Утилита | Ключи `configureMotion` | Локальный prop |
|----------|---------|---------------------------|----------------|
| Portal enter/exit | `animatePortalOpen/Close` | `tooltipDuration`, `interactiveEase` | `surface` |
| Show delay | `setTimeout` | — | `delayShowMs` |
| Persistent shadow | `usePersistentElShadow` | — | `variant="default"` |
| Gloss ref | gloss utils | — | `variant="gloss"` |
| Reposition | `computeTooltipPlacement` | — | `side` |

## Токены и CSS

| Класс / токен | Назначение |
|---------------|------------|
| `TOOLTIP_PANEL_CLASS` | Bubble surface, border, padding per size |
| `TOOLTIP_MESSAGE_GRID` | Alert-like grid для Icon/Title/Description |
| semantic status surfaces | `danger`/`success`/… tint на panel |
| `gloss-panel` + `gloss-content` | Gloss surface |
| `burneLightThemePortalProps` | Light theme inheritance в portal |

## Стилизация и кастомизация

### Два уровня

1. **`className` на подчастях** — `Trigger`, `Content`, `Panel`, `Arrow` merge в слот.
2. **`classNames` на root `Tooltip`** — все слоты через `TooltipClassNamesProvider`.

`root` и `trigger` применяются к trigger element (в т.ч. `cloneElement` единственного child).

### Слоты `TooltipClassNames`

| Слот | DOM | Когда использовать |
|------|-----|-------------------|
| `root` / `trigger` | Trigger element | Ring, focus outline helpers |
| `content` | Portal wrapper | Outer shell, ring |
| `arrow` | Arrow span | Tint/border стрелки |
| `panel` | Bubble surface | Background, border, padding |
| `glossPanel` | Gloss shell | При `variant="gloss"` (вместе с `panel`) |
| `glossContent` | Inner gloss grid | Content area в gloss |
| `message` | Grid wrapper (`display:contents`) | Compound layout spacing |
| `indicator` / `icon` | Icon cell | Semantic icon color/size |
| `title` / `description` | Text cells | Typography hierarchy |

### Simple text tooltip

```tsx
<Tooltip delayShowMs={240} side="top">
  <Tooltip.Trigger>
    <Button variant="outline" type="button">Наведи</Button>
  </Tooltip.Trigger>
  <Tooltip.Content showArrow>
    <Tooltip.Arrow />
    Короткая подсказка
  </Tooltip.Content>
</Tooltip>
```

### Semantic compound (как Alert grid)

```tsx
<Tooltip
  delayShowMs={0}
  status="info"
  variant="gloss"
  classNames={{
    panel: "border-primary/30",
    title: "text-primary font-semibold",
    description: "text-muted/80",
  }}
>
  <Tooltip.Trigger>
    <Button variant="outline" type="button">Статус</Button>
  </Tooltip.Trigger>
  <Tooltip.Content showArrow>
    <Tooltip.Arrow />
    <Tooltip.Icon />
    <Tooltip.Title>Информация</Tooltip.Title>
    <Tooltip.Description>Дополнительный контекст</Tooltip.Description>
  </Tooltip.Content>
</Tooltip>
```

### asChild trigger

`asChild` (по умолчанию `true` при одном element-child): handlers и `aria-describedby` merge на child — задайте `aria-label` на icon-only кнопках. `asChild={false}` — обёртка `<span>`.

### Практические заметки

- `delayShowMs={0}` — Storybook / instant tooltips.
- Portal наследует light theme через `burneLightThemePortalProps`.
- **Не фиксируйте `transform`/`left`/`top` на `content`** — positioning + GSAP.
- Semantic variants: icon auto unless `showIcon={false}` или custom `icon`.
- Gloss grid: `Tooltip.Message` + Icon/Title/Description как у `Alert`.
- **Порядок мержа:** variant/status → `classNames.slot` → `className` подчасти.

## Интеграции

| Компонент | Использование |
|-----------|---------------|
| `Avatar` | Tooltip по `nickname` |
| `Button` | Частый trigger |
| `Alert` | Общий message banner grid layout |

## Доступность

- Trigger: `aria-describedby={tooltipId}` когда `open`
- Content: `role="tooltip"`, `id={tooltipId}`
- Keyboard: `Escape` закрывает
- Focus: trigger получает `tabIndex={0}` если рендерится как `<span>` wrapper
- Arrow / icons: `aria-hidden`

## Структура файлов

```
Tooltip/
├── Tooltip.tsx
├── index.ts
├── tooltipTypes.ts
├── tooltipStyles.ts
├── tooltipAnimations.ts      # useTooltipPortalMotion
├── tooltipParts.tsx
├── tooltipPosition.ts
├── useTooltipRootState.ts
├── tooltipAPI.ts
├── tooltipA11y.ts
├── tooltipContext.tsx
└── Tooltip.stories.tsx
```

## Storybook

`Core Components/Tooltip` — variants, statuses, gloss grid, semantic icons, light theme, a11y, `classNames`.
