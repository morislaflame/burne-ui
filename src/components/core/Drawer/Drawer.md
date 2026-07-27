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
| `left` | `xPercent: -100 → 0` | `left-0 top-0 h-full` |
| `right` | `xPercent: 100 → 0` | `right-0 top-0 h-full` |
| `top` | `yPercent: -100 → 0` | `top-0 inset-x-0` |
| `bottom` | `yPercent: 100 → 0` | `bottom-0 inset-x-0` |

`extent` на `Drawer.Panel` — доля экрана (viewport). `size` на `Drawer` — chrome из `PANEL_SIZE_LAYOUT` (как Dialog / Card).

| extent | horizontal drawer | vertical drawer |
|------|-------------------|-----------------|
| `default` | `max-w-[min(100vw,24rem)]` | `max-h-[90dvh]` |
| `mid` | `50vw` | `max-h-[50dvh]` |
| `full` | `w-screen` | `h-dvh` |

Скругление края: `rounded-*-{size}` (`extent="full"` — без rounding). Close / footer buttons — `closeButtonSize` / `footerButtonSize` из panel.

## Анимации

`drawerAnimations.ts` (`useDrawerModalMotion`) + `useDrawerHandleDrag.ts` + `runOpenAfterSqueeze` на Trigger.

**DOM-структура (портал):**

```
<dialog>
  <div overlayRef>              ← opacity, drag-sync fade
  <div panelRef tabIndex={-1}>  ← slide x/yPercent, drag translate
    [Drawer.Handle]             ← pointer capture drag
    <Drawer.Content> …
```

### 1. Open — slide + overlay fade

При `open=true`, `mounted=true`:

1. `dialog.showModal()`
2. `animateModalOpen`:
   - **overlay:** `opacity: 0 → 1`
   - **panel from→to** по `placement`:

| placement | panelFrom | panelTo |
|-----------|-----------|---------|
| `left` | `xPercent: -100` | `xPercent: 0` |
| `right` | `xPercent: 100` | `0` |
| `top` | `yPercent: -100` | `0` |
| `bottom` | `yPercent: 100` | `0` |

**vars:** `motionInteractive()`. Без scale (в отличие от Dialog).

**Focus:** `panelRef.focus()`. **Scroll lock:** `body.overflow = hidden`.

### 2. Close — slide out + overlay fade

`animateModalClose` + `panelExit: getDrawerSlideOutTo(placement)` — зеркало slide-in.

**Skip close anim:** после успешного drag-dismiss `skipCloseAnimRef = true` → unmount без повторного exit.

### 3. Drag-to-dismiss (`Drawer.Handle`)

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

### 4. Trigger open squeeze

Как `Dialog.Trigger`: `e.preventDefault()` + `runOpenAfterSqueeze` → `animateInteractivePressSqueeze` → `onOpenChange(true)`.

### 5. Gloss panel

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

Slide keyframes — в `drawerAPI.ts`, не в config.

### Сводка: что настраивается где

| Анимация | Утилита | `configureMotion` | Hardcode |
|----------|---------|-------------------|----------|
| Open slide | `animateDrawerOpen` | `modalDuration`, `interactiveEase`, `enableModalMotion` | slide % в `drawerAPI` |
| Close slide | `animateDrawerClose` | те же | `getDrawerSlideOutTo` |
| Drag dismiss | `useDrawerHandleDrag` | interactive (finish) | ratio 0.38, velocity 0.45 |
| Drag snap-back | `useDrawerHandleDrag` | interactive | — |
| Trigger squeeze | `runOpenAfterSqueeze` | `pressSqueezeScale` | — |
| Skip close after drag | `skipCloseAnimRef` | — | внутренний флаг |

### Сравнение с Dialog

| | Dialog | Drawer |
|---|--------|--------|
| Panel enter | scale 0.97→1 | slide x/yPercent |
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
| `handle` | Drag handle | Hit-area, padding (top/bottom placement) |
| `handleGrip` | Grip lines | Визуал «ручки» |
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
- Handle: `role="button"`, `tabIndex={0}`, Enter/Space закрывают; swipe — pointer; `aria-label` по placement
- `Drawer.Close` → `aria-label="Close"`

## Структура файлов

```
Drawer/
├── Drawer.tsx
├── drawerAnimations.ts      # slide open/close
├── useDrawerHandleDrag.ts   # swipe dismiss
├── drawerAPI.ts             # slide keyframes
├── drawerParts.tsx
└── …
```

## Storybook

`Core Components/Drawer` — placement, size, gloss, handle drag, `isDismissable={false}`, Trigger.
