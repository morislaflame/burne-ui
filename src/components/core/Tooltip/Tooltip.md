# Tooltip

Подсказка по **hover** и **focus**. Рендерится в portal (`document.body`), позиционируется относительно триггера. Compound API: `Tooltip.Trigger` + `Tooltip.Content`; опционально grid-слоты как у `Alert` (`Icon`, `Title`, `Description`).

## Импорт

```tsx
import { Tooltip, type TooltipProps, type TooltipVariant, type TooltipSize, type TooltipSide, type TooltipClassNames, type TooltipMotion, type TooltipTriggerProps, type TooltipContentProps } from "burne-ui";
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
| `motion` | — | Карта слотов; хост — `Tooltip.Content` (`content.enter` / `leave`) |

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

### Status

Semantic statuses (`danger`, `success`, `info`, `warning`) keep a **neutral panel** (by `variant`) and accent **title + icon** only — same pattern as Alert / Toast. Auto icon via `SEMANTIC_STATUS_ICONS` (react-icons/io5) unless custom `icon` is passed.

### Surface / variant

| Surface | Поведение |
|---------|-----------|
| `default` | `bg-surface` + `shadow-token-large` |
| `outline` / `secondary` | transparent / secondary shell |
| `gloss` | `gloss-panel` + gloss interactive ref на panel |

Размер влияет на padding panel, typography (`Text` variants) и icon box.

| size | Panel padding | Title Text |
|------|---------------|------------|
| `small` | compact | `small` |
| `base` | default | `base` |
| `mid` / `large` | увеличенные | `mid` |

## Анимации

`tooltipAnimations.ts` → slot motion на портале (`TOOLTIP_MOTION_DEFAULTS`). Root без DOM портала передаёт карту `motion` в context; хост — `Tooltip.Content`.

**DOM:**

```
<div class=root>                         ← wraps trigger
  <button|span|asChild> Trigger        ← aria-describedby when open
  portal → document.body
    <div role=tooltip id=tooltipId ref=tipRef>   ← слот `content`
      [Tooltip.Arrow]
      <Tooltip.Panel | gloss-panel>
```

Нет trigger squeeze (в отличие от Popover) — show по hover/focus.

### Slot motion

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `content` | `enter` / `leave` | `portalSurfaceEnter` / `portalSurfaceLeave` (`motionTooltip()`) |

`leave: false` — портал размонтируется сразу после hide. Factory на `leave` должна вернуть tween (кит ждёт `onComplete`).

**Где в коде:** типы — `tooltipTypes.ts`; scope — `tooltipContext.tsx`; defaults + host — `tooltipAnimations.ts`; Content-provider — `tooltipParts.tsx`; карта на корне — `Tooltip.tsx`.

```tsx
<Tooltip motion={{ content: { leave: false } }}>…</Tooltip>

<Tooltip
  motion={{
    content: {
      enter: (ctx) => gsap.fromTo(ctx.el, { y: 8, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.22 }),
      leave: (ctx) => gsap.to(ctx.el, { y: 8, autoAlpha: 0, duration: 0.16 }),
    },
  }}
>
```

`classNames` / `className` на `title` / `description` / `indicator` сочетаются с factory на `content`. Вложенные части не отдельные motion-слоты — доставайте их из `ctx.el` (`data-part`). `leave` factory должна вернуть tween.

```tsx
<Tooltip
  delayShowMs={0}
  status="info"
  classNames={{
    panel: "border-token-info",
    indicator: "text-info",
    title: "text-info font-w-strong",
    description: "text-foreground/75",
  }}
  motion={{
    content: {
      enter: (ctx) => {
        const tl = gsap.timeline();
        const title = ctx.el.querySelector("[data-part=title]");
        tl.fromTo(ctx.el, { y: 12, autoAlpha: 0, scale: 0.96 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.24 }, 0);
        if (title) tl.fromTo(title, { y: 8 }, { y: 0, duration: 0.26 }, 0.08);
        return tl;
      },
      leave: (ctx) => gsap.to(ctx.el, { y: 8, autoAlpha: 0, duration: 0.16 }),
    },
  }}
>
  <Tooltip.Trigger asChild><Button>Hint</Button></Tooltip.Trigger>
  <Tooltip.Content>
    <Tooltip.Title data-part="title" className="font-w-strong">Stagger</Tooltip.Title>
    <Tooltip.Description className="text-muted">…</Tooltip.Description>
  </Tooltip.Content>
</Tooltip>
```

#### Кастомизация timing

```ts
configureMotion({
  tooltipDuration: 200,
  interactiveEase: "power2.out",
});
```

Локально: `delayShowMs` на root (default `240`). **Reduced motion:** `applyReducedPortalMotion` / instant unmount.

### 2. Shadow / gloss surface

| surface | Поведение |
|---------|-----------|
| `default` | `shadow-token-large` — large elevation на bubble |
| `gloss` | `createGlossInteractiveRefCallback` на gloss panel |

Tooltip — floating overlay с постоянной large-тенью (как Popover / Dialog).

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
| Portal enter/exit | `portalSurfaceEnter` / `Leave` | `tooltipDuration`, `interactiveEase` | `motion.content` |
| Show delay | `setTimeout` | — | `delayShowMs` |
| Rest shadow | `shadow-token-large` | — | `variant="default"` |
| Gloss ref | gloss utils | — | `variant="gloss"` |
| Reposition | `computeTooltipPlacement` | — | `side` |

## Токены и CSS

| Класс / токен | Назначение |
|---------------|------------|
| `TOOLTIP_PANEL_CLASS` | Bubble surface, border, padding per size |
| `TOOLTIP_MESSAGE_GRID` | Alert-like grid для Icon/Title/Description |
| status accents | `text-*` on title + indicator only (neutral shell) |
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
| `arrow` | Arrow span | Fill/border стрелки (matches panel, not status) |
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
- Focus: trigger получает `tabIndex={0}` + `focus-ring` если рендерится как `<span>` wrapper (`asChild={false}`)
- **`asChild` (default):** child должен быть фокусируемым интерактивным элементом; ring управляет child (Button/Link). Avatar без `tabIndex` — невалидный trigger
- Arrow / icons: `aria-hidden`

## Структура файлов

```
Tooltip/
├── Tooltip.tsx               # карта motion через Provider (Root без портала)
├── index.ts
├── tooltipTypes.ts           # TooltipMotion
├── tooltipStyles.ts
├── tooltipAnimations.ts      # TOOLTIP_MOTION_DEFAULTS, useTooltipPortalMotion
├── tooltipParts.tsx          # Content — хост + useMotionPart
├── tooltipPosition.ts
├── useTooltipRootState.ts
├── tooltipAPI.ts
├── tooltipA11y.ts
├── tooltipContext.tsx        # createMotionScope("Tooltip")
└── Tooltip.stories.tsx
```

## Storybook

`Core Components/Tooltip` — variants, statuses, gloss grid, semantic icons, light theme, a11y, `classNames`.
