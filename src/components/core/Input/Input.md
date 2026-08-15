# Input

Текстовое поле с оболочкой (shell), affix-слотами, типами `text` / `number` / `password` / `file`. Simple и compound API. Интеграция с `Form`, `ButtonGroup`, `FieldLabelContext`.

## Импорт

```tsx
import { Input, type InputControlProps, type InputSimpleProps, type InputProps, type InputVariant, type InputStatus, type InputSize, type InputClassNames, type InputMotion, type InputPartMotion } from "burne-ui";
```

## API

### Compound

```tsx
<Input label="Email" hint="…" status="danger" required>
  <Input.Label>Email</Input.Label>
  <Input.Control type="email" autoComplete="email" />
  <Input.Hint>Формат: name@domain.tld</Input.Hint>
  <Input.Error>Некорректный адрес</Input.Error>
</Input>
```

| Часть | Назначение |
|-------|------------|
| `Input` / `Input.Root` | `Field` + context |
| `Input.Label` | Алиас `Label` |
| `Input.Control` | Shell + `<input>` |
| `Input.Hint` | Подсказка |
| `Input.Error` | Ошибка (`role="alert"`) |

### Simple API

```tsx
<Input
  label="Email"
  hint="Формат: name@domain.tld"
  error={invalid ? "Укажите корректный адрес." : undefined}
  status={invalid ? "danger" : "default"}
  required
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### `Input.Control` props (ключевые)

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `variant` | `default` | `default` \| `outline` \| `gloss` |
| `status` | `default` | `default` \| `danger` \| `success` \| `warning` |
| `size` | `base` | `small` \| `base` \| `mid` \| `large` |
| `inputType` | `text` | `text` \| `number` \| `password` \| `file` |
| `prefix` / `suffix` | — | Affix-слоты (не для `file`) |
| `groupSegment` | — | Сегмент `ButtonGroup` |
| `classNames` | — | См. ниже |
| `motion` | — | Карта слотов на Root / simple API; на `Input.Control` — part motion `shell` |

### `InputClassNames`

`root`, `label`, `shell`, `control`, `prefix`, `suffix`, `passwordToggle`, `fileArea`, `fileEmpty`, `fileRow`, `fileGlyph`, `filePreview`, `fileRemove`, `hint`, `error`.

### Типы поля (`inputType`)

| `inputType` | Особенности |
|-------------|-------------|
| `text` | Стандартный input |
| `number` | `type="number"` |
| `password` | Toggle visibility (`IoEye` / `IoEyeOff`) |
| `file` | Drag-area, preview, multi-file, remove с exit-анимацией |

## variant и status

| variant | Shell |
|---------|-------|
| `default` | `bg-surface border-token` |
| `outline` | прозрачный + `border-token-outline` |
| `gloss` | `gloss-control` |

При `status` danger/success/info/warning — нейтральный фон и border; постоянный внешний статусный ring (геометрия `--focus-ring-*`). Affix: `bg-primary-tint`.

## Размеры

Из `CONTROL_SIZE_LAYOUT`: `h-control-*`, `controlPad`, toggle icon/pad для password.

## Анимации

Публичный slot motion. Root передаёт карту `motion`; хост — `Input.Control` (defaults + `play`). Gloss hover/press остаются на `useGlossFieldShellMotion`. File row leave — рецепт `fileRowExit` (scale / y / autoAlpha).

### Slot motion

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `shell` | `hoverIn` / `hoverOut` / `pressIn` / `pressOut` | non-gloss: `hoverLiftSecondLevel`, `pressSqueeze` (`pressOut: false`). Gloss hover/press — `false` (field-shell) |
| `control` / `prefix` / `suffix` / `passwordToggle` / `fileRemove` | hover/press | нет |
| `fileRow` | `leave` | `fileRowExit` |

`false` на `fileRow.leave` — строка снимается сразу, без tween. `false` на `shell.hoverIn/Out` — rest-тень остаётся, lift не играет. Не анимируйте layout в публичных MotionVars.

**Где в коде:** типы — `inputTypes.ts`; scope — `inputContext.tsx`; defaults + host — `inputAnimations.ts`; слоты — `inputControlParts.tsx` / `inputAffixParts.tsx`; карта на Root — `Input.tsx`.

```tsx
<Input
  label="Email"
  motion={{
    shell: { hoverIn: false, hoverOut: false },
  }}
/>
```

Compound: `motion` на `Input.Control` — part motion слота `shell`.

**ButtonGroup:** при `groupSegment` shell hover/press выключены.

### Кастомизация

```ts
import { configureMotion } from "burne-ui";

