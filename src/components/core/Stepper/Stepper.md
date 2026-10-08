# Stepper

Дорожка шагов. Текущий шаг — `active`, уже пройденные — `checked`, следующие — `inactive`.

`orientation` — ось дорожки, не значение канона `variant`. Только `horizontal` | `vertical`.

## Simple

```tsx
<Stepper
  aria-label="Checkout"
  value={step}
  onValueChange={setStep}
  steps={[
    { value: "account", title: "Account", description: "Email and password" },
    { value: "shipping", title: "Shipping", description: "Delivery address" },
    { value: "payment", title: "Payment", description: "Card on file" },
  ]}
/>
```

`steps` задаёт порядок. `value` — id текущего шага.

## Compound

```tsx
<Stepper value={step} onValueChange={setStep}>
  <Stepper.Item value="account">
    <Stepper.Indicator />
    <Stepper.Title>Account</Stepper.Title>
    <Stepper.Description>Email and password</Stepper.Description>
  </Stepper.Item>
</Stepper>
```

`Stepper.Item` в детях включает compound, и проп `steps` не используется. `Indicator` без детей рисует номер или галочку. Соединитель между пунктами рисует корень, отдельной части нет.

## Root props

| Prop | По умолчанию | Описание |
|------|--------------|----------|
| `steps` | — | Simple API |
| `value` / `defaultValue` / `onValueChange` | первый шаг | Текущий id |
| `orientation` | `horizontal` | Ось. Не `variant` |
| `linear` | `true` | Вперёд нельзя, назад можно |
| `size` | `base` | `small` \| `base` \| `mid` \| `large` |
| `classNames` | — | Слоты дорожки |
| `motion` | — | Слоты ниже. `events` / `states` — соседи, не ключи `StepperMotion` |
| `motionController` | — | Handle корня. `play()` играет `root` |

### `StepperClassNames`

`root`, `item`, `indicator`, `title`, `description`, `separator`.

### Слоты motion

| Слот | Где играет | Фазы |
|------|------------|------|
| `root` | Список | `enter` / `leave`, указатель |
| `item` | Пункт, повтор | `enter` / `leave`, указатель |
| `indicator` | Кружок | `hoverIn` / `hoverOut` / `pressIn` / `pressOut` / `enter` / `leave` |
| `title` | Заголовок | те же |
| `description` | Подпись | те же |
| `separator` | Соединитель | те же |

`events` и `states` — соседи слотов, не ключи `StepperMotion`.

## Поведение

`size` — метка и кегль: `small`, `base`, `mid`, `large`. Отдельного `variant` нет: `orientation` — ось дорожки.

- Пройденный шаг — кнопка. Клик и стрелки ставят его текущим.
- При `linear` шаг впереди — `disabled`, в tab sequence его нет.
- `ArrowLeft` / `ArrowRight` по горизонтали (в RTL стороны меняются), `ArrowUp` / `ArrowDown` по вертикали. `Home` / `End` — края доступных шагов.
- Текущий шаг: `aria-current="step"` и `data-state="active"`. Пройденный: `data-state="checked"`. Следующий: `data-state="inactive"`.

## Файлы

```
Stepper/
├── Stepper.tsx
├── index.ts
├── Stepper.stories.tsx
├── stepperTypes.ts
├── stepperStyles.ts
├── stepperA11y.ts
├── stepperAPI.ts
├── stepperContext.tsx
├── stepperAnimations.ts
├── stepperParts.tsx
├── useStepperRootState.ts
└── Stepper.md
```

`stepperAnimations.ts` — слоты, пустые defaults, `useMotionPart` и enter на маунте.
