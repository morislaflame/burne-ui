# Disclosure

Раскрывающийся блок (WAI-ARIA disclosure pattern). **Только compound API:** `Trigger`, `Content`, опционально `Handle` (drag). Контейнер `Disclosure.Group` — аккордеон с `accordion` / `separated`.

## Импорт

```tsx
import { Disclosure, Disclosure.Group, type DisclosureProps, type DisclosureGroupProps, type DisclosureTriggerProps, type DisclosureContentProps, type DisclosureVariant, type DisclosureSize, type DisclosureChevronPos, type DisclosureClassNames } from "burne-ui";
```

## API

### Compound API

```tsx
<Disclosure defaultOpen variant="outline" size="base">
  <Disclosure.Trigger>Заголовок</Disclosure.Trigger>
  <Disclosure.Content>Контент панели</Disclosure.Content>
</Disclosure>
```

### Card + drag handle

```tsx
<Disclosure variant="card" dragHandle defaultOpen>
  <Disclosure.Trigger>Карточка</Disclosure.Trigger>
  <Disclosure.Content>Растягиваемый контент</Disclosure.Content>
  <Disclosure.Handle />
</Disclosure>
```

### Disclosure.Group (аккордеон)

```tsx
<Disclosure.Group defaultValue="faq-1" variant="secondary">
  <Disclosure value="faq-1">
    <Disclosure.Trigger>Вопрос 1</Disclosure.Trigger>
    <Disclosure.Content>Ответ 1</Disclosure.Content>
  </Disclosure>
  <Disclosure value="faq-2">
    <Disclosure.Trigger>Вопрос 2</Disclosure.Trigger>
    <Disclosure.Content>Ответ 2</Disclosure.Content>
  </Disclosure>
</Disclosure.Group>
```

Simple API нет.

### Root props (`Disclosure`)

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `open` / `defaultOpen` | `false` | Controlled / uncontrolled |
| `onOpenChange` | — | `(open: boolean) => void` |
| `value` | — | ID для `Disclosure.Group` + `accordion` |
| `variant` | `default` | Визуальный стиль (наследуется от группы) |
| `size` | `base` | `small` \| `base` \| `mid` \| `large` |
| `disabled` | `false` | Блокирует trigger |
| `chevronPosition` | `end` | `start` \| `end` — позиция chevron |
| `dragHandle` | `false` | Drag-to-expand (`variant="card"` only) |
| `className` | — | На root |
| `classNames` | — | Слоты |
| `motion` | — | Карта `titleLift` / `chevron` / `contentShell`. Group `motion` мержится в каждый item |

### Compound parts

| Part | Описание |
|------|----------|
| `Disclosure.Trigger` | Кнопка заголовка |
| `Disclosure.Icon` | Leading icon слева от title |
| `Disclosure.Chevron` | Кастомный chevron (compound) |
| `Disclosure.Content` | Панель контента |
| `Disclosure.Handle` | Drag handle (`variant="card"`) |
| `Disclosure.Group` | Аккордеон-контейнер |

### `Disclosure.Trigger` props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `icon` | — | Leading icon слева от title |
| `chevron` | `IoChevronDown` | Кастомный chevron; `null` — без chevron |
| `asChild` | `false` | Clone child с ARIA/handlers |
| `className` | — | На `<button>` |

```tsx
<Disclosure.Trigger icon={<IoHelp aria-hidden />}>
  Заголовок с иконкой
</Disclosure.Trigger>

<Disclosure.Trigger chevron={null}>Без chevron</Disclosure.Trigger>

<Disclosure.Trigger>
  <Disclosure.Icon><IoHelp aria-hidden /></Disclosure.Icon>
  Compound icon
</Disclosure.Trigger>
```

### `Disclosure.Group` props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `accordion` | `true` | Один открытый; повторный клик закрывает |
| `separated` | `false` | Раздельные блоки vs единая оболочка |
| `variant` / `size` | `default` / `base` | Наследуются дочерними |
| `value` / `defaultValue` | — | Открытый `value` в группе |
| `onValueChange` | — | `(value: string \| null) => void` |
| `classNames` | — | Слот `group` |
| `motion` | — | Мержится в каждый item (как Accordion) |

При `accordion={false}` каждый `Disclosure` управляет своим `open` независимо.

### `DisclosureClassNames`

`root`, `trigger`, `titleLift`, `title`, `icon`, `chevron`, `contentShell`, `contentWrap`, `contentPanel`, `glossPanel`, `glossContent`, `handle`, `group`.

