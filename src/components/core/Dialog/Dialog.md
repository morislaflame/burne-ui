# Dialog

Модальное окно на нативном `<dialog>` с порталом в `document.body`, GSAP enter/leave и compound-компоновкой. Controlled / uncontrolled: `open` / `defaultOpen` / `onOpenChange`.

## Импорт

```tsx
import { Dialog, type DialogProps, type DialogVariant, type DialogClassNames, type DialogPanelProps, type DialogTriggerProps, type DialogMotion, type DialogPartMotion } from "burne-ui";
```

## API

### Root (`Dialog`)

| Prop | Тип | Обязательный | Описание |
|------|-----|--------------|----------|
| `open` | `boolean` | нет | Controlled: открыт ли диалог |
| `defaultOpen` | `false` | нет | Uncontrolled начальное состояние |
| `onOpenChange` | `(open: boolean) => void` | нет | Смена состояния |
| `children` | `ReactNode` | — | `Dialog.Panel`, `Dialog.Trigger`, … |
| `classNames` | `DialogClassNames` | — | Слоты всех подчастей |
| `motion` | `DialogMotion` | — | Карта `overlay` / `panel` / `title` / … (`enter` / `leave`; у `title` / `description` ещё `hoverIn` / `hoverOut`). Root без DOM — как `classNames` |

Root **не рендерит DOM** — только контекст и `classNames` provider.

### Compound-подчасти

| Часть | Назначение |
|-------|------------|
| `Dialog.Trigger` | Открытие после press-squeeze; `asChild` |
| `Dialog.Panel` | Портал + overlay + анимации; props ниже |
| `Dialog.Content` | Обёртка контента (`p-xlarge`, `gap-large`) |
| `Dialog.Header` | Шапка: heading + close |
| `Dialog.HeadingBlock` | Блок title + description |
| `Dialog.Title` | `<h2>`, `Text` mid |
| `Dialog.Description` | `<p>`, `text-muted` |
| `Dialog.Close` | `CloseButton` secondary; size из `PANEL_SIZE_LAYOUT.closeButtonSize` |
| `Dialog.Body` | Скроллируемая область |
| `Dialog.Footer` | Кнопки, `justify-end` |

### `Dialog.Panel` props

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `variant` | `default` \| `gloss` | `default` | Поверхность панели |
| `dismissOnBackdrop` | `boolean` | `true` | Закрытие по клику на overlay |
| `className` | `string` | — | На focusable panel wrapper |
| `themeAnchor` | `HTMLElement` | auto | Якорь для светлой темы портала |

### `DialogClassNames`

```tsx
type DialogClassNames = {
  trigger?: string;
  dialog?: string;       // <dialog>
  overlay?: string;
  panel?: string;
  glossPanel?: string;
  glossContent?: string;
  content?: string;
  header?: string;
  headingBlock?: string;
  title?: string;
  description?: string;
  body?: string;
  footer?: string;
  close?: string;
};
```

### Базовый пример

```tsx
const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  <Dialog.Panel>
    <Dialog.Header>
      <Dialog.HeadingBlock>
        <Dialog.Title>Заголовок</Dialog.Title>
        <Dialog.Description>Описание</Dialog.Description>
      </Dialog.HeadingBlock>
      <Dialog.Close />
    </Dialog.Header>
    <Dialog.Body>Контент</Dialog.Body>
    <Dialog.Footer>
      <Button variant="ghost" onClick={() => setOpen(false)}>Отмена</Button>
      <Button variant="primary" onClick={() => setOpen(false)}>OK</Button>
    </Dialog.Footer>
  </Dialog.Panel>
</Dialog>
```

### С `Dialog.Trigger`

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <Dialog.Trigger asChild>
    <Button>Открыть</Button>
  </Dialog.Trigger>
  <Dialog.Panel>…</Dialog.Panel>
