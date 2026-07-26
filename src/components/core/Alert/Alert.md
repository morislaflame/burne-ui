# Alert

Баннер уведомления с семантическими статусами, grid-компоновкой и hover-lift (компонент **второго уровня** — тень в покое и усиление при наведении). Simple и compound API.

## Импорт

```tsx
import { Alert, resolveAlertStatus, resolveAlertVariant, resolveAlertLiveRole, type AlertProps, type AlertVariant, type AlertStatus, type AlertLiveRole, type AlertClassNames } from "burne-ui";
```

## API

### Root props (`Alert`)

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `variant` | `default` \| `outline` \| `secondary` \| `gloss` | `default` | Визуальный стиль |
| `status` | `default` \| `danger` \| `success` \| `info` \| `warning` | `default` | Семантический тон |
| `size` | `small` \| `base` \| `mid` \| `large` | `base` | Padding, icon, type и **radius** (`CONTROL_SIZE_LAYOUT.rounded`) |
| `role` | `status` \| `alert` | auto | Live region; danger/warning → `alert` |
| `title` | `ReactNode` | — | Simple API |
| `description` | `ReactNode` | — | Simple API |
| `icon` | `ReactNode` \| `null` | auto | Simple: иконка; `null` скрывает индикатор |
| `action` | `ReactNode` | — | Simple: слот справа |
| `hoverLift` | `boolean` | `true` | Тень sm→md и lift при hover |
| `className` | `string` | — | Доп. классы на root |
| `classNames` | `AlertClassNames` | — | Слоты подчастей |

### Compound-подчасти

| Часть | Назначение |
|-------|------------|
| `Alert.Indicator` | Иконка слева; `status` prop переопределяет контекст |
| `Alert.Message` | Обёртка (`display: contents`) для группировки |
| `Alert.Content` | Группа title + description |
| `Alert.Title` | Заголовок (`font-medium`, `Text` base) |
| `Alert.Description` | Текст (`text-muted`, `Text` small) |
| `Alert.Action` | Слот действия справа |

### `AlertClassNames`

```tsx
type AlertClassNames = {
  root?: string;
  indicator?: string;
  message?: string;
  content?: string;
  title?: string;
  description?: string;
  action?: string;
};
```

### Simple API

```tsx
<Alert
  status="success"
  title="Сохранено"
  description="Изменения применены."
  action={<Button size="small" variant="ghost">Отменить</Button>}
/>
```

### Compound API

```tsx
<Alert status="danger" variant="outline">
  <Alert.Indicator />
  <Alert.Title>Ошибка</Alert.Title>
  <Alert.Description>Не удалось загрузить данные.</Alert.Description>
  <Alert.Action>
    <Button size="small">Повторить</Button>
  </Alert.Action>
</Alert>
```

Compound включается автоматически при наличии слотов (`Alert.Message`, `Alert.Title`, …).

## variant и status

| variant | default status | status ≠ default |
|---------|----------------|------------------|
| `default` | `bg-surface border-token` | tint + semantic text |
| `outline` | прозрачный + `border-token` | semantic border + text |
| `secondary` | `bg-secondary` | semantic text на secondary |
| `gloss` | `gloss-panel border-0` | semantic text |

### Индикатор по умолчанию

| Условие | Иконка |
|---------|--------|
| `status` danger/success/info/warning | `SEMANTIC_STATUS_ICONS[status]` (Io5) |
| `variant="outline"`, status default | `IoHelpCircleOutline` |
| иначе | скрыт (если не передан `icon`) |

`icon={null}` или `<Alert.Indicator>{null}</Alert.Indicator>` — без индикатора.

## Анимации

Компонент **2-го уровня** — тень в покое (`sm`), усиление при hover (`md`). Логика: `alertAnimations.ts` → `useSecondLevelShadow` или gloss-handlers.

**DOM-структура:**

```
<div ref=root>              ← motion target, pointer over/out
  grid: indicator | title | description | action
```

Нет collapse, portal, ripple. Только hover lift на корне.

### 1. Hover lift — default / outline / secondary (`hoverLift={true}`)

`useSecondLevelShadow(rootRef, liftEnabled && !isGloss)`:

**Init (mount):** `initElementShadow(el, shadowSm())` — покой `--el-shadow: var(--shadow-sm)`.

**Pointer enter:**

1. `animateInteractiveHoverLift(el, true, undefined, secondLevelShadow())`
2. Scale: адаптивный подъём (~1.8px cap, `hoverLiftScale`)
3. Тень: `idle sm` → `hover md` через CSS-переменную `--el-shadow`

**Pointer leave:** обратно к `sm`, scale `1`.

Класс на root: `animate-shadow will-change-transform origin-center` (`SHADOW_LIFT_MOTION_CLASS`).

**Отличие от Button (1-й уровень):** Alert **всегда** имеет тень в покое; Button — только при hover.

