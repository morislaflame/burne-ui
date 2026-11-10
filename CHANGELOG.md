# Changelog

## 2.0.0

Что поменять в приложении — таблица [Migration](#migration) в конце этой секции. Числа шкалы — таблица в Breaking.

### Added

- **Stack, Grid, Container:** раскладка по токенам. `Stack` — колонка или ряд (`orientation`, `gap` из `--space-*`, `align`, `justify`, `wrap`). `Grid` — `columns` `1|2|3|4|6|12|auto`; при `auto` минимум дорожки — `--max-component-*`. `Container` — `mx-auto` и `maxWidth` (`max-w-page-*`, `--max-page-*`), горизонтальный padding из `--space-*`. Это не поверхности: тени нет, фокус не ставится. `gap` / `padding` / `maxWidth` / `columns` — доменные шкалы, не `ComponentSize` и не `variant`. `classNames.root`, slot motion и `motionController`. Экран собирается из `Container`, `Stack`, `Grid` и `Surface`. Playground, сайт и Storybook.
- **AppShell, Header, Sidebar, AspectRatio, Resizable:** сборка экрана и кадр. `Header` (`sticky`), `Sidebar` (`width` из `w-page-*`, свой `side` и `data-side`), `AppShell` раскладывает прямых потомков `Header` и `Sidebar`, остальное — в `main`. `AspectRatio` держит `ratio`. `Resizable` / `Resizable.Panel` / `Resizable.Handle` делят ось жестом и стрелками; доля — размер раскладки, не MotionVar. Это не поверхности. `classNames`, slot motion и `motionController`. Playground, сайт и Storybook.
- **Данные и таблица:** `items` у Tabs, Accordion, Dropdown (`label` + пункты), ListBox, RadioGroup, CheckboxGroup, ToggleButtonGroup, Select и ComboBox. Table: `disabledKeys` выключает выбор и обход строки, `stickyHeader` снимает `overflow-clip` и ограничивает прокрутку. Toast: `toast.dismissAll()`.
- **Остальной §4.8:** Separator `decorative`. Select: группы в `items` и `clearable`. ComboBox: свой `filter`, `allowsCustomValue`, `loading`. Calendar `isDateUnavailable`. DatePicker: `readOnly` и `selectionMode="multiple"`. Tabs: `activationMode` и `keepMounted`. NumberInput `formatOptions`. `toast()` вне React. Table `columnResize`.
- **Авторский API:** `burne-ui/authoring` — `createMotionScope` (тип возврата `MotionScope`), `useMotionPart`, `mergeRefs`, `mergeAsChildProps`, `useControllableState`, `focusOnOpen` / `focusPanelOnOpen` / `focusKeyboard`, хелперы `dataContract`, `useSkinSlot`. Снимок `docs/authoring-api.snapshot.txt`. Корень `burne-ui` эти имена не отдаёт. `SkinSlotRegistry` и `registerSkinSlots` живут в `burne-ui/skin`; `burne-ui skin validate --slot` принимает имя из реестра. Имя вне реестра валидатор отклоняет.
- **Пакет компонентов:** `create-burne-app --template component-package` (пакет `create-burne-app@1.3.3`). Peer `burne-ui@^2.0.0`, сборка библиотеки, `@source` на `src`, Storybook, контракт слотов на `Callout` (`classNames`, compound, `motionController`). `SkinSlotRegistry` и `registerSkinSlots` для `callout.root` / `callout.title`.
- **`burne-ui/tailwind.css`:** `@theme inline` и все `@utility` кита, без preflight. Подключается следом за `burne-ui/styles.css`. Приложение собирает варианты, которых нет в prebuilt `ui.css` (`md:shadow-token-mid`, `divide-x-token`). Отдельного экспорта `./theme-bridge.css` нет: файл остаётся входом сборки `tailwind.css`.
- **Вес бандла:** рецепт, который играет компонент, регистрируется при импорте этого компонента. Остальные китовые имена подгружаются при первом play и не входят в начальный граф. Таблицы слотов скина в проде не тянутся: проверка слота — только dev. Бюджет сборки: вход `Button` легче 37 КБ gzip, `Dialog` — 52 КБ (без React и GSAP).
- **Студия, `burne-ui/studio`:** экспериментальный вход в 2.x до поставки студии (F6). Снимок фиксирует имена (`docs/studio-api.snapshot.txt`), не форму результата `validateDesign` и не литералы типов контролов схемы. `DesignDocument` (тема + скин), `THEME_TOKEN_SCHEMA`, `parseDesignDocument`, `renderDesignCss`, `validateDesign`, `contrastRatio` / `parseCssColor`. `StudioModeProvider` ставит `data-skin-slot` списком имён через пробел. В документе скина: `rules`, `properties`, `fonts`, `extends`, `motion` с `MotionVars`. Имя — kebab-case. `exportThemeCss` пишет `:root` и `[data-theme="light"]`. `themeTokenStateToConfig` оставляет только отличия от кита и не пишет `toast: true`. `applyThemeTokens` для `--space` / `--size` / `--radius` пишет фиксированный `rem`, как лист кита. Пресеты темы и именованные палитры живут в ките. `designToSkin` пишет только отличия темы от кита. `renderSkinPackage` повторяет `cli/templates/skin` (сборка копирует `skin.css` и `skin.json`, автор лицензии — `meta.author`). `paletteFromBrand` снижает chroma до sRGB. `findMotionController`, `playForceStateMotion`, `forceStateAttribute`. `motion.config` принимает массивы. `resolveThemeTokenState` заполняет обе палитры и motion. Слайдер длительности в схеме — 0–2000 мс (индикатор и точки — 0–4000); жёсткий clamp остаётся 0–60 000. `data-force-state` включает варианты `hover` / `focus` / `active` / `disabled`. `portalContainer` у Select, ComboBox, DatePicker и ColorPicker.
- **Вес шрифта:** шкала `small | base | mid | strong | bold`. Токен `--font-w-regular` и утилита `font-w-regular` сняты: шаг `regular` в `ThemeFontWeights` не входил, компоненты его не читали.
- **Скины neobrutalism и cybercore:** обе палитры. У neobrutalism тёмная бумага и светлые чернила в `tokensDark`. У cybercore тёмная база в `tokens`, светлая в `tokensLight`; `.cybercore-surface` читает эти переменные.
- **Checkbox, Radio, Switch:** `inputRef` указывает на нативный `<input>`. `ref` корня остаётся на `<label>` (compound Checkbox и Switch — на `<fieldset>`). У Checkbox он сливается с ref поля Form. `ref` у `Switch.Control` — визуальный контрол (`<span>` или compound `<label>`).
- **`ActionVariant`:** общий список скинов кнопок — `default` | `primary` | `outline` | `secondary` | `ghost`. Button и CloseButton принимают его целиком. ToggleButton красит `default` | `outline` | `ghost`. `Disclosure` `ghost` — доменное исключение (прозрачный trigger), не этот список.
- **Select, ComboBox, DatePicker:** слот `popover` на карте поля прокидывается на `content` внутреннего Popover (`portalSurfaceEnter` / `portalSurfaceLeave`). `motion` на `Select.Popover` / `ComboBox.Popover` / `DatePicker.Popover` побеждает карту корня. У DatePicker слот `calendar` уходит на Calendar `root` и играет enter только когда фаза задана. Слайды Menu enter (и Calendar enter у DatePicker) в Slot motion галерее playground / Storybook.
- **SelectionIndicator:** галерея Slot motion. `fill` и `mark` на `check` / `uncheck`: китовые рецепты, `false` пропускает fill, vars на `root`, factory на `mark`, timeline с `root` на `fill` и `mark`, compound-части, `classNames`, штрих галочки через `strokeDashoffset`. Playground, сайт и Storybook.
- **RadioGroup:** полный motion-хост хрома группы. `motion` принимает `events` и `states`, на корне есть `motionController`, `motionState`, `motionPayload`, `playInitialState`. Handle уходит в Provider, не на `<fieldset>`. Пункты Radio и SelectionIndicator остаются своим scope. Галерея MotionController — playground и Storybook.
- **SearchInput:** полный motion-хост. `motion` принимает `events` и `states`, на корне есть `motionController`, `motionState`, `motionPayload`, `playInitialState`. Handle уходит в Provider, не на `<input>`. Галерея MotionController — playground и Storybook.
- **Тест контракта слотов:** `src/__tests__/slotContract.test.tsx` — каждый `XxxClassNames` обязан иметь фикстуру. Маркеры `__slot_*` / `__part_*` проверяют, что слот и compound-часть на одном узле, `ref` указывает туда же, `motionController.getTarget(slot)` совпадает с `classNames`, пользовательский `className` на корне побеждает слот. Новый компонент без фикстуры падает. Известные расхождения §3 пока красные (R1.2+).
- **Импорт компонента:** `import { Button } from "burne-ui/Button"`. Имя пути — имя компонента (`burne-ui/Table`, `burne-ui/Accordion`). Тот же API, что у корня `burne-ui`. Стили по-прежнему из `burne-ui/styles.css`.
- **TagsInput:** поле из чипов. Enter, запятая или blur фиксируют текст. Пустой Backspace снимает последний чип. Повтор не добавляется. `values` / `onValuesChange`, `max`. `variant` и `size` как у Input. `classNames`, slot motion и MotionController. Playground и Storybook. Страница сайта — после публикации кита.
- **Stepper:** дорожка шагов. `value` — id текущего. Пройденные можно выбрать снова, следующие при `linear` недоступны. `orientation` `horizontal` | `vertical` — ось, не variant. `classNames`, slot motion и MotionController. Playground и Storybook. Страница сайта — после публикации кита.
- **HoverCard:** карточка по наведению и фокусу на базе Popover. `openDelay` 400, `closeDelay` 300 — указатель успевает перейти на панель. Клик по якорю не переключает. `Escape` закрывает. `classNames`, slot motion и MotionController на портале карточки. Playground и Storybook. Страница сайта — после публикации кита.
- **ScrollArea:** своя полоса прокрутки. `visibility` `hover` | `scroll` | `always`, `orientation` `vertical` | `horizontal` | `both`. Бегунок, клик по дорожке, клавиатура, RTL по горизонтали. `classNames`, slot motion и MotionController. Playground и Storybook. Страница сайта — после публикации кита.
- **PinInput.Control:** ячейка с собственным `className`. `classNames.control` по-прежнему на всех ячейках. Группа без полей рисует ряд сама; число `PinInput.Control` совпадает с `length`.
- **Label.Text, Label.Required:** слоты `text` и `required` как части. Без них корень рисует текст и звезду сам.
- **PinInput:** поле из ячеек. `length` 1…12, `type` `number` | `text`, `mask` (точки без `type="password"`, браузер не предлагает пароль), `separator` между половинами. Строка без дыр: вставка заменяет символ, вставка с буфера заполняет ряд, Backspace сдвигает. Один tab stop. `aria-invalid` только от `invalid` / `error`. Иконка в подписи, `classNames`, slot motion и MotionController. Playground и Storybook. Страница сайта — после публикации кита.
- **ContextMenu:** меню по правому клику и Shift+F10 на базе `Dropdown` (пункты, submenu, иконки, выбор, `classNames`). Панель встаёт у курсора. `ContextMenu.Item` по умолчанию закрывает меню как действие. Slot motion и MotionController — на `ContextMenu.Popover`. Playground и Storybook. Страница сайта — после публикации кита.
- **Виртуализация списков:** `virtualized` на Select, ComboBox, ListBox и `Table.Body`. В DOM остаётся окно видимых строк фиксированной высоты, без новой зависимости. Клавиатура ходит по всему списку. Секции ListBox и строки разной высоты остаются полностью смонтированными.
- **`Intl` для дат и чисел:** `createCalendarLocale` / `locale="ru"` строят имена месяцев и дней через `Intl`. Дефолт `EN_LOCALE` — `en-GB` (`15 Oct 2026`). Today/Clear: en и ru, остальные языки — английские подписи, пока не переданы `labels`. Поле DatePicker форматирует ту же локаль. Дефолтные подписи Slider, Meter и ProgressBar идут через `formatLocaleNumber` (`en`).
- **Select `multiple`:** несколько значений через `values` / `defaultValues` / `onValuesChange`. Выбор переключает пункт и оставляет меню открытым. В поле подписи в порядке options. Playground и Storybook.
- **NumberInput:** числовое поле со степперами. `value` / `onValueChange`, `min` / `max` / `step`. Пустое плюс ставит `min` или `0`. На blur значение ограничивается и садится на шаг. Кнопки вне tab sequence. Playground и Storybook. Страница сайта — после публикации кита.
- **DatePicker:** поле с календарём в попапе. `mode` `single` | `range`, `value` / `onValueChange`, `open` / `onOpenChange`. Кнопка — оболочка поля, шеврон крутится при открытии. Попап закрывается, когда значение полное. `name` пишет локальный `YYYY-MM-DD` (диапазон — `start/end`). Playground и Storybook. Страница сайта — после публикации кита.
- **Скины, редактор:** playground, группа Theme, страница Skin. Токены, `targets` и `layersDeclarative`, превью в своём контейнере (`SkinProvider` + `portalContainer`). Экспорт JSON, CSS и пакета, ссылка `#skin=`. Схема и разбор файла — `parseSkinDocument` / `SKIN_DOCUMENT_SCHEMA` в `burne-ui/internal`.
- **Скины, CLI:** `burne-ui skin add <name>` собирает пакет из `cli/templates/skin` (копия в `create-burne-app/templates/skin`) с `"license": "MIT"` и файлом `LICENSE`. `renderSkinPackage` пишет ту же лицензию. `burne-ui skin validate` проверяет декларацию токенов, focus ring, `forced-colors`, контраст `--color-foreground` / `--color-surface` (WCAG AA), слоты `SkinSlot`, `ref` у `layers` и два слоя у `--shadow-*`. Peer шаблона — `^2.0.0`.
- **`data-*` контракт:** `data-state` (open/closed, expanded/collapsed, checked/unchecked, on/off, active/inactive, selected, loading/idle/success), флаги `data-disabled` / `data-invalid` / `data-readonly` / `data-required`, `data-orientation`, `data-side` / `data-align`, `data-size` / `data-variant` / `data-status`. Хелперы — `dataContract.ts`. Пример: `Select.Trigger` с `data-[state=open]:rotate-180`.
- **Слоты `classNames`:** Avatar gloss больше не выбрасывает `className` / `classNames.root`. Новые слоты: `glossShadow`, Tooltip `panelRelative`, Expandable `contentWrap`, Toast `stackItem` (z-index, pointer-events, origin и ширина viewport — CSS-переменные), Badge `splitShell` и `icon`, Select `triggerIconWrap`, Switch `iconOff` / `iconOn`, Slider `icon`, Field `label`, Table `columnButton` (`columnInner` общий), Calendar `navIconWrap`.
- **`Table.Caption`:** `<caption>` — имя таблицы. Слот `classNames.caption`, motion-слот `caption`. `Table.Label` остаётся текстом заголовка колонки.
- **Рамка без `!important`:** `.gloss-control` и сегмент ButtonGroup сбрасывают border/shadow через `:where()` в `@layer utilities` — обычный `border-*` / `shadow-*` перекрывает. Accordion задаёт `--accordion-item-radius` на группе.
- **Каскад и размер:** бегунок ColorPicker берёт `--size-scale-small` (класс, не inline `14px`). `gloss-*`, `avatar-size-*`, `selection-indicator-*` в `@layer ui-kit`; `focus-ring*` остаётся `@utility`. `cn` сливает `border-token*`, `shadow-token*`, `z-*`, `avatar-size`, `selection-indicator`, `focus-ring`. Утилиты `h-control-*` удалены — высота контрола это `min-h-control-*`. Вложенный портал (не `document.body`) получает `--z-overlay-nested-step`; числа шкалы и top layer `showModal()` не меняются. `ref` на `SelectionIndicator`, `SelectionThumb` и `SelectionThumb.Icon` доходит до узла.
- **Motion, плагины:** `ctx.shadowFade(state)` и `ctx.adaptiveScale("hover" | "press")`. Хост тени ищется по своему `kind`: `"gloss"` не переписывает китовый `"elevation"`. Сегмент группы — публичный `data-group-segment`, не класс `.button-group-segment`.
- **Motion, фаза `mount`:** рецепт слота запускается при регистрации узла. `ctx.onCleanup` в этой фазе живёт до unmount и не сбрасывается следующим hover / press / enter. Gloss вешает shine и focus-within через `mount`, без `MutationObserver` на родителе.
- **Скины, реестр:** из `burne-ui` — `SkinProvider`, `useSkin`, `useSkinVariant`, `useSkinSurfaceStyle`, `useSkinRegistryRevision`, `registerSkin` / `unregisterSkin` / `hasSkin` / `listSkins` / `getSkin` / `subscribeSkins` / `getSkinRevision`, типы `SkinDefinition`, `SkinSlot`, `SkinDeclarativeLayers`, `SkinLayerRenderer`. Реестр подписывает компоненты через `useSyncExternalStore`: смена скина после маунта обновляет классы и motion. Одинаковая повторная запись ревизию не поднимает. `SkinProvider` не зовёт подписчиков из render. Из `burne-ui/internal` — `resolveSkinTokens`, `applySkinVars`, `releaseSkinVars`, `SKIN_SLOTS`, `SKIN_FORBIDDEN_TOKENS`. `skin={null}` пишет снимок значений с `:root`, не `initial`, и выключает scope. Пропущенный `variant` равен имени активного скина; явный `variant` побеждает. `variant="default"` при активном скине сбрасывает палитру на корне компонента и оставляет геометрию. Запрещённый `--color-focus-ring*` отбрасывается. Токены портала пишутся на `Dialog`, `Tooltip.Content` и viewport `Toast`. `BurneUIProvider` и `ThemeProvider` принимают `skin` / `skins` и оборачивают дерево в `SkinProvider`, когда проп задан.
- **Скины, Ярус 2:** публичный `variant` — `KitXxxVariant | (string & {})`, карты остаются на закрытом `KitXxxVariant`. `variant` равный имени скина читает `targets` и `motion`; неизвестная строка без скина — dev-ошибка и фолбэк на `default`. Пакет `burne-ui-skin-cybercore` меняет классы и hover без правок компонентов.
- **Скины, Ярус 3:** `SkinShell` регистрирует слот через `useMotionPart` и рисует `layers` или `layersDeclarative` (`wrapper` / `before` / `content` / `after`). У каждого узла есть `className` и `style`. Повторный `className` в `before` не склеивает слои: ключ — индекс. Хосты: Card (`card.root`), Surface (`surface.root`), Dialog (`dialog.panel`), Drawer (`drawer.panel`). Пустой `targets` снимает заливку, раскладка панели остаётся. `variant="default"` слои не монтирует. Пакет `burne-ui-skin-gloss` — сторонний плагин: `gloss-panel` → `gloss-shadow` + `gloss-content`; Dialog и Drawer — `gloss-deep`. Кит это имя не регистрирует. `overlaySkinMotion` читают Surface, Dialog, Drawer, Tooltip, Popover, Expandable, Avatar, Toast, Tabs, Table, Calendar, SelectionIndicator: `mount` скина (`glossPrepare`) играет на живом слоте. У Tooltip и Popover это `content`, не `root`. Targets gloss ещё на CloseButton, ToggleButton, Avatar, Tooltip / Popover panel (ColorPicker и меню Dropdown идут через Popover), AlertDialog, ButtonGroup, ListBox, submenu Dropdown и `selectionIndicator.fill`. Проверка пяти слоёв тени живёт в пакете gloss; lint кита соседний CSS больше не читает. Импорт `burne-ui-skin-cybercore` и `burne-ui-skin-neobrutalism` вызывает `registerSkin`, как gloss.
- **Шкала, аддитивно:** hit-area 24×24 у Checkbox / Radio / Switch (`hit-target-24`, глиф не меняется). Radius: `mid` ×1.125 (9px, `rounded-mid`), `none`, `2xlarge` (16px), `3xlarge` (24px), `full`. `--radius-nested` = `max(0, var(--radius-outer) − var(--radius-pad))`, утилита `rounded-nested` (Tabs, Accordion). Тень `shadow-token-xlarge` на Dialog, Drawer, Popover, Tooltip, AlertDialog. `--font-w-regular` (400) не меняет текст компонентов. Отрицательный tracking на `text-header-2` / `text-header-1` / `text-accent-header` поверх `--letter-spacing`. Иконки `icon-16` / `icon-24`. Брейкпоинты `--breakpoint-*` генерируются из `tokenPrimitives.json` (узкий viewport — `lg`, 1024). `--shadow-*` по-прежнему читается как готовый список слоёв: своя строка заменяет ручки, у hover/press того же уровня должно остаться два слоя.

### Changed

- **Тёмная тема:** `[data-theme="dark"]` повторяет только ключи светлого блока — цвета, вычисленные тени и градиенты тоста. Шкала, шрифт, motion, z-index и ручки тени остаются на `:root` и наследуются островком, включая оверрайды на `<html>`. `<html>` в тёмном режиме по-прежнему без атрибута. Вложенный корень `ThemeProvider` ставит `data-theme="dark"`. Портал из островка копирует атрибут. Стили скина повторяют тёмные токены после светлого блока.
- **Скины, дока:** сброс палитры — снимок корня темы, не `initial` и не только `:root`. Хелперы вне play — `burne-ui/skin`. `@source` нужен для утилит Tailwind в `targets`. Таблица «что скинится» в `docs/SKINS.md` пишется из живых слотов. Проверка ширины и отступа кольца смотрит CSS и пакеты скинов.
- **Скины, автор:** `skin validate` пропускает префикс скина (`--gloss-*`), китовые токены и `forced-colors`, который не красит кольцо. Число слоёв `--shadow-*` больше не фиксировано. Рецепт — китовое имя или `имя:локальное`. `defineSkin` / `defineSkinRecipe` регистрируют документ и рецепт (`hover` / `press` — interactive). `skin add --tier 1|2|3`, `skin build` пишет CSS из `skin.json`. Gloss, neobrutalism и cybercore проходят validate.
- **Кольцо фокуса под скином:** скин задаёт `--color-focus-ring*`, валидатор требует ≥3:1 к `background` и `surface`. Без своего цвета кольцо — `var(--color-foreground)`. Ширина и отступ по-прежнему у кита. У cybercore срез угла на `::before`, кольцо на внешнем узле. В forced-colors у узлов `[data-skin]` граница `ButtonText` не тоньше 1px.
- **Gloss:** Dialog и Popover с фокусом внутри не растут. Блик и conic живут на `.gloss-decor`, а не на всём поддереве. Смена `data-theme` больше не убивает leave. Один `ResizeObserver` на кнопки и поля. `gloss-deep` поднимается тенью, без масштаба.
- **Пакет скина:** `sideEffects` включает `./dist/index.js`, голый `import` не вырезается и вызывает `registerSkin`. Export `.` имеет `default`. `./styles.css` публикуется из `dist`, не из `src`. `./skin.json` указывает на `dist/skin.json`. Сборка копирует документ в `dist` и не кладёт карты деклараций. Классы стрелки и индикатора gloss заданы в CSS скина.
- **Motion:** сырой `gsap` у Button, ToggleButton, Checkbox, Radio, SelectionIndicator и Drawer живёт в рецепте или в `gsapMotion`. Allowlist `check-raw-gsap` короче: каждая оставшаяся строка — двигатель, который не является фазой слота (drag, FLIP, ripple, высота, chevron, hover-lift, searchExpand).
- **Motion:** `play()` без слота играет `root` — это первая строка JSDoc и гайда MotionController. Карта или `ctx.to` с `width` / `height` / `top` / `left` / `margin` в dev пишет `console.warn`. Рецепт `searchExpand` ширину шелла не предупреждает.
- **SETUP / README:** Next.js App Router — simple API с сериализуемыми пропами из Server Component; compound (`Card.Title`) и пропы-функции — в `"use client"`-файле. По ошибке `You cannot dot into a client module` раздел находится в SETUP. Для burne-ui 2.0 редактор темы — `burne-ui-devtools@0.2` (в npm её ещё нет). Сборка описана как ESM.
- **Table:** поверхность, не data grid. Страницы ставит родитель: `Pagination` в `Table.Footer`, в `Table.Body` приходит срез. Ширина колонки — `className`. Раскрытие строки — вторая `Table.Row` или `Expandable` в ячейке. Своего resize и `expanded` нет.
- **Типографика:** `--text-scale-large` `1.15rem` (18.4px) → `1.125rem` (18px). Межстрочный интервал остаётся `1.75rem` (28px). Высоты `--control-height-*` не меняются: `large` по-прежнему считается от `text-mid`.
- **RTL:** стили компонентов читают направление письма (`text-start`, `border-s-token` / `border-e-token`, `start-` / `end-`, `ms-` / `pe-`, `rounded-s` / `rounded-e`). Бегунок Switch и заливка Meter / ProgressBar растут к inline-end. Физическими остаются стороны viewport: Drawer, Toast, якоря Badge и половины ячеек Calendar. `check-logical-directions` не пускает новое `left` / `right` в `*Styles.ts`. Галерея Direction — playground и сайт (`/components/direction`), гайд `/docs/direction`.

### Fixed

- **Экспорт темы:** `exportThemeCss` пишет шкалу на `:root`, светлые цвета на `[data-theme="light"]`, тёмные цвета следом на `:root:not([data-theme="light"])` и `[data-theme="dark"]`. Светлая страница сохраняет свою палитру, тёмный островок получает тёмные оверрайды. `rules.dark` скина попадает на `<html>` без атрибута и стоит до `:hover`. `skin validate` разбирает документ тем же `parseSkinDocument`, что и студия: имя, `extends`, `rules`, `properties`, `fonts`, массив в `motion.config`. Своя переменная в правиле и `color-mix` в кольце фокуса проходят. Проверки `forced-colors` и `layers.tsx` остаются у CLI.
- **Документация:** у Header, Sidebar, AppShell, AspectRatio и Resizable есть таблица пропсов, доступность и `motionController`. Toast описывает `toast()` и `dismissAll`. Примеры импорта в markdown сверяются с опубликованными именами.
- **Авторский вход:** `burne-ui/authoring` отдаёт типы `MotionController`, `MotionMapWithEvents`, `MotionPartPhases`, `MotionStateHostProps`, `MotionScopeValue`, `Prettify`. `MotionRun` и `MotionBroadcastOptions` — с корня `burne-ui`: это результат `play()` и аргумент `playAll`.
- **Объявления хуков:** `useSliderTrackState`, `useSwitchRootState` и `useStepperRootState` возвращают именованный тип, без развёрнутого `CSSProperties`.
- **Гигиена:** липкая шапка использует `z-sticky` (`--z-sticky: 10`). `Sidebar` требует `aria-label` или `aria-labelledby`. `data-value` панели Resizable — проп `id`.
- **Палитра по умолчанию:** текст на заливке danger, success и info проходит WCAG AA 4.5:1 в обеих темах. В тёмной теме у success и info тёмный текст на яркой заливке, у danger белый. В светлой теме заливки глубже, текст на них белый. `validateDesign` на документе кита возвращает `ok: true`.
- **RadioGroup:** `aria-readonly` стоит на группе (`role="radiogroup"`), не на `input`. ARIA 1.2 не разрешает `aria-readonly` у `role="radio"`. Пустая ячейка календаря вне месяца скрыта от скринридера (`aria-hidden`): это отступ сетки, не день.
- **Пакет:** `engines.node` — `>=22`, `keywords` включают `react`, `ui-kit`, `gsap`, `tailwindcss`.
- **React 18:** каталог скина читается во время рендера (диспетчер React 18). Checkbox и Switch без `value` не пишут пустой атрибут: в `FormData` у отмеченного поля остаётся браузерное `on`.
- **Порядок pointer-хендлеров:** на DOM сначала `{...rest}`, затем `{...pointerHandlers}`. Пользовательский `onPointer*` снимается до `...rest` и попадает в motion, поэтому hover не затирает обработчик и обработчик не затирает hover. Guard `check-pointer-order` в `npm run lint`.
- **Toast:** карточка второго уровня. В покое тень mid (`useSecondLevelShadow`, `shadowSize: "mid"`), при наведении растёт (`hoverLiftSecondLevel`). Hover играет на карточке, не на обёртке enter и не на `stackItem`.
- **`ref` на compound-частях:** `Button.Icon` / `Text`, `ToggleButton.IconStart` / `IconEnd` / `Text`, `Expandable` (и реэкспорт Accordion) `Icon` / `Content` / `Title` / `Description` / `Chevron`, `Disclosure.Icon` / `Chevron` / `Handle`, `Alert.Content`, `Card.Header` / `HeadingBlock` / `Body` / `Footer`, `Meter.Header` / `Value`, `ProgressBar.Header` / `Value`, `ScrollArea.Scrollbar` / `Thumb` / `Corner`, `Breadcrumbs.Separator`. `ref` попадает на тот же узел, что слот. Маркеры `Breadcrumbs.Item` и `Link.Icon` по-прежнему не рендерят DOM.
- **Button / ToggleButton:** `className` остаётся только на корне. Раскладка содержимого — `classNames.label` / `classNames.content`. Раньше simple API копировал `className` на лейбл / content, и `px-8` давал двойной отступ.
- **Порядок `cn`:** CloseButton — `className` после `classNames.root`. Form.Field — `className` после `classNames.field` (слот с корня больше не затирается, если у Field нет своего `classNames.field`). SearchInput — свёрнутая ширина `w-control-*` до слота, её можно перебить через `classNames.root`. Tooltip.Indicator — китовый `icon-slot-*` до слота и `className`.
- **Select / ComboBox:** children у `Trigger` остаются в `triggerIconWrap` и крутятся с `chevronRotate`. Раньше кастомная иконка подменяла обёртку целиком и не поворачивалась.
- **ComboBox / Select:** на корне `Field` пользовательский `className` идёт после `classNames.root`.
- **Table:** пагинация в `Table.Footer` — одна строка на ширину таблицы: `Pagination.Summary` слева, кнопки справа.
- **Table:** заголовок колонок липкий внутри прокрутки. `Table.ScrollContainer` без elastic overscroll, чтобы на macOS и iOS не было щели между рамкой и ячейками.
- **Table:** заголовок столбца и ячейки выровнены одинаково, по `text-start`. `className="text-center"` или `text-end` на `Table.Column` и `Table.Cell` (или `classNames.column` / `cell`) перебивает это.
- **Calendar, range:** второй день диапазона вызывал обработчик первого клика. `memo` ячейки не сравнивал `onPress`, и ref оставался со старым `rangePending`.
- **Motion, `hoverIn: false`:** отпуск press, пока курсор на кнопке, больше не ставит масштаб hover. Возврат к hover-позе только если фаза `hoverIn` включена.
- **Badge, gloss:** статус больше не кладёт `bg-surface-tint-*` на стекло. Остаётся цвет текста (`text-*`), как у кнопки.
- **Motion, уровень 1:** страница `/docs/motion` — замедлить, выключить и подменить одну фазу слота. Рецепты, контроллер, команды, группа, ожидание и контракт файлов — отдельные страницы (`motion-recipes`, `motion-controller`, `motion-events`, `motion-group`, `motion-async`, `motion-authoring`). Якоря из `Component.md` ведут туда же. Живые пять фрагментов — playground и Storybook `Foundations/Motion`.
- **Скины, gloss:** `backdrop-filter` на `.gloss-panel`, `.gloss-control`, `.gloss-btn` и `.gloss-indicator` делает панель containing block для `position: fixed`. `Dialog`, `Popover`, `Tooltip` и `Drawer` уходят порталом в `document.body` и внутри `Card variant="gloss"` не запираются. Свой `fixed` нужно выносить порталом; `portalContainer` внутрь стекла попадает под то же правило.
- React Doctor: в `src/components` и `src/skins` ноль bug-ошибок. Запись `ref` во время рендера, без которой layout-эффект ребёнка видит прошлое значение, подавлена построчно и перечислена в `docs/react-doctor-baseline.md`. Stories и playground не входят в bug-правила (`doctor.config.json`). CI сверяет счёт с нулём (`check-react-doctor-baseline.mjs`). Select и ComboBox держат `setOpen` в зависимостях контекста. Шеврон не перезапускает layout-эффект на каждый рендер.
- `data-size` / `data-variant` / `data-status` публикует `dataVariantProps` на корне, у которого есть эти пропы (в том числе `Button` с `asChild`, оболочка Input / TextArea / Select / ComboBox, панель Dialog / Drawer / AlertDialog). Пустое значение опускается. Атрибут стоит после `{...rest}`. `variant` — разрешённый скин, `status` на form-контроле — визуальный (`danger`, когда поле невалидно).
- `data-state` на Radio, ToggleButton, Pagination, Table, ListBox, Expandable, Accordion, Drawer, AlertDialog, Popover, Tooltip, Dropdown и Toast. Атрибуты кита (`data-state`, `data-side`, `data-align`, `data-selected`, `data-invalid`) стоят после `{...rest}`. Popover и Tooltip публикуют `data-align`. SearchInput больше не использует `data-search-expand`: фокус после Escape идёт через ref. Checkbox принимает `indeterminate` (`aria-checked="mixed"`, черта в SelectionIndicator).
- Размер иконки задаётся на обёртке: `icon-slot` + `icon-slot-*` (`--icon-size`). `classNames.icon="icon-slot-large"` вытесняет китовый размер. `icon-*` на самом `<svg>` тоже побеждает. Селектор `[&_svg]:icon-*` из компонентов убран.
- В `npm run lint` три guard-скрипта: `check-aria-invalid-coverage` (15 form-контролов ставят `aria-invalid` из `invalid`), `check-data-state-coverage` (хосты публикуют `data-state` из словаря), `check-important-free` (`!important` только у zoom-guard, reduced-motion skeleton и forced-colors меток).
- Классы `h-control-*` больше не висят на Button, ButtonGroup, CloseButton, навигации Calendar, SearchInput и круге Skeleton. Высота — `min-h-control-*`.
- Popover с `role="dialog"` ставит `aria-modal={false}` boolean, не строку `"false"`.
- Вложенный `AlertDialog` больше не закрывает внешний `Dialog` и не снимает scroll-lock: `close` / `cancel` доходят по дереву React, dismiss остаётся только у того `<dialog>`, который сам получил событие. То же для `Drawer`.
- Press больше не твинит inline `box-shadow`. Тень press/hover/rest — статичные слои, GSAP двигает только opacity. Probe и `resolveConcreteBoxShadow` удалены.
- Отпуск press у второго уровня (Card, поля) возвращает тень hover-семейства, пока курсор остаётся на контроле. Раньше рецепт подставлял `--shadow-lift`, и размер возвращался только после нового наведения.
- Hover и press не вызывают `killMotion`. Повторный press останавливает только свой timeline, твин `leave` на том же узле не обрывается.
- Fade трека Checkbox / Radio и FLIP страниц Pagination убивают свой твин в cleanup. Отпуск высоты collapsible отменяет предыдущие кадры и не пишет в отсоединённый узел.
- Цвет поверхностей кита остаётся на CSS. `tweenCssColor` на время твина ставит `transition: none` и возвращает прежнее значение в конце, чтобы переход не сглаживал кадры GSAP. Компоненты `tweenCssColor` не вызывают.
- Дефолт `surfaceTransitionDuration` и `--motion-surface-duration` — 180ms. Пресет Default берёт его из `MOTION_DEFAULTS`.
- Списки `XxxClassNames` в `Component.md` и в доках сайта совпадают с типами. Убраны слоты gloss, которых в типе нет. Добавлены пропущенные ключи (`expandTrigger`, `navIcon`, `dayEmpty`, `iconStart` / `iconEnd`, `caption` и другие). Guard `check-classnames-docs-parity` входит в `npm run lint`.
- Примеры кастомизации: story `CustomClassNames` у Button, Text, Separator, Ripple, SelectionIndicator, SelectionThumb, SearchInput и Form. Playground `*ClassNamesFull` у Button, Avatar, Form, Text, Separator и Ripple. У Form в примере есть `errorSummary` и `announce`, у SearchInput — `expandTrigger`.
- Порог браузеров зафиксирован в `docs/adr/0001-browser-floor.md`. Guard `check-browser-floor` сверяет `browserslist` с таблицей в README, SETUP и на сайте `/docs/browsers`. Четыре `:has()` в `styles.css` помечены как усиления: без них раскладка жива, пропадают кольцо на оболочке, снятие двойной тени и цвет метки в forced-colors.
- Стек и scrim Toast, индикатор Tabs и точки Loading идут через рецепты `toastStackShift`, `toastScrimFade`, `tabsIndicatorMove`, `loadingDots`. Высота стека — `--toast-stack-height`, без твина. Полоса диапазона Calendar — `contentFade`, заливка ячейки и ToggleButton — `selectionFill`. Шеврон Select / ComboBox / Table играет `chevronRotate` на иконке (`enter` / `leave`). Guard `check-raw-gsap` не пускает новый `gsap.to` вне рецептов и allowlist.

### Breaking

- **Скины и scope:** `variant="gloss"` без `SkinProvider` не включает скин, даже после `registerSkin`. Определение берётся из scope, реестр — запасной путь внутри провайдера. `skin` / `skins` в реестр не пишутся. `targets` принимает `{ replace }` и `{ extend }` (строка по-прежнему заменяет класс). `elevation`: `kit` | `skin` | `none` (пропуск — `skin`). `motion.config` накладывается через `MotionConfigProvider`. Автору скина — подпуть `burne-ui/skin`. Контраст валидатора меряет пары и `oklch`.
- **Слоты скинов:** `targets`, `motion` и `layers` принимают только живые слоты (`SKIN_TARGET_SLOTS`, `SKIN_MOTION_SLOTS`, `SKIN_LAYER_SLOTS`). Ключ из `XxxClassNames`, который компонент не читает, — мёртвый: `parseSkinDocument`, `burne-ui skin validate` и dev-ошибка реестра. У Tooltip и Popover `classNames.content`, motion `content` и классы `panel` сидят на пузыре. Оболочка позиции слотом не является.
- **Календарь и тосты:** у Calendar и DatePicker видимый месяц — `month` / `onMonthChange`, сетка — `view` / `defaultView` / `onViewChange`. `initialView` снят. У Slider жест заканчивается `onValueCommit`. У PinInput заполнение — `onComplete`. У Toast автозакрытие — `duration` (вместо `timeout`); `add()` принимает `onClose`. Тип `ToastEntry` экспортируется.
- **Группы раскрытия:** Accordion и `Disclosure.Group` — `selectionMode` (`single` | `multiple`). Несколько пунктов — `values` / `defaultValues` / `onValuesChange`. Проп `accordion` у Disclosure.Group снят.
- **Поверхности:** Dialog, Drawer, Popover, HoverCard, Toast, Expandable и Accordion принимают `variant` `default` | `outline` | `secondary`.
- **Типографика:** у Text, Label, Field.Hint и Field.Error роль текста — `textStyle` (необязательный, по умолчанию `base`). Проп `variant` у них снят.
- **Размер и статус:** у ButtonGroup `buttonSize` → `size`. У Loading индикатор — `indicator` (`spinner` | `dots`); семантическая заливка — `status`, `color` — токен (`primary` | `foreground` | `muted` | `secondary`) или CSS-цвет. У PinInput набор символов — `charset`. У Switch `labelPosition` — `start` | `end` (по умолчанию `end`).
- **Группы и иконки:** `CheckboxGroup.Label` и `RadioGroup.Label` сняты — заголовок в легенде это `Label`. У групп есть simple API: `label`, `hint`, `error`, `options`. У Checkbox и Radio `labelPosition` — `start` | `end`. У Tooltip `showIcon` снят: `icon={null}` прячет глиф статуса. У CloseButton `icon` заменяет крестик, `null` прячет его.
- **SelectionIndicator:** прямые `children`, кроме `Fill` и `Mark`, больше не становятся иконкой. Иконка — проп `icon` (то же на `Checkbox.Indicator`, `Radio.Indicator`, `Dropdown.ItemIndicator`, `ListBox.ItemIndicator`). Содержимое `Mark` остаётся mark.
- **Иконки и дубли пропов:** у Calendar кнопки навигации — `previousIcon` / `nextIcon` (`null` прячет; слоты motion остаются `navPrevIcon` / `navNextIcon`). У Select simple API `icon` заменяет шеврон, у DatePicker `icon` заменяет шеврон рядом со значением; `null` прячет. У Dropdown поверхность меню — `variant` (было `popoverVariant`); `bodyClassName` снят, тело меню — `classNames.popoverBody`. У Slider `thumbClassName` снят, оболочка бегунка — `classNames.thumbShell`. У Expandable проп `compound` снят: compound определяется по слотам. У Badge позиция иконки — `start` | `end` (`data-icon`). У Avatar тултип — `tooltip={{ size, variant, status, side }}`. Типы `CheckboxCheckMotion`, `RadioCheckMotion`, `SwitchCheckMotion`, `SelectionIndicatorCheckMotion` переименованы в `*PartMotion`.
- **data-*:** значение вкладки и toggle-кнопки — `data-value`. Подсветка пункта ListBox — класс `listbox-option-active`. Пункт Accordion — класс `accordion-item`. Тон строки Table — `data-variant`. Китовые `data-*` пишутся после `{...rest}`.

- **Оверлеи:** одно закрытие — `closeOnEscape`, `closeOnInteractOutside`, `onEscapeKeyDown`, `onInteractOutside` (`preventDefault()` оставляет панель открытой), `initialFocus`. Ушли `dismissOnBackdrop`, `isDismissable`, `shouldDismiss`, `delayShowMs`. Задержки Tooltip и HoverCard — `openDelay` / `closeDelay`. Позиция (`side`, `align`, `offset`, `collisionPadding`, `avoidCollisions`) на корне и на плавающей панели, значение панели побеждает. `asChild` у триггеров оверлеев по умолчанию `true`. `Dialog.Overlay` и `AlertDialog.Overlay` — маркеры. У AlertDialog есть `Action` и `Cancel`.
- **Части полей:** `Select.Shell`, `ComboBox.Shell`, `PinInput.Shell`, `PinInput.Control`, `TagsInput.Shell` (`inputRef` на нативный input, `ref` / `className` на оболочке). `Dropdown.SubPopover` (слот `subPopover`). У Calendar слоты `title` и `day`. У `Breadcrumbs.Item` есть `asChild`. У `Pagination.Page` есть `href`. Pressable `Card` принимает `href` и `asChild` (карточка-ссылка, в том числе `next/link`).
- **Calendar day model:** `today`, `selected`, `rangeStart`, `rangeEnd` вместо `isToday`, `isSelected`, `isRangeStart`, `isRangeEnd`.
- **`Calendar.Day`:** публичные пропы `today`, `current` и нативный `aria-label`. Внутренние имена ячейки сетки (`isToday`, `ariaLabel`, `rovingKey`, `cellKind`, `rounded`) с типа дня сняты.

- **Публичная поверхность:** из `burne-ui` и фасадов компонентов ушли хелперы и дубли частей. Они в `burne-ui/internal`: `buttonRippleTone`, `resolveAlertStatus` / `resolveAlertVariant` / `resolveAlertLiveRole`, `footerButtonSizeForAlertDialog`, `primaryButtonVariantForAlertTone` / `primaryButtonStatusForAlertTone`, `sliderThicknessToCss`, `TABLE_ROW_TONE_SURFACE`, `MOTION_CONFIG_DEFAULTS`, `FONT_WEIGHT_CSS_VAR` / `FONT_WEIGHT_DEFAULTS`, классы и `useSelectionIndicatorAnimation` у SelectionIndicator. Отдельных runtime-имён `DialogContent`, `LabelRoot`, `LabelSlot`, `ToggleButtonGroupRoot` и частей `ToggleButton*` больше нет — только compound (`Dialog.Content`, `Label.Slot`, `ToggleButton.Content`). `prefersReducedMotion` остаётся в корне. Снимок runtime-экспортов — `docs/public-api.snapshot.txt`, проверка — `check-public-surface`.
- **ContextMenu:** панель меню — `ContextMenu.Popover`. Части `Content` больше нет. Тип `ContextMenuContentProps` переименован в `ContextMenuPopoverProps`. `SubPopover` — подменю (`Dropdown.SubPopover`).
- **Имена пропов:** у `Table.Column` `isRowHeader` → `rowHeader`, `allowsSorting` → `sortable`. У ячейки Calendar (`Calendar.Day` и модель дня) `onPress` → `onClick`, `isDisabled` → `disabled`. У Card один обработчик — `onClick`; `onPress` и тип `CardPressEvent` удалены.
- **CheckboxGroup `multiple`:** набор выбранных пунктов — `values` / `defaultValues` / `onValuesChange`. `value` / `defaultValue` / `onValueChange` остаются только у `selectionMode="single"`. Пункт с `value` внутри `multiple` следует набору группы; его `defaultChecked` не читается. Пункт без `value` по-прежнему на своём `checked` / `defaultChecked`.
- **Accordion:** пропа `defaultOpenIndex` больше нет. Начальный пункт — только `defaultValue` (id строкой). У Item без своего `value` id равен индексу среди соседей: `"0"`, `"1"`, …
- **Поля без `status`:** Input, TextArea, TimeField, NumberInput, Select, ComboBox, PinInput, DatePicker, TagsInput и Checkbox больше не принимают `status` и не пишут `data-status`. Ошибка — `invalid` или `error`: они ставят `aria-invalid`, `data-invalid` и danger-оформление. Из публичного barrel ушли `InputStatus`, `TextAreaStatus` и `TimeFieldStatus`.
- **Публичный motion:** низкоуровневые хелперы ушли из `burne-ui` в `burne-ui/internal`: `getMotionConfig`, `overlayMotionConfig`, `MOTION_CONFIG_LIMITS`, `killMotion`, `tweenCssColor`, `resolveCssColor`, `playShadowFade` / `snapShadowFade` / `removeShadowFadeHost`, `resolveAdaptiveHoverLiftScale` / `resolveAdaptivePressSqueezeScale`, `shouldSkipInteractiveHoverLift`, `motionPressSqueezeTotalFor`, реестр `unregisterMotionRecipe` / `hasMotionRecipe` / `listMotionRecipes` / `isKitMotionRecipe`, `KIT_MOTION_RECIPE_META`, `MOTION_RECIPE_METADATA_DEFAULTS`, `isMotionRunActive`, типы `MotionRun`, `MotionCancelReason`, `MotionBroadcastOptions`. `registerMotionRecipe`, `configureMotion` и `motionController` остаются в корне.
- **Имена слотов:** у Pagination нет `motion.control`. Кнопки — `previous`, `next`, `page`, активная страница — `pageActive`, на том же узле, что `classNames`. `playSlot("previous")` играет кнопку «Назад», не все кнопки сразу. У PinInput `classNames` и `motion`: `group` → `shell`, `field` → `control`.
- **Портал-хосты:** у Popover, HoverCard и Tooltip нет `classNames.root` — триггер это `classNames.trigger` и `className` на `*.Trigger`. У Tooltip нет `classNames.icon` и `Tooltip.Icon`: иконка — `Tooltip.Indicator` и `classNames.indicator`. Проп `icon` (свой SVG) остаётся.
- **Имена слотов:** у Drawer фон — `overlay` в `classNames` и `motion`, часть — `Drawer.Overlay` (маркер `closeOnInteractOutside`, сам узел не рисует). У Select и ComboBox оболочка поля — `shell` и части `Select.Shell` / `ComboBox.Shell`.
- **Слоты:** ColorSlider — `classNames` (`root`, `label`, `value`, `track`, `thumb`). ColorPicker пробрасывает `panel` / `panelRelative` в Popover. `Tabs.List` принимает `classNames` и `ref`; `Tabs.Tab` `asChild` получает классы вкладки, `className` child побеждает. Stepper — `classNames.trigger` и `Stepper.Trigger`. TagsInput — `classNames.tagText`, `TagsInput.Tag` и `TagsInput.Remove`. У Dropdown `subPopover` — оболочка подменю, `subPopoverBody` — тело. У Table `columnButton` — кнопка, `columnInner` — внутренний span и у сортируемой, и у статичной колонки.
- **Иконки триггеров:** ComboBox получил `classNames.triggerIconWrap`; размер шеврона — `icon-slot` / `icon-slot-*` на wrap. Select: размер с SVG на wrap, `motion.triggerIcon` → `triggerIconWrap`. CloseButton: `classNames.icon` и `icon-slot-*` на `<span>`, SVG без классов размера. `classNames.triggerIconWrap="icon-slot-large"` (и `classNames.icon` у CloseButton) меняет размер.
- **Слоты Expandable / Accordion / Disclosure:** у Expandable нет `classNames.body` и `motion.body` — панель это `panel` (`playSlot("panel")`). У Accordion `panel` — `<section>`, `body` — `Accordion.Body`; в Item пробрасываются `contentWrap` и `triggerRippleOverlay`. У Disclosure `contentPanel` и `body` схлопнуты в `content`; `ref` / `className` / `style` / `rest` у `Disclosure.Content` на `<section>`.
- **ESM-only:** пакет больше не публикует CommonJS. Нет `exports.require` и файлов `.cjs`. `require("burne-ui")` — Node 22 (`require(esm)`) или динамический `import()`. В `.d.ts` относительные импорты с расширением `.js` (`nodenext`).
- **Gloss — плагин:** `gloss` не вариант кита и не регистрируется из `burne-ui`. Стекло — пакет `burne-ui-skin-gloss`: `import { gloss } from "burne-ui-skin-gloss"`, `skins={[gloss]}` и `import "burne-ui-skin-gloss/styles.css"` после `burne-ui/styles.css`. Без пакета `variant="gloss"` — неизвестная строка, фолбэк на `default`. Из кита ушли CSS `gloss-*`, токены `--gloss-*`, слоты `glossPanel` / `glossContent` / `glossShadow` / `glossWrap` и рецепты `hoverLiftGloss` / `pressSqueezeGloss`. Кит играет свои рецепты; карта `motion` скина их подменяет.

| Токен | Было | Стало |
|---|---|---|
| `--space` / `--radius` | `clamp(…, 0.5rem)` | `0.5rem` (8px) |
| `--size` | `clamp(…, 1rem)` | `1rem` (16px) |
| `--space-xsmall` | ×0.618 (4.944px) | ×0.5 (4px) |
| `--space-small` | ×0.875 (7px) | ×0.75 (6px) |
| `--space-2xlarge` | ×4 (32px) | ×3 (24px) |
| `--space-3xlarge` | ×6 (48px) | ×4 (32px) |
| `--space-4xlarge` | — | ×5 (40px) |
| `--space-5xlarge` | — | ×6 (48px) |
| `--control-height-xsmall` | 25.89px | 24px |
| `--control-height-small` | 27.89px | 26px |
| `--selection-indicator-radius-xsmall` | `--radius-xsmall` ×0.618 (3.06px) | `max(0, --radius-small − --space-xsmall)` (3px) |
| `--selection-indicator-radius-small` | `--radius-small` ×0.618 (4.33px) | `max(0, --radius-base − --space-xsmall)` (4px) |
| `--selection-indicator-radius-base` | `--radius-base` ×0.618 (4.94px) | `max(0, --radius-base − --space-xsmall)` (4px) |
| `--selection-indicator-radius-mid` | `--radius-large` ×0.618 (6.18px) | `max(0, --radius-mid − --space-xsmall)` (5px) |
| `--selection-indicator-radius-large` | `--radius-large` ×0.618 (6.18px) | `max(0, --radius-large − --space-xsmall)` (6px) |

- **Form `invalid`:** `aria-invalid` и danger-визуал идут от `invalid` / `error` (и от ошибки Form), не от `status="danger"`. `status` остаётся только цветом. На корне публикуется `data-invalid`. Проп `invalid` есть у form-контролов, групп, `Field` и `Field.Set`.
- **Имена слотов:** `Popover` `classNames.label` / `hint` → `title` / `description` (motion `title` / `description` уже так назывались; motion `label` у Dropdown не менялся). `Link` `classNames.icon` и motion `icon` → `iconStart` / `iconEnd`. `Switch` `classNames.icon` → `iconOff` / `iconOn`.
- **Select / ComboBox:** `role="combobox"` и `aria-*` стоят на фокусируемом узле (`Select.Value`, `ComboBox.Input`). Оболочка больше не combobox и не несёт `aria-disabled`. Закрытый ComboBox не `readOnly`: ввод открывает список и фильтрует.
- **Тени:** `Calendar` и pressable `Card` — второй уровень, как Alert: тень в покое и больше при наведении. У Calendar масштаб панели не меняется. У pressable Card обрезка радиуса внутри, чтобы слои тени не срезались. `Expandable` и `Disclosure` `card` без тени в покое, hover `--shadow-lift`. Поверхности, модалки и меню остаются с тенью в покое.
- **ColorSwatch:** стили и кольцо фокуса в `colorSwatchStyles.ts` (`focus-ring`). Выбранное состояние — `data-state="selected"` и слот `classNames.selected`. У thumb ColorPicker внутреннее кольцо — `border-background`. Ручка resize у TextArea красится `text-muted`.
- **Form.ErrorSummary:** больше не `role="alert"`. Узел всегда в DOM (`tabIndex={-1}`, sr-only, `aria-live="polite"`). Фокус после submit — на первом невалидном поле. Короткое объявление счёта остаётся у `Form.Announce`.
- **Ripple:** `ref` указывает на клип-обёртку слоя. Карты `classNames` нет.
- **CheckboxGroup `required`:** `aria-required` на группе. Нативный `required` больше не ставится на первый checkbox.
- **TimeField `required`:** `aria-required` на группе (`fieldset`), не на первом сегменте.
- **Button:** `motionState="loading"` ставит `aria-busy` на кнопку.
- **Drawer.Handle:** доступное имя — `labels.close` («Close»), не «Drag down to close». Ключи `drawerDrag*` убраны из `BurneLabels`.
- **BurneLabels:** строки формы, слайдера, switch, radio, календаря, пустого ListBox и Loading берутся из провайдера (`BURNE_LABELS_RU` тоже).
- **`data-search-expanded` и `data-allows-sorting` удалены.** Состояние поиска — `data-state="expanded" | "collapsed"`. Сортировка колонки — проп `sortable` и `aria-sort`.

### Migration

С 1.8.8. Строка — замена в коде приложения. Подробности — в Breaking выше. Шкала `--space` / `--radius` / `--size` / `--control-height-*` — таблица там же.

| Было | Стало |
|------|-------|
| Calendar `initialView` | `defaultView` (и `view` / `onViewChange`) |
| Toast `timeout` | `duration`. `add({ onClose })` |
| `Disclosure.Group accordion={false}` | `selectionMode="multiple"` и `values` / `defaultValues` |
| `<Text variant="base">`, `<Label variant="base">`, `Field.Hint variant` | `textStyle="base"` (проп необязательный) |
| `font-w-regular`, `--font-w-regular` | шаг шкалы `base` (`--font-w-base`) или свой вес |
| `ButtonGroup buttonSize` | `size` |
| `<Loading type="dots" color="danger">` | `indicator="dots" status="danger"` |
| `<PinInput type="text">` | `charset="text"` |
| `<Switch labelPosition="left">` / `"right"` | `"start"` / `"end"` |
| `data-tab-value`, `data-toggle-button-value` | `data-value` |
| `dismissOnBackdrop`, Drawer `isDismissable`, `shouldDismiss` | `closeOnInteractOutside`. Отмена закрытия — `onInteractOutside` / `onEscapeKeyDown` и `preventDefault()` |
| Tooltip `delayShowMs` | `openDelay` / `closeDelay` |
| `Select.TriggerGroup`, `ComboBox.InputGroup`, `PinInput.Group` | `Select.Shell`, `ComboBox.Shell`, `PinInput.Shell` |
| `PinInput.Field` | `PinInput.Control` |
| `TagsInput.Control` | `TagsInput.Shell`. Нативный input — `inputRef` |
| `Dropdown.SubContent`, слот `subContent` | `Dropdown.SubPopover`, слот `subPopover` |
| Calendar `headerTitle`, `dayCell` | `title`, `day` |
| Calendar day `isToday` / `isSelected` / `isRangeStart` / `isRangeEnd` | `today` / `selected` / `rangeStart` / `rangeEnd` |
| `Calendar.Day` `isToday` / `isCurrent` / `ariaLabel` | `today` / `current` / `aria-label` |
| `@import "burne-ui/theme-bridge.css"` | `@import "burne-ui/tailwind.css"` |
| `Breadcrumbs.Item` только `href` | ещё `asChild` |
| `Pagination.Page` без адреса | `href` |
| Pressable `Card` только `<button>` | `href` или `asChild` |
| `import { buttonRippleTone, resolveAlertStatus, resolveAlertVariant, resolveAlertLiveRole, footerButtonSizeForAlertDialog, primaryButtonVariantForAlertTone, primaryButtonStatusForAlertTone, sliderThicknessToCss, TABLE_ROW_TONE_SURFACE, MOTION_CONFIG_DEFAULTS, FONT_WEIGHT_CSS_VAR, FONT_WEIGHT_DEFAULTS } from "burne-ui"` | те же имена из `burne-ui/internal` |
| `DialogContent`, `LabelRoot`, `LabelSlot`, `ToggleButtonGroupRoot`, `ToggleButtonRoot` и остальные части `ToggleButton*` | `Dialog.Content`, `Label.Slot`, `ToggleButton`, `ToggleButton.Content` |
| классы SelectionIndicator и `useSelectionIndicatorAnimation` из `burne-ui` | `burne-ui/internal` |
| `getMotionConfig`, `killMotion`, `tweenCssColor`, `resolveCssColor`, `playShadowFade` и остальные хелперы motion из Breaking | `burne-ui/internal`. `configureMotion`, `registerMotionRecipe`, `motionController`, `prefersReducedMotion` остаются в `burne-ui` |
| `ContextMenu.Content` / `ContextMenuContentProps` | `ContextMenu.Popover` / `ContextMenuPopoverProps`. Подменю — `SubPopover` |
| `Table.Column` `isRowHeader` / `allowsSorting` | `rowHeader` / `sortable` |
| `Calendar.Day` `onPress` / `isDisabled` | `onClick` / `disabled` |
| `Card` `onPress`, тип `CardPressEvent` | `onClick` |
| CheckboxGroup `selectionMode="multiple"`: `value` / `defaultValue` / `onValueChange` | `values` / `defaultValues` / `onValuesChange`. `defaultChecked` у пункта с `value` не читается |
| Accordion `defaultOpenIndex` | `defaultValue` (id строкой; без своего `value` у Item id = `"0"`, `"1"`, …) |
| `status` на Input, TextArea, TimeField, NumberInput, Select, ComboBox, PinInput, DatePicker, TagsInput, Checkbox | `invalid` или `error`. Типов `InputStatus`, `TextAreaStatus`, `TimeFieldStatus` нет |
| Form `status="danger"` как сигнал ошибки | `invalid` / `error`. `status` остаётся только цветом. На корне — `data-invalid` |
| Pagination `motion.control` | `previous`, `next`, `page`, `pageActive` |
| PinInput `classNames` / `motion` `group` / `field` | `shell` / `control` |
| Popover, HoverCard, Tooltip `classNames.root` | `classNames.trigger` и `className` на `*.Trigger` |
| `Tooltip.Icon`, `classNames.icon` | `Tooltip.Indicator`, `classNames.indicator` |
| Drawer `classNames.backdrop` / `motion.backdrop` (имя из 1.8.8) | `overlay`, часть `Drawer.Overlay` |
| Select / ComboBox слот оболочки поля | `shell`. Части `Select.Shell` и `ComboBox.Shell` |
| Expandable `classNames.body` / `motion.body` | `panel` |
| Disclosure `contentPanel` и `body` | `content` |
| `require("burne-ui")` в CJS-сборке | ESM. Node 22 — `require(esm)`, иначе `import()` |
| `variant="gloss"`, CSS `gloss-*`, слоты `glossPanel` / `glossContent` / `glossShadow` / `glossWrap`, рецепты `hoverLiftGloss` / `pressSqueezeGloss` | пакет `burne-ui-skin-gloss`: `skins={[gloss]}` и `burne-ui-skin-gloss/styles.css` после `burne-ui/styles.css` |
| Slider `ariaLabel` | `aria-label` |
| Switch `gloss`, Slider `gloss`, `Switch.Control` `gloss` | пропа нет. Стекло — `burne-ui-skin-gloss`, как строка `variant="gloss"` выше |
| Popover `classNames.label` / `hint` | `title` / `description` |
| Link `classNames.icon` и `motion.icon` | `iconStart` / `iconEnd` |
| Switch `classNames.icon` | `iconOff` / `iconOn` |
| `role="combobox"` на оболочке Select / ComboBox | на `Select.Value` и `ComboBox.Input`. Закрытый ComboBox не `readOnly` |
| `data-search-expanded` | `data-state="expanded"` \| `"collapsed"` |
| `data-allows-sorting` | пропа нет. Сортировка — `sortable` и `aria-sort` |
| `Form.ErrorSummary` `role="alert"` | узел всегда в DOM, `aria-live="polite"`. Фокус после submit — на первом невалидном поле |
| CheckboxGroup `required` на первом checkbox | `aria-required` на группе |
| TimeField `required` на первом сегменте | `aria-required` на `fieldset` |
| Dropdown / `Dropdown.Group` `selectionIndicator` | пропа нет. Индикатор — `indicator` на `Dropdown.Item` или `<Dropdown.ItemIndicator />` |
| Иконка прямым ребёнком `SelectionIndicator` / `Checkbox.Indicator` / `Radio.Indicator` / `Dropdown.ItemIndicator` / `ListBox.ItemIndicator` (не `Fill` / `Mark`) | проп `icon`. Содержимое `Mark` остаётся mark |
| `firstLevelHoverShadow()` / `secondLevelShadow()` из `burne-ui/internal` | `shadowMotionFor("none")` / `shadowMotionFor(size)` |
| `SHADOW_LAYER_GEOM` из `burne-ui/internal` | `SHADOW_INTERACTION_GEOM` |
| RadioGroup / CheckboxGroup / Select / ComboBox `options` | `items`. Типы: `RadioGroupItem`, `CheckboxGroupItem`, `SelectItem`, `SelectItemGroup`, `SelectItemSection`, `ComboBoxItem` |
| Container `size`, тип `ContainerSize` | `maxWidth`, тип `ContainerMaxWidth`. Классы `max-w-page-*` (`--max-page-*`) |
| Sidebar `size`, тип `SidebarSize` | `width`, тип `SidebarWidth`. Классы `w-page-*` |
| `AppShell sidebarSide` | `side` на каждом `Sidebar`. `data-side` на колонке |
| Tabs `forceMount` | `keepMounted` (по умолчанию `true`) |
| `registerSkinSlots` из `burne-ui/authoring` | `burne-ui/skin` |
| `defineSkin`, `defineSkinRecipe`, `skinRecipeName` из `burne-ui` | `burne-ui/skin`. Тип `SkinDefinition` есть в обоих входах |
| `hexToHsva`, `hsvaToHex` и остальные конвертеры цвета, `RIPPLE_COLOR`, `HOVER_CARD_OPEN_DELAY`, `HOVER_CARD_CLOSE_DELAY`, `ToastContext`, `useToastContext`, `KIT_MOTION_RECIPES`, `isMotionFeatureEnabledFor`, `SHADOW_CSS_VAR`, `Z_INDEX_CSS_VAR`, `Z_INDEX_DEFAULTS`, `NARROW_VIEWPORT_MAX_PX` из `burne-ui` | `burne-ui/internal`. Типы `HSVA`, `RGBA`, `RippleColor`, `ToastContextValue` остаются в `burne-ui` |
| `MotionGroupMember` | хук `useMotionGroupMember` |
| NumberInput: группировка остаётся в поле при фокусе | `locale` (по умолчанию `en`). Фокус показывает сырое число, blur форматирует. `aria-valuetext` — отформатированная строка |
| `items` и compound-дети рисуют одну и ту же часть дважды (Tabs, Accordion, Dropdown, ListBox, RadioGroup, CheckboxGroup, ToggleButtonGroup) | `items` заполняет только части, которых нет среди детей. Совпадение пишет ошибку в dev |
| подписи `resizeColumn` / ошибка toast зашиты строкой | `resizeColumnNamed` (`{name}`), `resizePanels`, `toastError` в `BurneLabels` |

## 1.8.8

Накоплено с 1.5.9: пакетные 1.6.x–1.8.7 выходили без отдельных записей; публичные breaking / migration — здесь.

### Added

- **`Dialog.Panel onInteractOutside`**: клик по overlay. `event.preventDefault()` оставляет диалог открытым; `return false` не отменяет dismiss. `dismissOnBackdrop={false}` по-прежнему полностью выключает закрытие.
- Публичный тип **`Prettify<T>`** (`burne-ui`) — на пропах `classNames?: Prettify<XxxClassNames>`, чтобы IDE hover показывал слоты, а не только алиас.
- Токен **`--color-transparent-hover`** / `bg-transparent-hover` — hover для `outline` / `ghost` (Button, CloseButton, ToggleButton); `default-hover` остаётся для surface/menus.
- Токен **`--color-muted-foreground`** — текст на muted-поверхностях; утилита **`text-muted`** читает его (а не `--color-muted`). `--color-muted` — muted surface (`bg-muted`).
- `Text`: `variant` мапится на утилиты `text-*` (не `[font-size:…]`), чтобы `className` / `classNames` с `text-large` и т.п. корректно twMerge’ились; `@utility text-*` уважают `--tw-leading` / `--tw-font-weight`.
- `BurneThemeConfig.customTokens` для проектных CSS-переменных, mode-specific значений и metadata автоматических контролов.
- Theme runtime preview API (`useBurneThemeRuntime`) для отдельного пакета `burne-ui-devtools`.
- Публичный примитив **`Field`** (`Field`, `Field.Hint`, `Field.Label`).
- **Dual API** (simple + compound) для `Input`, `Select`, `Switch`, `Meter`, `ProgressBar`, `Slider`, **`Avatar`** (`src` + `label` без children; compound — `Avatar.Image` / `Avatar.Fallback`).
- **`Badge`**: inline-иконки в `children` через `data-icon="inline-start" | "inline-end"`; prop `icon` игнорируется при наличии таких children.
- **`Breadcrumbs`**: при сжатии кнопка «…» открывает **`Dropdown`** со скрытыми разделами.
- **`Dropdown.Item`**: опциональный **`href`** — link-пункт (`<a role="menuitem">`); клавиатура ↑↓ / Home / End / Escape в `Dropdown.Popover`.
- **`Checkbox`**: dual API — compound `Checkbox.Control` / `Checkbox.Indicator` / `Checkbox.Content` / `Checkbox.Label` / `Checkbox.Hint`.
- Общие части шкал: `scaleFieldParts` (`ScaleFieldHeader`, `ScaleFieldValue`, `renderScaleSimpleLayout`).
- **Browser support:** Chrome 111+ / Safari 16.4+ / Firefox 128+ — `browserslist` in `package.json`, matrix in README, `docs/SETUP.md`, site `/docs/browsers`. JS bundle remains `es2020`.

### Changed

- **Tree-shaking:** kit motion recipes регистрируются лениво из `runMotionPhase`; published ESM — `preserveModules` (`import { cn }` не тянет GSAP).
- **JS target:** `es2020` — нет `.toSorted()` и другого ES2023.
- **`--color-muted`** — теперь muted surface (`bg-muted`); прежние серые значения текста переехали в **`--color-muted-foreground`**. Класс **`text-muted`** → `color: var(--color-muted-foreground)`. Light muted surface: `12%` foreground (dark: `6%`).
- Hover outline/ghost: **`--color-surface-transparent`** → **`--color-transparent-hover`** (`bg-transparent-hover`, theme key `transparentHover`; mix `muted 70%` + transparent).
- Единое имя подсказки поля: **`Hint`** вместо `Description` / `description` в field API.
- `Dropdown`: programmatic focus — `focusKeyboard` for menu arrows; `focusElement` for open/restore (UA `:focus-visible` from last input).
- Shared **`focusElement`** / **`focusKeyboard`** / **`focusPanelOnOpen`**: roving uses `focusKeyboard`; menu rows tint via `hoverVariant` (no item `focus-ring`); modals focus first control on open with ring only after keyboard.
- **`ToggleButtonGroup`**: root removed from Tab sequence; roving tabindex for `single` and `multiple`; arrows / Home / End move focus only; Enter/Space activate selection on the focused button.
- `Dropdown` в joined `ButtonGroup`: root получает `rounded-[inherit]`, чтобы скругление last/first сегмента на trigger Button наследовалось от группы.
- `ComboBox` / `Select` в joined `ButtonGroup`: `Field` root — тот же radius bridge (`BUTTON_GROUP_RADIUS_BRIDGE_CLASS`); `Select` добавлен в segment slots.
- `Switch.Description` → `Switch.Hint`.
- `CheckboxGroup.Description` / `RadioGroup.Description` → `*.Hint`.
- `description` prop у `Checkbox` / `Radio` → **`hint`**.
- `descriptionId` у групп опций → **`hintId`**.
- `sliderThicknessToCss` перенесён в `sliderStyles.ts` (публичный экспорт `Slider` / `burne-ui` тот же). `isFramedVariant` — в `disclosureStyles.ts`.
- `selectionIndicatorTokens.ts` → `selectionIndicatorStyles.ts`; `SelectionIndicatorSize` / `Variant` — в `selectionIndicatorTypes.ts`.
- **Drawer:** слот `classNames` / `motion` `overlay` → **`backdrop`** (имя = `Drawer.Backdrop`). Dialog / AlertDialog остаются на `overlay` — публичной `Backdrop` части нет.
- `ButtonStatus` / `BadgeStatus` / `AlertStatus` / `ToastStatus` / `DropdownItemStatus` — алиасы **`SemanticStatus`** (`default | danger | success | info | warning`). Публичные имена те же.
- Dropdown / Select / ComboBox: `max-height` меню **`70vh` / `65vh` → `70dvh` / `65dvh`** (dynamic viewport, iOS URL-bar).

### Fixed

- **body-scroll-lock:** синглтон-счётчик + iOS `position: fixed`; `overscroll-behavior: contain` на скролле панелей.
- **Motion leave:** посторонний play (hover / app-event) не вытесняет активный `leave`.
- **Gloss hairline:** `-webkit-mask` + `-webkit-mask-composite: xor` перед `mask-composite: exclude` (Chrome 111–119 / old WebKit).
- **Forced colors / Windows HCM:** `@media (forced-colors: active)` in `styles.css` — `Highlight` focus rings (inset switches to outline), `forced-color-adjust: none` on status surfaces, and border/glyph fallbacks so Checkbox / Radio / ToggleButton / Calendar / Switch selected state stays visible when GSAP fills are remapped.
- **Switch compound:** `Switch.Label` ставит `htmlFor` из `switchId` в контексте; compound root — `<fieldset>`, Control — wrapping `<label>` (клик по track). Simple — root `<label htmlFor>`.
- **Input file remove:** `onChange` / `assignInputFiles` run after `setPickedFiles`, not inside the updater (React 18/19 StrictMode was firing the callback twice).
- **Overlay reflow (iOS keyboard):** Popover / Tooltip / Dropdown submenu listen to `visualViewport` `resize`/`scroll` and use `{ passive: true }` on capture `scroll` (`bindOverlayReflow`).
- **Input file preview:** `URL.createObjectURL` в `useLayoutEffect`, не в `useMemo` во время рендера (revoke в cleanup того же эффекта — нет утечки, если рендер упадёт). Preview: `file.type` `image/*`, иначе последнее расширение после `.` (`my photo.jpg` → `jpg`); имя без точки не считается расширением (`split(".").pop()`).
- **Motion root shorthand:** `motion={{ hoverIn }}` на корне игнорируется; в dev — `console.error`. Нужен слот: `motion.root.hoverIn`.
- **ResizeObserver:** guard `typeof ResizeObserver === "undefined"` в Toast / ColorSlider / Slider / Switch — как у Tabs / collapsible / gloss (effect всё равно не на SSR; единая конвенция).

### Removed

- Внутренний `fieldShell.tsx` (заменён на `@/components/core/Field`).
- Мёртвые `useFirstLevelInteractiveMotion.ts` и `optionGroupParts.tsx` (нигде не импортировались; Button — `hoverInteractiveLift` + slot motion, группы — `optionGroupFieldset` / свои `*Parts`).
- Неиспользуемый runtime `OptionGroupList` — `CheckboxGroup.List` / `RadioGroup.List` рисуют свою разметку. Тип `OptionGroupListProps` остаётся.
- Алиасы **`BadgeIconPosition`**, **`LinkIconPos`**, **`DisclosureChevronPos`** — везде **`IconPosition`**.

### Migration

| Было | Стало |
|------|-------|
| `--color-muted` как цвет текста / `text-muted` → muted hex | `--color-muted-foreground` для текста; `text-muted` уже мапится; в палитре ключ `mutedForeground` |
| `--color-surface-transparent` / `bg-surface-transparent` / `surfaceTransparent` | `--color-transparent-hover` / `bg-transparent-hover` / `transparentHover` |
| `bg-muted` для spinner / grip (Loading, TextArea) | `bg-muted-foreground` (kit уже обновлён) |
| `<Switch.Description>…</Switch.Description>` | `<Switch.Hint>…</Switch.Hint>` или prop `hint` на `<Switch>` |
| `<CheckboxGroup.Description>…</CheckboxGroup.Description>` | `<CheckboxGroup.Hint>…</CheckboxGroup.Hint>` |
| `<RadioGroup.Description>…</RadioGroup.Description>` | `<RadioGroup.Hint>…</RadioGroup.Hint>` |
| `<Checkbox description="…" />` | `<Checkbox hint="…" />` |
| `<Radio description="…" />` | `<Radio hint="…" />` |
| `descriptionId` на `CheckboxGroup` / `RadioGroup` | `hintId` |
| Drawer `classNames.overlay` / `motion.overlay` | `backdrop` |
| `BadgeIconPosition` / `LinkIconPos` / `DisclosureChevronPos` | `IconPosition` |

**Не менялось:** `Dialog.Description`, `Card.Description`, `Alert.Description`, `Dropdown.Item description` — это контент UI, не field hint.

### Simple mode examples

```tsx
// Input
<Input label="Email" hint="Обязательно" placeholder="you@example.com" />

// Selector
<Selector label="Язык" hint="…" options={…} value={v} onValueChange={setV} />

// Switch
<Switch label="Уведомления" hint="Push" defaultChecked />

// Meter / ProgressBar / Slider
<Meter label="CPU" showValue value={65} />
<ProgressBar label="Загрузка" showValue value={42} />
<Slider label="Громкость" showValue defaultValue={50} />

// Avatar
<Avatar label="Grace Hopper" src="/photo.jpg" nickname="grace_h" />

// Badge (inline icon)
<Badge variant="secondary">
  <CheckIcon data-icon="inline-start" />
  Verified
</Badge>
```

## 1.5.9

### Breaking

- Boolean props: `isRequired` → `required`, Toast `isLoading` → `loading`, Pagination.Page `isActive` → `active` (ListBox keyboard `isActive` unchanged).
- Theme config: `modes.light` / `modes.dark` → flat **`colors.light` / `colors.dark`** (status foregrounds + hover tokens — обычные ключи палитры).
- Убран `borderCustomized` — `--color-border` всегда задаётся как остальные цвета.
- Из публичного API убраны named color presets (`OCEAN_*` и др.), `FONT_PRESETS` / `LAYOUT_PRESETS` / `COLOR_PRESET_*` — живут на docs site и в playground.
- Убраны публичные `PRIMARY_TINT` / `PRIMARY_TINT_STRONG`, `BORDER_COLOR_CSS_FORMULA`, `finalizePalette`, `ThemeColorSeed` — дефолтные палитры собираются внутри кита; named presets на site/playground — плоские `ThemeColors`.
- `DARK_COLORS` / `LIGHT_COLORS` — плоские снимки (без seed/`finalizePalette`).
- Удалён неиспользуемый токен `--color-surface-tint-primary`.
- В палитру / конфиг добавлены converge-ripple цвета (`convergeRipple*`).
- Убран editor chrome из публичного API (`*_LABELS`, `GSAP_EASE_OPTIONS`, `RIPPLE_EASE_CSS_OPTIONS`, …) — только site/playground `themeEditorChrome`.
- Удалён алиас `ThemeModePalette` (используйте `ThemeColors`).
- `resolveBurneTheme` / `resolveConfigTheme` → единый **`resolveTheme`**.
- `colorPreset` убран из `ThemeTokenState` — только в site/playground `ThemeEditorState`.
- `SCALE_DEFAULTS` разрезан: scale-only + **`MOTION_DEFAULTS`** (шрифты по-прежнему `DEFAULT_FONT*` / `FONT_WEIGHT_DEFAULTS`).
- Scaffold / `burne-ui init` пишут стартовый `burne-theme.ts` и провайдер с `config={burneTheme}`.

### Added

- `createDefaultBurneThemeConfig` / `exportDefaultBurneThemeConfigSource`.
- `DARK_COLORS` / `LIGHT_COLORS` (только дефолтная пара; named presets — плоские снимки на site/playground).
- Editable hover CSS vars в конфиге (`primaryHover`, `defaultHover`, surface-tint-*, fill-hover, …).
- Converge-ripple цвета в палитре / `BurneThemeConfig` (`convergeRipple*`).
- `resolveTheme`, `MOTION_DEFAULTS`.

### Migration

| Было | Стало |
|------|-------|
| `modes: { dark: { colors: {…} } }` | `colors: { dark: {…} }` |
| `import { OCEAN_DARK_COLORS } from "burne-ui"` | инлайн в `burne-theme.ts` или Copy config с сайта |
| отдельный `statusForegrounds` | ключи `dangerForeground` и т.д. внутри `colors.*` |

## 1.5.6

### Fixed

- `Form` + `Input`: form-bound controls no longer flip from uncontrolled → controlled when `getValue` is still `undefined` (coerce to `""`, same pattern as Select/ComboBox). Fixes React console warning on Card auth demos and any `<Input name>` inside `<Form>` without `defaultValues`.

## 1.5.5

### Fixed

- `Tooltip.Trigger` / `Popover.Trigger`: public `asChild` prop in types (merge onto child Button); default `asChild` stays on for a single element child.

## 1.5.4

### Fixed

- `RadioGroup` / `CheckboxGroup`: do not forward `onValueChange`, `value`, `defaultValue`, `required`, `hintId`, `errorId` (and `selection` for CheckboxGroup) to the native `<fieldset>`.
- `Pagination`: no horizontal overflow in narrow parents — `min-w-0` / wrap on root & content, drop `shrink-0` on the controls list, truncate summary.
- `Popover` / `Dropdown`: apply `matchAnchorWidth` minWidth **before** placement measure so viewport clamp keeps the panel on-screen (esp. trailing triggers on mobile). Drop the hardcoded `12rem` floor — width follows content (or `className` `min-w-*`).
- `Skeleton.Text`: unique keys per line (was keyed by width class `w-full`, which duplicated).

## 1.5.3

### Fixed

- Gloss blur OOTB: `-webkit-backdrop-filter` before `backdrop-filter` (Lightning CSS drops the unprefixed property when webkit is second) + reinforce at end of `styles.css`. No app `globals.css` fallback needed.
