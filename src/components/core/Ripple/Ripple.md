# Ripple

Converge-ripple — волна от точки нажатия, расходящаяся или сходящаяся к ней. Низкоуровневый примитив для интерактивных поверхностей; встроен в `Button`, `CloseButton`, `SearchInput` и вручную подключается к любым `relative`-контейнерам.

## Импорт

```tsx
import { Ripple, RIPPLE_COLOR, type RippleProps, type RippleColor, type RippleDirection } from "burne-ui";
```

## API

Simple API — один самозакрывающийся слой без compound-подчастей.

### Props

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `color` | `RippleColor` \| `string` | `neutral` | Именованный токен или произвольный CSS-цвет |
| `disabled` | `boolean` | `false` | Отключает слушатель `pointerdown` |
| `duration` | `number` | `rippleDefaultDuration` (700 ms) | Длительность анимации волны |
| `direction` | `"in"` \| `"out"` | `"out"` | `in` — схлопывание к точке; `out` — расход от точки |
| `className` | `string` | — | Клип-слой (`rounded-[inherit]` для наследования скругления) |

### `RIPPLE_COLOR` — именованные тона

| Ключ | Токен |
|------|-------|
| `primarySolid` | `converge-ripple-primary-fill` |
| `neutral` | `converge-ripple-neutral` |
| `neutralMuted` | `converge-ripple-neutral-muted` |
| `danger` | `converge-ripple-danger` |
| `success` | `converge-ripple-success` |
| `info` | `converge-ripple-info` |
| `warning` | `converge-ripple-warning` |

Любая другая строка в `color` передаётся в `ConvergeRippleLayer` как CSS-цвет напрямую.

### Примеры

```tsx
// Ручная интеграция
<div className="relative overflow-hidden rounded-mid">
  <Ripple color="neutral" className="rounded-[inherit]" />
  <div className="relative z-[1]">Контент поверх ripple</div>
</div>

// Произвольный цвет
<Ripple color="oklch(0.72 0.14 250 / 0.55)" duration={550} />

// Через Button
<Button ripple variant="primary">Сохранить</Button>
```

## Монтирование и слои

1. **Позиция** — `<Ripple />` первым ребёнком внутри `relative overflow-hidden` области.
2. **Слушатель** — `pointerdown` вешается на ближайший интерактивный предок (`button`, `a[href]`, `[role='button']`) или на `parentElement` слоя.
3. **Контент** — с `relative z-[1]`, чтобы оставаться кликабельным и видимым поверх волны.
4. **Скругление** — `className="rounded-[inherit]"` на Ripple, чтобы клип совпадал с родителем.

### Expandable / Accordion

Положите `<Ripple />` среди детей `<Expandable.Trigger>` — триггер вынесет ripple в overlay на **весь** `<button>` (включая шеврон):

```tsx
<Expandable.Trigger>
  <Ripple color="neutralMuted" />
  <Expandable.Content>
    <Expandable.Title>Заголовок</Expandable.Title>
  </Expandable.Content>
</Expandable.Trigger>
```

## Анимации

Реализация: `useConvergeRipples` (state точек) + `ConvergeRippleLayer` / `ConvergeRippleDot` в `utils/pressRipple.tsx`. Easing: `ensureRippleEase()` из `rippleEaseCss`.

**DOM-структура:**

```
интерактивный предок (button / a / role=button)
  └── <span layerRef>           ← pointer-events-none, overflow-hidden
        └── ConvergeRippleDot[] ← absolute, rounded-full, per click
```

Слушатель `pointerdown` на **предке**, не на span — координаты через `clientX/Y` относительно области.

### 1. Жизненный цикл одной волны

1. `pointerdown` → `pushAtClientCoords(target, x, y)` — вычисляет диаметр до углов (`convergeRippleGeometry`)
2. Монтируется `ConvergeRippleDot` с уникальным `id`
3. GSAP `fromTo`:
   - **direction `"out"`** (default в компоненте): `scale 0.12 → 1`, `autoAlpha opacityFrom → 0`
   - **direction `"in"`**: `scale 1 → 0.12`, тот же fade
4. `onComplete` → `dismiss(id)` — удаление из массива

`RIPPLE_MIN_SCALE = 0.12` — константа, не в `configureMotion`.

### 2. Условия запуска

Ripple **не** создаётся, если:

| Условие | Причина |
|---------|---------|
| `disabled={true}` | нет listener |
| `prefers-reduced-motion` | `prefersReducedInteractiveHoverLift()` |
| `enableRipple: false` | глобальный выключатель |
| `event.defaultPrevented` | например, Dialog.Trigger suppress |
| мышь, `button !== 0` | не левый клик |

### 3. Параметры твина

