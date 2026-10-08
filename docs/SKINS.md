# Скины

Контракт плагина визуального языка. `SkinProvider`, реестр, Ярус 2 и `SkinShell` (Ярус 3) подключены. Список слотов генерируется из `XxxClassNames` и проверяется в `npm run lint`.

## Импорт

Приложение берёт скин из `burne-ui`:

```ts
import {
  SkinProvider,
  useSkin,
  registerSkin,
  unregisterSkin,
  hasSkin,
  listSkins,
  getSkin,
  subscribeSkins,
  getSkinRevision,
  useSkinRegistryRevision,
  type SkinDefinition,
  type SkinSlot,
  type SkinDeclarativeLayers,
  type SkinDeclarativeNode,
  type SkinLayerRenderer,
} from "burne-ui";
```

`registerSkin` и `unregisterSkin` поднимают ревизию реестра. Компонент с этим `variant` перерисовывается и заново читает классы, слои и motion. Повторная запись тех же данных ревизию не двигает. `SkinProvider` записывает `skin` / `skins` до чтения детей и не зовёт подписчиков синхронно из render.

Редактор и проверка токенов — `burne-ui/internal`: `resolveSkinTokens`, `applySkinVars`, `releaseSkinVars`, `captureBaseline`, `baselineFor`, `skinSurfaceStyle`, `SKIN_SLOTS`, `SKIN_FORBIDDEN_TOKENS`, `isForbiddenSkinToken`.

`registerKitSkin` и `clearSkinsForTests` наружу не отдаются. `SkinShell` ставит кит на слот компонента, приложение его не импортирует.

## Ярусы

| Ярус | Данные | Что меняет |
|---|---|---|
| 1 — Token | `tokens` / `tokensLight` / `tokensDark` | CSS-переменные. Скин — JSON. |
| 2 — Recipe | `targets`, `motion` | Классы по слотам и подмена motion-рецепта на фазе. Тоже данные. Фаза `mount` вешает слушатели на узел: `ctx.onCleanup` срабатывает на unmount, а не в конце hover. |
| 3 — Layered | `layers`, `layersDeclarative` | Дополнительные DOM-слои. `layers` — код, `layersDeclarative` сериализуется для редактора. |

Рецепт читает живой снимок через `ctx.config`. Тень и масштаб не копируют: `ctx.shadowFade(state, { kind })` (без `duration` — snap) и `ctx.adaptiveScale("hover" | "press")`. Свой `kind` получает отдельный хост `data-burne-shadow-fade` и не переписывает китовый `elevation`. Сегмент ButtonGroup — `data-group-segment`, не класс `.button-group-segment`. Вне play (resize, смена темы) те же функции импортируются из `burne-ui`: `snapShadowFade`, `playShadowFade`, `resolveAdaptiveHoverLiftScale`, `resolveAdaptivePressSqueezeScale`, `shouldSkipInteractiveHoverLift`, `getMotionConfig`.

Ярус 1 не выключается через `variant="default"`: геометрия остаётся, цветовые токены на этом узле возвращаются к снимку кита (`useSkinSurfaceStyle("default")`). Ярусы 2 и 3 выключаются. Снять скин целиком — `<SkinProvider skin={null}>`. Провайдер пишет не ключевое слово `initial`, а значения, снятые с `:root` до применения скина.

## SkinDefinition

Имя скина попадает в `data-skin` и может быть значением `variant`.

`tokens` — единственный источник reset. Выключение скина пишет каждому ключу `initial`. Скин не может «забыть» вернуть переменную, которой нет в его карте.

`targets` — классы. Ключ `"button.root"`, `"card.root"`: компонент в camelCase с маленькой буквы, слот — ключ `XxxClassNames`.

`motion` — рецепт на пару слот + фаза (`hoverIn`, `pressIn`, `enter`, …). Плоской карты «фаза → рецепт» нет: у слотов разные фазы.

`baseVariant` — `default` | `outline` | `secondary`. Если `variant` равен имени зарегистрированного скина, а записи слота нет, стиль и ключ карты берутся отсюда. Значение из закрытого набора кита (`default`, `outline`, …) всегда берёт карту кита и не читает `targets`. Неизвестная строка без скина в реестре — dev-ошибка и фолбэк на `default`.

Резолвер один: `resolveVariantVisual` / `variantSlotClass` в `*Styles.ts`, `overlaySkinMotion` в `*Animations.ts`. Пользовательский `motion` на слоте по-прежнему важнее скина.

`styleUrl` — CSS-файл, его импортирует приложение. `layers` без `styleUrl` — dev-предупреждение.

