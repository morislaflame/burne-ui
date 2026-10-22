# TextArea

Многострочное поле с shell, опциональным resize-handle и теми же variant, что у Input. Ошибка — `invalid` / `error`. Simple и compound API.

Стекло — пакет `burne-ui-skin-gloss`, не вариант кита. Подключение и классы — [docs/SKINS.md](../../../../docs/SKINS.md).

## Импорт

```tsx
import { TextArea, type TextAreaProps, type TextAreaControlProps, type TextAreaSimpleProps, type TextAreaVariant, type TextAreaSize, type TextAreaClassNames, type TextAreaMotion, type TextAreaPartMotion } from "burne-ui";
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
| `variant` | `default` | `default` \| `outline` |
| `invalid` | — | `true` — danger-кольцо, `aria-invalid` и `data-invalid=""`. `error` делает то же и показывает сообщение |
| `size` | `base` | размер padding / min-height |
| `rows` | `1` | Нативные rows |
| `resizable` | `true` | Drag-handle в углу |
| `classNames` | — | `root`, `shell`, `control`, `resizeHandle`, … |
| `motion` | — | Root / simple: карта слотов + `events`. На `TextArea.Control` — part motion слота `shell` |
| `motionController` | — | Simple: форвардится на Control (хост `shell`). Compound: Root chrome; для shell — второй handle на `TextArea.Control`. Не на DOM |

### `TextAreaClassNames`

`root`, `label`, `shell`, `control`, `resizeHandle`, `hint`, `error`.

## variant

`invalid` или `error` — нейтральный фон/border и постоянное danger-кольцо. `data-status` нет.

## Размеры

`TEXTAREA_MIN_H`: `min-h-control-*` на shell. Control padding — `CONTROL_SIZE_LAYOUT[size].controlPad`.

`field-sizing: content` на textarea — авто-рост по контенту (CSS).

## Анимации

Публичный slot motion. Root передаёт карту `motion`; хост — `TextArea.Control` (defaults + `play`). Drag-resize высоты — kit-internal (`useTextAreaResize`), не публичные MotionVars.

### Slot motion

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `shell` | `hoverIn` / `hoverOut` / `pressIn` / `pressOut` | — |
| `control` / `resizeHandle` | hover/press | нет |
| `label` / `hint` / `error` | `enter` / hover/press | нет; Root scope (соседи Control) |

Press на shell не стартует, если target внутри `[data-textarea-resize-handle]`. `false` на `shell.hoverIn/Out` — rest-тень остаётся.

**Где в коде:** типы — `textAreaTypes.ts`; scope — `textAreaContext.tsx`; defaults + host — `textAreaAnimations.ts`; слоты — `textAreaParts.tsx`; карта на Root — `TextArea.tsx`. Resize drag — `useTextAreaResize.ts` (max 640px).

```tsx
<TextArea
  label="Note"
  motion={{
    shell: { hoverIn: false, hoverOut: false },
  }}
/>
```

Compound: `motion` на `TextArea.Control` — part motion слота `shell`. На `TextArea.Label` / `Hint` / `Error` — chrome Root scope.

Слота `root` нет: `play()` ищет `"root"` и skip. Simple API — `playSlot("shell", …)` / `playSlot("resizeHandle", …)`. Compound chrome — handle на Root (`playSlot("label")`); shell-хост — отдельный handle на `TextArea.Control`. Один handle ≠ два scope.

Проп `motionController` + ключ `events` на `motion` — app-команды (`area:nudge`, `area:pulse`), не фазы. `createMotionEvents`. События на simple API играть через `playSlot("shell", event)` (карта `events` с корня мержится в Control). `waitForComplete` / `cancel` — playground / Storybook **MotionController**.

Тройка на корне и на `TextArea.Control`. Simple API мержит карту корня в Control. `motionState`, `motionPayload` и `playInitialState` не попадают на DOM. Смена `motionState` играет `motion.states[имя]`; то же имя ещё раз — тишина. `motionPayload` — снимок для фабрики (`ctx.payload`, `createMotionFactory`); без смены режима не переигрывает. `playInitialState` по умолчанию выключен: на маунте режим не играет.

```tsx
import { Button, TextArea, createMotionEvents, useMotionControllerHandle } from "burne-ui";

const events = createMotionEvents({
  "area:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1 },
});

function Nudge() {
  const controller = useMotionControllerHandle();
  return (
    <>
      <Button size="small" variant="outline" onClick={() => controller.playSlot("shell", "area:nudge")}>
        Nudge
      </Button>
      <TextArea label="Note" placeholder="Write a note…" motionController={controller} motion={{ events }} />
    </>
  );
}
```

### Кастомизация

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

## Стилизация и кастомизация

### Два уровня

1. **`className` на root** — классы на `Field` (мерж с `classNames.root`).
2. **`classNames` на root** — слоты через `TextAreaClassNamesProvider`.

В compound API каждая подчасть (`TextArea.Control`, `TextArea.Label`, …) принимает **`className`**, мержится поверх слота из контекста.

### Слоты `TextAreaClassNames`

| Слот | DOM / элемент | Когда использовать |
|------|---------------|-------------------|
| `root` | `Field` | Max-width, внешние отступы, рамка поля |
| `label` | `Label` | Типографика label |
| `shell` | `[data-slot="textarea-shell"]` | Min-height, ring, border; сюда же inline `height` от resize |
| `control` | `<textarea>` | Line-height, padding, `field-sizing` поведение |
| `resizeHandle` | `[data-textarea-resize-handle]` | Видимость grip, hit-area (только при `resizable`) |
| `hint` / `error` | `Field.Hint` / `Field.Error` | Подсказка и ошибка |

`variant` и `size` — базовая поверхность и padding из `textAreaStyles.ts`. `classNames` дополняют, не заменяя variant автоматически.

### Simple API

```tsx
<TextArea
  className="max-w-md"
  classNames={{
    root: "rounded-large border border-primary/20 p-base",
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
- **Shell vs control:** hover-lift на `shell` (`classNames.shell`). `className` и `ref` у `TextArea.Control` попадают на `<textarea>` — тот же узел, что `classNames.control`.
- **Порядок мержа:** базовые стили → `classNames.slot` → `className` подчасти.
- **Мобильный шрифт контрола:** класс `field-control-mobile-no-zoom` стоит после слота намеренно — iOS зумит поле, если размер шрифта < 16px. Размер текста на `control` этим классом не перебить.

## Доступность

- `aria-describedby` через hint/error ids
- Resize handle: `aria-label` («Изменить высоту»); ArrowUp/Down (±16px), Home/End при фокусе на handle
- `error` или `invalid` ставят `aria-invalid`, пустой `data-invalid` на корне и danger-кольцо. `aria-required` — из `required`

## Структура файлов

```
TextArea/
├── TextArea.tsx                 # Root: карта motion
├── index.ts
├── textAreaTypes.ts
├── textAreaStyles.ts
├── textAreaAnimations.ts        # defaults + host play
├── textAreaContext.tsx          # createMotionScope
├── useTextAreaResize.ts         # pointer + keyboard resize (kit-internal height)
├── textAreaParts.tsx            # Control host + resizeHandle slot
├── useTextAreaRootState.ts
└── TextArea.stories.tsx
```

## Storybook

`Core Components/TextArea` — simple/compound, resizable, invalid, `classNames`, Slot motion, MotionController.
