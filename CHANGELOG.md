# Changelog

## Unreleased

### Added

- **Импорт компонента:** `import { Button } from "burne-ui/Button"`. Имя пути — имя компонента (`burne-ui/Table`, `burne-ui/Accordion`). Тот же API, что у корня `burne-ui`. Стили по-прежнему из `burne-ui/styles.css`.
- **TagsInput:** поле из чипов. Enter, запятая или blur фиксируют текст. Пустой Backspace снимает последний чип. Повтор не добавляется. `values` / `onValuesChange`, `max`. `variant` и `size` как у Input. `classNames`, slot motion и MotionController. Playground и Storybook. Страница сайта — после публикации кита.
- **Stepper:** дорожка шагов. `value` — id текущего. Пройденные можно выбрать снова, следующие при `linear` недоступны. `orientation` `horizontal` | `vertical` — ось, не variant. `classNames`, slot motion и MotionController. Playground и Storybook. Страница сайта — после публикации кита.
- **HoverCard:** карточка по наведению и фокусу на базе Popover. `openDelay` 400, `closeDelay` 300 — указатель успевает перейти на панель. Клик по якорю не переключает. `Escape` закрывает. `classNames`, slot motion и MotionController на портале карточки. Playground и Storybook. Страница сайта — после публикации кита.
- **ScrollArea:** своя полоса прокрутки. `visibility` `hover` | `scroll` | `always`, `orientation` `vertical` | `horizontal` | `both`. Бегунок, клик по дорожке, клавиатура, RTL по горизонтали. `classNames`, slot motion и MotionController. Playground и Storybook. Страница сайта — после публикации кита.
- **PinInput:** поле из ячеек. `length` 1…12, `type` `number` | `text`, `mask` (точки без `type="password"`, браузер не предлагает пароль), `separator` между половинами. Строка без дыр: вставка заменяет символ, вставка с буфера заполняет ряд, Backspace сдвигает. Один tab stop. `aria-invalid` только от `invalid` / `error`. Иконка в подписи, `classNames`, slot motion и MotionController. Playground и Storybook. Страница сайта — после публикации кита.
- **ContextMenu:** меню по правому клику и Shift+F10 на базе `Dropdown` (пункты, submenu, иконки, выбор, `classNames`). Панель встаёт у курсора. `ContextMenu.Item` по умолчанию закрывает меню как действие. Slot motion и MotionController — на `ContextMenu.Content`. Playground и Storybook. Страница сайта — после публикации кита.
- **Виртуализация списков:** `virtualized` на Select, ComboBox, ListBox и `Table.Body`. В DOM остаётся окно видимых строк фиксированной высоты, без новой зависимости. Клавиатура ходит по всему списку. Секции ListBox и строки разной высоты остаются полностью смонтированными.
- **`Intl` для дат и чисел:** `createCalendarLocale` / `locale="ru"` строят имена месяцев и дней через `Intl`. Дефолт `EN_LOCALE` — `en-GB` (`15 Oct 2026`). Today/Clear: en и ru, остальные языки — английские подписи, пока не переданы `labels`. Поле DatePicker форматирует ту же локаль. Дефолтные подписи Slider, Meter и ProgressBar идут через `formatLocaleNumber` (`en`).
- **Select `multiple`:** несколько значений через `values` / `defaultValues` / `onValuesChange`. Выбор переключает пункт и оставляет меню открытым. В поле подписи в порядке options. Playground и Storybook.
- **NumberInput:** числовое поле со степперами. `value` / `onValueChange`, `min` / `max` / `step`. Пустое плюс ставит `min` или `0`. На blur значение ограничивается и садится на шаг. Кнопки вне tab sequence. Playground и Storybook. Страница сайта — после публикации кита.
- **DatePicker:** поле с календарём в попапе. `mode` `single` | `range`, `value` / `onValueChange`, `open` / `onOpenChange`. Кнопка — оболочка поля, шеврон крутится при открытии. Попап закрывается, когда значение полное. `name` пишет локальный `YYYY-MM-DD` (диапазон — `start/end`). Playground и Storybook. Страница сайта — после публикации кита.
- **Скины, редактор:** playground, группа Theme, страница Skin. Токены, `targets` и `layersDeclarative`, превью в своём контейнере (`SkinProvider` + `portalContainer`). Экспорт JSON, CSS и пакета, ссылка `#skin=`. Схема и разбор файла — `parseSkinDocument` / `SKIN_DOCUMENT_SCHEMA` в `burne-ui/internal`.
- **Скины, CLI:** `burne-ui skin add <name>` собирает пакет из `cli/templates/skin` (копия в `create-burne-app/templates/skin`). `burne-ui skin validate` проверяет декларацию токенов, focus ring, `forced-colors`, контраст `--color-foreground` / `--color-surface` (WCAG AA), слоты `SkinSlot`, `ref` у `layers` и два слоя у `--shadow-*`. Peer шаблона — `^1.8.8`.
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

- **Table:** поверхность, не data grid. Страницы ставит родитель: `Pagination` в `Table.Footer`, в `Table.Body` приходит срез. Ширина колонки — `className`. Раскрытие строки — вторая `Table.Row` или `Expandable` в ячейке. Своего resize и `expanded` нет.
- **Типографика:** `--text-scale-large` `1.15rem` (18.4px) → `1.125rem` (18px). Межстрочный интервал остаётся `1.75rem` (28px). Высоты `--control-height-*` не меняются: `large` по-прежнему считается от `text-mid`.
- **RTL:** стили компонентов читают направление письма (`text-start`, `border-s-token` / `border-e-token`, `start-` / `end-`, `ms-` / `pe-`, `rounded-s` / `rounded-e`). Бегунок Switch и заливка Meter / ProgressBar растут к inline-end. Физическими остаются стороны viewport: Drawer, Toast, якоря Badge и половины ячеек Calendar. `check-logical-directions` не пускает новое `left` / `right` в `*Styles.ts`. Галерея Direction — playground и сайт (`/components/direction`), гайд `/docs/direction`.

### Fixed

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
- **`data-search-expanded` и `data-allows-sorting` удалены.** Состояние поиска — `data-state="expanded" | "collapsed"`. Сортировка колонки остаётся на `aria-sort` / `allowsSorting`.

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
- **Dual API** (simple + compound) для `Input`, `Selector`, `Switch`, `Meter`, `ProgressBar`, `Slider`, **`Avatar`** (`src` + `label` без children; compound — `Avatar.Image` / `Avatar.Fallback`).
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
