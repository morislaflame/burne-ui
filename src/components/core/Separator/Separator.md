# Separator

Визуальный разделитель горизонтальный или вертикальный. Leaf-компонент на border-токенах темы — без анимаций и без `classNames`.

## Импорт

```tsx
import {
  Separator,
  type SeparatorProps,
  type SeparatorOrientation,
} from "burne-ui";
```

## API

### Базовое использование

```tsx
<Separator />

<Separator orientation="vertical" />

<Separator className="my-mid border-primary/30" />
```

Compound API нет.

### Props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `orientation` | `horizontal` | `horizontal` \| `vertical` |
| `className` | — | Дополнительные классы |
| HTML props | — | Пробрасываются на root element |

## Ориентация и DOM

| Orientation | Element | Стили |
|-------------|---------|-------|
| `horizontal` | `<hr>` | `h-0 w-full border-t-token my-xsmall` |
| `vertical` | `<div role="separator">` | `w-0 min-h-[1.5rem] border-l-token mx-xsmall self-stretch` |

Общие классы: `box-border shrink-0`.

## Анимации

`Separator` не использует GSAP и не имеет motion pipeline.

### Сводка

| Анимация | GSAP | `configureMotion` |
|----------|------|-------------------|
| Render | Нет | — |

## Стилизация и кастомизация

### Один уровень

Только **`className`**. Отдельного `classNames` нет.

```tsx
<Separator className="border-dashed opacity-60" />

<Separator
  orientation="vertical"
  className="mx-plus min-h-[2rem] border-l-2 border-info/40"
/>
```

### Практические заметки

- Для горизонтального разделителя в flex-row используйте `orientation="vertical"`.
- Цвет линии — через border utilities (`border-primary/20`) или токен `border-token`.
- В списках/меню часто комбинируется с `Surface` и `Card.Footer`.
- `horizontal` использует нативный `<hr>` — учитывайте reset стилей браузера (у нас border-based).

## Интеграции

| Компонент | Сценарий |
|-----------|----------|
| `Card` | Разделение секций внутри body/footer |
| `Surface` | Разделители в stacked panels |
| `Dropdown` | Визуальные group separators (отдельный `Dropdown.Separator`) |

## Доступность

- **Horizontal:** нативный `<hr>` — семантический thematic break
- **Vertical:** `role="separator"` + `aria-orientation="vertical"`
- Декоративный разделитель без смысловой паузы — можно добавить `aria-hidden` через props

## Структура файлов

```
Separator/
├── Separator.tsx
└── index.ts
```

Storybook: отдельных stories нет; примеры использования — в `Card.stories`, `Surface.stories`.

## Storybook

Используется как dependency в других stories (`Card`, `Surface`). Отдельной страницы `Core Components/Separator` может не быть.