Переопределение `--shadow-{size}` (и `-hover` / `-press`) — целая строка слоёв. Число слоёв должно совпасть с hover/press того же уровня, иначе кросс-фейд GSAP ломается.

## Слоты

Источник — `export type *ClassNames` в `src/components`. Скрипт `scripts/sync-skin-slots.mjs` пишет `src/skins/skinSlots.generated.ts`. `npm run lint` гоняет `scripts/check-skin-slots.mjs`: файл и типы не должны разъехаться.

Неизвестный слот в `targets` / `layers` — ошибка типа и dev-ошибка в реестре.

Отдельные карты слотов (не корень компонента) получают свой префикс: `fieldSet.root`, `skeletonCircle.root`, `radioIndicator.fill`.

## Запрещённые токены

Скин не задаёт focus ring. В `@media (forced-colors: active)` эти переменные становятся `Highlight`; своё значение гасит кольцо в Windows HCM.

- `--color-focus-ring` и `--color-focus-ring-{danger,success,info,warning}`
- `--focus-ring-width`
- `--focus-ring-offset`

`isForbiddenSkinToken` отбрасывает такой ключ. Реестр добавит к этому dev-ошибку.

## Приоритет

`BurneUIProvider` и `ThemeProvider` принимают `skin` и `skins` и оборачивают дерево в `SkinProvider`. Так включается Ярус 1. Пропущенный `variant` равен имени активного скина, поэтому классы, слои и motion берутся из этого скина. Явная строка `variant` всегда побеждает провайдер.

1. Явный `variant` на компоненте (`outline`, имя скина, `"default"`).
2. Ближайший активный `SkinProvider` — только если `variant` не передан.
3. Внешний `SkinProvider`.
4. `BurneUIProvider` (`skin`).
5. Дефолт кита `"default"`, когда активного скина нет.

`skin={null}` делает scope неактивным. Пропущенный `variant` внутри него — `"default"`. Явный `variant="brutal"` внутри `skin={null}` по-прежнему читает реестр.

Вложенные скины: у компонента без `variant` побеждает внутренний. Ключ токена, которого у внутреннего нет, наследуется от внешнего. Группа (`ButtonGroup` и такие же) резолвит скин до записи `variant` в контекст, иначе дети увидят явный `"default"`.

Явный `variant="default"` при активном скине: классы и слои кита, палитра на корне компонента сбрасывается к снимку `:root`, геометрия (`--radius`, тени) остаётся от переменных скина.

## Порталы

CSS-переменные наследуются по DOM, не по дереву React. Панель Dialog / Tooltip / Toast — потомок `body`, поэтому провайдер обязан записать активные токены на саму панель. Иначе оверлей, открытый из поддерева `skin={null}`, останется в скине страницы.

## Декоратор слоя

`layers[slot]` получает `ref`, `className`, pointer-хендлеры (`onPointerOver` / `Out` / `Down` / `Up`) и остальные props узла. Их нужно прокинуть на тот DOM-узел, который регистрирует `useMotionPart`. Обёртка без `ref` снимает слот с анимации и с focus ring. `SkinShell` делает эту регистрацию сам и вызывает декоратор уже с `ref` и хендлерами.

`layersDeclarative` описывает те же слои данными: `wrapper` (узел слота), `before` (узлы до контента), `content` (обёртка детей), `after` (узлы после контента). У `wrapper`, `content`, `before` и `after` есть `className` и `style`. Одинаковый `className` у двух `before` не склеивает узлы: ключ — индекс в массиве. `SkinShell` рисует их, если кодового `layers[slot]` нет. Хосты: Card (`card.root`), Surface (`surface.root`), Dialog (`dialog.panel`), Drawer (`drawer.panel`). Пустой `targets` снимает только заливку: раскладка панели остаётся. Gloss — `gloss-panel` → `gloss-shadow` + `gloss-content`; у Dialog и Drawer обёртка ещё с `gloss-deep`. Остальные стеклянные поверхности — класс в `targets`: CloseButton и ToggleButton (`gloss-btn`), Avatar, Tooltip, Popover (и через него ColorPicker и меню Dropdown), AlertDialog, ButtonGroup, ListBox, submenu Dropdown. Заливка SelectionIndicator — `selectionIndicator.fill` (`gloss-indicator-fill`).

## Пилот

`burne-ui-skin-neobrutalism` — Ярус 1, без правок компонентов кита. Тень задана целой строкой `--shadow-*` из двух слоёв, без ручек `--shadow-opacity` / `blur` / `offset`. Импорт пакета вызывает `registerSkin`.

