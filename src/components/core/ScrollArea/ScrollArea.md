# ScrollArea

Область с собственной полосой прокрутки. Нативный скроллбар скрыт. Simple API кладёт детей во viewport и рисует полосы по `orientation`. Compound — `Viewport`, `Scrollbar`, `Thumb`, `Corner`.

## Импорт

```tsx
import { ScrollArea, type ScrollAreaProps, type ScrollAreaClassNames, type ScrollAreaMotion } from "burne-ui";
```

## API

### Simple API

```tsx
<ScrollArea aria-label="Cities" className="h-48 w-64">
  <p>Long list</p>
</ScrollArea>
```

Высоту и ширину задаёт вызывающий код. По умолчанию полоса вертикальная и появляется при наведении или фокусе.

### Compound API

```tsx
<ScrollArea aria-label="Notes" className="h-48 w-64" orientation="both">
  <ScrollArea.Viewport>
    <p>Wide and tall</p>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical" />
  <ScrollArea.Scrollbar orientation="horizontal">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
  <ScrollArea.Corner />
</ScrollArea>
```

`Scrollbar` без `Thumb` рисует бегунок сам. `orientation` на корне говорит viewport, по каким осям пускать переполнение. Полосы в compound ставятся вручную.

### Root props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `visibility` | `hover` | `hover` — под курсором или в фокусе. `scroll` — пока идёт прокрутка. `always` — пока контент не помещается |
| `orientation` | `vertical` | `vertical` \| `horizontal` \| `both`. Simple API. Доменное имя оси, не канон `variant` |
| `scrollHideDelay` | `600` | Сколько мс `scroll` держит полосу после последнего движения |
| `aria-label` / `aria-labelledby` | — | Имя viewport. На корне не остаётся |
| `classNames` | — | см. стилизацию |
| `motion` | — | Карта слотов + `events`. Хост — корень |
| `motionController` | — | На корне, тот же scope. Не на DOM |

Колёсико и тач скроллят viewport. Перетаскивание бегунка и клик по дорожке двигают ту же ось. На полосе стрелки, Page Up / Page Down, Home и End. В RTL горизонтальные стрелки идут к логическому концу.

### `ScrollAreaClassNames`

`root`, `viewport`, `scrollbar`, `thumb`, `corner`.

### Compound-подчасти

| Часть | Роль |
|-------|------|
| `ScrollArea.Viewport` | Прокручиваемый блок. Колёсико и тач |
| `ScrollArea.Scrollbar` | Дорожка оси. `role="scrollbar"`, tab stop, пока контент не помещается |
| `ScrollArea.Thumb` | Бегунок. Позиция — внутренний протокол, не слот-анимация |
| `ScrollArea.Corner` | Квадрат на стыке двух полос |

## Поведение

Полоса: `data-orientation` `vertical` \| `horizontal`, `data-state` `active` \| `inactive`. `active` — полоса видна. Пока контент помещается, полоса `hidden` и вне tab sequence. Прозрачность полосы — канал показа и скрытия. Анимация бегунка — `transform` (`y`, `scale`), не `opacity`.

Обёртка контента внутри viewport не слот: при `horizontal` и `both` она `w-max`, чтобы ряд мог быть шире окна.

## Анимации

### Slot motion

Хост — корень. Слоты: `root`, `viewport`, `scrollbar`, `thumb`, `corner`. У каждой оси свой `scrollbar` и `thumb`. `enter` играет при появлении, если фаза задана. Повторные слоты — `ctx.getTargets("thumb")`. Китовых рецептов наведения нет: показ полосы делает `visibility`.

## Файлы

`ScrollArea.tsx` держит scope. Рецепты слотов — `scrollAreaAnimations.ts`. Геометрия бегунка — `scrollAreaAPI.ts`.
