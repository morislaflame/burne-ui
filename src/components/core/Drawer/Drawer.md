# Drawer

Боковая (или верхняя/нижняя) панель поверх контента: нативный `<dialog>`, slide-in/out по `placement`, опциональный drag-to-dismiss через handle. Controlled / uncontrolled: `open` / `defaultOpen` / `onOpenChange`.

## Импорт

```tsx
import { Drawer, type DrawerProps, type DrawerPlacement, type DrawerSize, type DrawerVariant, type DrawerClassNames } from "burne-ui";
```

## API

### Root (`Drawer`)

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `open` | — | Controlled состояние |
| `defaultOpen` | `false` | Uncontrolled начальное состояние |
| `onOpenChange` | — | `(open: boolean) => void` |
| `placement` | `right` | `left` \| `right` \| `top` \| `bottom` |
| `size` | `base` | Chrome density (`PANEL_SIZE_LAYOUT`): padding, typography, close/footer buttons |
| `classNames` | — | Слоты портала и панели |
| `motion` | — | Карта слотов. Root без portal DOM — хост `Drawer.Panel` |

### Compound-подчасти

| Часть | Назначение |
|-------|------------|
| `Drawer.Trigger` | Открытие после press-squeeze; `asChild` |
| `Drawer.Panel` | Портал + overlay + slide motion |
| `Drawer.Backdrop` | Маркер `isDismissable={false}` (рендерит `null`) |
| `Drawer.Handle` | Drag-handle для swipe-dismiss |
| `Drawer.Content` | Layout-обёртка (`p-xlarge`, `gap-large`) |
| `Drawer.Header` / `HeadingBlock` / `Title` / `Description` | Шапка |
| `Drawer.Body` | Скроллируемая область |
| `Drawer.Footer` | Кнопки |
| `Drawer.Close` | `CloseButton`; size из `PANEL_SIZE_LAYOUT.closeButtonSize` |

### `Drawer.Panel`

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `size` | `default` | `default` \| `mid` \| `full` |
| `variant` | `default` | `default` \| `gloss` |
| `themeAnchor` | auto | Якорь темы для overlay портала |
| `className` | — | На focusable panel wrapper |
| `motion` | — | Мерж с картой Root; defaults + `params.placement` |

### Пример

```tsx
const [open, setOpen] = useState(false);

<Drawer open={open} onOpenChange={setOpen} placement="right">
  <Drawer.Trigger asChild>
    <Button>Меню</Button>
  </Drawer.Trigger>
  <Drawer.Panel extent="default">
    <Drawer.Handle />
    <Drawer.Header>
      <Drawer.HeadingBlock>
        <Drawer.Title>Фильтры</Drawer.Title>
      </Drawer.HeadingBlock>
      <Drawer.Close />
    </Drawer.Header>
    <Drawer.Body>…</Drawer.Body>
  </Drawer.Panel>
</Drawer>
```

`Drawer.Backdrop isDismissable={false}` — отключить закрытие по клику на overlay.

## placement, extent и size

| placement | Slide axis | Позиция панели |
|-----------|------------|----------------|
| `left` | `x: -offsetWidth → 0` | `left-0 top-0 h-full` |
| `right` | `x: offsetWidth → 0` | `right-0 top-0 h-full` |
| `top` | `y: -offsetHeight → 0` | `top-0 inset-x-0` |
| `bottom` | `y: offsetHeight → 0` | `bottom-0 inset-x-0` |

`extent` на `Drawer.Panel` — доля экрана (viewport). `size` на `Drawer` — chrome из `PANEL_SIZE_LAYOUT` (как Dialog / Card).

| extent | horizontal drawer | vertical drawer |
|------|-------------------|-----------------|
| `default` | `max-w-[min(100vw,24rem)]` | `max-h-[90dvh]` |
| `mid` | `50vw` | `max-h-[50dvh]` |
| `full` | `w-screen` | `h-dvh` |

Скругление края: `rounded-*-{size}` (`extent="full"` — без rounding). Close / footer buttons — `closeButtonSize` / `footerButtonSize` из panel.

## Анимации

`drawerAnimations.ts` → slot motion (`DRAWER_MOTION_DEFAULTS`) + `useDrawerModalMotion` → `useModalMotion`. Root без DOM портала передаёт карту `motion`; хост — `Drawer.Panel` (defaults + `params.placement` для `drawerSlide*`). Trigger squeeze — `runOpenAfterSqueeze`. Drag — `useDrawerHandleDrag.ts` (не публичный слот).

**DOM-структура (портал):**

```
<dialog>
  <div overlayRef>              ← слот `overlay`
  <div panelRef tabIndex={-1}>  ← слот `panel` (px-slide, не xPercent)
    [Drawer.Handle]             ← слот `handle` + pointer capture drag
    <Drawer.Content>            ← слот `content`
      Header / Title / Description / Close / Body / Footer
```

