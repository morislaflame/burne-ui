# Avatar

Аватар пользователя с изображением, fallback-буквой, tooltip по `nickname`, `variant="gloss"` и группировкой через `Avatar.Group`. Есть Simple API (`src`, `label`) и compound API (`Avatar.Image`, `Avatar.Fallback`).

## Импорт

```tsx
import { Avatar, type AvatarProps, type AvatarClassNames, type AvatarSize, type AvatarImageProps, type AvatarFallbackProps, type AvatarGroupProps, type AvatarMotion, type AvatarPartMotion } from "burne-ui";
```

## API

### Simple API

```tsx
<Avatar
  size="base"
  label="Grace Hopper"
  src={avatarUrl}
  alt=""
  loading="lazy"
  nickname="grace_h"
/>
```

Если `src` не передан или изображение не загрузилось, показывается fallback из первой буквы `label`.

### Compound API

```tsx
<Avatar size="base" label="Grace Hopper" nickname="grace_h">
  <Avatar.Image src={avatarUrl} alt="" loading="lazy" />
  <Avatar.Fallback />
</Avatar>
```

Кастомный fallback:

```tsx
<Avatar size="base" label="Design System">
  <Avatar.Fallback>DS</Avatar.Fallback>
</Avatar>
```

### Avatar.Group

```tsx
<Avatar.Group>
  <Avatar size="base" label="Один" src={one} alt="" />
  <Avatar size="base" label="Два" src={two} alt="" />
  <Avatar size="base" label="Плюс пять" nickname="+5" />
</Avatar.Group>
```

### Props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `variant` | `default` | `default` \| `gloss` |
| `size` | `base` | `small` \| `base` \| `mid` \| `large` |
| `label` | — | Источник fallback-инициалов (видимый); не form-лейбл |
| `aria-label` | — | Accessible name; если нет — берётся trimmed `label` |
| `src` | — | Image URL для Simple API |
| `alt` | `""` | Alt image; обычно пустой, так как root уже имеет accessible name |
| `loading` | — | `img.loading` |
| `nickname` | — | Tooltip content |
| `tooltipSize` | `base` | Размер tooltip |
| `tooltipVariant` | `default` | Вариант tooltip |
| `tooltipSide` | `top` | Сторона tooltip |
| `className` | — | Root shell (в gloss — внутренний круг) |
| `classNames` | — | Слоты компонента |
| `motion` | — | Карта слотов `root` / `image` / `fallback`; на `Avatar.Group` — `groupItem` |

### `AvatarClassNames`

`root`, `image`, `fallback`, `group`, `groupItem`, `glossWrap`.

## Variant / размеры

### Variant

| Variant | Поверхность |
|---------|-------------|
| `default` | `rounded-full bg-surface border-token` |
| `gloss` | `gloss-wrap` + `gloss-panel` + `gloss-shadow` |

### Sizes

`small`, `base`, `mid`, `large` мапятся на классы `avatar-size-*`. Эти токены задают размер root, image и fallback.

Fallback typography:

| Size | Text variant |
|------|--------------|
| `small` | `small` |
| `base` | `base` |
| `mid` | `mid` |
| `large` | `header-2` |

## Анимации

Публичный slot motion. Image fade — `contentFade` на `image.enter` / `leave`. Group hover — nested scope на wrap каждого item.

### Slot motion

| Слот | Фазы | Дефолтный рецепт |
|------|------|------------------|
| `root` | `hoverIn` / `hoverOut` | нет |
| `image` | `enter` / `leave` | `contentFade` |
| `fallback` | `hoverIn` / `hoverOut` | нет |
| `groupItem` | `hoverIn` / `hoverOut` | `{ y: -10, scale: 1.08 }` / rest (на `Avatar.Group`) |

`glossWrap` — layout-обёртка, не публичный motion-слот. `false` на `image.enter` / `leave` — хост ставит instant visible/hidden.

**Где в коде:** типы — `avatarTypes.ts`; scope — `avatarContext.tsx`; defaults + host play — `avatarAnimations.ts`; слоты — `avatarParts.tsx`; Provider — `Avatar.tsx`. Каждый item в `Avatar.Group` — nested `AvatarMotionProvider`.

