# Card

Контейнер с compound-разметкой: `Header`, `Title`, `Description`, `Body`, `Footer`. Поддерживает `variant`, статическую тень (passive) и **pressable** режим с hover-lift / squeeze как у кнопки второго уровня.

## Импорт

```tsx
import { Card, type CardProps, type CardVariant, type CardPressEvent, type CardClassNames, type CardHeaderProps, type CardBodyProps, type CardTitleProps } from "burne-ui";
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
<Card pressable animated onPress={(e) => console.log(e)}>
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
| `pressable` | `false` | Интерактивная карточка (`<button>` root) |
| `animated` | `true` | GSAP hover/squeeze (при `pressable`) |
| `onPress` | — | Активация click / Enter / Space |
| `onClick` / `onKeyDown` / `onPointerDown` | — | Низкоуровневые handlers |
| `className` | — | Root / gloss panel |
| `classNames` | — | Слоты |

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
| Passive (`pressable={false}`) | `shadow-token-sm` всегда |
| Pressable `default/outline/secondary` | `shadowSm` → `shadowMd` на hover |
| Pressable `gloss` | gloss interactive motion |

## Анимации

`cardAnimations.ts` → `useCardAnimations`.

**DOM (passive):**

```
<div class=cardRoot shadow-sm>
  Header / Body / Footer
</div>
```

**DOM (pressable default):**

```
<button class=cardRoot + liftMotion>
  <div class=content>children</div>
</button>
```

**DOM (gloss pressable):**

```
<button class=gloss-panel>
  <div class=gloss-content>children</div>
</button>
```

### 1. Hover lift (pressable, не gloss)

`useSecondLevelShadowContainer(rootRef, pressable && !isGloss)`:

**Init:** `initElementShadow(el, shadowSm())` — покой `shadow-token-sm`.

**Pointer enter:** `animateInteractiveHoverLift` + тень `sm` → `md` (`secondLevelShadow()`).

**Pointer leave:** scale `1`, тень обратно `sm`.

`pointerInsideRef` синхронизирует squeeze с hover state.

Класс: `pressableLift.motionClass` (`SHADOW_LIFT_MOTION_CLASS`).

### 2. Press squeeze

`pointerdown` на pressable root (`animated={true}`):

- **default/outline/secondary:** `animateInteractivePressSqueeze(shell, { pointerInside, shadow })`
- **gloss:** `animateGlossInteractivePressSqueeze(shell, pointerInside)`

`onPress` срабатывает на `click` / keyboard activation отдельно.

#### Кастомизация

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  hoverLiftScale: 1.025,
  pressSqueezeScale: [1, 0.98, 1],
  enableHoverLift: true,
  enablePressSqueeze: true,
});
```

### 3. Gloss interactive

`variant="gloss"` + `pressable`:

- `createGlossInteractiveRefCallback`
- `useGlossInteractiveHandlers`
- class `GLOSS_INTERACTIVE_MOTION_CLASS`

`animated={false}` отключает squeeze/hover, но `onPress` и button semantics остаются.

**Reduced motion:** `shouldSkipInteractiveHoverLift()` / `prefersReducedInteractiveHoverLift()` — без lift и squeeze.

### 4. Passive card

`pressable={false}`:

- `CARD_STATIC_SHADOW_CLASS` — постоянная `shadow-token-sm`
- `killMotion` на root при переключении в passive
- Нет pointer handlers

### 5. Ripple (опционально)

Ripple **не встроен**. Паттерн из stories:

```
<button pressable>
  <Ripple />                    ← overlay layer
  <div class=content z-[1]>     ← CARD_PRESSABLE_CONTENT_CLASS
    Card.Header / Body
```

Squeeze анимирует **весь** pressable shell, ripple — отдельный слой.

### Чего нет

- Portal / popover motion
- Height collapse
- Встроенный Ripple
- Hover lift на passive card

### Сводка: что настраивается где

| Анимация | Утилита | Ключи `configureMotion` | Локальный prop |
|----------|---------|---------------------------|----------------|
| Static shadow | CSS `shadow-token-sm` | — | `pressable={false}` |
| Hover lift sm→md | `useSecondLevelShadowContainer` | `hoverLiftScale`, `enableHoverLift` | `pressable`, `animated`, `!gloss` |
| Press squeeze | `animateInteractivePressSqueeze` | `pressSqueezeScale`, `enablePressSqueeze` | `animated` |
| Gloss hover/squeeze | gloss utils | gloss interactive tokens | `variant="gloss"` |
| Ripple overlay | `<Ripple />` child | `rippleDefaultDuration` | вручную в children |

## Токены и CSS

| Класс / токен | Назначение |
|---------------|------------|
| `CARD_ROOT_BASE_CLASS` | `rounded-mid overflow-hidden flex-col` |
| `CARD_STATIC_SHADOW_CLASS` | Passive `shadow-token-sm` |
| `CARD_PRESSABLE_ROOT_CLASS` | `cursor-pointer focus-ring` |
| `CARD_BUTTON_SHELL_CLASS` | `w-full border-0 p-0 text-left` на `<button>` |
| `CARD_HEADER_CLASS` / `BODY` / `FOOTER` | Padding + `border-t-token` footer |
| `CARD_GLOSS_PANEL_CLASS` | `gloss-panel rounded-mid` |
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

`animated={false}` — статичная pressable card без GSAP (для nested controls).

### Практические заметки

- Внутри pressable card не кладите кнопки/ссылки без `stopPropagation` — сработает `onPress` root.
- Ripple не встроен: первый child `<Ripple />`, контент в `relative z-[1]` внутри `content`.
- `Card.Title` всегда `h3` — не меняйте heading level через classNames без замены семантики.
- Passive: `pressable={false}` → постоянная `shadow-sm`, без hover lift.
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
├── cardAnimations.ts
├── cardParts.tsx
├── useCardRootState.ts
├── cardContext.tsx
├── cardAPI.ts
├── cardA11y.ts
└── Card.stories.tsx
```

## Storybook

`Core Components/Card` — variants, pressable, ripple, gloss, form layout, light theme, `classNames`.
