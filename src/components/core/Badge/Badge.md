# Badge

Компактный статус-бейдж: текст, иконка, icon-only, dot и overlay через `Badge.Anchor`. Есть `variant`, `status`, размеры, `gloss` и hover-lift как у компонентов второго уровня.

## Импорт

```tsx
import {
  Badge,
  type BadgeProps,
  type BadgeAnchorProps,
  type BadgeVariant,
  type BadgeStatus,
  type BadgeSize,
  type BadgePlacement,
  type BadgeIconPosition,
  type BadgeInlineIconPosition,
  type BadgeClassNames,
} from "burne-ui";
```

## API

### Simple API

```tsx
<Badge status="success">Опубликовано</Badge>

<Badge
  status="info"
  icon={<IoRocketOutline aria-hidden />}
  iconPosition="start"
>
  Старт
</Badge>
```

### Inline icon API

```tsx
<Badge variant="secondary">
  <IoCheckmarkCircleOutline data-icon="inline-start" />
  Verified
</Badge>

<Badge variant="outline">
  Bookmark
  <IoBookmarkOutline data-icon="inline-end" />
</Badge>
```

### Icon-only / dot

```tsx
<Badge
  status="danger"
  icon={<IoHeartOutline aria-hidden />}
  aria-label="Избранное"
/>

<Badge dot status="info" aria-label="Есть обновления" />
```

### Overlay через `Badge.Anchor`

```tsx
<Badge.Anchor>
  <Avatar size="large" label="Jordan Doe" src={avatarUrl} alt="" />
  <Badge status="danger" size="small">
    5
  </Badge>
</Badge.Anchor>
```

### Props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `variant` | `default` | `default` \| `primary` \| `outline` \| `secondary` \| `gloss` |
| `status` | `default` | `default` \| `danger` \| `success` \| `info` \| `warning` |
| `size` | `base` | `small` \| `base` \| `mid` \| `large` |
| `icon` | — | Иконка из `react-icons/io5` или ReactNode |
| `iconPosition` | `start` | `start` \| `end` |
| `iconOnly` | `false` | Принудительный icon-only layout |
| `dot` | `false` | Только круглый индикатор |
| `placement` | `top-right` внутри anchor | Позиция overlay |
| `hoverLift` | `true` | Hover shadow/lift |
| `className` | — | Root layout class |
| `classNames` | — | Слоты |

### `Badge.Anchor` props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `hoverLift` | `true` | Поднимать direct child badge через anchor |
| `className` | — | Wrapper |
| `classNames` | — | Общие слоты для anchor и вложенного badge |

### `BadgeClassNames`

`root`, `text`, `iconOnly`, `dot`, `anchor`.

## Variant / status / размеры

### Variant

| Variant | Поверхность |
|---------|-------------|
| `default` | `bg-surface border-token text-foreground` |
| `primary` | `bg-primary text-primary-foreground` |
| `outline` | transparent + border |
| `secondary` | `bg-secondary text-secondary-foreground` |
| `gloss` | `gloss-panel` |

### Status

`status !== "default"` переопределяет смысловой цвет:

- `default`: variant surface
- `danger`, `success`, `info`, `warning`: semantic tint/fill/border/text через `semanticStatusSurface`

### Размеры

| Size | Text variant | Icon size |
|------|--------------|-----------|
| `small` | `tools` | `icon-small` |
| `base` | `small` | `icon-small` |
| `mid` | `small` | `icon-base` |
| `large` | `base` | `icon-large` |

## Анимации

`badgeAnimations.ts`.

**DOM (text):**

```
<span data-badge-root data-icon=start|end>
  <Text as="span" inheritColor>...</Text>
</span>
```

**DOM (Badge.Anchor split-lift):**

```
<div data-badge-anchor>
  <Avatar />
  <span data-badge-root class=placement>
    <span data-badge-lift-target>Badge content</span>
  </span>
</div>
```

### 1. Self hover lift

Для обычного badge:

- `variant="gloss"` → `useGlossInteractiveHandlers`
- не gloss → `useSecondLevelShadow`
- rest shadow: `shadowSm`
- hover shadow/lift: second-level shadow motion

`hoverLift={false}` отключает self-lift.

### 2. Split lift внутри `Badge.Anchor`

Если `Badge` — direct child `Badge.Anchor`, не gloss и `hoverLift=true`:

1. Badge регистрирует `innerLiftRef` в anchor context.
2. Pointer events обрабатывает `Badge.Anchor`.
3. Anchor применяет `useSecondLevelShadowContainer` к `data-badge-lift-target`.
4. Сам badge получает `pointer-events-none`, чтобы не дублировать hover.

Для `variant="gloss"` split-lift не включается: используется gloss self motion.

### 3. Gloss interaction

`variant="gloss"`:

- ref биндинг через `createGlossInteractiveRefCallback`
- pointer handlers из `useGlossInteractiveHandlers`
- motion class `GLOSS_INTERACTIVE_MOTION_CLASS`

