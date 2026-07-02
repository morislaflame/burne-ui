# Accordion

Группа раскрывающихся секций на базе `Expandable`. **Только compound API.** В один момент открыт не более одного пункта (аккордеон); повторный клик по открытому пункту сворачивает всё.

## Импорт

```tsx
import {
  Accordion,
  type AccordionProps,
  type AccordionItemProps,
  type AccordionHeadingProps,
  type AccordionTriggerProps,
  type AccordionMessageProps,
  type AccordionIconProps,
  type AccordionContentProps,
  type AccordionTitleProps,
  type AccordionDescriptionProps,
  type AccordionIndicatorProps,
  type AccordionPanelProps,
  type AccordionBodyProps,
} from "burne-ui";
```

## API

### Compound API

```tsx
<Accordion defaultOpenIndex={0} size="base" className="max-w-2xl">
  <Accordion.Item value="shipping">
    <Accordion.Heading>
      <Accordion.Trigger>
        <Accordion.Message>
          <Accordion.Icon><IoHelp aria-hidden /></Accordion.Icon>
          <Accordion.Content>
            <Accordion.Title>Доставка</Accordion.Title>
            <Accordion.Description>Сроки и условия</Accordion.Description>
          </Accordion.Content>
          <Accordion.Indicator />
        </Accordion.Message>
      </Accordion.Trigger>
    </Accordion.Heading>
    <Accordion.Panel>
      <Accordion.Body>Контент секции…</Accordion.Body>
    </Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

Simple API нет.

### Root props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `openId` | — | Controlled: ID открытого пункта |
| `onOpenIdChange` | — | `(id: string \| null) => void` |
| `defaultOpenId` | `null` | Начальный ID (приоритет над `defaultOpenIndex`) |
| `defaultOpenIndex` | `null` | Начальный индекс (0-based), если у Item нет `value` |
| `size` | `base` | `small` \| `base` \| `mid` \| `large` — для всех Item |
| `className` | — | На root `<div>` |
| `children` | — | `Accordion.Item` |

`variant` и `classNames` на root **нет**.

### `Accordion.Item` props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `value` | auto index | Явный ID пункта (`"0"`, `"1"`, … или строка) |
| `disabled` | `false` | Блокирует toggle |
| `className` | — | Мерж с `accordionItemClass` |

Каждый Item — обёртка над `Expandable` (`compound={true}`, controlled `open`).

### Compound-подчасти

| Часть | Реализация | Назначение |
|-------|------------|------------|
| `Accordion.Item` | `Expandable` | Один пункт аккордеона |
| `Accordion.Heading` | `<h3>` | Семантический заголовок секции |
| `Accordion.Trigger` | `Expandable.Trigger` (`hideChevron=true`) | Кнопка toggle |
| `Accordion.Message` | `Expandable.Message` | Grid-слоты в trigger |
| `Accordion.Icon` | `Expandable.Icon` | Leading icon |
| `Accordion.Content` | `Expandable.Content` | Title + Description group |
| `Accordion.Title` | `Expandable.Title` | Заголовок |
| `Accordion.Description` | `Expandable.Description` | Подзаголовок muted |
| `Accordion.Indicator` | Custom chevron span | Шеврон вместо `Expandable.Chevron` |
| `Accordion.Panel` | `Expandable.Panel` | Раскрываемая `<section>` |
| `Accordion.Body` | `Text as="div"` | Тело панели (`text-muted`) |

`Accordion.Trigger` props: те же что `Expandable.Trigger` (`asChild`, `hideChevron`, …).

### Controlled / uncontrolled

```tsx
// Uncontrolled
<Accordion defaultOpenIndex={0} onOpenIdChange={(id) => console.log(id)} />

// Controlled
const [openId, setOpenId] = useState<string | null>("shipping");
<Accordion openId={openId} onOpenIdChange={setOpenId}>
  <Accordion.Item value="shipping">...</Accordion.Item>
</Accordion>
```

Поведение: клик по открытому → `openId = null`; клик по другому → закрывает предыдущий.

## Размеры

`size` на root прокидывается во все Item → `Expandable`. См. таблицу размеров в `Expandable.md` (`CONTROL_SIZE_LAYOUT`).

| size | min-h триггера | pad панели |
|------|----------------|------------|
| `small` | `min-h-control-small` | `px-base pb-base pt-small` |
| `base` | `min-h-control-base` | `px-plus pb-plus pt-small` |
| `mid` | `min-h-control-mid` | `px-mid pb-mid pt-base` |
| `large` | `min-h-control-large` | `px-large pb-large pt-base` |

`variant` и `status` **нет** — каждый Item использует `Expandable` с `variant="default"`.

## Анимации

Accordion добавляет только **Indicator rotation**; остальное — из `Expandable` + shared utils.

**DOM (один Item):**

```
<div data-accordion-item>              ← Expandable root
  <h3>
    <button class=trigger>             ← squeeze на liftSpan
      <Accordion.Message grid>
        <Icon /> <Title/> <Indicator/>  ← GSAP rotate chevron
  <div class=panelShell>               ← useCollapsibleHeight
    <section class=panel>
      <Accordion.Body />
```

### 1. Panel height (`Expandable.Panel`)

`useCollapsibleHeight` — open/close height GSAP. См. `Expandable.md`.

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  expandDuration: 320,
  expandOpenEase: "power2.inOut",
  enableExpandable: true,
});
```

**Reduced motion:** `enableExpandable: false` или `prefers-reduced-motion`.

### 2. Trigger press squeeze