#### Кастомизация hover lift

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  hoverLiftScale: 1.025,
  hoverLiftEase: "sine.inOut",
  interactiveDuration: 280,   // длительность lift
  enableHoverLift: true,
});
```

**Локально:** `hoverLift={false}` — без handlers и без `motionClass`.

**Reduced motion / touch:** `shouldSkipInteractiveHoverLift()` — тень остаётся `sm`, без scale.

### 2. Gloss variant (`variant="gloss"`)

Вместо `useSecondLevelShadow`:

- `createGlossInteractiveRefCallback(rootRef, liftEnabled && isGloss)`
- `useGlossInteractiveHandlers` на `onPointerOver` / `onPointerOut`
- Класс: `GLOSS_INTERACTIVE_MOTION_CLASS` + `glossInteractive.css`

Gloss lift — отдельная кривая (`glossInteractiveMotion`), не sm→md shadow.

### 3. Чего нет

- Press squeeze при клике (Alert не pressable)
- Enter/leave при монтировании
- Ripple (можно добавить вручную как child + `relative overflow-hidden`)

### Сводка: что настраивается где

| Анимация | Утилита | Ключи `configureMotion` | Локальный prop |
|----------|---------|---------------------------|----------------|
| Shadow sm→md + lift | `useSecondLevelShadow` | `hoverLiftScale`, `enableHoverLift`, `interactiveDuration` | `hoverLift` |
| Gloss hover | `useGlossInteractiveHandlers` | interactive-токены | `variant="gloss"` |
| Постоянная тень покоя | `initElementShadow` + `shadowSm()` | — | всегда при `hoverLift` |

## Grid-layout

Корень — `messageBannerGridClass(gridSlots)`:

- `hasIndicator`, `hasTitle`, `hasDescription`, `hasAction`
- Слоты вычисляются в `useAlertRootState` по props / compound children

Shell: `w-fit` + `max-w-component-*` + padding/radius из `MESSAGE_BANNER_SIZE` (radius = `CONTROL_SIZE_LAYOUT[size].rounded`, как у Button).

## Токены и CSS

### Семантика

`SEMANTIC_STATUS_SURFACE_TINT`, `SEMANTIC_STATUS_OUTLINE_BORDER`, `SEMANTIC_STATUS_TEXT` из `semanticStatusSurface`.

### Тени

- Покой: `shadow-token-sm` (через `--el-shadow`)
- Hover: `shadow-token-md`
- Класс motion: `animate-shadow will-change-transform`

### Индикатор

`[&_svg]:icon-mid`; цвет: `text-primary` (default) или semantic text.

## Стилизация и кастомизация

### Два уровня

1. **`className` на root** — дополнительные классы на корневой `role="alert"|"status"` (мерж с `classNames.root`).
2. **`classNames` на root** — слоты через `AlertClassNamesProvider`.

В compound API каждая подчасть (`Alert.Title`, `Alert.Message`, …) принимает **`className`**, мержится поверх слота контекста.

### Слоты `AlertClassNames`

| Слот | DOM / элемент | Когда использовать |
|------|---------------|-------------------|
| `root` | Корневой banner | Max-width, внешняя рамка, padding |
| `indicator` | `Alert.Indicator` | Цвет/размер иконки статуса |
| `message` | `Alert.Message` | Grid/flex layout блока сообщения |
| `content` | `Alert.Content` | Gap между title и description |
| `title` | `Alert.Title` | Типографика заголовка |
| `description` | `Alert.Description` | Подзаголовок, muted-тон |
| `action` | `Alert.Action` | Выравнивание кнопки справа |

`variant`, `status` задают поверхность и semantic colors. `hoverLift={false}` отключает только motion, не стили.

### Simple API

```tsx
<Alert
  status="success"
  className="max-w-lg"
  classNames={{
    root: "rounded-large border-success/50 bg-success/10",
    title: "text-success font-semibold",
    description: "text-foreground/80",
    action: "self-center",
  }}
  title="Сохранено"
  description="Изменения применены."
  action={<Button size="small">Отменить</Button>}
/>
```

### Compound API

```tsx
<Alert
  status="success"
  classNames={{
    root: "max-w-lg rounded-large border-success/50 bg-success/10",
    message: "items-start",
    indicator: "text-success",
    content: "gap-xsmall",
    title: "text-success font-semibold",
    description: "text-foreground/80",
    action: "self-start",
  }}
>
  <Alert.Message>
    <Alert.Indicator />
    <Alert.Content>
      <Alert.Title className="tracking-tight">Профиль обновлён</Alert.Title>
      <Alert.Description>Все слоты настроены через classNames.</Alert.Description>
    </Alert.Content>
  </Alert.Message>
  <Alert.Action>
    <Button size="small">Открыть</Button>
  </Alert.Action>
</Alert>
```

Можно переставить `Action`, обернуть `Message` — стили слотов сохраняются из root `classNames`.

### Практические заметки

- **Ripple:** для press-эффекта оберните root в `relative overflow-hidden` и добавьте `<Ripple />` первым ребёнком (см. Ripple stories).
- **2-й уровень:** постоянная тень `shadow-token-md`; `hoverLift` усиливает до `md` при hover.
- **Порядок мержа:** базовые стили → `classNames.slot` → `className` подчасти.

## Доступность

- `role`: `alert` для danger/warning; иначе `status` (или явный `role` prop).
- `aria-labelledby` / `aria-describedby` — auto из `titleId` / `descriptionId`.
- Экспортируемые helpers: `resolveAlertLiveRole`, `resolveAlertStatus`, `resolveAlertVariant`.

## Экспортируемые утилиты

```tsx
resolveAlertVariant(variant?)   // → "default" | …
resolveAlertStatus(status?)     // → "default" | …
resolveAlertLiveRole(status, role?) // → "status" | "alert"
```

## Структура файлов

```
Alert/
├── Alert.tsx
├── index.ts
├── alertTypes.ts
├── alertStyles.ts
├── alertAPI.ts
├── alertA11y.ts
├── alertContext.tsx
├── alertParts.tsx
├── alertSimpleContent.tsx
├── alertAnimations.ts
├── useAlertRootState.ts
└── Alert.stories.tsx
```

## Storybook

`Core Components/Alert` — варианты × статусы, compound, gloss, hoverLift, кастомизация `classNames`, светлая/тёмная тема.