`burne-ui-skin-cybercore` — Ярус 2. `variant="cybercore"` ставит класс `cybercore-surface` на `button.root` и `card.root` и подменяет hover на `cyberGlowIn` / `cyberGlowOut`. Состояния `loading` / `success` / `error` / `open` красит CSS по `data-state`. Импорт пакета регистрирует рецепты и вызывает `registerSkin`.

`burne-ui-skin-gloss` — сторонний плагин, как neobrutalism и cybercore. Кит имя `gloss` не регистрирует и не считает его своим `variant`. Подключение: `import { gloss } from "burne-ui-skin-gloss"` (импорт вызывает `registerSkin`) и `skins={[gloss]}` на `BurneUIProvider`, плюс `import "burne-ui-skin-gloss/styles.css"` после листа кита. `variant="gloss"` тогда красит стекло. Без пакета та же строка — неизвестный вариант: dev-ошибка и фолбэк на `default`, слои не монтируются. `variant="default"` слои не монтирует и при подключённом скине.

`.gloss-panel`, `.gloss-control`, `.gloss-btn` и `.gloss-indicator` ставят `backdrop-filter`. Значение кроме `none` делает узел containing block для `position: fixed`: потомок позиционируется от панели, не от окна. `Dialog`, `Popover`, `Tooltip` и `Drawer` рендерятся порталом в `document.body` (Dialog ещё и в top layer через `showModal()`), поэтому триггер внутри `Card variant="gloss"` их не запирает. Свой `fixed` нужно выносить порталом. `portalContainer` внутрь стеклянной панели попадает под то же правило.

```tsx
<Card variant="gloss">
  <Dialog>
    <Dialog.Trigger>Open</Dialog.Trigger>
    <Dialog.Panel>
      <Dialog.Title>On the viewport</Dialog.Title>
    </Dialog.Panel>
  </Dialog>
  <Popover>
    <Popover.Trigger>Hint</Popover.Trigger>
    <Popover.Content>Portaled to document.body</Popover.Content>
  </Popover>
</Card>
```

```tsx
<BurneUIProvider skins={[neobrutalism]} skin="neobrutalism">
  <App />
  <footer>
    <SkinProvider skin={null}>…</SkinProvider>
  </footer>
</BurneUIProvider>
```

CSS пакета по-прежнему можно включить атрибутом `data-skin`. Вложенный сброс через `initial` в том CSS не возвращает дефолт кита; это делает `SkinProvider`.

## Инструменты автора

```bash
npx burne-ui skin add paper
npx burne-ui skin validate burne-ui-skin-paper
```

`skin add` копирует `cli/templates/skin` (тот же набор лежит в `create-burne-app/templates/skin`). Пакет: `sideEffects: ["**/*.css"]`, exports `.` и `./styles.css`, peer `burne-ui` `^1.8.8`. Имя — kebab-case. Экспорт — camelCase (`soft-paper` → `softPaper`).

`skin validate` читает `src/skin.json` и `src/skin.css`:

- Каждая переменная в CSS есть в `tokens`, `tokensLight` или `tokensDark`.
- Focus ring (`--color-focus-ring*`, `--focus-ring-width`, `--focus-ring-offset`) и `@media (forced-colors)` не задаются.
- Если заданы `--color-foreground` и `--color-surface`, контраст ≥ WCAG AA (4.5:1). Цвет — hex или `rgb()`.
- Ключи `targets`, `motion`, `layers` и `layersDeclarative` есть в `SkinSlot`. Фаза motion — из китового списка.
- `src/layers.tsx` прокидывает `ref` (`{...props}` или `ref={ref}`).
- `--shadow-{small|base|mid|large|xlarge|lift}` и `-hover` / `-press` — две строки слоёв, как у кита. Запятые внутри `color-mix()` слоем не считаются.

Список слотов для CLI — `cli/skin-slots.json`. Его пишет `scripts/sync-skin-slots.mjs` вместе с `skinSlots.generated.ts`.

## Редактор

Playground, группа Theme, страница **Skin**. Превью — отдельный блок: `SkinProvider root={preview}` и `portalContainer` у Dialog и Popover, чтобы оверлей не выходил в страницу без скина.

Ярусы: токены (имя и значение, цвет — крутилка), `targets` строкой классов, `layersDeclarative` полями `before` / `after` / `wrapper` / `content` и JSON.

Экспорт: файл `.json`, `skin.css`, «скопировать как пакет» (package.json, skin.json, skin.css, index.ts). Share-ссылка кладёт документ в `#skin=`.

Контракт файла — `SKIN_DOCUMENT_SCHEMA` и `parseSkinDocument` в `burne-ui/internal`. Кодовые `layers` в файл не входят. Сайт подключает редактор после публикации кита: опубликованный пакет ещё без этих хелперов.
