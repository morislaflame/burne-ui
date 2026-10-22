# ContextMenu

Меню по правому клику. То же меню, что у `Dropdown`: пункты, группы, submenu. Панель встаёт у курсора, а не по ширине триггера.

## Импорт

```tsx
import { ContextMenu, type ContextMenuProps, type ContextMenuClassNames } from "burne-ui";
```

## API

```tsx
<ContextMenu>
  <ContextMenu.Trigger>Right-click</ContextMenu.Trigger>
  <ContextMenu.Popover>
    <ContextMenu.Item>Copy</ContextMenu.Item>
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger>Share</ContextMenu.SubTrigger>
      <ContextMenu.SubPopover>
        <ContextMenu.Item>Mail</ContextMenu.Item>
      </ContextMenu.SubPopover>
    </ContextMenu.Sub>
  </ContextMenu.Popover>
</ContextMenu>
```

`ContextMenu.Item` по умолчанию действие: `selection={false}`, выбор закрывает меню. Индикатор выбора — явный `selection` и `ContextMenu.ItemIndicator`, как у Dropdown.

Триггер без `asChild` — фокусируемый `div`. Правый клик и клавиши Context Menu / Shift+F10 открывают меню и глушат системное. Левый клик меню не открывает. Закрытие, клавиатура внутри меню и submenu — поведение `Dropdown`.

### Root props

Тип корня — `DropdownProps`. Пункты, группы и submenu — те же пропы, что у `Dropdown`.

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `open` / `defaultOpen` | `false` | Открыто меню |
| `onOpenChange` | — | `(open: boolean) => void` |
| `multiple` | `false` | Несколько выбранных |
| `value` / `defaultValue` | — | `string` или `string[]` |
| `onValueChange` | — | Колбэк выбора |
| `closeOnSelect` | `!multiple` | Закрыть после выбора |
| `variant` | `default` | Поверхность меню: `default` \| `outline` \| `secondary`. Панель `variant` побеждает |
| `portalContainer` | — | Куда порталить панель |
| `classNames` | — | Слоты, те же ключи, что `DropdownClassNames` |
| `motion` | — | Карта слотов `Dropdown`. На корне или на `ContextMenu.Popover` |
| `motionController` | — | Для панели — на `ContextMenu.Popover`, не на DOM |

Если `open` задан без правого клика, якорь встаёт у нижнего края триггера.

### `ContextMenu.Popover`

`side` (`bottom`), `align` (`start`), `offset` (`4`). Ширина панели не равна якорю: якорь — точка `0×0` в координатах курсора. Тип — `ContextMenuPopoverProps`.

### Compound-подчасти

| Часть | Роль |
|-------|------|
| `ContextMenu.Trigger` | Правый клик и Context Menu / Shift+F10. `asChild` — на фокусируемом потомке |
| `ContextMenu.Popover` | Панель у курсора |
| `ContextMenu.Item` | Пункт. По умолчанию `selection={false}` |
| `ContextMenu.ItemLabel` / `ItemHint` / `ItemIcon` | Слоты строки |
| `ContextMenu.ItemIndicator` | Индикатор выбора |
| `ContextMenu.Group` / `Label` / `Separator` | Группа |
| `ContextMenu.Sub` / `SubTrigger` / `SubContent` | Подменю. Хост подменю остаётся `SubContent` |

### `ContextMenuClassNames`

`root`, `trigger`, `popover`, `popoverBody`, `group`, `label`, `separator`, `item`, `itemLabel`, `itemHint`, `itemIcon`, `itemIndicator`, `itemIndicatorShell`, `itemIndicatorFill`, `itemIndicatorMark`, `sub`, `subTrigger`, `subTriggerLabelWrap`, `subTriggerIcon`, `subPopover`, `subPopoverBody`.

Слоты те же, что у `DropdownClassNames`. Слот motion панели — `content`, слот класса панели — `popover`.

## data-*

| Где | Атрибут |
|-----|---------|
| Триггер | `data-state` `open` \| `closed` |
| Панель | тот же `data-state`, что у `Dropdown.Popover` |

Пункты, группы и submenu несут контракт `Dropdown`.

## Анимации

Своего scope у `ContextMenu` нет: корень рендерит `Dropdown` и отдаёт ему `motion`. Рецепты панели, пунктов и submenu — таблица `Dropdown`. Триггер `ContextMenu.Trigger` слот `trigger` не регистрирует.

## MotionController

Ручка меню — на `ContextMenu.Popover`. Слота `root` у панели нет: `play()` без слота пропускается. Пункт — `playSlot("item")`, все живые пункты — `playAll`. Подменю — ручка на `ContextMenu.SubPopover`.

Тройка на корне уходит в Dropdown. На `ContextMenu.Popover` и `ContextMenu.SubPopover` — scope панели. `motionState`, `motionPayload` и `playInitialState` не попадают на DOM. Смена `motionState` играет `motion.states[имя]`; то же имя ещё раз — тишина. `motionPayload` — снимок для фабрики (`ctx.payload`, `createMotionFactory`); без смены режима не переигрывает. `playInitialState` по умолчанию выключен: на маунте режим не играет.

```tsx
const menu = useMotionControllerHandle();

<ContextMenu.Popover motionController={menu} />
```

## Доступность

- Триггер: `aria-expanded`, `aria-haspopup="menu"`, `aria-controls` на открытую панель. Без `asChild` это фокусируемый `div` (`tabIndex={0}`).
- Левый клик меню не открывает. Правый клик и клавиши Context Menu / Shift+F10 открывают и глушат системное меню.
- Панель, пункты, группы, typeahead и возврат фокуса — поведение `Dropdown`.
- `asChild`: потомок должен принимать фокус. Нефокусируемая иконка без `tabIndex` из Tab sequence выпадает.

## Структура файлов

```
ContextMenu/
├── ContextMenu.tsx          # триггер, якорь у курсора, Popover → Dropdown.Popover
├── index.ts                 # compound: Popover, пункты Dropdown, SubContent
├── contextMenuTypes.ts      # ContextMenuProps = DropdownProps, ContextMenuPopoverProps
├── contextMenuContext.tsx   # якорь
├── contextMenuAPI.ts        # жест и позиция якоря
├── contextMenuStyles.ts
├── contextMenu.test.tsx
├── ContextMenu.stories.tsx
└── ContextMenu.md
```

Анимации панели живут в `Dropdown/` (`dropdownAnimations.ts`).
