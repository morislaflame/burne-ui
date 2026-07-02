# TextArea

Многострочное поле с shell, опциональным resize-handle и теми же variant/status, что у Input. Simple и compound API.

## Импорт

```tsx
import {
  TextArea,
  type TextAreaProps,
  type TextAreaSimpleProps,
  type TextAreaVariant,
  type TextAreaStatus,
  type TextAreaSize,
  type TextAreaClassNames,
} from "burne-ui";
```

## API

### Compound

```tsx
<TextArea label="Описание" hint="До 500 символов" rows={4}>
  <TextArea.Label>Описание</TextArea.Label>
  <TextArea.Control placeholder="…" />
  <TextArea.Hint>До 500 символов</TextArea.Hint>
</TextArea>
```

| Часть | Назначение |
|-------|------------|
| `TextArea` | Root + Field |
| `TextArea.Label` | `Label` |
| `TextArea.Control` | Shell + `<textarea>` + resize |
| `TextArea.Hint` / `TextArea.Error` | Как у Input |

### Simple API

```tsx
<TextArea
  label="Комментарий"
  rows={3}
  resizable
  placeholder="Ваш отзыв…"
/>
```

### `TextArea.Control` props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `variant` | `default` | `default` \| `outline` \| `gloss` |
| `status` | `default` | семантический tint |
| `size` | `base` | размер padding / min-height |
| `rows` | `1` | Нативные rows |
| `resizable` | `true` | Drag-handle в углу |
| `classNames` | — | `root`, `shell`, `control`, `resizeHandle`, … |

### `TextAreaClassNames`

`root`, `label`, `shell`, `control`, `resizeHandle`, `hint`, `error`.

## variant и status

Аналогично Input: `default` / `outline` / `gloss`; status tint для danger/success/warning.

## Размеры

`TEXTAREA_MIN_H`: `min-h-control-*` на shell. Control padding — `CONTROL_SIZE_LAYOUT[size].controlPad`.

`field-sizing: content` на textarea — авто-рост по контенту (CSS).

## Анимации

`textAreaAnimations.ts` + `useTextAreaResize.ts`.

**DOM-структура:**

```
Field.Root
  Label
  <div data-slot="textarea-shell" ref=shellRef>
    <textarea ref=textareaRef />
    [button data-textarea-resize-handle]   ← optional
  Hint / Error
```

### 1. Shell hover lift (standard, `variant !== "gloss"`)

`useFieldShellHoverLift(shellRef, !blocked && !isGloss)`:

- Покой: `shadow-token-sm`
- Hover: sm → md + scale lift
- `fieldShellHoverClass(status)` — CSS tint на hover/focus-within
- Класс: `standardShellHoverMotionClass` → `animate-shadow`

### 2. Shell press squeeze

`useTextAreaShellMotion` → `handleShellPointerDown`:

1. Игнор если target внутри `[data-textarea-resize-handle]`
2. **Gloss:** `glossShellMotion.onShellPointerDown()` (gloss squeeze)
3. **Standard:** `animateInteractivePressSqueeze(shell)`

### 3. Gloss shell (`variant="gloss"`)

`useGlossFieldShellMotion`:

- pointer enter/leave → gloss hover lift
- focus capture in/out → lift при фокусе в textarea
- `glossShellHoverMotionClass` на shell
- ResizeObserver для gloss state refresh

### 4. Resize handle (не GSAP)

`useTextAreaResize(shellRef, resizable, blocked, size)`:

**pointerdown** на handle → `setPointerCapture`

**pointermove:**

```ts
nextHeight = clamp(
  minHeight,                          // readControlHeightPx(size)
  startHeight + (clientY - startY),
  MAX_HEIGHT_PX,                      // 640
);
shell.style.height = `${nextHeight}px`;
```

**pointerup:** release capture, listeners off.

- Минимум — высота контрола размера из токенов
- Максимум — **640px** (константа, не в `configureMotion`)
- При `resizable={false}` — inline `height` снимается в `setShellRef`

**Важно:** resize не анимируется — мгновенное следование за курсором.

