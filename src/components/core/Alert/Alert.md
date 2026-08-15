# Alert

Баннер уведомления с семантическими статусами, grid-компоновкой и hover-lift (компонент **второго уровня** — тень в покое и усиление **в том же размере** при наведении). Simple и compound API.

## Импорт

```tsx
import { Alert, resolveAlertStatus, resolveAlertVariant, resolveAlertLiveRole, type AlertProps, type AlertVariant, type AlertStatus, type AlertLiveRole, type AlertClassNames, type AlertMotion, type AlertPartMotion } from "burne-ui";
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
| `hoverLift` | `boolean` | `true` | Hover lift + stronger shadow in семье `shadow`; rest elevation остаётся |
| `shadow` | `small` \| `base` \| `mid` \| `large` | `base` | Размер тени покоя; hover — `--shadow-{size}-hover` |
| `className` | `string` | — | Доп. классы на root |
| `classNames` | `AlertClassNames` | — | Слоты подчастей |
| `motion` | `AlertMotion` | — | Карта слотов `root` / `indicator` / `title` / `description` / `action` (`hoverIn` / `hoverOut`). Части принимают `AlertPartMotion` |

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
| `default` | `bg-surface border-token` | тот же surface; status на индикаторе и title |
| `outline` | прозрачный + `border-token-outline` | тот же surface; status на индикаторе и title |
| `secondary` | `bg-secondary` | тот же surface; status на индикаторе и title |
| `gloss` | `gloss-panel border-0` | тот же surface; status на индикаторе и title |

### Индикатор по умолчанию

| Условие | Иконка |
|---------|--------|
| `status` danger/success/info/warning | `SEMANTIC_STATUS_ICONS[status]` (Io5) |
| `variant="outline"`, status default | `IoHelpCircleOutline` |
| иначе | скрыт (если не передан `icon`) |

`icon={null}` или `<Alert.Indicator>{null}</Alert.Indicator>` — без индикатора.

## Анимации

Компонент **2-го уровня** — тень в покое по `shadow` (default `base`), усиление при hover в той же семье (`--shadow-{size}-hover`). Логика: `alertAnimations.ts` → slot motion (`hoverLiftSecondLevel` / `hoverLiftGloss`) + rest-тень через `useSecondLevelShadow(..., { interactive: false })`.

### Slot motion

Слоты (DOM, не `display: contents`): `root`, `indicator`, `title`, `description`, `action`. `Alert.Message` / `Alert.Content` — не цели.

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `root` | `hoverIn` / `hoverOut` | `hoverLiftSecondLevel` или `hoverLiftGloss` по `variant`; `params.shadowSize` из `shadow` |
| `indicator` / `title` / `description` / `action` | `hoverIn` / `hoverOut` | нет (локально, если задать) |

`hoverLift={false}` = `motion.root.hoverIn/Out: false` (rest-тень остаётся). Явный `motion.root.hoverIn` важнее `hoverLift`. Simple API монтирует те же части — `motion.title` работает без compound.

**Где в коде:** типы — `alertTypes.ts`; scope — `alertContext.tsx`; defaults + host — `alertAnimations.ts` (`resolveAlertMotionDefaults`, `useAlertAnimations`); слоты — `alertParts.tsx` (`useMotionPart`); Provider — `Alert.tsx`.

```tsx
import gsap from "gsap";
import { Alert, killMotion, tweenCssColor } from "burne-ui";

<Alert title="Saved" motion={{ title: { hoverIn: { y: -2 }, hoverOut: { y: 0 } } }} />

<Alert.Title motion={{ hoverIn: { y: -2, duration: 0.2 }, hoverOut: { y: 0 } }} />

<Alert
  title="Deploy"
  motion={{
    root: {
      hoverIn: (ctx) => gsap.to(ctx.targets.title, { x: 8, repeat: -1, yoyo: true, duration: 0.35 }),
      hoverOut: (ctx) => {
        killMotion(ctx.targets.title);
        gsap.set(ctx.targets.title, { x: 0 });
      },
    },
  }}
/>
```

Цвет текста не входит в `MotionVars` — **`tweenCssColor`**, не сырой `gsap.to({ color: "var(--…)" })` (иначе обратный ход мигает). Таймлайн возвращайте из factory; чужие слоты — `ctx.targets`.

```tsx
<Alert
  title="Primary on hover"
  motion={{
    title: {
      hoverIn: (ctx) => tweenCssColor(ctx.el, "var(--color-primary)"),
      hoverOut: (ctx) =>
        tweenCssColor(ctx.el, "var(--color-foreground)", { clearOnComplete: true }),
    },
  }}
/>

<Alert.Indicator
  motion={{
    hoverIn: (ctx) => gsap.to(ctx.el, { rotate: 15, scale: 1.12, duration: 0.28, ease: "back.out(2)" }),
    hoverOut: (ctx) => gsap.to(ctx.el, { rotate: 0, scale: 1, duration: 0.2 }),
  }}
/>

