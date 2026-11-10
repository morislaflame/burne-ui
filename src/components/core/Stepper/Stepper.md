# Stepper

Дорожка шагов. Текущий шаг — `active`, уже пройденные — `checked`, следующие — `inactive`.

## Импорт

```tsx
import { Stepper, type StepperProps, type StepperClassNames, type StepperMotion } from "burne-ui";
```

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

`root`, `item`, `trigger`, `indicator`, `title`, `description`, `separator`.

`trigger` — кнопка шага (`Stepper.Trigger`). Если в `Item` уже есть `Trigger`, вторая кнопка не оборачивает детей. Motion-слота `trigger` нет.

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

## data-*

На списке: `data-orientation` `horizontal` \| `vertical`, `data-size`. На пункте: `data-state` `active` \| `checked` \| `inactive`, `data-value` — id шага, `data-disabled` — пустая строка, когда шаг нельзя выбрать.

## Анимации

Свой scope на корне. Defaults пустые: цвет шага едет на CSS по `data-state`. Фазы слотов — таблица выше. `enter` играет при появлении, если фаза задана.

## MotionController

Ручка на корне. `play()` играет `root`. Пункты повторные: `playSlot("item")` обходит живые шаги. Слота `trigger` в `StepperMotion` нет.

Тройка на корне, тот же scope. `motionState`, `motionPayload` и `playInitialState` не попадают на DOM. Смена `motionState` играет `motion.states[имя]`; то же имя ещё раз — тишина. `motionPayload` — снимок для фабрики (`ctx.payload`, `createMotionFactory`); без смены режима не переигрывает. `playInitialState` по умолчанию выключен: на маунте режим не играет.

```tsx
const steps = useMotionControllerHandle();

<Stepper motionController={steps} aria-label="Checkout" steps={items} />
```

## Доступность

- Имя дорожки — `aria-label` или `aria-labelledby` на корне.
- Текущий шаг: `aria-current="step"`. Пройденный шаг — кнопка. При `linear` шаг впереди `disabled` и вне tab sequence.
- `ArrowLeft` / `ArrowRight` по горизонтали (в RTL стороны меняются), `ArrowUp` / `ArrowDown` по вертикали. `Home` / `End` — края доступных шагов.

## Поведение

`size` — метка и кегль: `small`, `base`, `mid`, `large`. Отдельного `variant` нет: `orientation` — ось дорожки. Клик по пройденному шагу делает его текущим. Вперёд при `linear` клик не ставит.

## Структура файлов

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