```tsx
<Avatar src={url} label="Ada" motion={{ image: { enter: false, leave: false } }} />

<Avatar.Group motion={{ groupItem: { hoverIn: { y: -14, scale: 1.12 }, hoverOut: { y: 0, scale: 1 } } }}>
  <Avatar label="A" />
  <Avatar label="B" />
</Avatar.Group>
```

### Отключение

```ts
configureMotion({ enableContentFade: false });
```

### Чего нет

- Press squeeze на avatar
- Hover lift на одиночном avatar (только group stack)
- Ripple
- Portal motion (кроме auto Tooltip по `nickname`)

## Токены и CSS

| Класс / токен | Назначение |
|---------------|------------|
| `AVATAR_ROOT_CLASS` | Круг, `overflow-hidden`, size per prop |
| `AVATAR_FALLBACK_CLASS` | Initials / placeholder bg |
| `AVATAR_IMAGE_CLASS` | `object-cover`, start `opacity-0` до fade |
| gloss wrap layers | Outer ring/shadow в `variant="gloss"` |
| `groupItem` negative margin | Stack overlap в `Avatar.Group` |

## Стилизация и кастомизация

### Два уровня

1. **`className` на `Avatar`** — root shell. В `variant="gloss"` попадает на внутренний круг.
2. **`classNames` на root** — слоты root/image/fallback; `Avatar.Group` — `group`/`groupItem`.

### Слоты `AvatarClassNames`

| Слот | DOM | Когда использовать |
|------|-----|-------------------|
| `root` | Avatar circle | Ring, border, fallback color |
| `image` | `img` | Object-fit, filters, opacity helpers |
| `fallback` | Fallback span | Initials bg/text |
| `group` | `Avatar.Group` root | Gap, justify stack |
| `groupItem` | Group item wrapper | Overlap margin, lift target |
| `glossWrap` | Outer gloss wrapper | Ring/padding вокруг gloss circle |

### Simple (src + label)

```tsx
<Avatar
  variant="gloss"
  size="mid"
  label="Андрей"
  src={avatarUrl}
  alt=""
  classNames={{
    root: "border border-info/40",
    glossWrap: "p-0.5 ring-1 ring-info/30 rounded-full",
  }}
/>
```

### Compound (custom fallback)

```tsx
<Avatar
  size="base"
  label="Design System"
  classNames={{
    root: "bg-primary/10 text-primary",
    fallback: "bg-primary/15",
  }}
>
  <Avatar.Fallback>DS</Avatar.Fallback>
</Avatar>
```

### Group stack

```tsx
<Avatar.Group
  classNames={{
    group: "justify-center",
    groupItem: "-ml-small",
  }}
>
  <Avatar label="A" />
  <Avatar label="B" />
</Avatar.Group>
```

### Практические заметки

- Декоративная картинка: `alt=""`; имя — через `aria-label` (или fallback из `label`).
- `nickname` auto-wrap в `Tooltip` (portal motion из Tooltip.md).
- Gloss: `classNames.root` на inner circle, `glossWrap` на outer shell.
- **Не `overflow-visible` на root** — image выйдет за круг.
- **Не `opacity` на `image` в CSS** — конфликт с fade GSAP.

## Интеграции

| Компонент | Использование |
|-----------|---------------|
| `Tooltip` | Автоматически при `nickname` |
| `Badge.Anchor` | Наложение статуса/счётчика на avatar |
| `Avatar.Group` | Stack + hover lift |

## Доступность

- Root avatar: `role="group"`
- `aria-label` — явный проп; иначе trimmed `label` (источник инициалов)
- `Avatar.Group`: `role="group"`
- Fallback: `aria-hidden`
- Image `alt` по умолчанию `""`; accessible name на root
- Tooltip trigger получает тот же root

## Структура файлов

```
Avatar/
├── Avatar.tsx
├── index.ts
├── avatarTypes.ts
├── avatarStyles.ts
├── avatarAnimations.ts             # defaults + host play
├── avatarContext.tsx               # createMotionScope
├── avatarParts.tsx
├── useAvatarRootState.ts
├── avatarAPI.ts
├── avatarA11y.ts
└── Avatar.stories.tsx
```

## Storybook

`Core Components/Avatar` — Simple/Compound, размеры, fallback, broken image, group lift, nickname tooltip, gloss, light theme, `classNames`, slot motion gallery.
