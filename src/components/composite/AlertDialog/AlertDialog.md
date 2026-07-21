# AlertDialog

Модальное окно подтверждения на нативном `<dialog>`. Семантика и иконки как у `Alert`. **Escape и клик по overlay не закрывают** — только явные кнопки.

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
| `status` | `default` | `default` \| `danger` \| `success` \| `info` \| `warning` |
| `variant` | `default` | `default` \| `outline` \| `secondary` \| `gloss` |
| `size` | `base` | `small` \| `base` \| `mid` \| `large` |
| `classNames` | — | Слоты кастомизации (см. ниже) |
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
| `AlertDialog.Close` | `CloseButton` |

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
| `small` | `max-w-component-small` | `base` / `small` |
| `base` | `max-w-component-mid` | `mid` / `base` |
| `mid` | `max-w-component-mid` | `mid` / `base` |
| `large` | `max-w-component-large` | `large` / `mid` |

## Анимации

`alertDialogAnimations.ts` → `useAlertDialogModalMotion`.

**DOM:**

```
<Trigger>                              ← runOpenAfterSqueeze
portal → document.body
  <dialog ref=dialogRef role=alertdialog>
    <div ref=overlayRef />             ← fade overlay
    <div ref=panelRef tabIndex=-1>     ← scale 0.97→1
      <Header grid> Indicator Title Close
      <Body scroll>
      <Footer>
```

### 1. Open pipeline

1. `open=true` → `setMounted(true)`
2. `dialog.showModal()`
3. `animateModalOpen` — overlay fade + panel scale (`motionInteractive()`)
4. `panel.focus()`
5. `document.body.overflow = hidden`

### 2. Close pipeline

1. `animateModalClose` — fade + scale out
2. `setMounted(false)` → unmount portal

**Reduced motion:** `isReducedModalMotion()` → `applyReducedModalMotion`.

### 3. Trigger squeeze

`AlertDialog.Trigger` → `runOpenAfterSqueeze` (как `Dialog` / `Popover`).

### 4. Gloss panel

`variant="gloss"` → `createGlossInteractiveRefCallback` на gloss shell.

#### Кастомизация

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  interactiveDuration: 280,
  pressSqueezeScale: [1, 0.98, 1],
});
```

Portal motion: `modalSurfaceMotion.ts` (`animateModalOpen/Close`).

### Чего нет

- Dismiss по Escape (`onCancel` → `preventDefault`)
- Dismiss по overlay click
- Ripple встроенный

### Сводка: что настраивается где

| Анимация | Утилита | Ключи `configureMotion` | Локальный prop |
|----------|---------|---------------------------|----------------|
| Modal open/close | `useAlertDialogModalMotion` | `interactiveDuration`, `interactiveEase` | `open` |
| Trigger squeeze | `runOpenAfterSqueeze` | `pressSqueezeScale` | `asChild` |
| Gloss ref | gloss utils | gloss tokens | `variant="gloss"` |
| Body scroll lock | useEffect | — | `open` |

## Токены и CSS

`alertDialogStyles.ts`:

| Класс / preset | Назначение |
|----------------|------------|
| `ALERT_DIALOG_NATIVE_CLASS` | Fixed fullscreen `<dialog>`, z-100 |
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
- **Не полагайтесь на Escape/backdrop** — by design для alertdialog.
- Сравнение с `Dialog`: нет dismiss, есть `status`, `role="alertdialog"`.

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
| Label | `aria-labelledby={titleId}` |
| Description | `aria-describedby` если есть Description |
| Focus | `panel.focus()` при open; `tabIndex={-1}` на panel |
| Trigger | `aria-haspopup="dialog"`, `aria-expanded` |
| Escape / backdrop | **Заблокированы** |
| Indicator icons | `aria-hidden` |
| Close | Только явные кнопки |

## Структура файлов

```
AlertDialog/
├── AlertDialog.tsx
├── index.ts
├── alertDialogTypes.ts
├── alertDialogStyles.ts
├── alertDialogAPI.ts
├── alertDialogAnimations.ts
├── alertDialogContext.tsx
├── alertDialogParts.tsx
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
| Escape / backdrop dismiss | ✅ | ❌ |
| `role` | `dialog` | `alertdialog` |
| Header icons | ❌ | ✅ (из Alert) |
| Footer button size | manual | auto по `size` |
