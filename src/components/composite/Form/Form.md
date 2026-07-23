# Form

Composite-обёртка над `<form>`: state machine (values, errors, touched, submit), привязка полей по `name`, валидация и a11y announce. **Только compound API** — layout из `Title`, `Section`, `Field`, `Actions`.

## Импорт

```tsx
import { Form, useFormField, type FormProps, type FormSectionProps, type FormClassNames, type FormValues, type FormFieldRules, type FormResolver, type FormValidateMode } from "burne-ui";
```

Расширенный API (для авторов контролов) — из `@/components/composite/Form`: `useFormControlProps`, `useFormFieldBinding`, `useFormBindingContext`.

## API

### Compound API

```tsx
<Form
  aria-label="Профиль"
  defaultValues={{ name: "", email: "" }}
  rules={{
    name: { required: "Введите имя" },
    email: { required: true, pattern: { value: /\S+@\S+/, message: "Некорректный email" } },
  }}
  onSubmit={(values) => console.log(values)}
>
  <Form.Title>Профиль</Form.Title>
  <Form.Description>Обновите данные аккаунта.</Form.Description>
  <Form.Section>
    <Form.Field name="name">
      <Input name="name" label="Имя" required />
    </Form.Field>
    <Form.Field name="email">
      <Input name="email" label="Email" type="email" />
    </Form.Field>
  </Form.Section>
  <Form.Actions>
    <Button type="submit">Сохранить</Button>
  </Form.Actions>
</Form>
```

`FormRoot` автоматически рендерит `<Form.Announce>` и `<Form.ErrorSummary>` — **не дублируйте** в children.

### Root props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `defaultValues` | `{}` | Начальные values (uncontrolled). Множественная форма state-API: `values` / `defaultValues` / `onValuesChange` |
| `values` | — | Controlled values |
| `onValuesChange` | — | Колбэк при изменении карты полей |
| `rules` | — | `Record<string, FormFieldRules>` на уровне формы |
| `resolver` | — | Async/sync валидация после rules |
| `validateMode` | `onSubmit` | `onSubmit` \| `onBlur` \| `onChange` |
| `size` | — | `small` \| `base` \| `mid` \| `large` → контекст для полей |
| `disabled` / `readOnly` | `false` | Пробрасываются в контекст |
| `onSubmit` | — | `(values) => void \| Promise<void>` |
| `onSubmitError` | — | `(errors) => void` при ошибках валидации |
| `className` | — | На `<form>` |
| `classNames` | — | Слоты layout |
| HTML form attrs | — | `aria-label`, `id`, … |

`onSubmit` HTML переопределён — нативная валидация отключена (`noValidate`).

### Compound-подчасти

| Часть | DOM | Назначение |
|-------|-----|------------|
| `Form` | `<form>` | Root + state machine |
| `Form.Section` | `<div>` | Группа полей |
| `Form.Title` | `Text as="h2"` | Заголовок формы |
| `Form.Description` | `<p>` | Описание |
| `Form.Field` | `<div>` | Обёртка + регистрация `rules` |
| `Form.Actions` | `<div>` | Кнопки submit/cancel |
| `Form.ErrorSummary` | `role="alert"` sr-only | Сводка ошибок (auto в root). `children` или `Form` prop `errorSummary` — ReactNode / `(entries) => ReactNode` |
| `Form.Announce` | `role="status"` sr-only | Live region (auto в root) |

### `FormClassNames`

`root`, `section`, `title`, `description`, `actions`, `errorSummary`, `announce`, `field`.

### `useFormField(name, rules?)`

Сахар для полей внутри Form:

```tsx
function CustomField({ name }: { name: string }) {
  const field = useFormField(name, { required: true });
  return (
    <input
      name={field.name}
      value={String(field.value ?? "")}
      onChange={field.onChange}
      onBlur={field.onBlur}
      disabled={field.disabled}
      aria-invalid={field["aria-invalid"]}
      ref={field.ref as React.Ref<HTMLInputElement>}
    />
  );
}
```

Возвращает: `value`, `onChange`, `onBlur`, `disabled`, `readOnly`, `ref`, `aria-invalid`, `error`, `bound`.

### Валидация

**`FormFieldRules`:**

```ts
type FormFieldRules = {
  required?: boolean | string;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  validate?: (value: unknown, values: FormValues) => string | undefined;
};
```

Источники rules: `rules` на Form, `rules` на `Form.Field`, `rules` в `useFormField`.

**`validateMode`:**

| Режим | Когда |
|-------|-------|
| `onSubmit` | При submit (default) |
| `onBlur` | `validateField` на blur |
| `onChange` | При каждом `setValue` |

На submit валидация **всегда** полная + `resolver`.

**Nested keys:** dot-notation `"address.city"`.

**Submit flow:**

1. `preventDefault`, `validateForm()`
2. `resolver(values)` — merge errors
3. Ошибки → announce, `focusFirstInvalid`, `onSubmitError`
4. Успех → `await onSubmit(values)`, announce «Форма успешно отправлена»
5. `isSubmitting` блокирует поля и кнопки

## variant / size / status

| Ось | Form |
|-----|------|
| `variant` | Нет |
| `status` | Нет (ошибки на полях через `status="danger"`) |
| `size` | Да — контекст для `Input`, `Button`, … |
| `disabled` / `readOnly` | Да — контекст |

## Анимации

`Form` **не содержит GSAP** и motion pipeline. Анимации полностью делегированы дочерним контролам (`Input`, `Button`, `Checkbox`, `ComboBox`).

