# AlertDialog

Модальное окно подтверждения на нативном `<dialog>`. Семантика и иконки как у `Alert`. **Клик по overlay не закрывает**. Escape закрывает по умолчанию (Cancel / наименее деструктивное действие по APG); блокировка — через `closeOnEscape={false}`.

## Импорт

```tsx
import { AlertDialog, useAlertDialog, footerButtonSizeForAlertDialog, primaryButtonVariantForAlertTone, primaryButtonStatusForAlertTone, type AlertDialogProps, type AlertDialogSize, type AlertDialogTriggerProps, type AlertDialogHeaderProps, type AlertDialogTitleProps, type AlertDialogDescriptionProps, type AlertDialogBodyProps, type AlertDialogFooterProps, type AlertDialogCloseProps } from "burne-ui";
```

## API

### Compound API

```tsx
const [open, setOpen] = useState(false);

<AlertDialog open={open} onOpenChange={setOpen} status="danger" size="base">
  <AlertDialog.Trigger asChild>
    <Button variant="outline">Удалить аккаунт</Button>
  </AlertDialog.Trigger>
  <AlertDialog.Panel>
    <AlertDialog.Header>
      <AlertDialog.HeadingBlock>
        <AlertDialog.Title>Удалить аккаунт?</AlertDialog.Title>
        <AlertDialog.Description>
          Это действие необратимо. Все данные будут удалены.
        </AlertDialog.Description>
      </AlertDialog.HeadingBlock>
    </AlertDialog.Header>
    <AlertDialog.Body>Дополнительный контекст при необходимости.</AlertDialog.Body>
    <AlertDialog.Footer>
      <Button variant="outline" onClick={() => setOpen(false)}>Отмена</Button>
      <Button variant="primary" status="danger" onClick={handleDelete}>
        Удалить
      </Button>
    </AlertDialog.Footer>
  </AlertDialog.Panel>
</AlertDialog>
```

Simple API нет — всегда compound.

### Root props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `open` | — | Controlled состояние |
| `defaultOpen` | `false` | Uncontrolled начальное состояние |
| `onOpenChange` | — | `(open: boolean) => void` |
| `closeOnEscape` | `true` | Escape закрывает (Cancel). `false` — Escape заблокирован |
| `status` | `default` | `default` \| `danger` \| `success` \| `info` \| `warning` |
| `variant` | `default` | `default` \| `outline` \| `secondary` \| `gloss` |
| `size` | `base` | `small` \| `base` \| `mid` \| `large` |
| `classNames` | — | Слоты кастомизации (см. ниже) |
| `motion` | — | Карта `overlay` / `panel` / `title` / … (`enter` / `leave`). Root без DOM — как `classNames` |
| `children` | — | `Trigger` + `Panel` |

### `AlertDialogClassNames`

| Слот | Элемент |
|------|---------|
| `dialog` | Native `<dialog>` |
| `overlay` | Backdrop |
| `panel` | Outer panel shell |
| `glossPanel` | Gloss shell (`variant="gloss"`) |
| `glossContent` | Inner gloss content |
| `content` | Content wrapper |
| `trigger` | `AlertDialog.Trigger` |
| `header` | Header grid |
| `indicator` | Status icon |
| `headingBlock` | Title + description grid cell |
| `title` | Heading |
| `description` | Subtitle |
| `body` | Scrollable body |
| `footer` | Actions row |
| `close` | Close button |

### Compound-подчасти

| Часть | Назначение |
|-------|------------|
| `AlertDialog.Trigger` | Открытие; `asChild`; squeeze перед open |
| `AlertDialog.Panel` | Portal → `document.body`; `<dialog>` |
| `AlertDialog.Content` | Inner padding wrapper |
| `AlertDialog.Header` | Grid-шапка; auto `Indicator` + `Close` |
| `AlertDialog.Indicator` | Status icon (`SEMANTIC_STATUS_ICONS`) |
| `AlertDialog.HeadingBlock` | `display: contents` для grid |
| `AlertDialog.Title` | `Text as="h2"` → `aria-labelledby` |
| `AlertDialog.Description` | Muted subtitle → `aria-describedby` |
| `AlertDialog.Body` | Scrollable content |
| `AlertDialog.Footer` | Actions row; auto `Button` size |
| `AlertDialog.Close` | `CloseButton` secondary; size из `PANEL_SIZE_LAYOUT.closeButtonSize` |

### `useAlertDialog()`

Контекст: `open`, `titleId`, `descriptionId`, `hasDescription`, `onOpenChange`, `variant`, `status`, `size`, `footerButtonSize`.

### Хелперы тона кнопок

```tsx
footerButtonSizeForAlertDialog("base");        // → ButtonSize
primaryButtonVariantForAlertTone("danger");    // → "primary"
primaryButtonStatusForAlertTone("danger");     // → "danger"
```

## variant / status / размеры

