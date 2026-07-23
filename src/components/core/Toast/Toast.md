# Toast

Всплывающие уведомления в портале (`document.body`): стек с peek-эффектом, GSAP enter/leave, imperative API через `useToast`. Компонент **второго уровня** — постоянная тень `shadow-token-md` (default variant).

## Импорт

```tsx
import { Toast, ToastContext, useToast, useToastContext, type ToastStatus, type ToastVariant, type ToastPlacement, type ToastClassNames, type AddToastOpts } from "burne-ui";
```

## API

Два режима: **imperative** (через Provider + `useToast`) и **декларативный** (`<Toast />` как карточка).

### Provider

```tsx
<Toast.Provider defaultPlacement="bottom-center" defaultVariant="default" classNames={…}>
  {app}
</Toast.Provider>
```

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `defaultPlacement` | `bottom-center` | Позиция, если не указана в `add()` |
| `defaultVariant` | `default` | Вариант карточки |
| `classNames` | — | Слоты viewport / stack / scrim / карточки |

### `useToast()`

```tsx
const { toast } = useToast();

toast.success("Сохранено");
toast.danger("Ошибка", { description: "…", timeout: 6000 });
toast.show({ status: "info", title: "…", placement: "top-right" });

const id = toast.promise(save(), {
  loading: "Сохранение…",
  success: (data) => `Готово: ${data.id}`,
  error: (e) => `Ошибка: ${e}`,
});
toast.dismiss(id);
```

| Метод | Описание |
|-------|----------|
| `show(opts)` | Добавить toast, вернуть `id` |
| `success` / `danger` / `info` / `warning` | Шорткаты с `status` |
| `promise(p, opts)` | loading → success/error |
| `dismiss(id)` | Запуск dismiss-анимации |

`AddToastOpts`: `status`, `variant`, `title`, `description`, `action`, `timeout` (default 4000 ms, `0` = не закрывать), `placement`, `id`, `loading`, `classNames`.

### Toast.Root (карточка)

Simple + compound (как Alert): `Toast.Title`, `Toast.Description`, `Toast.Indicator`, `Toast.Action`, `Toast.Close`.

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `status` | `default` | Семантический тон поверхности |
| `variant` | `default` | `default` \| `gloss` |
| `loading` | `false` | Spinner вместо status-иконки |
| `onClose` | — | Показывает close-кнопку (simple API). **Исключение state-API:** Toast не controlled по `open` — dismiss через Provider/`useToast`; `onClose` только гейтит кнопку и колбэк dismiss. Не путать с `onOpenChange` оверлеев. |
| `classNames` | — | Слоты карточки |

## variant и status

| variant | Поверхность |
|---------|-------------|
| `default` | `TOAST_SURFACE_CLASS[status]` + `shadow-token-md` |
| `gloss` | `gloss-panel gloss-deep` + `GLOSS_INTERACTIVE_MOTION_CLASS` |

| status | Фон / иконка |
|--------|--------------|
| `default` | `bg-surface`, `text-primary` |
| `success` / `danger` / `info` / `warning` | `bg-surface-tint-*`, semantic icon color |

## Анимации

Вся motion-логика стека — `toastAnimations.tsx`. Три независимых слоя на каждый toast + viewport-level анимации.

**DOM-структура (viewport):**

```
<div viewport>                         ← fixed, placement
  <div scrimRef>                       ← gradient fade
  <div containerRef>                   ← animated height
    <div stackRef>                     ← peek/scale per toast (grid 1×1)
      <div animRef>                    ← enter/exit slide
        <ToastRoot ref=cardRef>        ← ResizeObserver height
```

### 1. Enter карточки (portal open)

При монтировании `animRef` → `animatePortalOpen`:

- **from:** `y: ±24px` (`TOAST_ENTRY_OFFSET_PX`), `scale: 0.97` (`MODAL_PANEL_SCALE_FROM`)
- **to:** `y: 0`, `scale: 1`
- **vars:** `motionInteractive()` → `interactiveDuration`, `interactiveEase`