### Slot motion

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `overlay` | `enter` / `leave` | `modalOverlayEnter` / `modalOverlayLeave` |
| `panel` | `enter` / `leave` | `drawerSlideEnter` / `drawerSlideLeave` (`params.placement`) |
| `title`, `description` | `enter` / `leave` + локальные `hoverIn` / `hoverOut` | нет; хост **рассылает** lifecycle |
| `close`, `header`, `footer`, `content`, `handle` | `enter` / `leave` | нет; хост **рассылает**, если задана |

Slide — **пиксели** (`offsetWidth` / `offsetHeight`), не `xPercent`: высота нижней панели может вырасти после mount. `leave` factory должна вернуть tween и **увести панель за край** (`x: el.offsetWidth` и т.п.) — короткий сдвиг на 80px оставит панель на экране, и `dialog.close()` даст рывок. `panel.enter/leave: false` — хост сразу ставит rest / off-screen; overlay по-прежнему фейдится.

**Где в коде:** типы — `drawerTypes.ts`; scope — `drawerContext.tsx`; defaults + host play — `drawerAnimations.ts`; Panel-provider — `drawerParts.tsx`; карта на корне — `Drawer.tsx`.

```tsx
<Drawer motion={{ panel: { enter: false, leave: false } }}>…</Drawer>

<Drawer
  placement="right"
  motion={{
    panel: {
      enter: (ctx) => gsap.fromTo(ctx.el, { x: 80 }, { x: 0, duration: 0.5, ease: "back.out(1.4)" }),
      leave: (ctx) => gsap.to(ctx.el, { x: ctx.el.offsetWidth, duration: 0.28, ease: "power2.in" }),
    },
    title: {
      enter: (ctx) => gsap.fromTo(ctx.el, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, delay: 0.08 }),
      leave: (ctx) => gsap.to(ctx.el, { y: -8, autoAlpha: 0, duration: 0.2 }),
    },
  }}
>
```

**Reduced motion / `enableModalMotion: false`:** instant rest / close offset.

### Drag-to-dismiss (`Drawer.Handle`)

`useDrawerHandleDrag(panelRef, overlayRef, placement, onClose)`:

**pointerdown** → capture → `killMotion`

**pointermove:**

- `gsap.set(panel, { x|y: clampedDelta })` — только «наружу» от края
- overlay `opacity = 1 - progress`

**pointerup:**

| Условие | Действие |
|---------|----------|
| `ratio ≥ 0.38` пути ИЛИ velocity ≥ `0.45` px/ms | dismiss timeline → `onClose()` + `skipCloseAnimRef` |
| иначе | snap-back panel→0, overlay→1 |

Ось: `left/right` → `x`, `top/bottom` → `y`.

**Reduced motion:** drag отключён полностью.

Пороги `0.38` / `0.45` — константы в `useDrawerHandleDrag.ts`.

### Trigger open squeeze

Как `Dialog.Trigger`: `e.preventDefault()` + `runOpenAfterSqueeze` → `animateInteractivePressSqueeze` → `onOpenChange(true)`.

### Gloss panel

Slide на `panelRef`; `bindGlossPanelRef` на gloss-обёртке — surface gloss motion.

