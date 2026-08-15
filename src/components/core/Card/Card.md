# Card

Контейнер с compound-разметкой: `Header`, `Title`, `Description`, `Body`, `Footer`. Поддерживает `variant`, статическую тень (passive) и **pressable** режим с hover-lift / squeeze как у кнопки второго уровня.

## Импорт

```tsx
import { Card, type CardProps, type CardVariant, type CardSize, type CardPressEvent, type CardClassNames, type CardHeaderProps, type CardBodyProps, type CardTitleProps, type CardMotion, type CardPartMotion } from "burne-ui";
```

## API

### Compound API

```tsx
<Card variant="default">
  <Card.Header>
    <Card.Title>Релиз 0.12</Card.Title>
    <Card.Description>Краткое описание карточки</Card.Description>
  </Card.Header>
  <Card.Body>Основной контент</Card.Body>
  <Card.Footer>
    <Button size="small">Детали</Button>
  </Card.Footer>
</Card>
```

### Pressable card

```tsx
<Card pressable onPress={(e) => console.log(e)}>
  <Card.Header>
    <Card.Title>Открыть</Card.Title>
  </Card.Header>
  <Card.Body>Клик по всей карточке</Card.Body>
</Card>
```

### Pressable + Ripple

```tsx
<Card pressable variant="outline" onPress={handlePress}>
  <Ripple color="neutral" />
  <div className="relative z-[1] flex flex-col">
    <Card.Header>...</Card.Header>
    <Card.Body>...</Card.Body>
  </div>
</Card>
```

Simple API (props `title` на root) нет — только compound children.

### Root props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `variant` | `default` | `default` \| `outline` \| `secondary` \| `gloss` |
| `size` | `base` | `small` \| `base` \| `mid` \| `large` — radius (как у Button), padding секций, type scale Title/Description |
| `shadow` | `base` | `small` \| `base` \| `mid` \| `large` — rest elevation (passive CSS или pressable family) |
| `pressable` | `false` | Интерактивная карточка (`<button>` root) |
| `onPress` | — | Активация click / Enter / Space |
| `onClick` / `onKeyDown` / `onPointerDown` | — | Низкоуровневые handlers |
| `className` | — | Root / gloss panel |
| `classNames` | — | Слоты |
| `motion` | — | Карта слотов `root` / `title` / `description` / `header` / `headingBlock` / `body` / `footer` |

### `CardClassNames`

`root`, `glossContent`, `content`, `header`, `headingBlock`, `title`, `description`, `body`, `footer`.

### Compound-подчасти

| Часть | Назначение |
|-------|------------|
| `Card.Header` | Верхний блок (title + description) |
| `Card.HeadingBlock` | Группа заголовка внутри header |
| `Card.Title` | `Text` as `h3` |
| `Card.Description` | Muted subtitle |
| `Card.Body` | Основной контент |
| `Card.Footer` | Нижняя зона с border-top |

## Size

Радиус / padding / title+description — общий `PANEL_SIZE_LAYOUT` (Dialog / AlertDialog / Popover / Card).

| size | Radius | Header | Body | Footer | Title | Description |
|------|--------|--------|------|--------|-------|-------------|
| `small` | `rounded-small` | `px-mid pt-base` + `gap-xsmall` | `px-mid py-small` | `px-mid pb-base` | `small` | `xsmall` |
| `base` | `rounded-base` | `px-large pt-mid` + `gap-base` | `px-large py-small` | `px-large pb-mid` | `base` | `small` |
| `mid` | `rounded-mid` | `px-large pt-mid` + `gap-base` | `px-large py-small` | `px-large pb-mid` | `mid` | `base` |
| `large` | `rounded-large` | `px-large pt-mid` + `gap-base` | `px-large py-small` | `px-large pb-mid` | `large` | `base` |

```tsx
<Card size="mid">
  <Card.Header>
    <Card.Title>Mid card</Card.Title>
    <Card.Description>Matches Button mid radius</Card.Description>
  </Card.Header>
  <Card.Body>Content</Card.Body>
</Card>
```

## Variant

| Variant | Поверхность |
|---------|-------------|
| `default` | `bg-surface border-token` |
| `outline` | transparent + border |
| `secondary` | `bg-secondary border-token` |
| `gloss` | `gloss-panel` + `gloss-content` |

### Тени

| Режим | Тень |
|-------|------|
| Passive (`pressable={false}`) | `shadow-token-{shadow}` всегда |
| Pressable `default/outline/secondary` | rest → `{shadow}-hover` на hover; press → `{shadow}-press` |
| Pressable `gloss` | gloss interactive motion |

## Анимации

`cardAnimations.ts` — публичный slot motion. Pressable — 2-й уровень (rest-тень + hover/press на `root`). Passive — без дефолтного hover.

### Slot motion

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `root` | `hoverIn` / `hoverOut` / `pressIn` / `pressOut` | при `pressable`: `hoverLiftSecondLevel` или gloss; `pressSqueeze` / `pressSqueezeGloss` (`pressOut: false`) |
| `title` / `description` / `header` / `headingBlock` / `body` / `footer` | `hoverIn` / `hoverOut` | нет |

`content` / `glossContent` — layout-обёртки, не публичные motion-слоты.

**Где в коде:** типы — `cardTypes.ts`; scope — `cardContext.tsx`; defaults + host — `cardAnimations.ts`; слоты — `cardParts.tsx`; Provider — `Card.tsx`.

