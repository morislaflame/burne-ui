# SelectionIndicator

Визуальный индикатор выбора: круглая оболочка (shell), fill-слой и mark (галочка, точка или кастомная иконка). Низкоуровневый примитив для Checkbox, Radio, ListBox и других контролов. Не интерактивен сам по себе (`aria-hidden`).

## Импорт

```tsx
import { SelectionIndicator, useSelectionIndicatorAnimation, selectionIndicatorShellClass, selectionIndicatorFallbackPx, type SelectionIndicatorProps, type SelectionIndicatorSize, type SelectionIndicatorVariant, type SelectionIndicatorClassNames } from "burne-ui";
```

## API

### Simple API (props)

```tsx
<SelectionIndicator
  selected={checked}
  size="base"
  variant="outline"
  check
/>

<SelectionIndicator selected={isOn} dot variant="gloss" />

<SelectionIndicator selected={active} icon={<IoStar aria-hidden />} />
```

### Compound API (слоты Fill / Mark)

```tsx
<SelectionIndicator selected={checked} size="mid" variant="secondary">
  <SelectionIndicator.Fill className="bg-primary/20" />
  <SelectionIndicator.Mark>
    <IoCheckmark aria-hidden />
  </SelectionIndicator.Mark>
</SelectionIndicator>
```

Если в `children` есть `SelectionIndicator.Fill` или `.Mark` — включается compound-режим разметки.

### Props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `selected` | — | **Обязательный.** Активное состояние → анимация fill/mark |
| `size` | `base` | `xsmall` \| `small` \| `base` \| `mid` \| `large` |
| `variant` | `base` | `base` \| `secondary` \| `outline` \| `gloss` |
| `check` | `false` | Дефолтная галочка `IoCheckmarkSharp` |
| `dot` | `false` | Radio-dot (круг внутри) |
| `icon` | — | Кастомный mark (приоритет над check/dot) |
| `className` | — | Мержится в **root** |
| `classNames` | — | `root`, `fill`, `mark` |

### `SelectionIndicatorClassNames`

```tsx
type SelectionIndicatorClassNames = {
  root?: string;
  fill?: string;
  mark?: string;
};
```

### Compound-подчасти

| Часть | Роль |
|-------|------|
| `SelectionIndicator.Fill` | Fill-слой с ref для GSAP |
| `SelectionIndicator.Mark` | Mark-слой (иконка/dot) с ref для GSAP |

## variant

| variant | Shell | Fill | Mark |
|---------|-------|------|------|
| `base` | `border-primary bg-surface` | `bg-indicator` | `text-indicator-foreground` |
| `secondary` | `border-token bg-secondary` | `bg-secondary` | `text-secondary-foreground` |
| `outline` | `border-primary bg-surface` | **нет fill** | dot/check цвет foreground |
| `gloss` | `gloss-indicator` | `gloss-indicator-fill` | `text-foreground` |

`outline` — только обводка; fill не рендерится (`selectionIndicatorShowsFill`).

## Размеры

CSS-переменные: `--selection-indicator-xsmall` … `--selection-indicator-large` (диаметр),
`--selection-indicator-radius-*` = `--radius-*` × 0.618 (углы shell/dot — не `rounded-full`; fill — `rounded-[inherit]` + `-inset` под бордер, без отдельного радиуса в API).

| size | CSS class | Mark icon |
|------|-----------|-----------|
| `xsmall` | `selection-indicator-xsmall` | `--icon-size-xsmall` × 0.75 |
| `small` | `selection-indicator-small` | `--icon-size-small` × 0.75 |
| `base` | `selection-indicator-base` | `--icon-size-base` × 0.75 |
| `mid` | `selection-indicator-mid` | `--icon-size-mid` × 0.75 |
| `large` | `selection-indicator-large` | `--icon-size-large` × 0.75 |

Утилита `selectionIndicatorFallbackPx(size)` — px для layout без DOM.

## Анимации

`useSelectionIndicatorAnimation.ts` — единственный motion-хук.

**DOM-структура:**

```
<span root aria-hidden>              ← shell: size + radius token
  <span fill ref=fillRef>             ← scale 0→1, z-0, -inset border, rounded-[inherit]
  <span mark ref=markRef>             ← check/dot/icon, z-2
</span>
```

### Pipeline (`selected` toggle)

