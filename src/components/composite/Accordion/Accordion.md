# Accordion

Группа раскрывающихся секций на базе `Expandable`. **Только compound API.** В один момент открыт не более одного пункта (аккордеон); повторный клик по открытому пункту сворачивает всё.

## Импорт

```tsx
import { Accordion, type AccordionProps, type AccordionItemProps, type AccordionHeadingProps, type AccordionTriggerProps, type AccordionMessageProps, type AccordionIconProps, type AccordionContentProps, type AccordionTitleProps, type AccordionDescriptionProps, type AccordionChevronProps, type AccordionPanelProps, type AccordionBodyProps, type AccordionClassNames, type AccordionMotion } from "burne-ui";
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
          <Accordion.Chevron />
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
| `value` | — | Controlled: ID открытого пункта (`null` = все закрыты) |
| `onValueChange` | — | `(value: string \| null) => void` |
| `defaultValue` | `null` | Начальный ID (приоритет над `defaultOpenIndex`) |
| `defaultOpenIndex` | `null` | Начальный индекс (0-based), если у Item нет `value` |
| `size` | `base` | `small` \| `base` \| `mid` \| `large` — для всех Item |
| `className` | — | На root `<div>` |
| `classNames` | — | `AccordionClassNames` — слоты root + все Item (наследуются через `AccordionClassNamesProvider`) |
| `motion` | — | `AccordionMotion` — те же слоты, что у Expandable (`triggerLift` / `chevron` / `panelShell`). Item перекрывает root |
| `children` | — | `Accordion.Item` |

`variant` на root **нет**.

### `Accordion.Item` props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `value` | auto index | Явный ID пункта (`"0"`, `"1"`, … или строка) |
| `disabled` | `false` | Блокирует toggle |
| `className` | — | Мерж с `accordionItemClass` |
| `classNames` | — | `AccordionClassNames` — локально переопределяет слоты, унаследованные от root (мерж как `Breadcrumbs.List`: `{...parent, ...classNames}`) |
| `motion` | — | Локально перекрывает root `motion` (мерж по слотам) |

Каждый Item — обёртка над `Expandable` (`compound={true}`, controlled `open`). Слоты `trigger`, `triggerLift`, `message`, `icon`, `content`, `title`, `description`, `chevron`, `panelShell`, `panel`, `glossContent` прокидываются в `classNames` вложенного `Expandable`; `item` прокидывается в `Expandable`'s `classNames.root`.

### Compound-подчасти

| Часть | Реализация | Назначение |
|-------|------------|------------|
| `Accordion.Item` | `Expandable` | Один пункт аккордеона |
| `Accordion.Heading` | `<h3>` | Семантическая обёртка секции (a11y heading). Не путать с `Accordion.Title` — видимый текстовый заголовок внутри Message. |
| `Accordion.Trigger` | `Expandable.Trigger` (`hideChevron=true`) | Кнопка toggle |
| `Accordion.Message` | `Expandable.Message` | Grid-слоты в trigger |
| `Accordion.Icon` | `Expandable.Icon` | Leading icon |
| `Accordion.Content` | `Expandable.Content` | Title + Description group |
| `Accordion.Title` | `Expandable.Title` | Заголовок |
| `Accordion.Description` | `Expandable.Description` | Подзаголовок muted |
| `Accordion.Chevron` | Custom chevron span | Шеврон вместо `Expandable.Chevron`; регистрирует слот `chevron` Expandable |
| `Accordion.Panel` | `Expandable.Panel` | Раскрываемая `<section>` |
| `Accordion.Body` | `Text as="div"` | Тело панели (`text-muted`) |

`Accordion.Trigger` props: те же что `Expandable.Trigger` (`asChild`, `hideChevron`, …).

### Controlled / uncontrolled

```tsx
// Uncontrolled
<Accordion defaultOpenIndex={0} onValueChange={(id) => console.log(id)} />

// Controlled
const [value, setValue] = useState<string | null>("shipping");
<Accordion value={value} onValueChange={setValue}>
  <Accordion.Item value="shipping">...</Accordion.Item>
</Accordion>
```

Поведение: клик по открытому → `value = null`; клик по другому → закрывает предыдущий.

## Размеры

`size` на root прокидывается во все Item → `Expandable`. См. таблицу размеров в `Expandable.md` (`CONTROL_SIZE_LAYOUT`).

| size | min-h триггера | pad панели |
|------|----------------|------------|
| `small` | `min-h-control-small` | `px-base pb-base pt-small` |
| `base` | `min-h-control-base` | `px-mid pb-mid pt-small` |
| `mid` | `min-h-control-mid` | `px-large pb-large pt-base` |
| `large` | `min-h-control-large` | `px-xlarge pb-xlarge pt-base` |

`variant` и `status` **нет** — каждый Item использует `Expandable` с `variant="default"`.

## Анимации

Accordion — **embedder** в Expandable: своего `createMotionScope` нет. Root/Item `motion` мержится и передаётся в `Expandable`. Хост play и дефолты — `expandableAnimations.ts` (`pressSqueeze`, `chevronRotate`, `collapsibleHeight`). `Accordion.Chevron` регистрирует слот `chevron` (Trigger по умолчанию `hideChevron`).

```tsx
<Accordion motion={{ panelShell: { enter: false, leave: false } }}>…</Accordion>

<Accordion.Chevron
  motion={{
    enter: (ctx) => gsap.to(ctx.el, { rotation: 180, duration: 0.45, ease: "back.out(1.6)" }),
    leave: (ctx) => gsap.to(ctx.el, { rotation: 0, duration: 0.28 }),
  }}
