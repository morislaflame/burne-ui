# HoverCard

Карточка по наведению и фокусу. Позиция, портал, стрелка и закрытие снаружи — `Popover`. Клик по якорю карточку не переключает.

Указатель может перейти с якоря на панель: `closeDelay` (300 мс) покрывает зазор. Вход на панель отменяет закрытие. `Escape` закрывает. Фокус на якорь возвращается, только если он был внутри карточки (`Popover` `restoreFocus={false}`, иначе уход курсора фокусировал бы якорь).

## Simple

```tsx
<HoverCard trigger={<Button>Ada Lovelace</Button>} title="Ada Lovelace" description="Mathematician">
  <Button>View profile</Button>
</HoverCard>
```

`trigger` — якорь. `title` / `description` — шапка. `children` — тело. `HoverCard.Trigger` в детях включает compound и эти пропы не используются.

## Compound

```tsx
<HoverCard>
  <HoverCard.Trigger>
    <Button>Ada Lovelace</Button>
  </HoverCard.Trigger>
  <HoverCard.Content>
    <HoverCard.Arrow />
    <HoverCard.Header>
      <HoverCard.Title>Ada Lovelace</HoverCard.Title>
      <HoverCard.Description>Mathematician</HoverCard.Description>
    </HoverCard.Header>
    <HoverCard.Body>
      <Button>View profile</Button>
    </HoverCard.Body>
  </HoverCard.Content>
</HoverCard>
```

`HoverCard.Arrow` — прямой ребёнок `Content` (как `Popover.Arrow`).

## Root props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `trigger` / `title` / `description` | — | Simple API |
| `showArrow` | `true` | Стрелка simple API |
| `side` | `bottom` | Сторона панели |
| `size` | `base` | `small` \| `base` \| `mid` \| `large` |
| `variant` | `default` | Уходит в Popover |
| `open` / `defaultOpen` / `onOpenChange` | закрыто | Открытие |
| `openDelay` | `400` | Пауза перед открытием |
| `closeDelay` | `300` | Пауза перед закрытием |
| `shouldDismiss` | — | Veto outside `pointerdown` |
| `portalContainer` | `document.body` | Портал |
| `classNames` | — | Слоты панели Popover |
| `motion` | — | `trigger` на scope HoverCard. Остальные слоты — портал `HoverCard.Content` |
| `motionController` | — | Handle портала. `play()` пропускается: слота `root` нет. `playSlot` |

### `HoverCardClassNames`

`root`, `trigger`, `content`, `panelRelative`, `panel`, `arrow`, `header`, `title`, `description`, `body`.

### Слоты motion

| Слот | Где играет | Фазы |
|------|------------|------|
| `trigger` | Якорь, scope HoverCard | `hoverIn` / `hoverOut` / `pressIn` / `pressOut` / `enter` / `leave` |
| `content` | Портал Popover, хост `HoverCard.Content` | enter / leave панели (`portalSurfaceEnter` / `portalSurfaceLeave`) |
| `header` | Шапка | enter / leave |
| `title` | Заголовок | hover и enter |
| `description` | Подпись | hover и enter |
| `body` | Тело | enter / leave |
| `arrow` | Стрелка | hover и enter |

`events` и `states` — соседи слотов, не ключи `HoverCardMotion`.

## Поведение

`size` — отступы, кегль и ширина панели, как у Popover: `small`, `base`, `mid`, `large`. `variant` уходит в Popover; в ките это `default`.

- `pointerenter` / фокус на якоре запускают `openDelay`. Уход до открытия отменяет таймер.
- Уход с якоря или панели запускает `closeDelay`. Вход на другую сторону сбрасывает его.
- Клик по якорю не закрывает и не открывает.
- `pointerdown` снаружи и `Escape` закрывают сразу.
- Якорь: `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls` на открытую панель. `data-state` `open` / `closed`.

## Файлы

```
HoverCard/
├── HoverCard.tsx
├── hoverCardParts.tsx       # Trigger, Content, Escape; Title/Body — части Popover
├── hoverCardAnimations.ts   # слот trigger
├── hoverCardContext.tsx
├── useHoverCardRootState.ts # openDelay / closeDelay
├── hoverCardAPI.ts
├── hoverCardA11y.ts
├── hoverCardStyles.ts
└── hoverCardTypes.ts
```
