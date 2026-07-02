# Pagination

Навигация по страницам в `<nav>`. Compound API: `Summary`, `Content`, `Item`, `Previous` / `Next`, `Pages`. Кнопки в стиле muted links с press text motion; смена страниц анимируется FLIP-подобным сдвигом.

## Импорт

```tsx
import {
  Pagination,
  type PaginationProps,
  type PaginationClassNames,
  type PaginationSummaryProps,
  type PaginationContentProps,
  type PaginationPageProps,
} from "burne-ui";
```

## API

### Compound API

```tsx
const [page, setPage] = useState(1);

<Pagination
  page={page}
  totalPages={10}
  onPageChange={setPage}
  siblingCount={1}
>
  <Pagination.Summary>
    Страница {page} из 10
  </Pagination.Summary>
  <Pagination.Content>
    <Pagination.Item>
      <Pagination.Previous />
    </Pagination.Item>
    <Pagination.Pages />
    <Pagination.Item>
      <Pagination.Next />
    </Pagination.Item>
  </Pagination.Content>
</Pagination>
```

### Root props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `page` | — | Текущая страница (1-based) |
| `totalPages` | — | Всего страниц |
| `onPageChange` | — | `(page: number) => void` |
| `siblingCount` | `1` | Соседние страницы вокруг current |
| `aria-label` | `"Pagination"` | Accessible name `<nav>` |
| `className` | — | На `<nav>` |
| `classNames` | — | Слоты |

### `PaginationClassNames`

`root`, `summary`, `summaryText`, `content`, `item`, `interactive`, `pageActive`, `pageText`, `ellipsis`, `navText`, `previousIcon`, `nextIcon`.

### Compound-подчасти

| Часть | Назначение |
|-------|------------|
| `Pagination.Summary` | Текстовая сводка (опционально) |
| `Pagination.Content` | `<ol>` списка controls |
| `Pagination.Item` | `<li>` wrapper |
| `Pagination.Previous` / `Next` | Nav buttons с auto disable |
| `Pagination.PreviousIcon` / `NextIcon` | `IoChevronBack` / `Forward` |
| `Pagination.Page` | Кнопка номера страницы |
| `Pagination.Pages` | Auto range из context |
| `Pagination.Ellipsis` | Декоративное `…` |

`Pagination.Pages` требует `page` и `totalPages` на root.

## Поведение range

`getPaginationRange(page, totalPages, siblingCount)`:

- `totalPages <= 7`: все номера
- иначе: `1`, `…`, siblings, `…`, `last`
- ellipsis items получают `data-flip-key` для анимации

`Pagination.Previous` disabled при `page <= 1`; `Next` при `page >= totalPages`.

Активная страница — `<span aria-current="page">`, не кнопка.

## Анимации

`paginationAnimations.ts` — FLIP на `<ol>` + shared press motion на кнопках.

**DOM:**

```
<nav>
  <Pagination.Summary />
  <ol ref=olRef>                    ← usePaginationFlip target
    <li data-flip-key="prev">       ← Previous
    <li data-flip-key="page-3">     ← Page button
    <li data-flip-key="ellipsis-1"> ← Ellipsis (fade in/out)
    <li data-flip-key="page-active"> ← Current span (no button)
```

Нет portal, нет hover shadow lift — только text press + layout shift.

### 1. Page flip (`usePaginationFlip`)

На каждый layout pass `Pagination.Content` (`useLayoutEffect`):

1. Собирает `data-flip-key` у `<li>` children (или `__keyless_N` fallback)
2. Сравнивает `getBoundingClientRect()` с предыдущим кадром
3. **Existing item** (key был): GSAP `fromTo({ x: dx }, { x: 0, ...motionInteractive() })`
4. **New item** (key новый): `fromTo({ autoAlpha: 0, scale: 0.82 }, { autoAlpha: 1, scale: 1 })`
5. **First run:** skip animation (инициализация `prevRects`)
6. **Unmount cleanup:** `killMotion` на всех children

Ellipsis и page numbers получают стабильные `data-flip-key` из `paginationAPI`.

