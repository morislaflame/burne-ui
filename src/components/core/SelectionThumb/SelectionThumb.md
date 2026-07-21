# SelectionThumb

Упрощённый thumb-индикатор для **Switch** и **Slider**: круглый shell + animating fill (без mark/check). Опционально `SelectionThumbIcon` для иконки поверх thumb. Низкоуровневый примитив — не используется напрямую в формах как самостоятельный контрол.

## Импорт

```tsx
import { SelectionThumb, SelectionThumbIcon, type SelectionThumbProps, type SelectionThumbIconProps } from "burne-ui";
```

## API

### `SelectionThumb`

```tsx
<SelectionThumb
  active={checked}
  size="base"
  gloss={false}
  className="shadow-token-sm"
/>
```

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `active` | — | **Обязательный.** Fill scale in/out (как `selected` у SelectionIndicator) |
| `size` | `base` | `SelectionIndicatorSize` |
| `gloss` | `false` | `gloss-indicator` shell + gloss tint fill |
| `shellRef` | — | Ref на shell (для parent slide anim — Switch) |
| `fillRef` | internal | Ref на fill (можно передать извне) |
| `className` | — | На shell |
| `children` | — | Обычно `SelectionThumbIcon` |

### `SelectionThumbIcon`

```tsx
<SelectionThumbIcon size="base" highlighted={isOn} gloss={false}>
  <IoMoon aria-hidden />
</SelectionThumbIcon>
```

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `highlighted` | `false` | `text-indicator-foreground` vs `text-primary` |
| `gloss` | `false` | `text-foreground` в gloss mode |
| `iconRef` | — | Ref для parent icon crossfade (Switch) |
| `className` | — | На wrapper иконки |
| `size` | `base` | Размер SVG через `SELECTION_INDICATOR_ICON_CLASS` |

## variant / surface

| `gloss` | Shell | Fill |
|---------|-------|------|
| `false` | `border border-primary bg-surface` | `selectionIndicatorFillClass("base")` |
| `true` | `gloss-indicator border-0` | `bg-primary-tint` (`FILL_GLOSS_TINT_CLASS`) |

## Анимации

Переиспользует `useSelectionIndicatorAnimation(active, fillRef)` — **только fill**, без mark.

**DOM:**

```
<span shell ref=shellRef>           ← parent may animate position (Switch/Slider)
  <span fill ref=fillRef>           ← scale 0↔1 on active
  {children}                        ← SelectionThumbIcon (opacity from parent)
</span>
```

### Fill animation

Идентично SelectionIndicator fill:

- active: `scale 0→1`, `autoAlpha 0→1`
- inactive: `scale→0`, fade out
- `motionInteractive()` — `interactiveDuration`, `interactiveEase`
- Reduced motion: instant

### Parent animations (не в SelectionThumb)

| Родитель | Доп. motion |
|----------|-------------|
| `Switch` | thumb slide по track, icon opacity, shell ref |
| `Slider` | thumb position по `percent`, press squeeze на button |

SelectionThumb отвечает только за **fill pulse** внутри thumb.

### Кастомизация

```ts
configureMotion({ interactiveDuration: 280 });
```

## Стилизация и кастомизация

### `SelectionThumbClassNames` / `SelectionThumbIconClassNames`

Thumb: `root`, `fill`. Icon: `root`, `icon`.

`className` мержится в `root`.

### `SelectionThumb`

```tsx
<SelectionThumb
  active={value > 0}
  size="mid"
  gloss
  className="ring-1 ring-primary/20"
/>
```

Стили fill/shell gloss заданы токенами — override через родительский Switch/Slider `classNames.thumbShell`.

### `SelectionThumbIcon`

```tsx
<SelectionThumbIcon
  highlighted={checked}
  gloss={variant === "gloss"}
  className="opacity-90"
>
  <IoSunny aria-hidden />
</SelectionThumbIcon>
```

В Switch видимость иконок on/off — `style={{ opacity }}` на уровне `Switch.Icon`, не в SelectionThumbIcon.

### В Switch / Slider

```tsx
// Switch — слоты thumbShell, icon на Switch root:
<Switch
  classNames={{
    thumb: "…",
    thumbShell: "border-primary/30",
    icon: "text-warning",
  }}
/>
```

SelectionThumb получает `className={slotClassNames.thumbShell}` из Switch internals.

### Практические заметки

- **Не standalone control** — нет role, label, keyboard; оборачивайте в Switch/Slider.
- **active vs checked** — семантика родителя; thumb только визуал fill.
- **shellRef / fillRef** — для координации GSAP в Switch track animations.
- **Тёмная/светлая тема** — gloss CSS из `glossPanel.css`.

## Доступность

- `aria-hidden` на shell и fill
- Иконки: `aria-hidden` на SVG
- A11y — на родительском `Switch` / `role="slider"`

## Встроенное использование

| Компонент | Использование |
|-----------|---------------|
| `Switch.Thumb` | `SelectionThumb` + optional `Switch.Icon` |
| `Slider` thumb button | `SelectionThumb` + `SelectionThumbIcon` |

## Структура файлов

```
SelectionThumb/
├── SelectionThumb.tsx    # SelectionThumb + SelectionThumbIcon
└── index.ts
```

Анимация fill: `../SelectionIndicator/useSelectionIndicatorAnimation.ts`  
Токены shell/size: `../SelectionIndicator/selectionIndicatorTokens.ts`

## Storybook

Отдельной story нет — см. `Switch`, `Slider` stories.
