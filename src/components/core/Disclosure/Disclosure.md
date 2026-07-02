# Disclosure

Раскрывающийся блок (WAI-ARIA disclosure pattern). **Только compound API:** `Trigger`, `Content`, опционально `Handle` (drag). Контейнер `DisclosureGroup` — аккордеон с `accordion` / `separated`.

## Импорт

```tsx
import {
  Disclosure,
  DisclosureGroup,
  type DisclosureProps,
  type DisclosureGroupProps,
  type DisclosureTriggerProps,
  type DisclosureContentProps,
  type DisclosureVariant,
  type DisclosureSize,
  type DisclosureIconPos,
  type DisclosureClassNames,
} from "burne-ui";
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

### DisclosureGroup (аккордеон)

```tsx
<DisclosureGroup defaultValue="faq-1" variant="secondary">
  <Disclosure value="faq-1">
    <Disclosure.Trigger>Вопрос 1</Disclosure.Trigger>
    <Disclosure.Content>Ответ 1</Disclosure.Content>
  </Disclosure>
  <Disclosure value="faq-2">
    <Disclosure.Trigger>Вопрос 2</Disclosure.Trigger>
    <Disclosure.Content>Ответ 2</Disclosure.Content>
  </Disclosure>
</DisclosureGroup>
```

Simple API нет.

### Root props (`Disclosure`)

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `open` / `defaultOpen` | `false` | Controlled / uncontrolled |
| `onOpenChange` | — | `(open: boolean) => void` |
| `value` | — | ID для `DisclosureGroup` + `accordion` |
| `variant` | `default` | Визуальный стиль (наследуется от группы) |
| `size` | `base` | `small` \| `base` \| `mid` \| `large` |
| `disabled` | `false` | Блокирует trigger |
| `iconPos` | `right` | `left` \| `right` |
| `dragHandle` | `false` | Drag-to-expand (`variant="card"` only) |
| `className` | — | На root |
| `classNames` | — | Слоты |

### `Disclosure.Trigger` props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `icon` | `IoChevronDown` | Кастомная иконка; `null` — без chevron |
| `asChild` | `false` | Clone child с ARIA/handlers |
| `className` | — | На `<button>` |

### `DisclosureGroup` props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `accordion` | `true` | Один открытый; повторный клик закрывает |
| `separated` | `false` | Раздельные блоки vs единая оболочка |
| `variant` / `size` | `default` / `base` | Наследуются дочерними |
| `value` / `defaultValue` | — | Открытый `value` в группе |
| `onValueChange` | — | `(value: string \| null) => void` |
| `classNames` | — | Слот `group` |

При `accordion={false}` каждый `Disclosure` управляет своим `open` независимо.

### `DisclosureClassNames`

`root`, `trigger`, `triggerTitleLift`, `triggerTitle`, `triggerChevron`, `contentShell`, `contentWrap`, `contentPanel`, `glossPanel`, `glossContent`, `handle`, `group`.

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

| size | Trigger | Content padding |
|------|---------|-----------------|
| `small` | `CONTROL_SIZE_LAYOUT.small` | `p-base` |
| `base` | `CONTROL_SIZE_LAYOUT.base` | `p-plus` |
| `mid` | `CONTROL_SIZE_LAYOUT.mid` | `p-mid` |
| `large` | `CONTROL_SIZE_LAYOUT.large` | `p-large` |

## Анимации

`disclosureAnimations.ts` + `useCollapsibleHeight` + `useDisclosureContentDrag.ts`.

**DOM:**

```
<div class=root>
  <button class=trigger aria-expanded>
    <span class=chevron />           ← GSAP rotate 0→180°
    <span class=titleLift>           ← hover lift + squeeze
      <Text class=title />
  <div class=contentShell ref=shell> <!-- overflow-hidden, height GSAP -->
    <div class=contentWrap ref=inner>
      <section class=contentPanel>
  <div class=handle />               <!-- card + dragHandle only -->
