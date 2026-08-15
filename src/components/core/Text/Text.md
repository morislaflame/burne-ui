# Text

Базовая типографика дизайн-системы. `Text` мапит `variant` на токенизированные классы (`text-base`, `text-header-1` и т.д.) и выбирает семантический HTML-тег по умолчанию.

## Импорт

```tsx
import { Text, type TextProps, type TextVariant } from "burne-ui";
```

## API

### Simple API

```tsx
<Text variant="base">
  Пример текста дизайн-системы Burne UI
</Text>

<Text variant="header-2" as="span" className="break-words break-all">
  Очень_длинное_имя_файла.tsx
</Text>
```

Compound API нет: компонент leaf-level и не имеет подчастей.

### Props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `variant` | — | Обязательный typography variant |
| `as` | зависит от `variant` | HTML-тег или React component |
| `inheritColor` | `false` | Не добавлять `text-foreground` |
| `className` | — | Дополнительные классы |
| HTML props | — | Все `HTMLAttributes<HTMLElement>` кроме переопределённого `className` |

### `TextVariant`

`accent-header`, `header-1`, `header-2`, `large`, `mid`, `base`, `small`, `xsmall`.

### Теги по умолчанию

| Variant | Default tag |
|---------|-------------|
| `accent-header` | `h1` |
| `header-1` | `h2` |
| `header-2` | `h3` |
| `large` / `mid` / `base` / `small` / `xsmall` | `p` |

## Размеры и варианты

`variant` отвечает только за типографику:

| Variant | CSS token |
|---------|-----------|
| `accent-header` | `text-accent-header` |
| `header-1` | `text-header-1` |
| `header-2` | `text-header-2` |
| `large` | `text-large` |
| `mid` | `text-mid` |
| `base` | `text-base` |
| `small` | `text-small` |
| `xsmall` | `text-xsmall` |

`variant` не задаёт semantic status и не меняет цвет, кроме default `text-foreground`.

## Анимации

### Slot motion

| Слоты | Фазы | Дефолт |
|-------|------|--------|
| `root` | `enter` / hover / press (opt-in) | empty |

Свой scope на корне. Без пропа `motion` GSAP не играет.

`false` на фазе — skip без kill и без смены визуала. Не анимируйте layout (`width` / `height` / `top` / `left` / `margin`) в публичных MotionVars. Кастомный `motion` — opt-in: без пропа дефолтный вид не меняется.


Без пропа `motion` визуал прежний: публичный slot motion — opt-in, defaults пустые.

**DOM:**

```tsx
createElement(as ?? defaultTag, {
  className: cn(TEXT_VARIANT_CLASS[variant], !inheritColor && "text-foreground", className),
})
```

`variant` → утилита `text-*` (size + line-height + weight). Перекрытие через `className`: `text-large`, `leading-none`, `font-semibold` — через `cn` / twMerge (`--tw-leading` / `--tw-font-weight`).

### Сводка

| Анимация | GSAP | `configureMotion` |
|----------|------|-------------------|
| Typography render | Нет | — |
| Color/variant switch | Нет | — |

## Стилизация и кастомизация

### Один уровень

`Text` принимает только `className`. `classNames` нет, потому что у компонента один DOM-узел.

```tsx
<Text variant="small" className="text-muted">
  Secondary text
</Text>
```

### Цвет

По умолчанию добавляется `text-foreground`.

```tsx
<Text variant="base" className="text-info">
  Info text
</Text>
```

Если цвет должен наследоваться от родителя:

```tsx
<Text variant="base" inheritColor>
  Inherits parent color
</Text>
```

### Семантика через `as`

```tsx
<Text variant="header-1" as="h1">
  Заголовок страницы
</Text>

<Text variant="small" as="span" className="text-muted">
  Inline meta
</Text>
```

### Практические заметки

- `variant` — визуальный размер; `as` — семантика.
- Для inline-контента обычно используйте `as="span"`.
- Для цвета в составных компонентах используйте `inheritColor`, чтобы не перебить цвет контейнера.
- Для переносов (`break-words`, `truncate`) используйте `className`.

## Интеграции

`Text` используется внутри `Badge`, `Avatar.Fallback`, `ProgressBar.Value`, `Meter.Value` и других компонентов как единый слой типографики.

## Доступность

Компонент не добавляет ARIA. Доступность определяется выбранным HTML-тегом через `as` и переданными HTML props.

## Структура файлов

```
Text/
├── Text.tsx
├── index.ts
└── Text.stories.tsx
```

## Storybook

`Core Components/Text` — default, `as="span"` + перенос, surface panel, light theme.