</Dialog>
```

Trigger вызывает `e.preventDefault()` на `pointerdown`, чтобы подавить собственную анимацию `Button`, затем `runOpenAfterSqueeze` открывает диалог после squeeze.

## variant

| variant | Панель |
|---------|--------|
| `default` | `bg-surface border-token shadow-token-large` + radius из `PANEL_SIZE_LAYOUT` |
| `gloss` | `gloss-panel gloss-deep` + `gloss-content` |

Размеры (`size`) — общий пресет `PANEL_SIZE_LAYOUT` (вместе с AlertDialog / Popover / Card): max-width, max-height, section padding, title/desc/body, radius.

| size | max-width | title / body | close |
|------|-----------|--------------|-------|
| `small` | `max-w-component-base` | `small` / `small` | `small` |
| `base` | `max-w-component-large` | `base` / `base` | `small` |
| `mid` | `max-w-component-xlarge` | `mid` / `base` | `base` |
| `large` | `max-w-component-2xlarge` | `large` / `mid` | `base` |

## Анимации

Портал + нативный `<dialog>`. Хост — `Dialog.Panel` (`useDialogModalMotion` → `useModalMotion` + slot motion). AlertDialog — тот же паттерн на `AlertDialog.Panel` (backdrop не закрывает). Drawer — свой slot motion (`drawerSlideEnter` / `Leave`).

### Slot motion

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `overlay` | `enter` / `leave` | `modalOverlayEnter` / `modalOverlayLeave` |
| `panel` | `enter` / `leave` | `modalPanelEnter` / `modalPanelLeave` |
| `title`, `description` | `enter` / `leave` + локальные `hoverIn` / `hoverOut` | нет; хост **рассылает** lifecycle; pointer — на самом заголовке/описании |
| `close`, `header`, `footer`, `content` | `enter` / `leave` | нет; хост **рассылает** фазу, если задана |

Nested `enter` — следующий кадр после host, без layout flush на overlay. После `showModal()` — один измеренный flush (`display: none` → `[open]`).

`leave` factory должна вернуть tween/Promise или вызвать `ctx.complete()` — иначе портал не размонтируется (dev warn + ~500ms fallback). Promise не отменяем: перед delayed DOM проверяйте `ctx.signal` / `isMotionRunActive(ctx)`. Прерывание leave (повторный open / новый play) отменяет `MotionRun` и **не** вызывает `complete` — портал не зависает и не размонтируется во время enter. Factory leave на `panel` должна **скрыть** поверхность (`autoAlpha: 0` или полный slide) — иначе после твина `dialog.close()` выглядит как рывок.

`leave: false` на хосте (`overlay` / `panel`) — хост сразу ставит закрытое состояние (панель не висит, пока фейдится сосед). `enter: false` — сразу открытое.

```tsx
<Dialog motion={{ panel: { enter: false, leave: false } }}>…</Dialog>

<Dialog
  motion={{
    panel: {
      enter: (ctx) =>
        gsap.fromTo(
          ctx.el,
          { y: 28, scale: 0.92, autoAlpha: 0 },
          { y: 0, scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(1.4)" },
        ),
      leave: (ctx) =>
        gsap.to(ctx.el, {
          y: 24,
          scale: 0.94,
          autoAlpha: 0,
          duration: 0.22,
          ease: "power2.in",
        }),
    },
  }}
>
```

**Где в коде:** типы — `dialogTypes.ts`; scope — `dialogContext.tsx`; defaults + host play — `dialogAnimations.ts` (`DIALOG_MOTION_DEFAULTS`, `useDialogModalMotion`); слоты и Panel-provider — `dialogParts.tsx`; карта `motion` на корне — `Dialog.tsx`.

```tsx
import gsap from "gsap";
import { Dialog, tweenCssColor } from "burne-ui";

<Dialog
  open={open}
  onOpenChange={setOpen}
  motion={{
    title: {
      enter: (ctx) =>
        gsap.fromTo(ctx.el, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35 }),
      leave: (ctx) => gsap.to(ctx.el, { y: -8, autoAlpha: 0, duration: 0.2 }),
    },
  }}