## variant и размеры

| variant | Поведение |
|---------|-----------|
| `default` | Trigger + content; в группе — `divide-y-token` |
| `outline` | Рамка только у контента (`FRAMED_PANEL`) |
| `secondary` | Framed + `bg-secondary` |
| `card` | Единая карточка `shadow-token-sm`; drag handle |
| `ghost` | Прозрачный trigger, muted content |
| `gloss` | `gloss-panel gloss-deep` |

`status` нет.

| size | Trigger / content padding | Title |
|------|---------------------------|-------|
| `small` | `COLLAPSIBLE_SIZE_LAYOUT` (`triggerPadding` / `contentPadding`) | `leading-none` + `titleVariant` |
| `base` | same | same |
| `mid` | same | same |
| `large` | same | same |

Отступы — отдельный `COLLAPSIBLE_SIZE_LAYOUT` (ритм как у panel header/body, не через `PANEL_SIZE_LAYOUT`). Chevron/icon — из `CONTROL_SIZE_LAYOUT`.

## Анимации

Свой scope. Хосты: Trigger (`titleLift` hover/press + `chevron` enter/leave) и Content (`contentShell` height). Handle-drag — kit-internal: ставит `skipContentAnimRef` перед `setOpen`, хосты применяют instant и не играют.

### Slot motion

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `titleLift` | `hoverIn` / `hoverOut` / `pressIn` / `pressOut` | `hoverLiftFirstLevel` (gloss — `hoverLiftGloss`); `pressSqueeze` / `pressSqueezeGloss`; `pressOut: false` |
| `chevron` | `enter` / `leave` | `chevronRotate` |
| `contentShell` | `enter` / `leave` | `collapsibleHeight` (`panelInner` — внутренний target) |

```tsx
<Disclosure motion={{ contentShell: { enter: false, leave: false } }}>
  …
</Disclosure>

<Disclosure.Chevron
  motion={{
    enter: (ctx) => gsap.to(ctx.el, { rotation: 180, duration: 0.45, ease: "back.out(1.6)" }),
    leave: (ctx) => gsap.to(ctx.el, { rotation: 0, duration: 0.28 }),
  }}
/>
```

`leave: false` на `contentShell` — хост сразу ставит closed height. Factory leave должна свернуть высоту в `0`. После drag skip — instant на chevron и shell.

**Где в коде:** типы — `disclosureTypes.ts`; scope — `disclosureContext.tsx`; defaults + host play — `disclosureAnimations.ts` (`resolveDisclosureMotionDefaults`); слоты — `disclosureParts.tsx` / `disclosureContentPart.tsx`; Provider — `Disclosure.tsx`. Group карта — `disclosureGroup.tsx`.

**DOM:**

```
<div class=root>
  <button class=trigger>
    <span class=titleLift>           ← slot titleLift
      <Text class=title />
    <span class=chevron />           ← slot chevron
  <div class=contentShell>           ← slot contentShell / collapsibleHeight
    <div class=contentWrap>          ← internal panelInner
      <section class=contentPanel>
  <div class=handle />               ← kit-internal drag, не слот
```

### 1. Content height (`contentShell`)

Дефолт — рецепт `collapsibleHeight`. См. `Expandable.md`.

### 2. Chevron rotation

Play с Trigger-хоста (`chevronRotate`). Compound `Disclosure.Chevron` регистрирует target. First paint: `createChevronRotationRefCallback`.

### 3. Trigger hover / press

Pointer на кнопке, play на `titleLift`. `asChild` без lift-span — hover/press не вешаются.

### 4. Card drag handle (`useDisclosureContentDrag`)

Только `variant="card"` + `dragHandle`. Live resize + chevron sync. `skipContentAnimRef = true` перед `setOpen`.

### Чего нет

- Portal motion
- Ripple
- Second-level hover shadow (кроме static `shadow-token-sm` у `card`)
- FLIP в группе
- Handle как публичный слот

### Сводка: что настраивается где

| Анимация | Слот / рецепт | Ключи `configureMotion` | Локальный prop |
|----------|---------------|---------------------------|----------------|
| Height collapse | `contentShell` → `collapsibleHeight` | `expandDuration`, `enableExpandable` | `motion` на Root / Content / Group |
| Chevron rotate | `chevron` → `chevronRotate` | `interactiveDuration`, `enableExpandable` | `motion` на Chevron |
| Title hover/squeeze | `titleLift` | `hoverLiftScale`, `pressSqueezeScale` | `motion` на Trigger |
| Drag expand | `useDisclosureContentDrag` | — | `dragHandle`, `variant="card"` |