#### Кастомизация

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  modalDuration: 350,
  interactiveEase: "power3.out",
  enableModalMotion: true,
  pressSqueezeScale: [1, 0.98, 1],
  enablePressSqueeze: true,
});
```

Slide keyframes — px в `drawerSlide.ts` (`params.placement`), не в config.

### Сводка: что настраивается где

| Анимация | Утилита | `configureMotion` | Hardcode |
|----------|---------|-------------------|----------|
| Open/close slide | `drawerSlideEnter` / `Leave` | `modalDuration`, `interactiveEase`, `enableModalMotion` | px от размера панели |
| Overlay fade | `modalOverlayEnter` / `Leave` | те же | — |
| Nested title / handle | slot broadcast | — | `motion.title` / … |
| Drag dismiss | `useDrawerHandleDrag` | interactive (finish) | ratio 0.38, velocity 0.45 |
| Drag snap-back | `useDrawerHandleDrag` | interactive | — |
| Trigger squeeze | `runOpenAfterSqueeze` | `pressSqueezeScale` | — |
| Skip close after drag | `skipCloseAnimRef` | — | внутренний флаг |

### Сравнение с Dialog

| | Dialog | Drawer |
|---|--------|--------|
| Panel enter | `modalPanelEnter` (scale) | `drawerSlideEnter` (px по `placement`) |
| Drag dismiss | нет | `Drawer.Handle` |
| Close skip | нет | после drag |

## Токены и CSS

| Элемент | Классы |
|---------|--------|
| Overlay light | `overlay-backdrop` (`--overlay-backdrop-color` + blur) |
| Overlay dark | `overlay-backdrop-scrim` (`--overlay-backdrop-scrim`) |
| Panel | `bg-surface border-token shadow-token-lg` |
| Gloss | `gloss-panel gloss-deep` |
| Handle grip | `bg-tertiary`, `rounded-full` |
| z-index | `z-dialog` (`--z-dialog`) |

## Стилизация и кастомизация

### Два уровня

1. **`classNames` на `<Drawer>`** — слоты портала через `DrawerClassNamesProvider`.
2. **`className` на `Drawer.Panel`** — доп. классы surface (size, placement, variant).

Подчасти (`Drawer.Title`, `Drawer.Handle`, …) принимают **`className`** поверх слота.

### Слоты `DrawerClassNames`

| Слот | DOM / элемент | Когда использовать |
|------|---------------|-------------------|
| `trigger` | `Drawer.Trigger` | Слот на кнопке / asChild |
| `dialog` | Нативный `<dialog>` | Глобальные правки dialog |
| `overlay` | Backdrop | Blur, opacity |
| `panel` | Surface панели | Width/height по `size`, border, shadow |
| `glossPanel` | Gloss-обёртка | При `variant="gloss"` |
| `glossContent` | Gloss inner wrap | Внутренний gloss-слой |
| `content` | `Drawer.Content` | Padding внутри панели |
| `handle` | Drag handle | Hit-area, padding (не focusable) |
| `handleGrip` | Grip / тамб | Визуал + keyboard focus ring |
| `header` | `Drawer.Header` | Title row + close |
| `headingBlock` | Title + description | Stack заголовка |
| `title` | `Drawer.Title` | Типографика |
| `description` | `Drawer.Description` | Подзаголовок |
| `body` | `Drawer.Body` | Scroll area |
| `footer` | `Drawer.Footer` | Actions row |
| `close` | `Drawer.Close` | CloseButton styles |

`Drawer.Panel`: `extent` (`default` | `mid` | `full`), `variant` (`default` | `gloss`); `placement` / `size` на `<Drawer>`.

### Compound API

```tsx
<Drawer
  open={open}
  onOpenChange={setOpen}
  placement="bottom"
  classNames={{
    overlay: "backdrop-blur-2xl",
    panel: "max-h-[85vh] border-primary/40 shadow-token-lg",
    handle: "py-mid",
    header: "border-b border-primary/20 pb-small",
    title: "text-primary font-semibold",
    description: "text-foreground/75",
    body: "px-xlarge",
    footer: "border-t border-primary/20 pt-small",
  }}
>
  <Drawer.Panel extent="mid" variant="gloss">
    <Drawer.Handle />
    <Drawer.Header>
      <Drawer.HeadingBlock>
        <Drawer.Title>Настройки</Drawer.Title>
        <Drawer.Description>Все слоты через classNames.</Drawer.Description>
      </Drawer.HeadingBlock>
      <Drawer.Close />
    </Drawer.Header>
    <Drawer.Body>…</Drawer.Body>
    <Drawer.Footer>
      <Button size="small" onClick={() => setOpen(false)}>Закрыть</Button>
    </Drawer.Footer>
  </Drawer.Panel>
</Drawer>
```

`Drawer.Trigger` — `className` на триггере (часто `Button` + `asChild`).

### Практические заметки

- **Handle:** рендерится только для `placement="top"|"bottom"`; стили grip — `handle` + `handleGrip`.
- **Size:** `full` / `mid` задают ширину/высоту панели — дополняйте через `classNames.panel`.
- **Swipe dismiss:** не отключайте `pointer-events` на handle при кастомизации.
- **Порядок мержа:** базовые → `classNames.slot` → `className` подчасти / `Drawer.Panel`.

## Доступность

- `<dialog>` + `showModal()`, Esc → `onClose`
- `aria-labelledby` — только при `Drawer.Title`; иначе `aria-label` на panel
- `aria-describedby` — при `Drawer.Description`
- Handle: hit-area (drag) + grip `role="button"` / `tabIndex={0}` / `focus-ring` на тамбе; Enter/Space закрывают; `aria-label` по placement
- `Drawer.Close` → `aria-label="Close"`

## Структура файлов

```
Drawer/
├── Drawer.tsx               # карта motion в context (Root без DOM)
├── drawerTypes.ts           # DrawerMotion / DrawerLifecycleMotion / DrawerPartMotion
├── drawerAnimations.ts      # DRAWER_MOTION_DEFAULTS, useDrawerModalMotion
├── drawerContext.tsx        # createMotionScope("Drawer")
├── drawerParts.tsx          # Panel-хост + useMotionPart
├── useDrawerHandleDrag.ts   # swipe dismiss (не слот)
├── drawerAPI.ts             # re-export slide helpers
└── …
```

## Storybook

`Core Components/Drawer` — placement, size, gloss, handle drag, `isDismissable={false}`, Trigger, slot motion gallery.
