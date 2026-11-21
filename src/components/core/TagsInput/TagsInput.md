# TagsInput

Поле из чипов. Текст фиксируется по Enter, запятой или снятию фокуса. Пустой Backspace снимает последний чип. Повтор и пустая строка не добавляются.

## Импорт

```tsx
import { TagsInput, type TagsInputProps, type TagsInputClassNames, type TagsInputMotion } from "burne-ui";
```

## API

```tsx
<TagsInput
  label="Topics"
  hint="Enter or a comma"
  placeholder="Add a tag"
  values={topics}
  onValuesChange={setTopics}
/>
```

`values` / `defaultValues` / `onValuesChange` — список строк. `max` останавливает добавление. `name` пишет скрытый input на каждый чип, Form получает массив.

### Compound

```tsx
<TagsInput values={topics} onValuesChange={setTopics}>
  <TagsInput.Label>Topics</TagsInput.Label>
  <TagsInput.Shell />
  <TagsInput.Hint>Enter or a comma</TagsInput.Hint>
</TagsInput>
```

### Root props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `label` / `hint` / `error` | — | Simple API |
| `invalid` | — | `aria-invalid` и `data-invalid`. `error` делает то же и показывает сообщение |
| `values` / `defaultValues` / `onValuesChange` | — | Список строк. Повтор и пустая строка не попадают в набор |
| `inputValue` / `defaultInputValue` | — | Черновик поля до Enter |
| `onInputValueChange` | — | `(value: string) => void` |
| `max` | — | Дальше чипы не добавляются |
| `name` | — | Скрытый input на каждый чип |
| `placeholder` | — | Поле ввода |
| `size` | `base` | `small` \| `base` \| `mid` \| `large` |
| `variant` | `default` | `default` \| `outline` \| `secondary` |
| `disabled` / `readOnly` / `required` | — | Как у поля |
| `classNames` | — | Слоты ниже |
| `motion` | — | `shell` / `tag` / `remove` / `control` / `label` / `hint` / `error`. `events` — app-команды |
| `motionController` | — | Handle scope корня. Слота `root` нет: `play()` skip, `playSlot("shell")` |

### `TagsInputClassNames`

`root`, `label`, `shell`, `tag`, `tagText`, `remove`, `control`, `hint`, `error`.

`className` и `ref` у `TagsInput.Shell` попадают на оболочку (тот же узел, что `classNames.shell`). Нативный `<input>` — `inputRef` и `classNames.control`.

### Compound-подчасти

| Часть | Роль |
|-------|------|
| `TagsInput.Label` | Подпись |
| `TagsInput.Shell` | Оболочка, чипы и поле |
| `TagsInput.Tag` | Чип |
| `TagsInput.Remove` | Кнопка снятия чипа (`value`) |
| `TagsInput.Hint` | Подсказка |
| `TagsInput.Error` | Сообщение ошибки |

## Поведение

`variant` — оболочка поля, как у Input: `default`, `outline`, `secondary`. На `secondary` чип красится в tertiary, на остальных — в secondary. `size` — высота: `small`, `base`, `mid`, `large`.

Поле: подпись через `aria-labelledby`. Кнопка чипа — `Remove {value}`. `aria-invalid` только от `invalid` / `error`. При `max` поле ввода выключено, снятые чипы снова его открывают.

## Анимации

### Slot motion

Хост — `shell`: тень в покое и подъём при наведении, как у Input. `tag`, `remove`, `control`, `label`, `hint`, `error` на том же scope. Повторные `tag` и `remove` — `ctx.getTargets("tag")`.

## MotionController

Слота `root` нет: `play()` skip. Simple API — `playSlot("shell")`. Чипы и кнопки снятия повторяются: `getTargets("tag")` / `getTargets("remove")`.

Проп `motionController` + ключ `events` на `motion` — app-команды (`tags:nudge`), не фазы. `createMotionEvents`. `waitForComplete` / `cancel` — playground / Storybook **MotionController**.

Тройка на корне, тот же scope. `motionState`, `motionPayload` и `playInitialState` не попадают на DOM. Смена `motionState` играет `motion.states[имя]`; то же имя ещё раз — тишина. `motionPayload` — снимок для фабрики (`ctx.payload`, `createMotionFactory`); без смены режима не переигрывает. `playInitialState` по умолчанию выключен: на маунте режим не играет.

```tsx
import { Button, TagsInput, createMotionEvents, useMotionControllerHandle } from "burne-ui";

const events = createMotionEvents({
  "tags:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1 },
});

function Nudge() {
  const controller = useMotionControllerHandle();
  return (
    <>
      <Button size="small" variant="outline" onClick={() => controller.playSlot("shell", "tags:nudge")}>
        Nudge
      </Button>
      <TagsInput label="Topics" motionController={controller} motion={{ events }} />
    </>
  );
}
```

## Доступность

- Подпись поля — `aria-labelledby` от видимого label.
- Кнопка чипа — accessible name `Remove {value}`.
- `aria-invalid` и `data-invalid` только от `invalid` / `error`.

## Структура файлов

```
TagsInput/
├── TagsInput.tsx              # Provider, scope
├── index.ts
├── tagsInputTypes.ts          # TagsInputMotion, classNames
├── tagsInputStyles.ts
├── tagsInputContext.tsx
├── tagsInputAnimations.ts     # слоты, host shell
├── tagsInputParts.tsx
├── tagsInputAPI.ts
├── tagsInputA11y.ts
├── useTagsInputRootState.ts
└── TagsInput.stories.tsx
```