`Expandable.Trigger` → `animateInteractivePressSqueeze` на `triggerLift` span.

### 3. Indicator rotation (`accordionAnimations.ts`)

`useAccordionIndicatorAnimation(open)` → `useChevronRotation` на `Accordion.Indicator`.

- `Accordion.Trigger` по умолчанию `hideChevron={true}`
- Rotation: `motionInteractive()`; off при `enableExpandable: false`

### 4. Ripple (опционально)

`<Ripple />` внутри `Accordion.Trigger` — overlay через `partitionExpandableTriggerRipple`.

### Чего нет

- Group-level FLIP при смене `openId`
- `variant="gloss"` на Accordion
- Анимация `Accordion.Body` / `Heading`
- `classNames` provider (только per-part `className`)

### Сводка: что настраивается где

| Анимация | Утилита | Ключи `configureMotion` | Локальный prop |
|----------|---------|---------------------------|----------------|
| Panel height | `useCollapsibleHeight` | `expandDuration`, `enableExpandable` | `open` на Item |
| Trigger squeeze | `animateInteractivePressSqueeze` | `pressSqueezeScale` | `disabled` |
| Indicator rotate | `useChevronRotation` | `interactiveDuration`, `enableExpandable` | `open` |
| Ripple | `<Ripple />` | `rippleExpandableDuration` | в Trigger children |

## Токены и CSS

### Собственные (`accordionStyles.ts`)

| Класс / функция | Назначение |
|-----------------|------------|
| `accordionRootClass` | `flex flex-col`; скругление first/last Item |
| `[&>item:first-child]:rounded-t-mid` | Верх группы |
| `[&>item:not(:first-child)]:-mt-px` | Склейка border между Item |
| `accordionItemClass` | `relative !rounded-none` |
| `accordionHeadingClass` | Reset `<h3>` |
| `accordionIndicatorClass` | Chevron wrapper `origin-center` |
| `accordionBodyClass` | `text-muted` |

### Унаследованные от Expandable (на Item)

`border-token bg-surface shadow-token-sm`, `messageBannerGridLayout`, `focus-ring`, panel padding per size.

## Стилизация и кастомизация

### Один уровень — `className` per-part

**Нет `classNames` на Accordion** (в отличие от `Expandable`). Кастомизация через `className` на каждой подчасти.

| Часть | Где задавать |
|-------|--------------|
| root | `Accordion className` |
| item | `Accordion.Item className` |
| heading / trigger / message / … | `className` на подчасти |
| indicator | `Accordion.Indicator className` |
| panel / body | `Accordion.Panel` / `Accordion.Body className` |

`ExpandableClassNames` **не прокидывается** через Accordion.

### FAQ-группа

```tsx
<Accordion defaultOpenIndex={0} size="base" className="max-w-2xl">
  {items.map((item, i) => (
    <Accordion.Item key={item.id} value={item.id}>
      <Accordion.Heading>
        <Accordion.Trigger>
          <Accordion.Message>
            <Accordion.Icon>{item.icon}</Accordion.Icon>
            <Accordion.Content>
              <Accordion.Title>{item.title}</Accordion.Title>
            </Accordion.Content>
            <Accordion.Indicator />
          </Accordion.Message>
        </Accordion.Trigger>
      </Accordion.Heading>
      <Accordion.Panel>
        <Accordion.Body>{item.content}</Accordion.Body>
      </Accordion.Panel>
    </Accordion.Item>
  ))}
</Accordion>
```

### Trigger + Ripple

```tsx
<Accordion.Trigger>
  <Ripple color="neutralMuted" />
  <Accordion.Message className="relative z-[1]">
    ...
  </Accordion.Message>
</Accordion.Trigger>
```

### Практические заметки

- Рекомендуемая структура: `Heading` → `Trigger` → `Message` → slots → `Panel` → `Body`.
- `Accordion.Indicator` — внутри или рядом с `Message` (grid резолвит по `displayName`).
- Для controlled state используйте стабильные `value` на Item, не полагайтесь на auto-index при reorder.
- Сравнение с `Expandable`: один блок vs группа с `openId`.
- **Не задавайте `rounded` на Item** — скругление задаёт root через селекторы first/last.

## Интеграции

| Компонент | Роль |
|-----------|------|
| `Expandable` | Каждый `Accordion.Item` |
| `Text` | `Accordion.Body` |
| `Ripple` | Опционально в Trigger |
| `messageBannerGridLayout` | Grid trigger slots |

## Доступность

Делегировано `Expandable` + семантика Accordion:

- `Accordion.Heading` → `<h3>`
- Trigger: `aria-expanded`, `aria-controls`, `id`
- Panel: `<section aria-labelledby hidden inert>`
- Icon / Indicator: `aria-hidden`
- Keyboard: Enter/Space на trigger

**Нет** `role="group"` / accordion pattern на root — каждый Item автономный disclosure; «один открыт» — только JS (`openId`).

## Структура файлов

```
Accordion/
├── Accordion.tsx
├── index.ts
├── accordionTypes.ts
├── accordionStyles.ts
├── accordionAnimations.ts       # useAccordionIndicatorAnimation
├── accordionParts.tsx
├── accordionAPI.ts
├── accordionContext.tsx
├── useAccordionRootState.ts
└── Accordion.stories.tsx
```

A11y — в `Expandable/expandableA11y.ts` (display names Accordion зарегистрированы).

## Storybook

`Composite Components/Accordion` — default FAQ, interaction test, trigger ripple.

Playground: `playground/showcase/demos/accordion/` — sizes, checkout FAQ, release notes.