>
  <Dialog.Panel>…</Dialog.Panel>
</Dialog>
```

Цвет — factory и токены, не `MotionVars`. Nested `enter` стартует на следующем кадре после host enter, без `offsetHeight` flush на overlay. После `showModal()` хост один раз читает layout (`flushDialogOpenLayout`) — UA `display: none` → `[open]`. `leave: false` на части, если хост (`panel`) оркестрирует `ctx.targets` одним таймлайном.

```tsx
<Dialog
  motion={{
    title: {
      hoverIn: (ctx) => tweenCssColor(ctx.el, "var(--color-primary)"),
      hoverOut: (ctx) =>
        tweenCssColor(ctx.el, "var(--color-foreground)", { clearOnComplete: true }),
    },
  }}
>
  …
</Dialog>

<Dialog
  motion={{
    panel: {
      leave: (ctx) => {
        const tl = gsap.timeline();
        if (ctx.targets.title) tl.to(ctx.targets.title, { x: -12, autoAlpha: 0, duration: 0.16 }, 0);
        tl.to(ctx.el, { scale: 0.94, autoAlpha: 0, duration: 0.22 }, 0.08);
        return tl;
      },
    },
    title: { leave: false },
  }}
>
```

См. [Motion](/docs/motion).

**DOM-структура (портал):**

```
<dialog>
  <div overlayRef>              ← opacity 0→1
  <div panelRef tabIndex={-1}>  ← scale enter/exit
    <Dialog.Content>            ← layout, без отдельной motion
      Header / Body / Footer
```

### 1. Open — overlay fade + panel scale

При `open=true`, `mounted=true`:

1. `dialog.showModal()`
2. `animateModalOpen({ overlay, panel, vars: motionInteractive() })`:
   - **overlay:** `opacity: 0 → 1`
   - **panel:** `scale: 0.97` (`MODAL_PANEL_SCALE_FROM`) → `scale: 1`
3. `focusPanelOnOpen` — первый focusable (иначе panel); ring если trigger был `:focus-visible`

**Важно:** scale только на panel, **не** `autoAlpha` на panel при open — gloss `backdrop-filter` на детях не ломается.

**Scroll lock:** `body.overflow = hidden` на время `mounted`.

#### Кастомизация open/close

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  modalDuration: 280,          // overlay + panel scale
  interactiveEase: "power2.out",
  enableModalMotion: true,
});
```

`MODAL_PANEL_SCALE_FROM = 0.97` — константа в `modalSurfaceMotion.ts`, не в config.

### 2. Close — overlay fade + panel fade + scale

При `open=false`:

1. `animateModalClose`:
   - **overlay:** `opacity → 0`
   - **panel:** `autoAlpha: 0`, `scale: 0.97` (default `panelExit`)
2. `onComplete` → `setMounted(false)` — unmount портала
3. Нативный `onClose` на `<dialog>` → `onOpenChange(false)`

Kill tweens при unmount через `killMotion(overlay, panel)` (снимает и inline `will-change`). Nested enter rAF отменяется на unmount / leave (`invalidateEnterFrame`).

### 3. Reduced motion

`isReducedModalMotion()` (= `prefers-reduced-motion`):

- `applyReducedModalMotion(overlay, panel, { focusPanel: true })` — мгновенно, без GSAP
- Close — мгновенный unmount

### 4. Dialog.Trigger — open после squeeze

`runOpenAfterSqueeze({ triggerRef, openingRef, setOpen })`:

1. `pointerdown` на Trigger → `e.preventDefault()` **до** child Button (подавляет дублирующий squeeze)
2. `animateInteractivePressSqueeze(triggerEl)` → Promise
3. `setOpen(true)` после complete

При reduced motion — `setOpen(true)` сразу. Keyboard click (без pointerdown) — open немедленно в `handleClick`.

Использует те же `pressSqueezeScale` / `interactiveDuration`, что Button.

### 5. Gloss panel

