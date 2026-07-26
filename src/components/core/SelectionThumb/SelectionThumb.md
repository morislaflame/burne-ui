# SelectionThumb

Упрощённый thumb-индикатор для **Switch** и **Slider**: shell с `--selection-indicator-radius-*` (без внутреннего fill). Опционально `SelectionThumb.Icon` — цвет стабильный (`text-primary` / gloss `text-foreground`). Низкоуровневый примитив — не используется напрямую в формах как самостоятельный контрол.

## Импорт

```tsx
import { SelectionThumb, type SelectionThumbProps, type SelectionThumbIconProps } from "burne-ui";
```

## API

### `SelectionThumb`

```tsx
<SelectionThumb
  size="base"
  gloss={false}
  className="shadow-token-sm"
/>
```

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `size` | `base` | `SelectionIndicatorSize` → radius + icon scale |
| `gloss` | `false` | `gloss-indicator` shell |
| `shellRef` | — | Ref на shell (для parent slide anim — Switch) |
| `className` | — | На shell |
| `children` | — | Обычно `SelectionThumb.Icon` |

### `SelectionThumb.Icon`

```tsx
<SelectionThumb.Icon size="base" gloss={false}>
  <IoMoon aria-hidden />
</SelectionThumb.Icon>
```

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `gloss` | `false` | `text-foreground` в gloss mode, иначе `text-primary` |
| `iconRef` | — | Ref для parent icon crossfade (Switch) |
| `className` | — | На wrapper иконки |
| `size` | `base` | Размер SVG через `SELECTION_INDICATOR_ICON_CLASS` |

## variant / surface

| `gloss` | Shell | Icon |
|---------|-------|------|
| `false` | `border border-primary bg-surface` | `text-primary` |
| `true` | `gloss-indicator border-0` | `text-foreground` |

## Анимации

Внутри SelectionThumb motion нет (fill убран).

**DOM:**

```
<span shell ref=shellRef>           ← parent may animate position (Switch/Slider)
  {children}                        ← SelectionThumb.Icon (opacity from parent)
</span>
```

### Parent animations (не в SelectionThumb)

| Родитель | Доп. motion |
|----------|-------------|
| `Switch` | thumb slide по track, icon opacity, shell ref |
| `Slider` | thumb position по `percent`, press squeeze на button |

## Стилизация и кастомизация

### `SelectionThumbClassNames` / `SelectionThumbIconClassNames`

Thumb: `root`. Icon: `root`, `icon`.

`className` мержится в `root`.

### В Switch / Slider

```tsx
<Switch
  classNames={{
    thumb: "…",
    thumbShell: "border-primary/30",
    icon: "text-warning",
  }}
/>
```

SelectionThumb получает `className={slotClassNames.thumbShell}` из Switch internals.

Track/rail скругление — тот же `--selection-indicator-radius-*`, что и у thumb.

### Практические заметки

- **Не standalone control** — нет role, label, keyboard; оборачивайте в Switch/Slider.
- **shellRef** — для координации GSAP в Switch track animations.
- **Тёмная/светлая тема** — gloss CSS из `glossPanel.css`.

## Доступность

- `aria-hidden` на shell
- Иконки: `aria-hidden` на SVG
- A11y — на родительском `Switch` / `role="slider"`

## Встроенное использование

| Компонент | Использование |
|-----------|---------------|
| `Switch.Thumb` | `SelectionThumb` + optional `Switch.Icon` |
| `Slider` thumb button | `SelectionThumb` + `SelectionThumb.Icon` |

## Структура файлов

```
SelectionThumb/
├── SelectionThumb.tsx    # SelectionThumb + SelectionThumb.Icon
└── index.ts
```

Токены shell/radius: `../SelectionIndicator/selectionIndicatorTokens.ts`

## Storybook

Отдельной story нет — см. `Switch`, `Slider` stories.