```

### 1. Content height (`useCollapsibleHeight`)

Shared с `Expandable` / Accordion:

**Open:** `height: 0` → `scrollHeight` (`motionExpand()`).

**Close:** текущая height → `0`.

**Reduced motion / `enableExpandable: false`:** instant state.

`skipContentAnimRef` — мгновенный snap после drag.

#### Кастомизация

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  expandDuration: 320,
  expandOpenEase: "power2.inOut",
  enableExpandable: true,
});
```

### 2. Chevron rotation (`useChevronRotation`)

`useDisclosureTriggerMotion` → rotate chevron при `open`.

Easing: `motionInteractive()`. Учитывает `skipContentAnimRef` после drag.

### 3. Trigger micro-interactions

На `titleLiftRef`:

- **Hover:** `animateInteractiveHoverLift`
- **Press:** `animateInteractivePressSqueeze`

Пропуск при reduced motion / touch.

```ts
configureMotion({
  hoverLiftScale: 1.03,
  pressSqueezeScale: [1, 0.98, 1],
});
```

### 4. Card drag handle (`useDisclosureContentDrag`)

Только `variant="card"` + `dragHandle`:

1. Pointer capture на handle
2. Live resize `shell.style.height`
3. Chevron sync: `rotation = progress * 180°`
4. Snap: ratio ≥ 38% или velocity → open
5. `skipContentAnimRef = true` перед `setOpen`

### Чего нет

- Portal motion
- Ripple
- Second-level hover shadow (кроме static `shadow-token-sm` у `card`)
- FLIP в группе

### Сводка: что настраивается где

| Анимация | Утилита | Ключи `configureMotion` | Локальный prop |
|----------|---------|---------------------------|----------------|
| Height collapse | `useCollapsibleHeight` | `expandDuration`, `enableExpandable` | `open` |
| Chevron rotate | `useChevronRotation` | `interactiveDuration`, `enableExpandable` | `open` |
| Title hover/squeeze | `disclosureAnimations` | `hoverLiftScale`, `pressSqueezeScale` | `disabled` |
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
2. **`classNames` на root** — trigger, content, handle; `DisclosureGroup` — слот `group`.

`Disclosure.Trigger` — `className` на button.

### Слоты `DisclosureClassNames`

| Слот | DOM | Когда использовать |
|------|-----|-------------------|
| `root` | Root div | Outer spacing |
| `trigger` | `<button>` | Padding, hover bg |
| `triggerTitleLift` | Lift wrapper | Motion target area |
| `triggerTitle` | Title Text | Typography |
| `triggerChevron` | Chevron span | Icon color/size |
| `contentShell` | Collapsible shell | Max-height helpers |
| `contentWrap` | Inner wrap | Padding framed variants |
| `contentPanel` | `<section>` | Content typography |
| `glossPanel` / `glossContent` | Gloss layers | Gloss variant |
| `handle` | Drag bar | Card drag grip |
| `group` | `DisclosureGroup` | Accordion container |

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
<DisclosureGroup separated variant="card" classNames={{ group: "gap-mid" }}>
  <Disclosure value="a" dragHandle>
    <Disclosure.Trigger>Шаг 1</Disclosure.Trigger>
    <Disclosure.Content>...</Disclosure.Content>
    <Disclosure.Handle />
  </Disclosure>
</DisclosureGroup>
```

### Практические заметки

- `accordion={false}` — несколько открытых одновременно.
- `icon={null}` — trigger без chevron.
- `asChild` на Trigger — merge ARIA на child button/link.
- Card в группе без `separated`: shell карточки на `DisclosureGroup`.
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
├── Disclosure.tsx
├── disclosureGroup.tsx
├── index.ts
├── disclosureTypes.ts
├── disclosureStyles.ts
├── disclosureAnimations.ts
├── disclosureParts.tsx
├── useDisclosureRootState.ts
├── useDisclosureGroupRootState.ts
├── useDisclosureContentDrag.ts
├── disclosureContext.tsx
├── disclosureAPI.ts
├── disclosureA11y.ts
└── Disclosure.stories.tsx
```

## Storybook

`Core Components/Disclosure` — variants, sizes, icon position, controlled, disabled, group modes, card drag, `CustomClassNames`.