`createGlossInteractiveRefCallback(glossPanelRef, variant === "gloss")` — gloss surface на внутренней обёртке. Slide/scale motion на внешнем `panelRef`; gloss ref для hover на панели (если интерактивна).

### Сводка: что настраивается где

| Анимация | Утилита | Ключи `configureMotion` | Примечание |
|----------|---------|---------------------------|------------|
| Open overlay | `animateModalOpen` | `modalDuration`, `interactiveEase`, `enableModalMotion` | opacity fade |
| Open panel | `animateModalOpen` | те же | scale 0.97→1 |
| Close | `animateModalClose` | те же | autoAlpha + scale out |
| Trigger squeeze | `runOpenAfterSqueeze` | `pressSqueezeScale`, `enablePressSqueeze` | Dialog.Trigger |
| Reduced motion | `isReducedModalMotion` | `enableModalMotion` / `enableAnimations` | системная настройка + флаги |
| Scale from | `MODAL_PANEL_SCALE_FROM` | — | константа 0.97 |

## Overlay и тема

| Тема UI | Overlay |
|---------|---------|
| Light | `overlay-backdrop` → `--overlay-backdrop-color` + blur/saturate |
| Dark | `overlay-backdrop-scrim` → `--overlay-backdrop-scrim` |

Тема портала: `usePortalThemeAnchor`, `useBurneLightTheme`, `burneLightThemePortalProps` — overlay подстраивается под якорь (например, `[data-theme="light"]` в приложении).

Переопределение:

```css
:root {
  --overlay-backdrop-color: color-mix(in oklab, var(--color-foreground) 20%, transparent);
  --overlay-backdrop-blur: 20px;
}
```

## Layout

Из `modalPanelLayout`:

- `Dialog.Content` — `MODAL_CONTENT_CLASS` (`p-xlarge`, `gap-large` между Header/Body/Footer)
- `Dialog.Body` — `MODAL_BODY_SCROLL_CLASS` (скролл только в body)

## Токены и CSS

| Класс | Назначение |
|-------|------------|
| `shadow-token-large` | Тень панели |
| `border-token`, `bg-surface` | Default surface |
| `max-w-component-*` | Ширина панели (`PANEL_SIZE_LAYOUT`) |
| `rounded-*` | Скругление по `size` (как Button / Card) |
| `z-dialog` | Stacking dialog (`--z-dialog`) |
| `overlay-backdrop` / `overlay-backdrop-scrim` | Подложка (light frosted / dark solid) |
| `gloss-panel`, `gloss-deep` | Gloss variant |

## Стилизация и кастомизация

### Два уровня

1. **`classNames` на `<Dialog>`** — слоты портала и разметки через `DialogClassNamesProvider` (доступны внутри `Dialog.Panel` через портал-контекст).
2. **`className` на `Dialog.Panel`** — дополнительные классы на surface панели (мерж с `classNames.panel` / gloss-обёрткой).

Подчасти (`Dialog.Title`, `Dialog.Body`, …) принимают **`className`** поверх слота из `classNames`.

### Слоты `DialogClassNames`

| Слот | DOM / элемент | Когда использовать |
|------|---------------|-------------------|
| `trigger` | `Dialog.Trigger` | Слот на кнопке / asChild |
| `dialog` | Нативный `<dialog>` | Редко — глобальные правки dialog-элемента |
| `overlay` | Backdrop | Blur, opacity, цвет затемнения |
| `panel` | Surface панели | Max-width, border, shadow, gloss/default |
| `glossPanel` | Gloss-обёртка панели | При `variant="gloss"` |
| `content` | `Dialog.Content` | Padding/gap внутри панели |
| `glossContent` | Gloss content wrap | Внутренний gloss-слой |
| `header` | `Dialog.Header` | Раскладка title + close |
| `headingBlock` | `Dialog.HeadingBlock` | Title + description stack |
| `title` | `Dialog.Title` | Типографика заголовка |
| `description` | `Dialog.Description` | Подзаголовок |
| `body` | `Dialog.Body` | Scroll area, padding контента |
| `footer` | `Dialog.Footer` | Кнопки, border-top |
| `close` | `Dialog.Close` | Стили close-кнопки (прокидывается в CloseButton) |