<Alert
  status="danger"
  title="Timeline"
  description="Root stagger"
  motion={{
    root: {
      hoverIn: (ctx) => {
        const tl = gsap.timeline();
        if (ctx.targets.indicator) tl.to(ctx.targets.indicator, { rotate: -8, duration: 0.28 }, 0);
        if (ctx.targets.title) tl.to(ctx.targets.title, { y: -3, duration: 0.28 }, 0.05);
        return tl;
      },
      hoverOut: (ctx) => {
        const tl = gsap.timeline();
        if (ctx.targets.indicator) tl.to(ctx.targets.indicator, { rotate: 0, duration: 0.22 }, 0);
        if (ctx.targets.title) tl.to(ctx.targets.title, { y: 0, duration: 0.22 }, 0);
        return tl;
      },
    },
  }}
/>
```

См. [Motion](/docs/motion): приоритет part → root slot → рецепт; `false` отключает дефолт; factory + `ctx.targets` / `killMotion`.

**DOM-структура:**

```
<div ref=root>              ← motion target, pointer over/out
  grid: indicator | title | description | action
```

Нет collapse, portal, ripple. Только hover lift на корне (press squeeze нет — Alert не pressable).

### 1. Hover lift — default / outline / secondary (`hoverLift={true}`)

`useSecondLevelShadow(rootRef, !isGloss, { shadowSize: shadow, interactive: hoverLift })`:

**Init (mount):** `initElementShadow(el, var(--shadow-{shadow}))` — покой всегда (независимо от `hoverLift`).

**Pointer enter** (только при `hoverLift`):

1. `animateInteractiveHoverLift(el, true, undefined, shadowMotionFor(shadow))`
2. Scale: адаптивный подъём (~1.8px cap, `hoverLiftScale`)
3. Тень: rest → `--shadow-{size}-hover` (та же семья, не переход base→mid)

**Pointer leave:** обратно к rest, scale `1`.

Класс на root: `animate-shadow origin-center` (`SHADOW_LIFT_MOTION_CLASS`) — пока elevation включена (не gloss).

**Отличие от Button (1-й уровень):** Alert **всегда** имеет тень в покое; Button — `none` → `--shadow-lift` при hover.

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

**Локально:** `hoverLift={false}` — без handlers и scale; rest shadow и `animate-shadow` остаются.

**Reduced motion / touch:** `shouldSkipInteractiveHoverLift()` — тень остаётся на rest, без scale.

### 2. Gloss variant (`variant="gloss"`)

Вместо `useSecondLevelShadow`:

- `createGlossInteractiveRefCallback(rootRef, hoverLift && isGloss)`
- `useGlossInteractiveHandlers` на `onPointerOver` / `onPointerOut`
- Класс: `GLOSS_INTERACTIVE_MOTION_CLASS` + `glossInteractive.css`

Gloss lift — отдельная кривая (`glossInteractiveMotion`), не token shadow families.

### 3. Чего нет

- Press squeeze при клике (Alert не pressable; `--shadow-*-press` не используется)
- Enter/leave при монтировании
- Ripple (можно добавить вручную как child + `relative overflow-hidden`)

### Сводка: что настраивается где

| Анимация | Утилита | Ключи `configureMotion` | Локальный prop |
|----------|---------|---------------------------|----------------|
| Shadow rest→hover + lift | `useSecondLevelShadow` + `shadow` | `hoverLiftScale`, `enableHoverLift`, `interactiveDuration` | `hoverLift`, `shadow` |
| Gloss hover | `useGlossInteractiveHandlers` | interactive-токены | `variant="gloss"` |
| Тень покоя | `initElementShadow` + `--shadow-{shadow}` | — | всегда (non-gloss) |

## Grid-layout

Корень — `messageBannerGridClass(gridSlots)`:

- `hasIndicator`, `hasTitle`, `hasDescription`, `hasAction`
- Слоты вычисляются в `useAlertRootState` по props / compound children

Shell: `w-fit` + `max-w-component-*` + padding/radius из `MESSAGE_BANNER_SIZE` (radius = `CONTROL_SIZE_LAYOUT[size].rounded`, как у Button).

## Токены и CSS

### Семантика

Surface всегда по `variant` (как у `AlertDialog`). Status красит индикатор и заголовок (`SEMANTIC_STATUS_TEXT`).

### Тени

- Покой: `--shadow-{shadow}` через `--el-shadow` (default `base`)
- Hover: `--shadow-{shadow}-hover` (та же семья)
- Класс motion: `animate-shadow origin-center` (+ динамический `will-change` на время твина)

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

`variant` задаёт поверхность; `status` — индикатор и заголовок (как у `AlertDialog` для иконки). `hoverLift={false}` отключает только motion, не стили.

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
- **2-й уровень:** тень покоя по `shadow` (default `base`); `hoverLift` усиливает до `--shadow-{size}-hover`. `hoverLift={false}` сохраняет rest elevation.
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
├── Alert.tsx                 # Provider: motion + resolveAlertMotionDefaults + params
├── index.ts
├── alertTypes.ts             # AlertMotion / AlertPartMotion
├── alertStyles.ts
├── alertAPI.ts
├── alertA11y.ts
├── alertContext.tsx          # createMotionScope("Alert")
├── alertParts.tsx            # useMotionPart на DOM-слотах
├── alertSimpleContent.tsx
├── alertAnimations.ts        # слоты, defaults, host play
├── useAlertRootState.ts
└── Alert.stories.tsx
```

## Storybook

`Core Components/Alert` — варианты × статусы, compound, gloss, hoverLift, кастомизация `classNames`, slot motion gallery, светлая/тёмная тема.
