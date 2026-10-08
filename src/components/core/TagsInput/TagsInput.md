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
  <TagsInput.Control />
  <TagsInput.Hint>Enter or a comma</TagsInput.Hint>
</TagsInput>
```

### `TagsInputClassNames`

`root`, `label`, `shell`, `tag`, `remove`, `input`, `hint`, `error`.

### Compound-подчасти

| Часть | Роль |
|-------|------|
| `TagsInput.Label` | Подпись |
| `TagsInput.Control` | Оболочка, чипы и поле |
| `TagsInput.Hint` | Подсказка |
| `TagsInput.Error` | Сообщение ошибки |

## Поведение

`variant` — оболочка поля, как у Input: `default`, `outline`, `secondary`. На `secondary` чип красится в tertiary, на остальных — в secondary. `size` — высота: `small`, `base`, `mid`, `large`.

Поле: подпись через `aria-labelledby`. Кнопка чипа — `Remove {value}`. `aria-invalid` только от `invalid` / `error`. При `max` поле ввода выключено, снятые чипы снова его открывают.

## Анимации

### Slot motion

Хост — `shell`: тень в покое и подъём при наведении, как у Input. `tag`, `remove`, `input`, `label`, `hint`, `error` на том же scope. Повторные `tag` и `remove` — `ctx.getTargets("tag")`.

## Файлы

`TagsInput.tsx` держит scope. Рецепты слотов — `tagsInputAnimations.ts`.