Направление: `top-*` → `y: -24`, `bottom-*` → `y: +24`.

**Reduced motion:** `isReducedModalMotion()` → `applyReducedPortalMotion` без GSAP.

### 2. Dismiss (portal close)

При `isDismissing`:

```ts
animatePortalClose({
  surface: animRef,
  vars: { duration: 0.22, ease: "power2.in" }, // фиксировано
  exit: { y: slideDir },
  onComplete: () => removeFromDOM,
});
```

Dismiss **220 ms** — не из `configureMotion`.

### 3. Стек — reposition (peek + scale)

На `stackRef` при изменении позиции в стеке:

| reverseIdx | scale | y offset | opacity |
|------------|-------|----------|---------|
| 0 | 1 | 0 | 1 |
| 1 | 0.96 | ±8px | 1 |
| 2 | 0.92 | ±16px | 1 |
| ≥3 | — | — | 0 (скрыт) |

Константы: `TOAST_STACK_PEEK_PX=8`, `TOAST_STACK_SCALE_STEP=0.04`, `TOAST_MAX_VISIBLE=3`.

Первый mount (не gloss): доп. fade `opacity: 0 → 1` на stack layer.

`transformOrigin`: `top center` / `bottom center` по placement.

### 4. Высота контейнера стека

`frontHeight` (ResizeObserver на card) + `extraPeek` → GSAP `to(container, { height })` с `motionInteractive()`.

### 5. Scrim (градиент)

`scrimRef`: fade `opacity 0↔1`. Последний toast dismiss → `0.22s power2.in` (как exit карточки).

Токены: `--toast-scrim-*` (`tokens/toastScrim.ts`).

### 6. Gloss hover на карточке

`variant="gloss"` на `ToastRoot` → `useGlossInteractiveHandlers` (локально, не стек).

### 7. Auto-dismiss

`setTimeout` — не GSAP. `timeout: 0` или `loading` — без таймера.
Пауза при `pointerenter` / `focusin`, возобновление при выходе (WCAG 2.2.1).

#### Кастомизация

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  enableToastStack: true,       // peek/scale/height — мгновенно если false
  interactiveDuration: 320,     // enter slide, stack reposition, container height, scrim in
  interactiveEase: "power2.out",
});
```

Константы `TOAST_*` в `toastAPI.ts` — не в config (нужен PR для изменения).

### Сводка: что настраивается где

| Анимация | Элемент | `configureMotion` | Константы / hardcode |
|----------|---------|-------------------|----------------------|
| Enter slide | `animRef` | `interactiveDuration`, `interactiveEase` | `ENTRY_OFFSET_PX=24`, `SCALE_FROM=0.97` |
| Dismiss slide | `animRef` | — | `0.22s`, `power2.in` |
| Stack peek/scale | `stackRef` | `enableToastStack`, `interactiveDuration` | `PEEK`, `SCALE_STEP`, `MAX_VISIBLE` |
| Container height | `containerRef` | `enableToastStack`, `interactiveDuration` | — |
| Scrim | `scrimRef` | `interactiveDuration` (in) | `0.22s` (out) |
| Gloss hover | `ToastRoot` | interactive | `variant="gloss"` |
| Auto-close | — | — | `timeout` prop (default 4000) |

## Токены и CSS

| Элемент | Классы / токены |
|---------|-----------------|
| Карточка | `rounded-mid py-base px-plus`, `shadow-token-md` |
| Viewport | `fixed z-toast` (`--z-toast`), placement offsets (`top-4`, …) |
| Scrim | `toastScrimToken(gradientTop/Bottom, mask, …)` |
| Ширина | `360px` (`TOAST_WIDTH_PX`) |

## Стилизация и кастомизация

### Три уровня

1. **`Toast.Provider classNames`** — глобальные слоты viewport, scrim, stack + дефолты карточки.
2. **Per-toast `classNames`** — в `toast.show({ classNames })` / `toast.success(…, { classNames })`; мержится поверх provider.
3. **`Toast.Root classNames`** — декларативная карточка (simple/compound), как у Alert.

Подчасти (`Toast.Title`, `Toast.Close`, …) принимают **`className`** поверх слота.

### Слоты `ToastClassNames`

| Слот | DOM / элемент | Когда использовать |
|------|---------------|-------------------|
| `viewport` | Fixed region | Позиция (`top-8`), z-index |
| `scrim` | Gradient fade | Прозрачность под стеком |
| `stack` | Контейнер peek-стека | Gap между карточками в стеке |
| `root` | Карточка toast | Border, ring, max-width |
| `indicator` | Status / loading icon | Цвет иконки |
| `message` | Grid сообщения | Layout indicator + content |
| `content` | Title + description block | Gap внутри текста |
| `title` | Заголовок | Типографика |
| `description` | Описание | Muted-тон |
| `action` | Action button slot | Выравнивание кнопки |
| `close` | Close button | Стили dismiss |

### Imperative API (основной)

```tsx
<Toast.Provider
  classNames={{
    viewport: "top-8",
    scrim: "opacity-90",
    stack: "gap-2",
    root: "border-primary/30",
    close: "text-muted",
  }}