configureMotion({
  hoverLiftScale: 1.025,
  hoverLiftEase: "sine.inOut",
  interactiveDuration: 280,
  enableHoverLift: true,
  enablePressSqueeze: true,
});
```

**Reduced motion / touch:** `shouldSkipInteractiveHoverLift()`.

Resize/file geometry не в публичных vars. Password toggle и file remove — публичные слоты (можно factory на hover).

## Интеграция

| Контекст | Поведение |
|----------|-----------|
| `Form` | `error` из `getError(name)`, `size`, `disabled` |
| `ButtonGroup` | `groupSegment`, `variant` gloss, без shell hover |
| `FieldLabelContext` | auto `htmlFor`, `labelId`, `required` |

## Стилизация и кастомизация

### Два уровня

1. **`className` на root** — дополнительные классы на обёртку `Field` (мержатся с `classNames.root`).
2. **`classNames` на root** — точечные слоты через `InputClassNamesProvider`; все подчасти читают контекст.

В compound API слоты из root `classNames` применяются ко всем частям. Дополнительно каждая подчасть принимает свой **`className`**, который мержится поверх слота контекста через `cn`.

### Слоты `InputClassNames`

| Слот | DOM / элемент | Когда использовать |
|------|---------------|-------------------|
| `root` | `Field` | Отступы, max-width, рамка вокруг всего поля |
| `label` | `Label` (simple и `Input.Label`) | Типографика, отступ label |
| `shell` | `[data-slot="input-shell"]` | Оболочка: ring, border, min-height, hover/focus (осторожно с motion-классами) |
| `control` | `<input>` | Шрифт, placeholder, padding внутри shell |
| `prefix` / `suffix` | Affix-слоты | Фон иконки, отступы affix |
| `passwordToggle` | Кнопка показа пароля | Размер hit-area, цвет иконки |
| `fileArea` | Контейнер file UI | Layout drag-zone / списка |
| `fileEmpty` | Пустая зона + иконка | Dashed-area, текст «Select file» |
| `fileRow` | Строка выбранного файла | Gap, padding строки |
| `filePreview` | `<img>` preview | Размер превью |
| `fileGlyph` | Иконка файла без preview | Размер glyph |
| `fileRemove` | Кнопка удаления файла | Hit-area remove |
| `hint` / `error` | `Field.Hint` / `Field.Error` | Цвет, размер подсказки/ошибки |

`variant`, `status`, `size` задают базовые токены в `inputStyles.ts`. `classNames` **дополняют** их, не отменяя variant-логику (кроме явного override Tailwind-классами).

### Simple API

Все props поля и control — на одном `Input`. Стили слотов — через `classNames` на root:

```tsx
<Input
  className="max-w-sm"
  classNames={{
    root: "rounded-mid border border-primary/20 p-base",
    shell: "ring-1 ring-primary/15",
    control: "text-primary placeholder:text-primary/50",
    prefix: "bg-surface-elevated text-muted",
    hint: "text-foreground/70",
    error: "font-medium",
  }}
  label="Email"
  placeholder="you@example.com"
  prefix={<IoSearch aria-hidden />}
  status="danger"
  hint="Мы не передаём адрес третьим лицам."
  error="Введите корректный email."
/>
```

Для `inputType="file"` дополнительно: `fileArea`, `fileEmpty`, `fileRow`, `filePreview`, `fileRemove`.

### Compound API

`classNames` на root + **`className` на каждой части** для локальных правок. Можно менять порядок и оборачивать части:

```tsx
<Input
  status="danger"
  required
  classNames={{
    root: "max-w-md gap-small",
    shell: "border-primary/30",
    hint: "text-xs",
  }}
>
  <Input.Label className="uppercase tracking-wide">
    Email
  </Input.Label>

  <div className="relative">
    <Input.Control
      className="pr-xlarge"
      placeholder="you@example.com"
      prefix={<IoMail aria-hidden />}
    />
  </div>

  <Input.Hint>Служебный адрес</Input.Hint>
  <Input.Error className="text-danger">Некорректный формат</Input.Error>
</Input>
```

`Input.Label` также принимает вложенные `classNames` компонента `Label` (`root`, `text`, `required`) — они мержатся с `classNames.label` из контекста Input.

`Input.Control` наследует `variant`, `status`, `size` из field context (или props). Affix (`prefix` / `suffix`) — только на `Control`.

### Практические заметки

- **Shell vs control:** тень и hover-lift вешаются на `shell`; текст и caret — на `control`.
- **Gloss:** не переопределяйте `gloss-control` на shell без необходимости — ломается gloss motion.
- **ButtonGroup:** при `groupSegment` shell hover отключён; стили сегмента задаёт группа.
- **Порядок мержа:** `базовые стили` → `classNames.slot` → `className` на подчасти.

## Доступность

- `joinFieldDescribedBy(hintId, errorId)` на control
- `aria-invalid` при `status="danger"`
- `aria-required` из `required`
- Password toggle: `aria-label`, `aria-pressed`
- File remove: `aria-label`

## Структура файлов

```
Input/
├── Input.tsx                 # Root: карта motion (без defaults)
├── index.ts
├── inputTypes.ts
├── inputStyles.ts
├── inputAnimations.ts        # defaults + host play (hover / press / fileRow leave)
├── inputContext.tsx          # field + classNames + createMotionScope
├── inputControlParts.tsx     # Control host + nested Provider
├── inputAffixParts.tsx       # prefix/suffix/passwordToggle/fileRow/fileRemove
├── inputFieldParts.tsx
├── inputSimpleParts.tsx
├── useInputRootState.ts
├── inputAPI.ts
├── inputA11y.ts
└── Input.stories.tsx
```

## Storybook

`Core Components/Input` — simple/compound, variant, status, password, file, gloss, ButtonGroup segment, `classNames`, slot motion gallery.
