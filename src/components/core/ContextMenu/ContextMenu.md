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
  <ContextMenu.Content>
    <ContextMenu.Item>Copy</ContextMenu.Item>
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger>Share</ContextMenu.SubTrigger>
      <ContextMenu.SubContent>
        <ContextMenu.Item>Mail</ContextMenu.Item>
      </ContextMenu.SubContent>
    </ContextMenu.Sub>
  </ContextMenu.Content>
</ContextMenu>
```

`ContextMenu.Item` по умолчанию действие: `selection={false}`, выбор закрывает меню. Индикатор выбора — явный `selection` и `ContextMenu.ItemIndicator`, как у Dropdown.

Триггер без `asChild` — фокусируемый `div`. Правый клик и клавиши Context Menu / Shift+F10 открывают меню и глушат системное. Левый клик меню не открывает. Закрытие, клавиатура внутри меню и submenu — поведение `Dropdown`.

### Root props

Те же, что у `Dropdown`: `open` / `defaultOpen` / `onOpenChange`, `multiple`, `value` / `defaultValue` / `onValueChange`, `closeOnSelect`, `popoverVariant`, `portalContainer`, `classNames`, `motion`, `motionController`.

`motion` — карта слотов `Dropdown` (`content`, `item`, `itemIcon`, `label`, `separator`, `subTrigger`, `subContent`). Её можно передать на корень или на `ContextMenu.Content`. Ручка `motionController` для меню — на `ContextMenu.Content`: `play()` без слота `root` пропускается, пункты играются через `playSlot` / `playAll`. Если `open` задан без правого клика, якорь встаёт у нижнего края триггера.

### `ContextMenu.Content`

`side` (`bottom`), `align` (`start`), `offset` (`4`). Ширина панели не равна якорю: якорь — точка `0×0` в координатах курсора.

### `ContextMenuClassNames`

`root`, `trigger`, `popover`, `popoverBody`, `group`, `label`, `separator`, `item`, `itemLabel`, `itemHint`, `itemIcon`, `itemIndicator`, `itemIndicatorShell`, `itemIndicatorFill`, `itemIndicatorMark`, `sub`, `subTrigger`, `subTriggerLabelWrap`, `subTriggerIcon`, `subPopover`, `subPopoverBody`.

Слоты те же, что у `DropdownClassNames`.