>
  {app}
</Toast.Provider>

// В компоненте:
toast.show({
  status: "info",
  title: "Полная кастомизация",
  description: "Слоты root, title, description.",
  classNames: {
    root: "rounded-large border-info/50 bg-info/10 ring-1 ring-info/20",
    indicator: "text-info",
    title: "font-semibold text-info",
    description: "text-foreground/80",
  },
});
```

Per-toast `classNames` **перекрывают** одноимённые ключи provider для этой карточки.

### Декларативный / compound API

```tsx
<Toast
  status="success"
  onClose={() => {}}
  classNames={{
    root: "max-w-sm",
    title: "font-semibold",
    close: "opacity-70",
  }}
  title="Готово"
  description="Файл загружен"
/>

// Compound:
<Toast status="info" onClose={dismiss}>
  <Toast.Indicator />
  <Toast.Message>
    <Toast.Content>
      <Toast.Title className="text-info">Обновление</Toast.Title>
      <Toast.Description>Доступна новая версия.</Toast.Description>
    </Toast.Content>
  </Toast.Message>
  <Toast.Close />
</Toast>
```

### Практические заметки

- **Provider vs toast:** viewport/scrim/stack — только на Provider через `classNames` (compound `Toast.Viewport` / `Toast.Stack` не добавляем — слотов достаточно); карточка — provider defaults + per-toast override.
- **Gloss:** `variant="gloss"` на `toast.show` или `Toast.Root`; не ломайте `gloss-panel` без нужды.
- **2-й уровень:** постоянная `shadow-token-md` на карточке.
- **Порядок мержа:** provider → per-toast / Root `classNames` → `className` подчасти.

## Доступность

- Viewport: `role="region"`, `aria-label` по placement.
- Карточка: `role="group"`; `aria-labelledby` при Title, иначе `aria-label` из title/description string.
- Анонсы SR: постоянно смонтированный `aria-live` (polite / assertive) в `ToastProvider`, текст вставляется при add/update.
- Скрытые в стеке (idx ≥ 3): `aria-hidden` на wrapper.
- Только передний toast: `pointer-events: auto`.

## Структура файлов

```
Toast/
├── Toast.tsx
├── toastProvider.tsx
├── toastAnimations.tsx    # стек + enter/leave
├── toastAPI.ts            # константы стека
├── toastStyles.ts
├── useToast.ts
└── …
```

## Storybook

`Core Components/Toast` — imperative API, promise, gloss, placement, compound.
