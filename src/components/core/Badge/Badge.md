# Badge

Компактный статус-бейдж: текст, иконка, icon-only, dot и overlay через `Badge.Anchor`. Есть `variant`, `status`, размеры, `gloss` и hover-lift как у компонентов второго уровня.

## Импорт

```tsx
import { Badge, type BadgeProps, type BadgeAnchorProps, type BadgeVariant, type BadgeStatus, type BadgeSize, type BadgePlacement, type BadgeIconPosition, type BadgeInlineIconPosition, type BadgeClassNames, type BadgeMotion, type BadgePartMotion } from "burne-ui";
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
| `hoverLift` | `true` | Hover shadow/lift. Shorthand for `motion.root.hoverIn/Out: false` |
| `motion` | — | Карта слотов `root` / `anchor` |
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

Как у `Button`: `status` накладывается поверх `variant` через `semanticStatusSurface`.

| variant | status = default | status ≠ default |
|---------|------------------|------------------|
| `default` | surface + border | tint (`bg-surface-tint-*`) + `text-*` |
| `primary` | `bg-primary` | fill (`bg-danger` / … + `*-foreground`) |
| `outline` | transparent + outline border | `border-token-*` + `text-*` |
| `secondary` | `bg-secondary` | тот же surface; `text-*` |
| `gloss` | `gloss-panel` | `gloss-text-*` |

`dot` — заливка точки следует status/variant (индикатор).

### Размеры

| Size | Text variant | Icon size | Dot size | Chip pad | Circle size |
|------|--------------|-----------|----------|----------|-------------|
| `small` | `xsmall` | `icon-small` | `icon-xsmall` | `--chip-px/py-small` | `--chip-size-small` |
| `base` | `small` | `icon-base` | `icon-small` | `--chip-px/py-base` | `--chip-size-base` |
| `mid` | `base` | `icon-base` | `icon-bse` | `--chip-px/py-mid` | `--chip-size-mid` |
| `large` | `mid` | `icon-mid` | `icon-mid` | `--chip-px/py-large` | `--chip-size-large` |

`--chip-*` — внутренние CSS-переменные (доля `--space-*`), общие с `Kbd`. Не входят в публичный token API.

### Круглый layout

`rounded-full` + явный `--chip-size-*` (равные width/height), когда:

- **icon-only** — только `icon` / `iconOnly` / inline-icon без текста
- **одна цифра** `0`–`9` в `children` (например счётчик на `Badge.Anchor`)

Многосимвольный текст (`12`, `New`) остаётся pill с `--chip-px/py-*`.

## Анимации

`badgeAnimations.ts` — публичный slot motion. Компонент **2-го уровня**: rest-тень всегда, hover через слот `root` / `anchor`.

### Slot motion

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `root` | `hoverIn` / `hoverOut` | `hoverLiftSecondLevel` или `hoverLiftGloss`; `false` внутри `Badge.Anchor` split-lift |
| `anchor` | `hoverIn` / `hoverOut` | `hoverLiftSecondLevel` с `params.liftScale` = `badgeAnchorHoverLiftScale` |

`hoverLift={false}` = `motion.root.hoverIn/Out: false` (rest-тень остаётся). На `Badge.Anchor` то же для `motion.anchor`. Явный `motion.root.hoverIn` важнее `hoverLift`.

**Где в коде:** типы — `badgeTypes.ts`; scope — `badgeContext.tsx`; defaults + host — `badgeAnimations.ts`; `Badge.Anchor` — `badgeParts.tsx`; Provider — `Badge.tsx` / Anchor.

```tsx
<Badge motion={{ root: { hoverIn: false, hoverOut: false } }}>Instant hover</Badge>

<Badge.Anchor motion={{ anchor: { hoverIn: { scale: 1.18, y: -6 }, hoverOut: { scale: 1, y: 0 } } }}>
  <Avatar />
  <Badge size="small">8</Badge>
</Badge.Anchor>
```

Split-lift: pointer на Anchor, цель — `data-badge-lift-target`. Кастомизируйте `motion.anchor`, не `motion.root` у вложенного Badge.

### Отключение

```ts
configureMotion({ enableHoverLift: false, badgeAnchorHoverLiftScale: 1.04 });
```

## Токены и CSS

| Класс / токен | Назначение |
|---------------|------------|
| `semanticStatusSurface` | Status overlay per variant (tint / fill / outline / text) |
| `--chip-px/py-*`, `--chip-gap-*`, `--chip-box-*`, `--chip-size-*` | Internal chip inset / circle diameter (Badge + Kbd; not public API) |
| `shadow-token-base` + `-hover` | Через `--el-shadow` (rest всегда; hover при lift) |
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
| `iconOnly` | Icon-only / single-digit layout | Fixed `--chip-size-*` square → circle |
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
├── badgeAnimations.ts             # defaults + host play
├── badgeContext.tsx               # createMotionScope
├── badgeParts.tsx                 # views + Anchor
├── useBadgeRootState.ts
├── badgeAPI.tsx
├── badgeA11y.ts
└── Badge.stories.tsx
```

## Storybook

`Core Components/Badge` — размеры/variants, statuses, light theme, `Badge.Anchor`, inline icons, icon-only, dots, custom colors, `classNames`, gloss.