### Кастомизация shell motion

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  hoverLiftScale: 1.025,
  interactiveDuration: 280,
  pressSqueezeScale: [1, 0.98, 1],
  enableHoverLift: true,
  enablePressSqueeze: true,
});
```

**Локально:** `resizable={false}` — без handle; `disabled` / `readOnly` → `blocked`, без hover/squeeze.

### Сводка: что настраивается где

| Анимация | Утилита | `configureMotion` | Hardcode |
|----------|---------|-------------------|----------|
| Shell hover | `useFieldShellHoverLift` | `enableHoverLift`, `hoverLiftScale` | — |
| Shell squeeze | `animateInteractivePressSqueeze` | `pressSqueezeScale` | — |
| Gloss shell | `useGlossFieldShellMotion` | interactive | variant=gloss |
| Drag resize | `useTextAreaResize` | — | `MAX_HEIGHT_PX=640` |
| Content growth | CSS `field-sizing: content` | — | — |

## Стилизация и кастомизация

### Два уровня

1. **`className` на root** — классы на `Field.Root` (мерж с `classNames.root`).
2. **`classNames` на root** — слоты через `TextAreaClassNamesProvider`.

В compound API каждая подчасть (`TextArea.Control`, `TextArea.Label`, …) принимает **`className`**, мержится поверх слота из контекста.

### Слоты `TextAreaClassNames`

| Слот | DOM / элемент | Когда использовать |
|------|---------------|-------------------|
| `root` | `Field.Root` | Max-width, внешние отступы, рамка поля |
| `label` | `Label` | Типографика label |
| `shell` | `[data-slot="textarea-shell"]` | Min-height, ring, border; сюда же inline `height` от resize |
| `control` | `<textarea>` | Line-height, padding, `field-sizing` поведение |
| `resizeHandle` | `[data-textarea-resize-handle]` | Видимость grip, hit-area (только при `resizable`) |
| `hint` / `error` | `Field.Hint` / `Field.Error` | Подсказка и ошибка |

`variant`, `status`, `size` — базовая поверхность и padding из `textAreaStyles.ts`. `classNames` дополняют, не заменяя variant автоматически.

### Simple API

```tsx
<TextArea
  className="max-w-md"
  classNames={{
    root: "rounded-mid border border-primary/20 p-base",
    shell: "min-h-[12rem] ring-1 ring-primary/15",
    control: "text-primary placeholder:text-primary/50 leading-relaxed",
    resizeHandle: "opacity-60 hover:opacity-100",
    hint: "text-foreground/70",
    error: "font-medium",
  }}
  label="Комментарий"
  placeholder="Ваш отзыв…"
  rows={3}
  resizable
  status="danger"
  hint="До 500 символов."
  error="Текст слишком короткий."
/>
```

### Compound API

```tsx
<TextArea
  variant="outline"
  classNames={{
    root: "max-w-lg",
    shell: "border-token/60",
  }}
>
  <TextArea.Label className="font-semibold">
    Описание задачи
  </TextArea.Label>

  <TextArea.Control
    className="text-mid"
    rows={5}
    resizable={false}
    placeholder="Детали…"
  />

  <TextArea.Hint className="italic">
    Видно всем участникам
  </TextArea.Hint>
</TextArea>
```

`TextArea.Label` поддерживает вложенные `classNames` компонента `Label` — мерж с `classNames.label` из контекста.

При `resizable={false}` слот `resizeHandle` не рендерится.

### Практические заметки

- **Высота:** минимум — через `rows` + `size`; drag-resize пишет `height` на `shell`; авто-рост контента — CSS `field-sizing: content` на `control`.
- **Shell vs control:** hover-lift и squeeze на `shell`; перенос строк и скролл — на `control`.
- **Gloss:** как у Input — не ломайте `gloss-control` на shell без нужды.
- **Порядок мержа:** базовые стили → `classNames.slot` → `className` подчасти.

## Доступность

- `aria-describedby` через hint/error ids
- Resize handle: `aria-label` («Изменить высоту»)
- `aria-invalid`, `aria-required` как у Input

## Структура файлов

```
TextArea/
├── TextArea.tsx
├── index.ts
├── textAreaTypes.ts
├── textAreaStyles.ts
├── textAreaAnimations.ts    # useTextAreaShellMotion
├── useTextAreaResize.ts     # pointer resize
├── textAreaParts.tsx
├── useTextAreaRootState.ts
└── TextArea.stories.tsx
```

## Storybook

`Core Components/TextArea` — simple/compound, resizable, gloss, status, `classNames`.