1. **First layout:** instant `applyInstant(selected)` — без GSAP
2. **Reduced motion:** instant scale/opacity, `killMotion`
3. **Fill (если variant ≠ outline):**
   - select: `gsap.fromTo(fill, { scale:0, autoAlpha:0 }, { scale:1, autoAlpha:1, ...motionSelectionFill() })`
   - deselect: `gsap.to(fill, { scale:0, autoAlpha:0, ... })`
4. **Mark (если есть):**
   - select: `fromTo mark { scale:0.88, autoAlpha:0 } → { scale:1, autoAlpha:1 }` — те же `motionSelectionFill()`
   - deselect: `to { scale:0.92, autoAlpha:0 }`

Initial inline style на Fill/Mark: `scale(0)`, `opacity: 0`.

### Кастомизация

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  selectionFillDuration: 280,
  selectionFillEase: "back.out(1.25)",
  enableSelectionFill: true,
});
```

### Сводка

| Слой | Анимируется | `configureMotion` |
|------|-------------|-------------------|
| Fill | scale + autoAlpha | `selectionFillDuration`, `selectionFillEase`, `enableSelectionFill` |
| Mark | scale + autoAlpha | те же |
| Shell | CSS only | — |

## Стилизация и кастомизация

### Два уровня

1. **`className`** — мержится в **root** (вместе с `classNames.root`).
2. **`classNames`** — `root`, `fill`, `mark`.

В compound API `SelectionIndicator.Fill` / `.Mark` принимают свой **`className`** поверх слота.

### Слоты

| Слот | Элемент | Назначение |
|------|---------|------------|
| `root` | Внешний круг | Border, gloss, размер |
| `fill` | Absolute inset fill | Цвет заливки checked |
| `mark` | Check/dot/icon | Размер иконки, цвет mark |

### Standalone

```tsx
<SelectionIndicator
  selected={isSelected}
  variant="outline"
  check
  className="ring-2 ring-primary/30"
  classNames={{
    root: "border-primary/50",
    fill: "bg-primary/30",
    mark: "text-primary",
  }}
/>
```

### Через родительские контролы

Слоты прокидываются с root контрола:

```tsx
// Checkbox
<Checkbox classNames={{ indicator: "…", indicatorFill: "…", indicatorMark: "…" }}>

// Radio — то же
// ListBox.ItemIndicator classNames={{ itemIndicatorShell, itemIndicatorFill, … }}
```

Маппинг: `indicator` → root, `indicatorFill` → fill, `indicatorMark` → mark.

### Compound кастом mark

```tsx
<SelectionIndicator selected dot variant="gloss" size="large">
  <SelectionIndicator.Fill className="bg-primary-tint" />
  <SelectionIndicator.Mark className="text-primary">
    <span className="size-2 rounded-full bg-current" />
  </SelectionIndicator.Mark>
</SelectionIndicator>
```

### Практические заметки

- **`check` vs `dot` vs `icon`:** взаимоисключающие приоритеты — `icon` > custom Mark child > `check` > `dot`.
- **outline:** без fill — стилизуйте только root + mark.
- **Кастомный radius shell:** достаточно `classNames.root` / `rounded-*` — fill подхватывает через `rounded-[inherit]`.
- **Не интерактивен:** не вешайте pointer-events; клик на родителе.
- **Порядок мержа:** variant classes → `classNames` → `className` (root).

## Встроенное использование

| Компонент | Режим |
|-----------|-------|
| `Checkbox` | `check`, variants mapped |
| `Radio` | `dot` |
| `ListBox.ItemIndicator` | `check` / radio dot по `indicatorMode` |
| `Checkbox.Indicator` / `Radio.Indicator` | compound `.Fill` / `.Mark` |

## Доступность

- Root: `aria-hidden` — семантика на нативном input родителя
- Mark/fill: decorative

## Экспортируемые утилиты

```tsx
selectionIndicatorShellClass(size, className?)
selectionIndicatorVariantClass(variant, selected)
selectionIndicatorFallbackPx(size)
useSelectionIndicatorAnimation(active, fillRef?, iconRef?)
```

## Структура файлов

```
SelectionIndicator/
├── SelectionIndicator.tsx
├── index.ts
├── selectionIndicatorTypes.ts
├── selectionIndicatorTokens.ts    # размеры, variant CSS
├── selectionIndicatorAPI.ts       # compound partition, mark resolve
├── selectionIndicatorParts.tsx    # Fill, Mark
├── selectionIndicatorContext.tsx
├── useSelectionIndicatorRootState.ts
└── useSelectionIndicatorAnimation.ts
```

## Storybook

Отдельной story нет — см. Checkbox, Radio, ListBox stories с indicator variants.