#### Кастомизация FLIP

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  interactiveDuration: 280,
  interactiveEase: "power2.out",
});
```

**Reduced motion:** `prefersReducedInteractiveHoverLift()` — мгновенный layout без GSAP.

### 2. Button press text motion

`PaginationInteractive` → `usePressableElementTextMotion`:

**Pointer down** на Previous / Next / Page buttons:

- squeeze внутреннего `Text` ref (`textMotionRef`)
- `origin-center` на button (`PAGINATION_INTERACTIVE_BUTTON_CLASS`)

Disabled state: `disabled:opacity-48`, motion skipped через `isDisabled`.

#### Кастомизация press

```ts
configureMotion({
  pressSqueezeScale: [1, 0.98, 1],
  interactiveDuration: 280,
});
```

### 3. Active page switch

Смена `page` → React re-render → `Pagination.Pages` пересобирает range → FLIP анимирует сдвиг.

Сам active span **не** squeeze — это `<span aria-current="page">`.

### Чего нет

- Hover lift / second-level shadow
- Portal animations
- Ripple
- Chevron rotation (static icons)

### Сводка: что настраивается где

| Анимация | Утилита | Ключи `configureMotion` | Локальный prop |
|----------|---------|---------------------------|----------------|
| FLIP shift items | `usePaginationFlip` | `interactiveDuration`, `interactiveEase` | `data-flip-key` на Item |
| New item fade+scale | `usePaginationFlip` | `interactiveDuration` | — |
| Press text squeeze | `usePressableElementTextMotion` | `pressSqueezeScale` | `disabled` на button |
| Active page | React render | — | `page` |

## Токены и CSS

| Класс / токен | Назначение |
|---------------|------------|
| `PAGINATION_INTERACTIVE_BUTTON_CLASS` | Muted link-style buttons, `hover:text-foreground` |
| `PAGINATION_PAGE_ACTIVE_CLASS` | Current page `font-medium text-foreground` |
| `PAGINATION_PAGE_TEXT_CLASS` | `tabular-nums` на номерах |
| `PAGINATION_ELLIPSIS_CLASS` | Decorative `…` |
| `PAGINATION_PREVIOUS_ICON_CLASS` | `IoChevronBack icon-small` |
| `focus-ring` | Keyboard focus на interactive |
| `motion-reduce:animate-none` | На buttons |

## Стилизация и кастомизация

### Два уровня

1. **`className` на `Pagination`** — `<nav>` wrapper.
2. **`classNames` на root** — summary, content, buttons, icons.

`Pagination.Item` / `Page` / `Previous` — без отдельного `classNames`; стили через слоты root.

### Слоты `PaginationClassNames`

| Слот | DOM | Когда использовать |
|------|-----|-------------------|
| `root` | `<nav>` | Border, padding, max-width container |
| `summary` | Summary div | Layout сводки слева |
| `summaryText` | Inner `Text` | Color/size «Страница N из M» |
| `content` | `<ol>` | Gap между page items |
| `item` | `<li>` | Per-item spacing |
| `interactive` | Nav/page `<button>` | Hover color, padding, radius |
| `pageActive` | Current `<span>` | Active typography (не button) |
| `pageText` | Page number in button | Muted → foreground hover |
| `ellipsis` | `…` span | Ellipsis color/size |
| `navText` | Back/Forward label | Nav typography |
| `previousIcon` / `nextIcon` | Chevron icons | Icon size/opacity |

### Full compound с summary

```tsx
<Pagination
  page={page}
  totalPages={12}
  onPageChange={setPage}
  classNames={{
    root: "rounded-mid border border-primary/20 p-base",
    summaryText: "text-primary",
    content: "gap-small",
    interactive: "text-info hover:text-primary",
    pageActive: "text-primary font-semibold",
    navText: "font-medium",
  }}
>
  <Pagination.Summary>Страница {page} из 12</Pagination.Summary>
  <Pagination.Content>
    <Pagination.Item><Pagination.Previous /></Pagination.Item>
    <Pagination.Pages />
    <Pagination.Item><Pagination.Next /></Pagination.Item>
  </Pagination.Content>
</Pagination>
```

### Minimal prev/next only

```tsx
<Pagination page={page} totalPages={5} onPageChange={setPage}>
  <Pagination.Content>
    <Pagination.Item><Pagination.Previous>Назад</Pagination.Previous></Pagination.Item>
    <Pagination.Item><Pagination.Next>Далее</Pagination.Next></Pagination.Item>
  </Pagination.Content>
</Pagination>
```

Кастомный range: вручную `Pagination.Page` + `Pagination.Ellipsis` с уникальными `data-flip-key`.

### Практические заметки

- Иконки: `react-icons/io5` (`IoChevronBack`, `IoChevronForward`).
- `children` в `Previous` / `Next` — кастомные labels; `aria-label` для a11y.
- `Pagination.Page` принимает `isActive` override.
- **Не удаляйте `data-flip-key`** с `<li>` при кастомном range — сломается FLIP.
- Summary опционален — можно только prev/next/pages.
- **Не задавайте `transform` на `<li>`** — конфликт с FLIP `x` tween.
- **Порядок мержа:** base button classes → `classNames.interactive` → per-button `className` (если API).

## Интеграции

| Контекст | Паттерн |
|----------|---------|
| Tables / lists | `page` + `onPageChange` с data fetch |
| `Breadcrumbs` | Похожий press motion на интерактивных элементах |

## Доступность

- Root: `<nav aria-label="Pagination">`
- Active page: `aria-current="page"`
- Page buttons: `aria-label="Page N"` (если children — только число)
- Previous/Next: default labels `"Back"` / `"Forward"` (кастомизируйте через `aria-label`)
- Ellipsis / icons: `aria-hidden`

## Структура файлов

```
Pagination/
├── Pagination.tsx
├── index.ts
├── paginationTypes.ts
├── paginationStyles.ts
├── paginationAnimations.ts    # usePaginationFlip
├── paginationParts.tsx
├── usePaginationRootState.ts
├── paginationContext.tsx
├── paginationAPI.ts
├── paginationA11y.ts
└── Pagination.stories.tsx
```

## Storybook

`Core Components/Pagination` — prev/next, full pages, controlled state, light theme, `classNames`.