#### Кастомизация

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  badgeAnchorHoverLiftScale: 1.04,
  hoverLiftScale: 1.025,
  hoverLiftEase: "sine.inOut",
  enableHoverLift: true,
});
```

Gloss lift — отдельная кривая, не sm→md shadow tokens.

### Чего нет

- Press squeeze
- Ripple (можно рядом с anchor child)
- Portal motion на самом badge
- FLIP при смене layout

### Сводка: что настраивается где

| Анимация | Утилита | Ключи `configureMotion` | Локальный prop |
|----------|---------|---------------------------|----------------|
| Self shadow/lift | `useSecondLevelShadow` | `hoverLiftScale`, `enableHoverLift` | `hoverLift`, `!gloss` |
| Anchor split-lift | `useSecondLevelShadowContainer` | `badgeAnchorHoverLiftScale` | `Badge.Anchor` child |
| Gloss hover | `useGlossInteractiveHandlers` | gloss tokens | `variant="gloss"` |
| Layout switch | React render | — | `dot` / `iconOnly` / text |

## Токены и CSS

| Класс / токен | Назначение |
|---------------|------------|
| `semanticStatusSurface` | Status tint per `status` |
| `BADGE_TEXT_CLASS` | Inline-flex row, gap icons |
| `BADGE_DOT_CLASS` | Ring + fill dot |
| `BADGE_ICON_ONLY_CLASS` | Square icon badge |
| `shadow-token-sm` / `md` | Через `--el-shadow` при hover lift |
| `gloss-panel gloss-deep` | Gloss badge surface |
| `data-badge-anchor` | Anchor grid positioning |

## Стилизация и кастомизация

### Два уровня

1. **`className` на `Badge`** — конкретный rendered layout (`text`, `dot`, `iconOnly`).
2. **`classNames` на root** — общие слоты, включая `anchor` для `Badge.Anchor`.

### Слоты `BadgeClassNames`

| Слот | DOM | Когда использовать |
|------|-----|-------------------|
| `root` | Все layouts | Общий radius/border |
| `text` | Text badge row | Surface/text, inline icons |
| `iconOnly` | Icon-only layout | Square padding, icon color |
| `dot` | Dot layout | Ring/fill online indicator |
| `anchor` | `Badge.Anchor` root | Overlay grid на Avatar/Card |

### Text badge (simple)

```tsx
<Badge
  status="info"
  classNames={{
    root: "rounded-large",
    text: "border-info/50 bg-info/10 text-info",
  }}
>
  Глобальный стиль текста
</Badge>
```

### Icon-only / dot

```tsx
<Badge
  iconOnly
  icon={<IoRocketOutline aria-hidden />}
  aria-label="Новое"
  classNames={{
    iconOnly: "border-success/40 bg-success/10 text-success",
  }}
/>

<Badge
  dot
  status="success"
  aria-label="Онлайн"
  classNames={{ dot: "ring-2 ring-background bg-success" }}
/>
```

### Anchor overlay (compound)

```tsx
<Badge.Anchor
  placement="top-right"
  classNames={{
    anchor: "rounded-full ring-2 ring-primary/30",
    dot: "ring-2 ring-background bg-success",
  }}
>
  <Avatar size="base" label="Demo" />
  <Badge dot status="success" aria-label="Онлайн" hoverLift={false} />
</Badge.Anchor>
```

`hoverLift={false}` на overlay badge — lift обрабатывает anchor target.

### Практические заметки

- Иконки: `react-icons/io5`.
- Icon-only/dot: обязательный `aria-label` если несут смысл.
- Inline icons: `data-icon="start"|"end"`, decorative без `aria-label`.
- **Не pointer handlers на badge внутри Anchor** — events на anchor.
- `placement`: `top-right` | `top-left` | `bottom-right` | `bottom-left`.
- **Не `transform` на root при hoverLift** — конфликт с GSAP lift.

## Интеграции

| Компонент | Сценарий |
|-----------|----------|
| `Avatar` | Онлайн-статус, счётчик уведомлений |
| `Card` | Label/status внутри footer или overlay |
| `Button` | Статус рядом с action |
| `Tooltip` | При необходимости описания icon-only badge |

## Доступность

- Текстовый badge читается обычным текстом.
- Dot/icon-only с `aria-label` получает `role="img"`.
- Dot/icon-only без accessible name получает `aria-hidden` + `role="presentation"`.
- Иконки в text badge декоративные: `aria-hidden=true`, если нет собственного `aria-label`.

## Структура файлов

```
Badge/
├── Badge.tsx
├── index.ts
├── badgeTypes.ts
├── badgeStyles.ts
├── badgeAnimations.ts
├── badgeContext.tsx
├── badgeParts.tsx
├── useBadgeRootState.ts
├── badgeAPI.tsx
├── badgeA11y.ts
└── Badge.stories.tsx
```

## Storybook

`Core Components/Badge` — размеры/variants, statuses, light theme, `Badge.Anchor`, inline icons, icon-only, dots, custom colors, `classNames`, gloss.
