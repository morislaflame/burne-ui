# ADR 0001: Порог браузеров

Статус: принято (06.10.2026).

## Контекст

Кит не полифиллит современный CSS. Тема, тени и прозрачности собраны из `color-mix(in oklab, …)` (Chrome / Edge 111). Типизированные custom properties Tailwind v4 (`@property`) доезжают в Safari 16.4 и Firefox 128. Ниже этой планки fallback — это вторая палитра на каждый токен, а `@property` из Tailwind обойти нельзя.

Рядом используются `:has()`, `dvh`, `inert`. Они не поднимают планку выше 111 / 16.4 / 128. `oklch()` встречается в примерах цвета, не в хранимой палитре. Gloss-бордер: `mask-composite: exclude` и `-webkit-mask-composite: xor` (Chrome 111–119; без префикса — Chrome 120+).

JS-бандл остаётся `es2020`. Сборка **не** даунлевелит CSS по `browserslist`: `styles.css` уходит как написан.

## Решение

Порог не опускать.

| Браузер | Мин. версия | Ограничивающая фича |
|---------|-------------|---------------------|
| Chrome / Edge / Android Chrome | 111 | `color-mix()` |
| Safari / iOS Safari | 16.4 | `@property` |
| Firefox / Firefox for Android | 128 | `@property` |

`package.json` → `browserslist`: `chrome >= 111`, `and_chr >= 111`, `edge >= 111`, `firefox >= 128`, `and_ff >= 128`, `safari >= 16.4`, `ios_saf >= 16.4`.

Та же таблица: `README.md`, `docs/SETUP.md`, сайт `/docs/browsers` (ru / en). Guard `scripts/check-browser-floor.mjs` в `npm run lint` сверяет версии.

## Ниже порога

Без `color-mix()` ломаются тени и прозрачности (смешанные цвета поверхностей, бордеров, ripple). Раскладка (flex, grid, отступы, типографика) остаётся.

`:has()` в `styles.css` — усиления, не каркас:

- `.animate-shadow:has(> [data-burne-shadow-fade])` снимает тень хоста, когда слои fade уже смонтированы. Без селектора тень рисуется дважды.
- `.has-focus-ring:has(:focus-visible)` рисует кольцо на оболочке, когда фокус на скрытом native input. Без селектора контрол работает, кольцо на оболочке не появляется.
- То же кольцо в `forced-colors`.
- `:not(:has([data-selection-fill]))` в `forced-colors` красит метку в `Highlight`, если слоя заливки нет. Без селектора метка остаётся `HighlightText`.

`field-sizing: content` у TextArea — progressive enhancement (Chromium 123+). Без него поле не растёт, остальное работает.

## Что не делаем

Не добавляем fallback-палитру и не понижаем `browserslist`, чтобы собрать старые Safari 15 / Firefox 115 / Chrome 109.
