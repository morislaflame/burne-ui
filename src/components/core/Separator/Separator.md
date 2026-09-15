# Separator

Визуальный разделитель горизонтальный или вертикальный. Leaf-компонент на border-токенах темы. Публичный slot motion — opt-in (пустые defaults).

## Импорт

```tsx
import { Separator, type SeparatorProps, type SeparatorOrientation } from "burne-ui";
```

## API

### Базовое использование

```tsx
<Separator />

<Separator orientation="vertical" />

<Separator className="my-large border-primary/30" />
```

Compound API нет.

### Props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `orientation` | `horizontal` | `horizontal` \| `vertical` |
| `className` | — | Дополнительные классы |
| `motion` | — | Per-slot (`root`). `events` — app-команды `MotionController` |
| `motionController` | — | Handle с `createMotionController()` / `useMotionControllerHandle()`, не на DOM |
| HTML props | — | Пробрасываются на root element |

## Ориентация и DOM

| Orientation | Element | Стили |
|-------------|---------|-------|
| `horizontal` | `<hr>` | `h-0 w-full border-t-token my-xsmall` |
| `vertical` | `<div role="separator">` | `w-0 min-h-[1.5rem] border-l-token mx-xsmall self-stretch` |

Общие классы: `box-border shrink-0`.

## Анимации

### Slot motion

| Слоты | Фазы | Дефолт |
|-------|------|--------|
| `root` | `enter` / hover / press (opt-in) | empty |

Свой scope на корне. Один DOM-слот — `play()` ищет `root`. Нет `play vs playSlot` / stagger / exclude.

`false` на фазе — skip без kill и без смены визуала. Не анимируйте layout (`width` / `height` / `top` / `left` / `margin`) в публичных MotionVars. Кастомный `motion` — opt-in: без пропа дефолтный вид не меняется.

Проп `motionController` + ключ `events` на `motion` — app-команды (`sep:nudge`, `sep:pulse`), не фазы. `createMotionEvents`. `waitForComplete` / `cancel` — playground / Storybook **MotionController**.

```tsx
import { Button, Separator, createMotionEvents, useMotionControllerHandle } from "burne-ui";

const events = createMotionEvents({
  "sep:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1 },
});

function Nudge() {
  const controller = useMotionControllerHandle();
  return (
    <>
      <Button size="small" variant="outline" onClick={() => controller.play("sep:nudge")}>
        Nudge
      </Button>
      <Separator className="w-full" motionController={controller} motion={{ events }} />
    </>
  );
}
```


Без пропа `motion` GSAP не играет — opt-in slot motion с пустыми defaults.

### Сводка

| Анимация | GSAP | `configureMotion` |
|----------|------|-------------------|
| Render | Нет | — |
| Slot motion / MotionController | Opt-in | — |

## Стилизация и кастомизация

### Один уровень

Только **`className`**. Отдельного `classNames` нет.

```tsx
<Separator className="border-dashed opacity-60" />

<Separator
  orientation="vertical"
  className="mx-mid min-h-[2rem] border-l-2 border-info/40"
/>
```

### Практические заметки

- Для горизонтального разделителя в flex-row используйте `orientation="vertical"`.
- Цвет линии — через border utilities (`border-primary/20`) или токен `border-token`.
- В списках/меню часто комбинируется с `Surface` и `Card.Footer`.
- `horizontal` использует нативный `<hr>` — учитывайте reset стилей браузера (у нас border-based).

## Интеграции

| Компонент | Сценарий |
|-----------|----------|
| `Card` | Разделение секций внутри body/footer |
| `Surface` | Разделители в stacked panels |
| `Dropdown` | Визуальные group separators (отдельный `Dropdown.Separator`) |

## Доступность

- **Horizontal:** нативный `<hr>` — семантический thematic break
- **Vertical:** `role="separator"` + `aria-orientation="vertical"`
- Декоративный разделитель без смысловой паузы — можно добавить `aria-hidden` через props

## Структура файлов

```
Separator/
├── Separator.tsx
└── index.ts
```

Storybook: `Core Components/Separator` — playground, Slot motion, MotionController. Также dependency в `Card` / `Surface`.
