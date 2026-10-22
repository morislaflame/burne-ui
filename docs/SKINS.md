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
  type SkinDefinition,
  type SkinSlot,
  type SkinDeclarativeLayers,
  type SkinDeclarativeNode,
  type SkinLayerRenderer,
} from "burne-ui";
import { getSkinRevision, subscribeSkins, useSkinRegistryRevision } from "burne-ui/skin";
```

`registerSkin` и `unregisterSkin` поднимают ревизию реестра. Компонент внутри `SkinProvider` с этим `variant` перерисовывается и заново читает классы, слои и motion. Повторная запись тех же данных ревизию не двигает. `skin` и `skins` на `SkinProvider` живут в scope и в реестр не пишутся: превью редактора не протекает в остальные деревья. Без провайдера `variant="gloss"` не включает скин, даже если `registerSkin` уже вызван.

Редактор и проверка токенов — `burne-ui/internal`: `resolveSkinTokens`, `applySkinVars`, `releaseSkinVars`, `captureBaseline`, `baselineFor`, `skinSurfaceStyle`, `SKIN_SLOTS`, `SKIN_FORBIDDEN_TOKENS`, `isForbiddenSkinToken`.

`registerKitSkin` и `clearSkinsForTests` наружу не отдаются. `SkinShell` ставит кит на слот компонента, приложение его не импортирует.

## Ярусы

| Ярус | Данные | Что меняет |
|---|---|---|
| 1 — Token | `tokens` / `tokensLight` / `tokensDark` | CSS-переменные. Скин — JSON. |
| 2 — Recipe | `targets`, `motion` | Классы по слотам и подмена motion-рецепта на фазе. Тоже данные. Фаза `mount` вешает слушатели на узел: `ctx.onCleanup` срабатывает на unmount, а не в конце hover. |
| 3 — Layered | `layers`, `layersDeclarative` | Дополнительные DOM-слои. `layers` — код, `layersDeclarative` сериализуется для редактора. |

Рецепт читает живой снимок через `ctx.config`. Тень и масштаб не копируют: `ctx.shadowFade(state, { kind })` (без `duration` — snap) и `ctx.adaptiveScale("hover" | "press")`. Свой `kind` получает отдельный хост `data-burne-shadow-fade` и не переписывает китовый `elevation`. Сегмент ButtonGroup — `data-group-segment`, не класс `.button-group-segment`. Вне play (resize, смена темы) те же функции импортируются из `burne-ui/skin`, не из корня `burne-ui` и не из `burne-ui/internal`: `snapShadowFade`, `playShadowFade`, `resolveAdaptiveHoverLiftScale`, `resolveAdaptivePressSqueezeScale`, `shouldSkipInteractiveHoverLift`, `getMotionConfig`, `killMotion`, `motionPressSqueezeTotalFor`, `removeShadowFadeHost`.

Ярус 1 не выключается через `variant="default"`: геометрия (`--radius`, тени) остаётся унаследованной, палитра `--color-*` кроме цветов кольца возвращается к снимку кита с корня темы (`useSkinSurfaceStyle("default")`). Ярусы 2 и 3 выключаются. Снять скин целиком — `<SkinProvider skin={null}>`. Провайдер пишет тот же снимок и снимает его заново при смене режима. Значение — не `initial`.

## SkinDefinition

Имя скина попадает в `data-skin` и может быть значением `variant`.

`tokens` — набор ключей, которые скин возвращает при выключении. Каждому ключу пишется снимок кита с корня темы: ближайший `data-theme`, иначе элемент `ThemeProvider`, иначе `documentElement`. Это не `initial` и не отдельный снимок только с `:root`, если корень темы — другой узел. Скин не может «забыть» вернуть переменную, которой нет в его карте.

`targets` — классы. Ключ `"button.root"`, `"card.root"`: компонент в camelCase с маленькой буквы, слот — ключ `XxxClassNames`. Строка и `{ replace }` заменяют класс кита (пустая строка снимает заливку). `{ extend }` дописывает классы после класса кита.

`motion` — рецепт на пару слот + фаза (`hoverIn`, `pressIn`, `enter`, …). Плоской карты «фаза → рецепт» нет: у слотов разные фазы. `motion.config` — частичный `MotionConfig`: `SkinProvider` кладёт его в `MotionConfigProvider`, и GSAP читает `ctx.config`.

`elevation` — `kit` | `skin` | `none`. Пропуск значит `skin`: кит не рисует свои слои тени и hover-lift. `kit` оставляет тени и подъём кита (скин «только цвета»). `none` — плоско. Модалки и меню не растут на hover ни при каком значении.

`baseVariant` — `default` | `outline` | `secondary`. Если `variant` равен имени скина в текущем scope, а записи слота нет, стиль и ключ карты берутся отсюда. Значение из закрытого набора кита (`default`, `outline`, …) всегда берёт карту кита и не читает `targets`. Строка без скина в scope — dev-ошибка и фолбэк на `default`. Реестр — запасной путь только внутри `SkinProvider`.

Резолвер один: `resolveVariantVisual` / `variantSlotClass` в `*Styles.ts`, `overlaySkinMotion` в `*Animations.ts`. Пользовательский `motion` на слоте по-прежнему важнее скина.

`styleUrl` — CSS-файл, его импортирует приложение. `layers` без `styleUrl` — dev-предупреждение.

Переопределение `--shadow-{size}` (и `-hover` / `-press`) — целая строка слоёв. Число слоёв должно совпасть с hover/press того же уровня, иначе кросс-фейд GSAP ломается.

## Слоты

Источник имён — `export type *ClassNames` в `src/components`. Скрипт `scripts/sync-skin-slots.mjs` пишет `src/skins/skinSlots.generated.ts` и три живых списка в `skinLiveSlots.generated.ts`: `SKIN_TARGET_SLOTS` (что читает `resolveVariantVisual`), `SKIN_LAYER_SLOTS` (хосты `SkinShell`), `SKIN_MOTION_SLOTS` (что достигает `overlaySkinMotion`). `npm run lint` гоняет `scripts/check-skin-slots.mjs`: файлы не должны разъехаться.

Ключ из `XxxClassNames`, который никто не читает, — мёртвый слот: `parseSkinDocument` и `burne-ui skin validate` его отклоняют, реестр пишет dev-ошибку. Пустой ключ — тоже ошибка. У Tooltip и Popover классы `panel` и motion `content` стоят на одном узле (пузырь), оболочка позиции — `classNames.content`.

Живые слоты по компонентам. Блок пишет `scripts/sync-skin-slots.mjs` из тех же трёх списков. Компонента нет в таблице — слот скина он не читает.

<!-- skin-coverage:start -->
| Компонент | Классы (`targets`) | Слои | Motion |
|---|---|---|---|
| Alert | root | — | action, description, indicator, root, title |
| AlertDialog | panel | — | — |
| AppShell | root | — | — |
| AspectRatio | root | — | — |
| Avatar | root | — | fallback, groupItem, image, root |
| Badge | root | — | anchor, root |
| Button | root | — | error, icon, label, loader, root, success, text |
| ButtonGroup | root | — | — |
| Calendar | root | — | cell, cellFill, cellText, footer, footerClear, footerToday, grid, header, navNext, navPrev, rangeHalfFill, root, title |
| Card | root | root | body, description, footer, header, headingBlock, root, title |
| CloseButton | root | — | icon, root |
| ComboBox | shell | — | input, popover, shell, trigger, triggerIconWrap |
| Container | root | — | — |
| DatePicker | trigger | — | icon, label, popover, trigger |
| Dialog | panel | panel | body, close, content, description, footer, header, headingBlock, overlay, panel, title, trigger |
| Disclosure | content, contentWrap, group, root, trigger | — | chevron, content, contentShell, icon, panelInner, root, title, titleLift |
| Drawer | panel | panel | body, close, content, description, footer, handle, header, headingBlock, overlay, panel, title, trigger |
| Dropdown | subPopover | — | — |
| Expandable | root | — | chevron, description, icon, panel, panelInner, panelShell, root, title, triggerLift |
| Grid | root | — | — |
| Header | root | — | — |
| Input | shell | — | control, fileRemove, fileRow, passwordToggle, shell |
| Kbd | root | — | group, root, text |
| ListBox | root | — | — |
| NumberInput | shell | — | control, decrement, increment, label, shell |
| PinInput | control | — | control, label, shell |
| Popover | arrow, panel | — | arrow, body, content, description, header, title, trigger |
| Resizable | root | — | — |
| SearchInput | root | — | clear, expandTrigger, icon, input, root |
| Select | shell | — | popover, shell, trigger, triggerIconWrap, value |
| SelectionIndicator | fill, mark, root | — | fill, mark, root |
| SelectionThumb | — | — | icon, root |
| SelectionThumbIcon | root | — | — |
| Sidebar | root | — | — |
| Slider | fill | — | fill, header, icon, rail, thumb, track, value |
| Stack | root | — | — |
| Surface | root | root | root |
| Switch | fill | — | fill, thumb, track |
| Table | cell, column, content, root, row | — | body, caption, cell, column, columnSortIcon, content, empty, footer, header, headerRow, label, root, row, scrollContainer |
| Tabs | indicator, list, tab | — | indicator, list, panel, root, tab, tabText |
| TagsInput | shell | — | control, label, remove, shell, tag |
| TextArea | shell | — | control, resizeHandle, shell |
| TimeField | shell | — | segments, shell |
| Toast | root | — | action, close, description, indicator, root, scrim, stackItem, title |
| ToggleButton | root | — | content, fill, iconEnd, iconStart, label, root, text |
| ToggleButtonGroup | root | — | — |
| Tooltip | arrow, panel | — | arrow, content, description, indicator, panel, title |
<!-- skin-coverage:end -->

Отдельные карты слотов (не корень компонента) получают свой префикс: `fieldSet.root`, `skeletonCircle.root`, `radioIndicator.fill`.

## Запрещённые токены

Скин может задать цвет кольца: `--color-focus-ring` и `--color-focus-ring-{danger,success,info,warning}`. Валидатор требует контраст ≥3:1 к `--color-background` и `--color-surface` в каждой заданной теме. Цвет — hex, `rgb()` или `oklch()`, либо `var(--токен)` из той же карты. Без своего значения кольцо становится `var(--color-foreground)`, не смесью `primary`.

Ширину и отступ кольцо не отдаёт. В `@media (forced-colors: active)` кит красит сам `outline` в `Highlight`, поэтому свой цвет не гасит кольцо в Windows HCM.

- `--focus-ring-width`
- `--focus-ring-offset`

`isForbiddenSkinToken` отбрасывает эти два ключа. Реестр добавит к этому dev-ошибку.

## Приоритет

`BurneUIProvider` и `ThemeProvider` принимают `skin` и `skins` и оборачивают дерево в `SkinProvider`. Так включается Ярус 1. Пропущенный `variant` равен имени активного скина, поэтому классы, слои и motion берутся из этого скина. Явная строка `variant` всегда побеждает провайдер.

1. Явный `variant` на компоненте (`outline`, имя скина, `"default"`).
2. Ближайший активный `SkinProvider` — только если `variant` не передан.
3. Внешний `SkinProvider`.
4. `BurneUIProvider` (`skin`).
5. Дефолт кита `"default"`, когда активного скина нет.

`skin={null}` делает scope неактивным. Пропущенный `variant` внутри него — `"default"`. Явный `variant="brutal"` внутри `skin={null}` по-прежнему читает реестр.

Вложенные скины: у компонента без `variant` побеждает внутренний. Ключ токена, которого у внутреннего нет, наследуется от внешнего. Группа (`ButtonGroup` и такие же) резолвит скин до записи `variant` в контекст, иначе дети увидят явный `"default"`.

Явный `variant="default"` при активном скине: классы и слои скина снимаются, палитра на корне компонента сбрасывается к снимку корня темы, геометрия (`--radius`, тени) остаётся от переменных скина.

## Порталы

CSS-переменные наследуются по DOM, не по дереву React. Панель Dialog / Tooltip / Toast — потомок `body`, поэтому провайдер обязан записать активные токены на саму панель. Иначе оверлей, открытый из поддерева `skin={null}`, останется в скине страницы.

## Декоратор слоя

`layers[slot]` получает `ref`, `className`, pointer-хендлеры (`onPointerOver` / `Out` / `Down` / `Up`) и остальные props узла. Их нужно прокинуть на тот DOM-узел, который регистрирует `useMotionPart`. Обёртка без `ref` снимает слот с анимации и с focus ring. `SkinShell` делает эту регистрацию сам и вызывает декоратор уже с `ref` и хендлерами.

`layersDeclarative` описывает те же слои данными: `wrapper` (узел слота), `before` (узлы до контента), `content` (обёртка детей), `after` (узлы после контента). У `wrapper`, `content`, `before` и `after` есть `className` и `style`. Одинаковый `className` у двух `before` не склеивает узлы: ключ — индекс в массиве. `SkinShell` рисует их, если кодового `layers[slot]` нет. Хосты: Card (`card.root`), Surface (`surface.root`), Dialog (`dialog.panel`), Drawer (`drawer.panel`). Пустой `targets` снимает только заливку: раскладка панели остаётся. Gloss — `gloss-panel` → `gloss-shadow` + `gloss-content`; у Dialog и Drawer обёртка ещё с `gloss-deep`. Остальные стеклянные поверхности — класс в `targets`: CloseButton и ToggleButton (`gloss-btn`), Avatar, Tooltip, Popover (и через него ColorPicker и меню Dropdown), AlertDialog, ButtonGroup, ListBox, submenu Dropdown. Заливка SelectionIndicator — `selectionIndicator.fill` (`gloss-indicator-fill`).

## Пилот

`burne-ui-skin-neobrutalism` — Ярус 1, без правок компонентов кита. Тень задана целой строкой `--shadow-*` из двух слоёв, без ручек `--shadow-opacity` / `blur` / `offset`. Светлая палитра в `tokens`, тёмная в `tokensDark`. `elevation` — `kit`, `motion.config` ставит интерактивные длительности на 80ms. Импорт пакета вызывает `registerSkin`.

`burne-ui-skin-cybercore` — Ярус 2. `variant="cybercore"` ставит класс `cybercore-surface` на `button.root` и `card.root` и подменяет hover на `cybercore:glow-in` / `cybercore:glow-out`. Срез угла и обводка живут на `::before`, свечение и focus ring остаются на внешнем узле. Правила класса лежат в `@layer ui-kit`. Состояния `loading` / `success` / `error` / `open` красят CSS по `data-state`. Цвета поверхности — `tokens` и `tokensLight`. Импорт пакета регистрирует рецепты через `defineSkinRecipe` и вызывает `defineSkin`.

`burne-ui-skin-gloss` — сторонний плагин, как neobrutalism и cybercore. Кит имя `gloss` не регистрирует и не считает его своим `variant`. Подключение: `import { gloss } from "burne-ui-skin-gloss"` и `skins={[gloss]}` на `BurneUIProvider`, плюс `import "burne-ui-skin-gloss/styles.css"` после листа кита. `variant="gloss"` красит стекло только внутри этого провайдера. Без провайдера та же строка остаётся вариантом кита: dev-ошибка и фолбэк на `default`, слои не монтируются. `variant="default"` слои не монтирует и при подключённом скине. Анимации gloss импортируют `burne-ui/skin`, не `burne-ui/internal`. Рецепты — `gloss:hover`, `gloss:press`, `gloss:prepare`. `elevation` gloss — `skin`. Dialog и Popover с фокусом внутри остаются в покое: блик живёт на `.gloss-decor`, масштаб enter не перехватывается. Смена `data-theme` не обрывает leave. В forced-colors кит возвращает стеклянным узлам границу `ButtonText` не тоньше 1px. Блок `forced-colors` в CSS gloss только ставит `forced-color-adjust` и кольцо не трогает.

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

CSS пакета включается атрибутом `data-skin`. Тёмная тема страницы — отсутствие `data-theme` на `<html>`: значения читаются из `:root` и из базового блока `[data-skin]`. Светлая — `[data-theme="light"]` на том же узле или на предке. Островок `data-theme="dark"` внутри светлой страницы повторяет тёмные цвета, вычисленные тени и градиенты тоста. Шкала, шрифт, motion и z-index наследуются со страницы, поэтому оверрайды темы на `<html>` доходят до островка. Тёмные токены скина повторяются так же, и светлый предок их не перекрашивает. Портал из островка копирует `data-theme="dark"` на панель. `SkinProvider` при `skin={null}` пишет снимок кита с корня темы.

## Инструменты автора

```bash
npx burne-ui skin add paper
npx burne-ui skin add aurora --tier 3
npx burne-ui skin validate burne-ui-skin-paper
npx burne-ui skin build burne-ui-skin-paper
```

`skin add` копирует шаблон яруса (`--tier 1` токены, `2` классы, `3` слои). Пакет резолвит `burne-ui` по имени пакета. `sideEffects` включает `./dist/index.js`, поэтому голый импорт пакета вызывает `defineSkin`. Export `.` имеет условие `default`. `./styles.css` указывает на `./dist/styles.css`. `./skin.json` указывает на `./dist/skin.json`: документ скина импортируется из опубликованного пакета. Peer `burne-ui` — `^2.0.0`. Имя — kebab-case. Экспорт — camelCase (`soft-paper` → `softPaper`).

`skin validate` читает `src/skin.json` и `src/skin.css` (относительные `@import` подставляются):

- Переменная в CSS есть в `tokens`, `tokensLight` или `tokensDark`, либо это префикс скина (`--gloss-*`, `--_private`) или китовый токен (`--border-width`).
- `--focus-ring-width` и `--focus-ring-offset` не задаются. Блок `forced-colors` допустим, пока он не задаёт `--color-focus-ring*`, ширину, отступ и `outline` на `.focus-ring`. Цвет `--color-focus-ring*` допустим при контрасте ≥3:1 к `background` и `surface`.
- Контраст пар (`foreground`/`surface`, `primary`, `secondary`, статусы, `muted`) ≥ WCAG AA (4.5:1), когда обе стороны заданы. Цвет — hex, `rgb()` или `oklch()`.
- Ключи `targets`, `motion`, `layers` и `layersDeclarative` есть в `SkinSlot` и в живом списке. Фаза motion — из китового списка. Имя рецепта — китовое или `имя:локальное` (`gloss:hover`). `hover` и `press` у `defineSkinRecipe` помечаются `interactive`.
- `src/layers.tsx` прокидывает `ref` (`{...props}` или `ref={ref}`).
- `--shadow-*` может содержать любое число слоёв. Запятые внутри `color-mix()` слоем не считаются.

`skin build` пишет `dist/styles.css` из документа и дописывает классовые правила из `src/skin.css`. `defineSkin` регистрирует документ, `defineSkinRecipe` — рецепт `имя:локальное`.

Классы из CSS пакета приезжают с `styles.css`. Утилиты Tailwind в `targets` попадают в сборку приложения, только если сканер видит пакет:

```css
@import "tailwindcss";
@source "../node_modules/burne-ui-skin-paper";
```

Список слотов для CLI — `cli/skin-slots.json`. Его пишет `scripts/sync-skin-slots.mjs` вместе с `skinSlots.generated.ts`.

## Слоты стороннего пакета

`SkinTargetSlot`, `SkinMotionSlot` и `SkinLayerSlot` включают имена из `SkinSlotRegistry`. Пакет расширяет модуль `burne-ui/skin` и регистрирует те же строки в рантайме:

```ts
declare module "burne-ui/skin" {
  interface SkinSlotRegistry {
    "pricing.root": true;
  }
}

