# SearchInput

Компактное поле поиска с **раскрытием** из круглой кнопки в расширенную строку. Atomic-компонент (один файл) — для форм с label/hint используйте `Input`. Поддержка `gloss`, `ripple`, `ButtonGroup`.

## Импорт

```tsx
import {
  SearchInput,
  type SearchInputProps,
  type SearchInputSize,
  type SearchInputVariant,
} from "burne-ui";
```

## API

### Базовое использование

```tsx
<SearchInput
  placeholder="Найти…"
  defaultExpanded
  onValueChange={setQuery}
/>

<SearchInput
  expanded={open}
  onExpandedChange={setOpen}
  expandedWidth={320}
  collapseOnBlur
  ripple
  aria-label="Поиск по сайту"
/>
```

### Props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `size` | `base` | `small` \| `base` \| `mid` \| `large` |
| `variant` | `default` / gloss из ButtonGroup | `default` \| `gloss` |
| `expanded` / `defaultExpanded` | `false` | Controlled / uncontrolled expand |
| `onExpandedChange` | — | Колбэк раскрытия |
| `expandedWidth` | по size | Ширина в px (240–360) |
| `collapseOnBlur` | `true` | Свернуть при blur если пусто |
| `onValueChange` | — | Строка запроса |
| `ripple` | `false` | `<Ripple color="neutral" />` |
| `groupSegment` | — | Сегмент ButtonGroup |
| `disabled` / `readOnly` | — | Блокировка |
| `className` | — | Единственный слот стилей на shell |
| `aria-label` | — | **Рекомендуется** — collapsed trigger + input |

Нет `classNames` — только `className` на root shell.

## Состояния UI

| Состояние | Вид | Поведение |
|-----------|-----|-----------|
| Collapsed | Круглая кнопка с иконкой | `role="button"`, click/Enter/Space → expand |
| Expanded | Прямоугольное поле | `role="search"`, input focus, clear button |
| С query | Expanded + clear | Кнопка `IoClose` |
| Empty blur | Collapse | Если `collapseOnBlur` и пустое значение |

## Анимации

Вся motion в `SearchInput.tsx` (GSAP + field shell utils).

**DOM:**

```
<div ref=rootRef shell>              ← width, borderRadius, shadow
  [Ripple?]
  <span ref=iconRef> IoSearch         ← left position animated
  <input type=search tabIndex=0|-1>
  [button clear]
</div>
```

### 1. Expand / collapse (`runExpandMotion`)

**Expand:**

- Timeline parallel: shell `width` collapsed→targetW, `borderRadius` circle→expanded
- Icon `left`: center → `padX`
- vars: `motionInteractive()`

**Collapse:**

- shell → `collapsedDim` px width, full border-radius
- icon → centered
- onComplete: remove inline width/radius

**Reduced motion:** `applyShellMetrics` instant.

### 2. Shell hover shadow

Collapsed: `shadowNone()`; expanded: `shadowSm()`.

`useSecondLevelShadow` — idle shadow sync по `expanded` key; hover sm→md когда expanded.

Gloss: `useGlossFieldShellMotion` вместо standard hover.

### 3. Press squeeze (collapsed)

`pointerdown` на shell (если !expanded):

- `animateInteractivePressSqueeze` или `animateGlossInteractivePressSqueeze`
- Promise в `squeezePromiseRef` — expand ждёт завершения squeeze

### 4. Icon slide

Синхронно с expand timeline — отдельный tween `iconEl.left`.

### Кастомизация

```ts
configureMotion({
  interactiveDuration: 280,
  interactiveEase: "power2.out",
  hoverLiftScale: 1.025,
  pressSqueezeScale: [1, 0.98, 1],
});
```

Размеры expand width — hardcode `SEARCH_DEFAULT_EXPANDED_WIDTH` per size (не в configureMotion).

### Сводка

| Анимация | `configureMotion` | Hardcode |
|----------|-------------------|----------|
| Expand width/radius | `interactiveDuration` | `expandedWidth` prop |
| Icon slide | interactive | padX per size |
| Hover shadow | `enableHoverLift` | shadow tokens |
| Squeeze | `pressSqueezeScale` | — |
| Ripple | — | `ripple` prop |

## Стилизация и кастомизация

Отдельного `classNames` **нет** — только **`className`** на root shell + props `size` / `variant`.

### Что можно настроить

| Способ | Что меняет |
|--------|------------|
| `className` | Margin, max-width wrapper, external layout |
| `size` | Высота, icon box, collapsed width, default expanded width |
| `variant="gloss"` | `gloss-control` surface |
| `expandedWidth` | Целевая ширина expand (px) |
| `ripple` | Press ripple overlay |

### Пример

```tsx
<SearchInput
  size="mid"
  variant="gloss"
  ripple
  expandedWidth={400}
  className="mx-auto"
  aria-label="Поиск товаров"
  placeholder="Найти товар…"
/>
```

### В ButtonGroup

```tsx
<ButtonGroup variant="gloss">
  <SearchInput groupSegment="start" />
  <Button groupSegment="end">Фильтр</Button>
</ButtonGroup>
```

При segment: group rounding/surface; shell hover отключён.

### Clear button

Стили фиксированы (CSS `hoverVariant`, `focus-ring-inset`) — не кастомизируется через API.

### Практические заметки

- **Для форм с label** — используйте `Input` + prefix icon, не SearchInput.
- **Controlled expand:** `expanded` + `onExpandedChange` для header toolbar integration.
- **Не override `width`/`borderRadius` в className** при expand — конфликт с GSAP inline styles.
- **`aria-label` обязателен** в collapsed mode (дефолт «Open search»).

## Доступность

| Состояние | role | Клавиатура |
|-----------|------|------------|
| Collapsed | `button`, `aria-expanded=false` | Enter/Space → open |
| Expanded | `search`, `aria-expanded=true` | input focus; Esc collapse if empty |
| Input | `type="search"` | Native search; `tabIndex` 0 only when expanded |

- Clear: `aria-label="Clear field"`
- Иконки: `aria-hidden`

## Интеграция

| Контекст | Поведение |
|----------|-----------|
| `ButtonGroup` | `groupSegment`, gloss variant |
| Card toolbar | `defaultExpanded`, custom `expandedWidth` |

## Структура файлов

```
SearchInput/
├── SearchInput.tsx      # component + all motion
├── index.ts
└── SearchInput.stories.tsx
```

Утилиты: `readControlHeightPx`, `CONTROL_SIZE_LAYOUT`; радиус expanded — `readSearchExpandedRadiusPx` в `searchInputStyles`.

## Storybook

`Core Components/SearchInput` — collapsed/expanded, controlled, gloss, ripple, ButtonGroup, light theme, a11y.
