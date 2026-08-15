# Breadcrumbs

Навигационная цепочка в `<nav>`. **Simple API** — `items` на root; **compound API** — `Breadcrumbs.List` + `Breadcrumbs.Item`. При `collapse` длинные цепочки сворачиваются в `…` с `Dropdown` скрытых сегментов.

## Импорт

```tsx
import { Breadcrumbs, type BreadcrumbsProps, type BreadcrumbsClassNames, type BreadcrumbItem, type BreadcrumbsListProps, type BreadcrumbsItemProps, type BreadcrumbsMotion, type BreadcrumbsPartMotion } from "burne-ui";
```

## API

### Simple API

```tsx
<Breadcrumbs
  items={[
    { label: "Главная", href: "/" },
    { label: "Каталог", href: "/catalog" },
    { label: "Текущая", current: true },
  ]}
/>
```

### Compound API

```tsx
<Breadcrumbs collapse>
  <Breadcrumbs.List>
    <Breadcrumbs.Item href="/" onClick={preventNav}>
      Главная
    </Breadcrumbs.Item>
    <Breadcrumbs.Item href="/catalog">Каталог</Breadcrumbs.Item>
    <Breadcrumbs.Item current>Текущая</Breadcrumbs.Item>
  </Breadcrumbs.List>
</Breadcrumbs>
```

### Root props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `collapse` | `true` | Сворачивать цепочки > 3 пунктов |
| `items` | — | Simple API: массив `BreadcrumbItem` |
| `aria-label` | `"Хлебные крошки"` | Accessible name для `<nav>` |
| `className` | — | Классы на `<nav>` |
| `classNames` | — | Слоты |

### `BreadcrumbItem`

```tsx
type BreadcrumbItem = {
  label: ReactNode;
  href?: string;
  onClick?: (event) => void;
  current?: boolean;
  className?: string;
};
```

### Compound-подчасти

| Часть | Назначение |
|-------|------------|
| `Breadcrumbs.List` | `<ol>` с auto-walk `Breadcrumbs.Item` |
| `Breadcrumbs.Item` | Marker для compound (рендерится через walk) |
| `Breadcrumbs.Separator` | Кастомный chevron (в simple/compound pieces — `IoChevronForward`) |

`Breadcrumbs.Item` в compound — declarative marker (`return null`), данные собираются через `displayName` walk.

### `BreadcrumbsClassNames`

`root`, `list`, `item`, `separator`, `separatorWrapper`, `itemActive`, `itemLink`, `itemLinkWrapper`, `itemLinkText`, `itemStatic`, `ellipsisTrigger`, `ellipsisLiftWrapper`, `ellipsisText`, `ellipsisPopover`, `dropdownItem`.

`Breadcrumbs.List` может переопределять `classNames` локально (merge с root provider).

## Поведение collapse

При `collapse={true}` и **> 3** пунктах:

```
[first] … [penultimate] [current]
         └─ Dropdown со скрытыми middle items
```

Алгоритм (`breadcrumbsAPI.ts`):

- `n <= 3`: все сегменты видимы
- `n > 3`: `items[0]`, ellipsis (`items[1..n-3]`), `items[n-2]`, `items[n-1]`

Последний сегмент получает `aria-current="page"` (или по `current` prop).

## Анимации

Публичный slot motion. Root — map-only Provider. Каждый интерактивный crumb / ellipsis — nested scope. Dropdown меню «…» — slot motion Dropdown/Popover.

### Slot motion

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `itemLink` | press (+ hover если задать factory) | `pressSqueeze` (`pressOut: false`) |
| `itemLinkText` | hover/press | нет |
| `ellipsisLiftWrapper` | press | `pressSqueeze` (`pressOut: false`) |

`false` на `itemLink.pressIn` — skip без kill. Current/static сегменты не анимируются.

**Где в коде:** типы — `breadcrumbsTypes.ts`; scope — `breadcrumbsContext.tsx`; defaults — `breadcrumbsAnimations.ts`; слоты — `breadcrumbsParts.tsx`; карта на Root — `Breadcrumbs.tsx`.

```tsx
<Breadcrumbs motion={{ itemLink: { pressIn: false } }} items={items} />
```

## Токены и CSS

| Класс / токен | Назначение |
|---------------|------------|
| `CRUMB_INTERACTIVE_INNER_CLASS` | Truncate, muted, `hover:text-foreground` |
| `BREADCRUMBS_ELLIPSIS_TRIGGER_CLASS` | `…` button, `aria-expanded` styles |
| `breadcrumbCurrentClass` | `font-medium text-foreground` last segment |
| `breadcrumbChevronClass` | `IoChevronForward icon-small opacity-75` |
| `TEXT_COLOR_TRANSITION` | Color transition на interactive |
| `focus-ring` | Keyboard focus ring (`--color-focus-ring`) |