| Источник | Параметр | Default | Примечание |
|----------|----------|---------|------------|
| prop `duration` | длительность ms | 700 | переопределяет глобальное |
| `configureMotion` | `rippleDefaultDuration` | 700 | fallback |
| `configureMotion` | `rippleDefaultOpacityFrom` | 0.42 | стартовая alpha |
| `configureMotion` | `rippleEaseCss` | cubic-bezier | → GSAP CustomEase |
| prop `direction` | in / out | `out` | направление scale |

Стартовая opacity **только** через motion config / `opacityFrom` в layer — не через props Ripple (кроме косвенно через `getMotionConfig()`).

#### Кастомизация

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  rippleDefaultDuration: 540,
  rippleDefaultOpacityFrom: 0.38,
  rippleEaseCss: "cubic-bezier(0.25, 0.55, 0.35, 0.95)",
  enableRipple: true,
});
```

Per-instance:

```tsx
<Ripple color="neutral" duration={550} direction="in" />
```

**Expandable wide trigger:** `rippleExpandableDuration` / `rippleExpandableOpacityFrom` — для `<Expandable>` / `<SearchInput>`, не для базового `<Ripple />`.

### Сводка: что настраивается где

| Параметр | `configureMotion` | prop `Ripple` |
|----------|-------------------|---------------|
| Длительность | `rippleDefaultDuration` | `duration` |
| Стартовая opacity | `rippleDefaultOpacityFrom` | — |
| Easing | `rippleEaseCss` | — |
| Направление | — | `direction` |
| Цвет | — | `color` / `RIPPLE_COLOR` |
| Вкл/выкл | `enableRipple` | `disabled` |

## Токены

CSS-переменные `--color-converge-ripple-*` (светлая/тёмная тема в `styles.css`):

- `converge-ripple-primary-fill`
- `converge-ripple-neutral`, `converge-ripple-neutral-muted`
- `converge-ripple-danger`, `converge-ripple-success`, `converge-ripple-info`, `converge-ripple-warning`

В коде: `colorToken("converge-ripple-neutral")` или ключи `RIPPLE_COLOR`.

## Стилизация и кастомизация

Ripple — overlay-слой: **только `className` на клип-обёртке**. `classNames` нет. Simple/compound не применим — компонент вставляется внутрь interactive surface.

### Единственный слот

```tsx
<div className="relative overflow-hidden rounded-base">
  <Ripple color="info" className="rounded-[inherit]" />
  <button type="button">Нажми</button>
</div>
```

| Prop | Назначение |
|------|------------|
| `color` | Тон волны (`primary`, `info`, `danger`, …) |
| `className` | Clip shape (`rounded-full`, `rounded-[inherit]`), opacity |
| `direction` | `in` / `out` (converge ripples) |

### Встроенное использование

| Компонент | Как включить | Кастомизация ripple |
|-----------|--------------|---------------------|
| `Button` | `ripple={true}` | Тон auto (`buttonRippleTone`); отдельного слота нет |
| `CloseButton` | `ripple={true}` | `classNames.ripple` на CloseButton |
| `Expandable.Trigger` | `<Ripple />` child | `classNames.triggerRippleOverlay` на Expandable |
| `Card`, `Alert` | Ручной `<Ripple />` | `className` на Ripple + `overflow-hidden` на parent |

### Практические заметки

- **Parent:** обязательны `relative` + `overflow-hidden` на интерактивной поверхности.
- **Не заменяет focus ring** — ripple только press feedback.
- **Кнопки:** цвет подбирается из `variant`/`status` — для кастома используйте явный `color` prop на Ripple.

## Доступность

- Слой `aria-hidden`, `pointer-events-none`.
- Не заменяет focus ring и не влияет на tab-порядок.
- Визуальная обратная связь; для screen reader полагайтесь на нативное состояние кнопки.

## Встроенное использование в ките

| Компонент | Включение |
|-----------|-----------|
| `Button` | `ripple={true}` |
| `CloseButton` | `ripple={true}` |
| `SearchInput` | `ripple={true}` |
| `Expandable.Trigger` | `<Ripple />` как child |
| `Card`, `Alert`, оболочки | ручной `<Ripple />` |

## Структура файлов

```
Ripple/
├── Ripple.tsx           # слой + pointerdown
├── rippleTokens.ts      # RIPPLE_COLOR
├── index.ts
└── Ripple.stories.tsx
```

Утилиты анимации: `utils/pressRipple.ts`, `utils/useConvergeRipples.ts`, `utils/convergeRippleGeometry.ts`.

## Storybook

`Core Components/Ripple` — песочница, направления in/out, интеграции с Card, Button, Expandable, Alert, Input.