## Токены и CSS

| Класс / токен | Назначение |
|---------------|------------|
| `DISCLOSURE_TRIGGER_BASE_CLASS` | Full-width button, `focus-ring` |
| `DISCLOSURE_CONTENT_SHELL_CLASS` | `overflow-hidden` collapsible |
| `FRAMED_PANEL` | Border/bg контента outline/secondary |
| `DISCLOSURE_GLOSS_PANEL_CLASS` | Gloss shell |
| `disclosureGroupClass` | Group divide/gap/shadow |
| `hoverVariant()` | Trigger hover tint |
| Open title | `text-primary` inline |

## Стилизация и кастомизация

### Два уровня

1. **`className` на `Disclosure`** — root.
2. **`classNames` на root** — trigger, content, handle; `Disclosure.Group` — слот `group`.

`Disclosure.Trigger` — `className` на button.

### Слоты `DisclosureClassNames`

| Слот | DOM | Когда использовать |
|------|-----|-------------------|
| `root` | Root div | Outer spacing |
| `trigger` | `<button>` | Padding, hover bg |
| `titleLift` | Lift wrapper | Motion target area |
| `title` | Title Text | Typography |
| `chevron` | Chevron span | Icon color/size |
| `contentShell` | Collapsible shell | Max-height helpers |
| `contentWrap` | Inner wrap | Padding framed variants |
| `contentPanel` | `<section>` | Content typography |
| `glossPanel` / `glossContent` | Gloss layers | Gloss variant |
| `handle` | Drag bar | Card drag grip |
| `group` | `Disclosure.Group` | Accordion container |

### Single disclosure

```tsx
<Disclosure
  variant="outline"
  classNames={{
    trigger: "font-semibold",
    contentPanel: "text-small text-muted",
  }}
>
  <Disclosure.Trigger>Детали заказа</Disclosure.Trigger>
  <Disclosure.Content>Состав и сумма</Disclosure.Content>
</Disclosure>
```

### Group separated cards

```tsx
<Disclosure.Group separated variant="card" classNames={{ group: "gap-large" }}>
  <Disclosure value="a" dragHandle>
    <Disclosure.Trigger>Шаг 1</Disclosure.Trigger>
    <Disclosure.Content>...</Disclosure.Content>
    <Disclosure.Handle />
  </Disclosure>
</Disclosure.Group>
```

### Практические заметки

- `accordion={false}` — несколько открытых одновременно.
- `chevron={null}` — trigger без chevron.
- `asChild` на Trigger — merge ARIA на child button/link.
- Card в группе без `separated`: shell карточки на `Disclosure.Group`.
- **Не override `height` на `contentShell`** — GSAP collapsible.
- Drag children order: Trigger → Content → Handle (`orderDragHandleChildren`).

## Интеграции

| Компонент | Сценарий |
|-----------|----------|
| `Expandable` | Shared `useCollapsibleHeight` |
| `Field` | FAQ в формах |
| `Card` | Похожий card shell (Disclosure `variant="card"`) |

## Доступность

- Trigger: `aria-expanded`, `aria-controls`, `id={triggerId}`
- Panel: `id={panelId}`, `aria-labelledby={triggerId}`
- Shell: `aria-hidden={!open}`
- Chevron / Handle: `aria-hidden`
- Keyboard: Enter/Space toggle на trigger
- `disabled` — нативный на button

## Структура файлов

```
Disclosure/
├── Disclosure.tsx                 # MotionProvider + merge Group motion
├── disclosureGroup.tsx            # карта motion в group context
├── index.ts
├── disclosureTypes.ts             # DisclosureMotion / TitleLift / Lifecycle
├── disclosureStyles.ts
├── disclosureAnimations.ts        # defaults + host play (skip after drag)
├── disclosureParts.tsx            # Trigger / Chevron useMotionPart
├── disclosureContentPart.tsx      # contentShell host
├── useDisclosureRootState.ts
├── useDisclosureGroupRootState.ts
├── useDisclosureContentDrag.ts    # kit-internal, не слот
├── disclosureContext.tsx          # createMotionScope (без defaults/play)
├── disclosureAPI.ts
├── disclosureA11y.ts
└── Disclosure.stories.tsx
```

## Storybook

`Core Components/Disclosure` — variants, sizes, chevron position, icon, controlled, disabled, group modes, card drag, `CustomClassNames`.