### Сводка

| Анимация | Где | Примечание |
|----------|-----|------------|
| Field shell hover | `Input`, `ComboBox`, … | `useFieldShellHoverLift` |
| Button press | `Button` | GSAP на submit |
| Error appear | `FieldError` | CSS / React |

### Чего нет

- Собственный `formAnimations.ts`
- `configureMotion` на уровне Form
- Transition между секциями

## Токены и CSS

| Слот | Базовые классы (`formStyles.ts`) |
|------|----------------------------------|
| `root` | `flex flex-col gap-large w-full text-left` |
| `section` | `flex flex-col gap-base` |
| `title` | `text-header-3 font-semibold text-foreground` |
| `description` | `text-base text-muted` |
| `actions` | `flex flex-wrap justify-end gap-small pt-small` |
| `errorSummary` / `announce` | `sr-only` |
| `field` | только user classes |

`Form.Title` — `Text variant="mid" as="h2"` поверх `formTitleClass`.

## Стилизация и кастомизация

### Два уровня

1. **`className` на `Form`** — layout (horizontal toolbar, max-width).
2. **`classNames` на root** — все layout-слоты.

`Form.Section` / `Form.Field` могут переопределить локальный слот (`section`, `field`).

### Слоты `FormClassNames`

| Слот | DOM | Когда использовать |
|------|-----|-------------------|
| `root` | `<form>` | Border, padding, bg panel |
| `section` | Section div | Gap между полями |
| `title` | `h2` Text | Heading color/size |
| `description` | `<p>` | Muted intro |
| `actions` | Actions row | Align buttons, border-top |
| `field` | Field wrapper | Per-field card/bg |
| `errorSummary` | sr-only alert | Кастом summary (редко) |
| `announce` | sr-only status | Live region styling |

### Кастомизация classNames

```tsx
<Form
  classNames={{
    root: "rounded-mid border border-primary/20 bg-tertiary/50 p-large",
    title: "text-primary",
    description: "text-info",
    section: "gap-small",
    actions: "justify-start border-t border-token pt-large",
    field: "rounded-base bg-background/40 p-small",
  }}
  onSubmit={handleSubmit}
>
  <Form.Title>Обратная связь</Form.Title>
  <Form.Section>
    <Form.Field name="topic">
      <Input name="topic" label="Тема" />
    </Form.Field>
  </Form.Section>
  <Form.Actions>
    <Button type="submit">Отправить</Button>
  </Form.Actions>
</Form>
```

### Controlled + resolver

```tsx
<Form
  values={values}
  onValuesChange={setValues}
  resolver={async (v) => {
    const errors: Record<string, string> = {};
    if (!v.login) errors.login = "Обязательно";
    return Object.keys(errors).length ? { errors } : { values: v };
  }}
  onSubmit={save}
>
  ...
</Form>
```

### Горизонтальный layout

```tsx
<Form className="flex flex-row flex-wrap items-end gap-small" aria-label="Поиск">
  <Form.Section className="flex flex-1 flex-row gap-small">
    <Input name="q" label="Поиск" compact />
  </Form.Section>
  <Form.Actions className="pt-0">
    <Button type="submit">Найти</Button>
  </Form.Actions>
</Form>
```

### Практические заметки

- Поля bindятся по **`name`** на контроле; `Form.Field` нужен для per-field `rules` и стилей.
- Явный `value` на контроле **отключает** form binding.
- `Checkbox` внутри `CheckboxGroup` **не** bindится к Form (`group != null`).
- `ComboBox` / `Select` — `useFormFieldBinding` (value-based, не event).
- Всегда `Form.Title` или `aria-label` на Form.
- `isSubmitting` автоматически `disabled` на `Button` через контекст.

## Интеграции

| Компонент | Binding |
|-----------|---------|
| `Input` | `useFormControlProps` — event-based |
| `Checkbox` | `useFormControlProps` (`type="checkbox"`) |
| `ComboBox` / `Select` | `useFormFieldBinding` — value-based |
| `Button` | `size`, `disabled`, `isSubmitting` из контекста |
| `CheckboxGroup` | Без прямого binding; single selection — отдельный `name`/`value` pattern |
| `Card` / `Dialog` / `Surface` | Layout wrappers в stories |

## Доступность

| Механизм | Реализация |
|----------|------------|
| Native validation | Отключена: `noValidate` |
| Form label | `aria-labelledby` → `Form.Title` id |
| Description | `aria-describedby` → `Form.Description` |
| Errors | `aria-describedby` + `Form.ErrorSummary` при ошибках |
| `Form.ErrorSummary` | `role="alert"` (assertive live), sr-only; render-проп `children(entries)` для кастомного списка ошибок |
| `Form.Announce` | `role="status"`, `aria-live="polite"`, `aria-atomic` |
| Поля | `aria-invalid` через binding |
| Focus | `focusFirstInvalid` на submit с ошибками |

Сообщения (RU): «Исправьте ошибку в форме», «Форма успешно отправлена».

## Структура файлов

```
Form/
├── Form.tsx
├── index.ts
├── formTypes.ts
├── formStyles.ts
├── formAPI.ts
├── formA11y.ts
├── formContext.tsx
├── formParts.tsx
├── useFormRootState.ts
├── useFormControlProps.ts
├── useFormFieldBinding.ts
└── Form.stories.tsx
```

## Storybook

`Composite Components/Form` — profile, validation onBlur/onChange, login, controlled, async submit, search toolbar, billing, readOnly, classNames, resolver, compound layout, inline subscribe.