| `status` | Эффект |
|----------|--------|
| `default` | Без semantic icon по умолчанию |
| `danger` / `success` / `info` / `warning` | Icon в header, tint indicator |

| `variant` | Panel surface |
|-----------|---------------|
| `default` | `alertSurfaceClass` + `shadow-token-lg` |
| `outline` / `secondary` | Semantic surfaces |
| `gloss` | `gloss-panel gloss-deep` |

| size | max-width | title / body Text |
|------|-----------|-------------------|
| `small` | `max-w-component-base` | `base` / `small` |
| `base` | `max-w-component-large` | `mid` / `base` |
| `mid` | `max-w-component-xlarge` | `mid` / `base` |
| `large` | `max-w-component-2xlarge` | `large` / `mid` |

Размеры — общий `PANEL_SIZE_LAYOUT` (Dialog / AlertDialog / Popover / Card). Title у AlertDialog — `alertTitleVariant` (в `base` крупнее обычного panel title).

## Анимации

Портал + нативный `<dialog role="alertdialog">`. Хост — `AlertDialog.Panel` (`useAlertDialogModalMotion` → `useModalMotion` + slot motion). Backdrop не закрывает (APG). Escape — `closeOnEscape` на `<dialog cancel>`.

### Slot motion

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `overlay` | `enter` / `leave` | `modalOverlayEnter` / `modalOverlayLeave` |
| `panel` | `enter` / `leave` | `modalPanelEnter` / `modalPanelLeave` |
| `title`, `description` | `enter` / `leave` + локальные `hoverIn` / `hoverOut` | нет; хост **рассылает** lifecycle; pointer — на самом заголовке/описании |
| `close`, `header`, `footer`, `content`, `indicator` | `enter` / `leave` | нет; хост **рассылает** фазу, если задана |

`leave` factory должна вернуть tween/Promise или вызвать `ctx.complete()` — иначе портал не размонтируется. Promise: `ctx.signal` / `isMotionRunActive(ctx)` до delayed DOM. Прерывание leave (повторный open) отменяет `MotionRun` без `complete`. Factory leave на `panel` должна **скрыть** поверхность (`autoAlpha: 0`) — иначе после твина `dialog.close()` выглядит как рывок.

`leave: false` на хосте (`overlay` / `panel`) — хост сразу ставит закрытое состояние. `enter: false` — сразу открытое.

```tsx
<AlertDialog motion={{ panel: { enter: false, leave: false } }}>…</AlertDialog>

<AlertDialog
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

**Где в коде:** типы — `alertDialogTypes.ts`; scope — `alertDialogContext.tsx`; defaults + host play — `alertDialogAnimations.ts` (`ALERT_DIALOG_MOTION_DEFAULTS`, `useAlertDialogModalMotion`); слоты и Panel-provider — `alertDialogParts.tsx`; карта `motion` на корне — `AlertDialog.tsx`.

Trigger squeeze остаётся `runOpenAfterSqueeze` (не слот).

### Чего нет

- Dismiss по overlay click (по-прежнему заблокирован)
- Ripple встроенный

### Сводка: что настраивается где

| Анимация | Слот / рецепт | Ключи `configureMotion` | Локальный prop |
|----------|---------------|---------------------------|----------------|
| Overlay fade | `overlay` → `modalOverlay*` | `modalDuration`, `enableModalMotion` | `motion` на Root / Panel |
| Panel scale | `panel` → `modalPanel*` | `modalDuration`, `enableModalMotion` | `motion` на Root / Panel |
| Trigger squeeze | `runOpenAfterSqueeze` | `pressSqueezeScale` | `asChild` |
| Gloss ref | gloss utils | gloss tokens | `variant="gloss"` |

## Токены и CSS

`alertDialogStyles.ts`:

| Класс / preset | Назначение |
|----------------|------------|
| `ALERT_DIALOG_NATIVE_CLASS` | Fixed fullscreen `<dialog>`, `z-dialog` |
| `alertDialogPanelClass` | Shell + max-width/height |
| `alertDialogGlossPanelClass` | Gloss shell |
| `alertDialogOverlayClass` | → `dialogOverlayClass` |
| `ALERT_DIALOG_FOOTER_CLASS` | `flex justify-end gap-base` |
| `messageBannerGridLayout` | Header grid (как Alert) |
| `MODAL_BODY_SCROLL_CLASS` | Scrollable body |

## Стилизация и кастомизация

### Два уровня

1. **`classNames` на root** — единая точка для всех слотов (как у `Dialog`).
2. **`className` на подчастях** — точечная переопределяемость; мержится поверх `classNames`.

| Часть | `classNames` слот | `className` prop |
|-------|-------------------|------------------|
| Root | все слоты | — |
| `Panel` | `panel` | outer shell в portal |
| `Trigger` | `trigger` | кнопка / asChild |
| `Header`, `Title`, `Description`, `Body`, `Footer` | соответствующие слоты | per-part |
| `Indicator`, `Close`, `Content` | соответствующие слоты | per-part merge |

### Кастомизация через `classNames`

```tsx
<AlertDialog
  open={open}
  onOpenChange={setOpen}
  status="danger"
  classNames={{
    panel: "ring-1 ring-danger/20",
    title: "text-danger font-semibold",
    footer: "border-t border-danger/20 pt-small",
  }}