## Стилизация и кастомизация

### Два уровня

1. **`className` на root** — padding/border на `<nav>`.
2. **`classNames` на root** — все слоты; `Breadcrumbs.List` может дополнить локально.

Per-item: **`className` на `Breadcrumbs.Item`** (compound) или `BreadcrumbItem.className` (simple).

### Слоты `BreadcrumbsClassNames`

| Слот | DOM | Когда использовать |
|------|-----|-------------------|
| `root` | `<nav>` | Container border/padding |
| `list` | `<ol>` | Flex gap, wrap long chains |
| `item` | `<li>` | Item + separator spacing |
| `separator` | `IoChevronForward` | Chevron color/size |
| `separatorWrapper` | Wrapper span | Separator alignment |
| `itemActive` | Last crumb `Text` | Current page emphasis |
| `itemLink` | `<a>` / `<button>` | Interactive surface padding |
| `itemLinkWrapper` | Outer span | Hover hit area |
| `itemLinkText` | Inner `Text` | Typography + press target |
| `itemStatic` | Non-clickable segment | Muted path without href |
| `ellipsisTrigger` | `Dropdown.Trigger` | `…` button surface |
| `ellipsisLiftWrapper` | Inner span | Press wrapper |
| `ellipsisText` | `…` Text | Weight/color ellipsis |
| `ellipsisPopover` | Dropdown body | Menu panel border |
| `dropdownItem` | Hidden crumb rows | Menu item typography |

### Simple API

```tsx
<Breadcrumbs
  className="rounded-mid border border-token p-small"
  classNames={{
    separator: "text-primary opacity-100",
    itemLink: "text-info hover:text-info",
    itemActive: "font-semibold text-success",
  }}
  items={[
    { label: "Главная", href: "/" },
    { label: "Каталог", href: "/catalog" },
    { label: "Текущая", current: true },
  ]}
/>
```

### Compound API с локальным List override

```tsx
<Breadcrumbs
  collapse
  classNames={{
    list: "gap-small",
    itemActive: "font-semibold text-success",
    ellipsisPopover: "border border-token",
  }}
>
  <Breadcrumbs.List classNames={{ ellipsisTrigger: "text-warning" }}>
    <Breadcrumbs.Item href="/">Главная</Breadcrumbs.Item>
    <Breadcrumbs.Item href="/catalog">Каталог</Breadcrumbs.Item>
    <Breadcrumbs.Item current>Текущая</Breadcrumbs.Item>
  </Breadcrumbs.List>
</Breadcrumbs>
```

### Per-item className

```tsx
<Breadcrumbs.Item href="#" className="underline decoration-dotted">
  Главная
</Breadcrumbs.Item>
```

Мержится в `itemLink` / `itemStatic` / `itemActive` slot.

### Практические заметки

- SPA: `onClick` + `preventDefault` на `href`.
- `collapse={false}` — полная цепочка без `…` menu.
- Separator — `IoChevronForward` (`aria-hidden`).
- `Breadcrumbs.List` наследует collapse context от root.
- Hidden items в ellipsis menu — осмысленные `label` для screen readers.
- **Не задавайте `transform` на `itemLinkText`** — конфликт с press squeeze.
- **List `classNames` merge** с root provider — локальные слоты перекрывают root.

## Интеграции

| Компонент | Использование |
|-----------|---------------|
| `Dropdown` | Ellipsis menu со скрытыми крошками |
| `Text` | Typography всех сегментов |
| `Link` | Альтернатива для отдельных ссылок вне цепочки |

## Доступность

- Root: `<nav aria-label="Хлебные крошки">` (или кастомный `aria-label`)
- Current page: `aria-current="page"` на последнем сегменте
- Separators: `aria-hidden`
- Ellipsis trigger: `aria-label="Показать N скрытых разделов"`
- Dropdown popover: `aria-label="Скрытые разделы"`
- Interactive crumbs: нативные `<a>` / `<button>` semantics

## Структура файлов

```
Breadcrumbs/
├── Breadcrumbs.tsx
├── index.ts
├── breadcrumbsTypes.ts
├── breadcrumbsStyles.ts
├── breadcrumbsAnimations.ts    # slot defaults
├── breadcrumbsParts.tsx
├── breadcrumbsSimpleContent.tsx
├── useBreadcrumbsRootState.ts
├── breadcrumbsAPI.ts
├── breadcrumbsA11y.ts
├── breadcrumbsContext.tsx
└── Breadcrumbs.stories.tsx
```

## Storybook

`Core Components/Breadcrumbs` — simple/compound, collapse, long chain, light theme, per-item className, `classNames`.