```tsx
<Card pressable motion={{ root: { hoverIn: false, hoverOut: false } }}>
  <Card.Title>Instant hover</Card.Title>
</Card>

<Card.Title motion={{ hoverIn: { scale: 1.06, y: -2 }, hoverOut: { scale: 1, y: 0 } }} />
```

### Отключение

```ts
configureMotion({ enableHoverLift: false, enablePressSqueeze: false });
```

Ripple **не встроен** — передайте `<Ripple />` первым ребёнком и оберните контент в слой `relative z-[1]`. Squeeze анимирует pressable shell.

## Токены и CSS

| Класс / токен | Назначение |
|---------------|------------|
| `CARD_ROOT_BASE_CLASS` | `overflow-hidden flex-col` (+ size `rounded-*`) |
| `PANEL_SIZE_LAYOUT` | Radius / padding / title+description (shared panel grid) |
| `CARD_STATIC_SHADOW_CLASS` | Map `shadow` → `shadow-token-*` |
| `CARD_PRESSABLE_ROOT_CLASS` | `cursor-pointer focus-ring` |
| `CARD_BUTTON_SHELL_CLASS` | `w-full border-0 p-0 text-left` на `<button>` |
| `cardHeaderClass` / `cardBodyClass` / `cardFooterClass` | Padding из size layout; footer + `border-t-token` |
| `CARD_GLOSS_PANEL_BASE_CLASS` | `gloss-panel` (+ size `rounded-*`) |
| `GLOSS_INTERACTIVE_MOTION_CLASS` | Gloss pressable motion |
| `SHADOW_LIFT_MOTION_CLASS` | GSAP shadow transition |

## Стилизация и кастомизация

### Два уровня

1. **`className` на `Card`** — root / gloss panel (`classNames.root` merge).
2. **`classNames` на root** — все внутренние слоты через provider.

Compound-подчасти не принимают отдельный `classNames` — только root.

### Слоты `CardClassNames`

| Слот | DOM | Когда использовать |
|------|-----|-------------------|
| `root` | `<div>` или `<button>` shell | Border, radius, outer shadow override |
| `glossContent` | Inner gloss wrapper | Padding/layout в gloss variant |
| `content` | Pressable inner wrapper | z-index для Ripple + children |
| `header` | Header block | Top bg strip, extra padding |
| `headingBlock` | Title group flex | Gap title/description |
| `title` | `h3` Text | Heading color/weight |
| `description` | Muted `p` | Subtitle typography |
| `body` | Body section | Main content padding |
| `footer` | Footer bar | Actions row, border-top tint |

### Декоративная карточка (passive)

```tsx
<Card
  variant="outline"
  classNames={{
    root: "rounded-large border-primary/40 bg-primary/5 shadow-token-md",
    header: "bg-primary/5",
    title: "text-primary font-semibold",
    description: "text-foreground/80",
    body: "text-small",
    footer: "border-primary/20 bg-primary/5",
  }}
>
  <Card.Header>
    <Card.Title>Профиль</Card.Title>
    <Card.Description>Все слоты через classNames</Card.Description>
  </Card.Header>
  <Card.Body>Контент</Card.Body>
  <Card.Footer>
    <Button size="small">Сохранить</Button>
  </Card.Footer>
</Card>
```

### Pressable + Ripple (compound)

```tsx
<Card
  pressable
  variant="outline"
  onPress={handleOpen}
  classNames={{ root: "rounded-large", content: "gap-0" }}
>
  <Ripple color="neutral" />
  <div className="relative z-[1] flex flex-col">
    <Card.Header>
      <Card.Title>Открыть</Card.Title>
    </Card.Header>
    <Card.Body>Клик по всей карточке</Card.Body>
  </div>
</Card>
```

`enableAnimations: false` — отключить motion глобально через `enableAnimations`.

### Практические заметки

- Внутри pressable card не кладите кнопки/ссылки без `stopPropagation` — сработает `onPress` root.
- Ripple не встроен: первый child `<Ripple />`, контент в `relative z-[1]` внутри `content`.
- `Card.Title` всегда `h3` — не меняйте heading level через classNames без замены семантики.
- Passive: `pressable={false}` → постоянная `shadow-token-{shadow}`, без hover lift.
- Gloss: `className` / `classNames.root` на `gloss-panel`; children в `glossContent`.
- **Не задавайте `transform` на root при `pressable`** — конфликт с lift/squeeze GSAP.
- **Порядок мержа:** variant surface → motionClass → `classNames.slot` → `className` root.

## Интеграции

| Компонент | Сценарий |
|-----------|----------|
| `Badge.Anchor` | Overlay badge на карточке |
| `Ripple` | Press feedback в pressable card |
| `Form` | Card как layout wrapper формы |
| `Button` | Actions в `Card.Footer` |

## Доступность

- `pressable={true}`: root `<button type="button">`, `focus-ring`
- `onPress` на click и keyboard activation
- `Card.Title`: semantic `h3`
- Вложенные интерактивные элементы — осторожно с event bubbling

## Структура файлов

```
Card/
├── Card.tsx
├── index.ts
├── cardTypes.ts
├── cardStyles.ts
├── cardAnimations.ts              # defaults + host play
├── cardParts.tsx                  # useMotionPart
├── useCardRootState.ts
├── cardContext.tsx                # createMotionScope
├── cardAPI.ts
├── cardA11y.ts
└── Card.stories.tsx
```

## Storybook

`Core Components/Card` — variants, pressable, ripple, gloss, form layout, light theme, `classNames`.