registerSkinSlots(["pricing.root"]);
```

`registerSkinSlots` живёт в `burne-ui/skin`. Парсер документа и `warnSkinSlots` читают этот список. CLI того же процесса: `burne-ui skin validate --slot pricing.root` и `burne-ui skin build --slot pricing.root`. Имя, которого нет ни в таблице кита, ни в реестре, валидатор отклоняет. Мёртвый слот кита (`button.icon`) мёртвым и остаётся.

Компонент читает активный скин через `useSkinSlot` из `burne-ui/authoring`: классы (`className` / `extend`), слой и motion этого слота.

## Редактор

Playground, группа Theme, страница **Skin**. Превью — отдельный блок: `SkinProvider root={preview}` и `portalContainer` у Dialog и Popover, чтобы оверлей не выходил в страницу без скина.

Ярусы: токены (имя и значение, цвет — крутилка), `targets` строкой классов, `layersDeclarative` полями `before` / `after` / `wrapper` / `content` и JSON.

Экспорт: файл `.json`, `skin.css`, «скопировать как пакет» (package.json, skin.json, skin.css, index.ts). Share-ссылка кладёт документ в `#skin=`.

Контракт файла — `SKIN_DOCUMENT_SCHEMA` и `parseSkinDocument` в `burne-ui/internal`. Имя — kebab-case. `motion` на фазе принимает имя рецепта или `MotionVars` (`{ y: -4, recipe }`). `rules` — CSS-свойства слота (`style`, `hover`, `focus-visible`, `::before`, `::after`, `light` / `dark`, `state`, `status`); экспорт добавляет класс `.skin-{name}-{slot}` в `targets`. `properties` — `@property`, `fonts` — `@font-face` или `href`, `extends` — имя другого скина. Хосты слоёв — список `SKIN_LAYER_SLOTS`. Кодовые `layers` в файл не входят.

Студия читает один файл через `burne-ui/studio`: `DesignDocument` (`version`, `name`, `theme`, `skin`), `THEME_TOKEN_SCHEMA`, `renderDesignCss`, `validateDesign`. `StudioModeProvider` ставит `data-skin-slot` списком имён через пробел (`popover.content popover.panel`): селектор `[data-skin-slot~="popover.panel"]`. Без провайдера атрибута нет. `data-force-state` (`hover`, `focus`, `press`, `disabled`) включает варианты Tailwind и кольца `focus-ring`. Подъём и сжатие GSAP сами по атрибуту не играют: после записи атрибута студия зовёт `playForceStateMotion(node)` (`press` важнее `hover`). `designToSkin` пишет в скин только отличия цветов и motion от кита.