>
  ...
</AlertDialog>
```

### Confirm delete (danger)

```tsx
<AlertDialog open={open} onOpenChange={setOpen} status="danger" size="base">
  <AlertDialog.Trigger asChild>
    <Button variant="outline" status="danger">Удалить</Button>
  </AlertDialog.Trigger>
  <AlertDialog.Panel className="ring-1 ring-danger/20">
    <AlertDialog.Header>
      <AlertDialog.HeadingBlock>
        <AlertDialog.Title>Удалить файл?</AlertDialog.Title>
        <AlertDialog.Description>Файл нельзя восстановить.</AlertDialog.Description>
      </AlertDialog.HeadingBlock>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <Button variant="outline" onClick={() => setOpen(false)}>Отмена</Button>
      <Button
        variant={primaryButtonVariantForAlertTone("danger")}
        status={primaryButtonStatusForAlertTone("danger")}
        onClick={handleDelete}
      >
        Удалить
      </Button>
    </AlertDialog.Footer>
  </AlertDialog.Panel>
</AlertDialog>
```

### Gloss + status

```tsx
<AlertDialog open={open} onOpenChange={setOpen} variant="gloss" status="info">
  ...
</AlertDialog>
```

`themeAnchor` на `Panel` — наследование light theme в portal.

### Практические заметки

- `open` / `defaultOpen` / `onOpenChange` — как у Popover/Dialog (controlled или uncontrolled).
- Primary action: используйте `primaryButtonStatusForAlertTone(status)`.
- Footer `Button` получает `size` из context автоматически (`injectFooterButtonSize`).
- `AlertDialog.Description` регистрирует `hasDescription` → `aria-describedby`.
- `children={null}` на `Indicator` скрывает icon.
- Escape = Cancel (`closeOnEscape`, default `true`); backdrop по-прежнему не закрывает.
- Сравнение с `Dialog`: backdrop не dismiss; есть `status`, `role="alertdialog"`.

## Интеграции

| Компонент | Роль |
|-----------|------|
| `Alert` | `status`, `variant`, surfaces, icons, grid |
| `Dialog` | Overlay styles, modal patterns |
| `Button` / `CloseButton` | Footer actions |
| `Text` | Title, Description, Body |
| `modalSurfaceMotion` | GSAP open/close |
| `runOpenAfterSqueeze` | Trigger |
| `burneLightThemePortalProps` | Portal theme |

## Доступность

| Аспект | Реализация |
|--------|------------|
| Role | `role="alertdialog"` на `<dialog>` |
| Label | `aria-labelledby` только при `AlertDialog.Title` |
| Description | `aria-describedby` если есть Description |
| Focus | `focusPanelOnOpen` при open; `tabIndex={-1}` на panel (fallback) |
| Trigger | `aria-haspopup="dialog"`, `aria-expanded` |
| Escape | Закрывает (Cancel); opt-out: `closeOnEscape={false}` |
| Backdrop | Не закрывает |
| Indicator icons | `aria-hidden` |
| Close | Явные кнопки + Escape (если не отключён) |

## Структура файлов

```
AlertDialog/
├── AlertDialog.tsx              # карта motion в context (Root без DOM)
├── index.ts
├── alertDialogTypes.ts          # AlertDialogMotion / Lifecycle / Part
├── alertDialogStyles.ts
├── alertDialogAPI.ts
├── alertDialogAnimations.ts     # ALERT_DIALOG_MOTION_DEFAULTS + host play
├── alertDialogContext.tsx       # createMotionScope (без defaults/play)
├── alertDialogParts.tsx         # useMotionPart + Panel nested provider
├── useAlertDialogRootState.ts
├── useAlertDialog.ts
└── AlertDialog.stories.tsx
```

## Storybook

`Composite Components/AlertDialog` — confirm delete, all statuses, sizes, gloss, gloss light theme, `CustomClassNames`.

Playground: `playground/showcase/demos/alertDialog/`.

## Сравнение с Dialog

| | `Dialog` | `AlertDialog` |
|---|----------|---------------|
| `classNames` | ✅ | ✅ |
| `status` | ❌ | ✅ |
| Escape dismiss | ✅ | ✅ (`closeOnEscape`, default) |
| Backdrop dismiss | ✅ | ❌ |
| `role` | `dialog` | `alertdialog` |
| Header icons | ❌ | ✅ (из Alert) |
| Footer button size | manual | auto по `size` |