`Dialog.Panel` prop `variant`: `default` | `gloss`.

### Compound API (основной способ)

```tsx
<Dialog
  open={open}
  onOpenChange={setOpen}
  classNames={{
    overlay: "backdrop-blur-xl",
    panel: "max-w-lg border-primary/40 bg-primary/5 shadow-token-lg",
    title: "text-primary font-semibold",
    description: "text-foreground/80",
    body: "px-xlarge",
    footer: "border-t border-primary/20 pt-small",
    close: "opacity-80",
  }}
>
  <Dialog.Panel variant="gloss" className="ring-1 ring-white/10">
    <Dialog.Header>
      <Dialog.HeadingBlock>
        <Dialog.Title>Настройки</Dialog.Title>
        <Dialog.Description>Все слоты через classNames.</Dialog.Description>
      </Dialog.HeadingBlock>
      <Dialog.Close aria-label="Закрыть диалог" />
    </Dialog.Header>
    <Dialog.Body>
      <p className="text-small text-muted">Контент модального окна.</p>
    </Dialog.Body>
    <Dialog.Footer>
      <Button size="small" onClick={() => setOpen(false)}>Закрыть</Button>
    </Dialog.Footer>
  </Dialog.Panel>
</Dialog>
```

`Dialog.Trigger` — стилизуется своим `className` (обычно это `Button` с `asChild`).

### Практические заметки

- **Panel vs Dialog:** `classNames` задаются на `<Dialog>`, рендерятся в портале внутри `Dialog.Panel`.
- **Close:** `Dialog.Close` — обёртка `CloseButton`; `size` по умолчанию из `PANEL_SIZE_LAYOUT.closeButtonSize` (можно переопределить пропом).
- **Scroll:** только `Dialog.Body` скроллится — min-height/max-height задавайте на `body` слот. У Body есть `py-xsmall`, чтобы focus-ring / hover-shadow полей не обрезались футером и краем scrollport.
- **Порядок мержа:** базовые стили → `classNames.slot` → `className` подчасти / `Dialog.Panel`.

## Доступность

- Нативный `<dialog>` + `showModal()` — focus trap, Esc закрытие.
- `aria-labelledby` — только при наличии `Dialog.Title`; иначе задайте `aria-label` на `Panel`.
- `aria-describedby` — при наличии `Dialog.Description`.
- `Dialog.Trigger`: `aria-haspopup="dialog"`, `aria-expanded={open}`.
- `Dialog.Close`: дефолтный `aria-label="Закрыть"`.
- Backdrop: `aria-hidden`, закрытие по `mousedown` на overlay (не на panel).

## Контекст

Внутренний `useDialog()`:

- `open`, `onOpenChange`, `titleId`, `descriptionId`, `hasDescription`, `setHasDescription`

Контекст React течёт через портал (не через DOM) — `DialogClassNamesProvider` доступен в `Dialog.Panel`.

## Структура файлов

```
Dialog/
├── Dialog.tsx               # карта motion в context (Root без DOM)
├── index.ts
├── dialogTypes.ts           # DialogMotion / DialogLifecycleMotion / DialogPartMotion
├── dialogStyles.ts
├── dialogAPI.ts
├── dialogContext.tsx        # createMotionScope("Dialog")
├── dialogParts.tsx          # Panel-хост + useMotionPart
├── dialogAnimations.ts      # DIALOG_MOTION_DEFAULTS, useDialogModalMotion
├── useDialogRootState.ts
├── useDialogFooterState.ts
└── Dialog.stories.tsx
```

## Storybook

`Core Components/Dialog` — default, `Dialog.Trigger`, gloss, `classNames`, форма в body, светлая/тёмная тема, `dismissOnBackdrop={false}`, slot motion gallery.