/>
```

`leave: false` на `panelShell` — хост сразу ставит closed height (как Expandable). Factory leave должна свернуть высоту в `0`.

**Где в коде:** карта — `accordionAnimations.ts` (`resolveAccordionItemMotion`); Chevron — `accordionParts.tsx` (`useMotionPart` на scope Expandable).

См. [Motion](/docs/motion) и `Expandable.md`.

**DOM (один Item):**

```
<div data-accordion-item>              ← Expandable root
  <h3>
    <button class=trigger>             ← squeeze на liftSpan
      <Accordion.Message grid>
        <Icon /> <Title/> <Chevron/>  ← slot `chevron`
  <div class=panelShell>               ← slot `panelShell` / collapsibleHeight
    <section class=panel>
      <Accordion.Body />
```

### 1. Panel height (`Expandable.Panel`)

Дефолт — рецепт `collapsibleHeight`. См. `Expandable.md`.

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

`Expandable.Trigger` → слот `triggerLift` (`pressSqueeze`).

### 3. Chevron rotation

`Accordion.Chevron` регистрирует target; play — хост Expandable Trigger (`chevronRotate`).

- `Accordion.Trigger` по умолчанию `hideChevron={true}`
- First paint: `createChevronRotationRefCallback`

### 4. Ripple (опционально)

`<Ripple />` внутри `Accordion.Trigger` — overlay через `partitionExpandableTriggerRipple`.

### Чего нет

- Group-level FLIP при смене `value`
- `variant="gloss"` на Accordion
- Анимация `Accordion.Body` / `Heading` как публичные слоты

### Сводка: что настраивается где

| Анимация | Слот / рецепт | Ключи `configureMotion` | Локальный prop |
|----------|---------------|---------------------------|----------------|
| Panel height | `panelShell` → `collapsibleHeight` | `expandDuration`, `enableExpandable` | `motion` на Root / Item / Panel |
| Trigger squeeze | `triggerLift` → `pressSqueeze` | `pressSqueezeScale` | `motion` на Trigger |
| Chevron rotate | `chevron` → `chevronRotate` | `interactiveDuration`, `enableExpandable` | `motion` на Chevron |
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
| `accordionChevronClass` | Chevron wrapper `origin-center` |
| `accordionBodyClass` | `text-muted` |

### Унаследованные от Expandable (на Item)

`border-token bg-surface shadow-token-sm`, `messageBannerGridLayout`, `focus-ring`, panel padding per size.

## Стилизация и кастомизация

### `classNames` на root — `AccordionClassNames`

```ts
type AccordionClassNames = {
  root?: string;
  item?: string;
  heading?: string;
  trigger?: string;
  triggerLift?: string;
  message?: string;
  icon?: string;
  content?: string;
  title?: string;
  description?: string;
  chevron?: string;
  panelShell?: string;
  panel?: string;
  glossContent?: string;
};
```

Мерж-порядок для каждого слота: **база → `classNames.slot` → `className` подчасти**.

Провайдер `AccordionClassNamesProvider` на root — слоты наследуются всеми `Accordion.Item`. Каждый `Accordion.Item` может локально переопределить любой слот через свой проп `classNames` (мерж как `Breadcrumbs.List`: `{...parent, ...classNames}`), не затрагивая другие Item.

| Слот | Куда попадает |
|------|----------------|
| `root` | `Accordion` root `<div>` |
| `item` | Каждый `Accordion.Item` → `Expandable`'s `classNames.root` |
| `heading` | `Accordion.Heading` (`<h3>`) |
| `trigger` / `triggerLift` | `Accordion.Trigger` → `Expandable.Trigger` |
| `message` | `Accordion.Message` → `Expandable.Message` |
| `icon` | `Accordion.Icon` → `Expandable.Icon` |
| `content` | `Accordion.Content` → `Expandable.Content` |
| `title` | `Accordion.Title` → `Expandable.Title` |
| `description` | `Accordion.Description` → `Expandable.Description` |
| `chevron` | `Accordion.Chevron` (свой компонент, не `Expandable.Chevron`) |
| `panelShell` / `panel` | `Accordion.Panel` → `Expandable.Panel` |
| `glossContent` | `Expandable`'s gloss-wrapper (не используется, т.к. Item всегда `variant="default"`) |

### Пример: переопределение на одном Item

```tsx
<Accordion classNames={{ trigger: "bg-primary/5", title: "text-primary" }}>
  <Accordion.Item>...</Accordion.Item>
  <Accordion.Item classNames={{ title: "text-danger" }}>
    {/* title красный, trigger — унаследован от root */}
    ...
  </Accordion.Item>
</Accordion>
```

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
            <Accordion.Chevron />
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
- `Accordion.Chevron` — внутри или рядом с `Message` (grid резолвит по `displayName`).
- Для controlled state используйте стабильные `value` на Item, не полагайтесь на auto-index при reorder.
- Сравнение с `Expandable`: один блок vs группа с `value`.
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
- Icon / Chevron: `aria-hidden`
- Keyboard: Enter/Space на trigger

**Нет** `role="group"` / accordion pattern на root — каждый Item автономный disclosure; «один открыт» — только JS (`value`).

## Структура файлов

```
Accordion/
├── Accordion.tsx
├── index.ts
├── accordionTypes.ts
├── accordionStyles.ts
├── accordionAnimations.ts       # resolveAccordionItemMotion (embedder → Expandable)
├── accordionParts.tsx
├── accordionAPI.ts
├── accordionContext.tsx
├── useAccordionRootState.ts
└── Accordion.stories.tsx
```

A11y — в `Expandable/expandableA11y.ts` (display names Accordion зарегистрированы).

## Storybook

`Composite Components/Accordion` — default FAQ, interaction test, trigger ripple, slot motion gallery.

Playground: `playground/showcase/demos/accordion/` — sizes, checkout FAQ, release notes, slot motion.
