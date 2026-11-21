# burne-ui-skin-__SKIN_NAME__

Ярус 1. Токены — `src/skin.json`. CSS — `src/skin.css`. Импорт пакета вызывает `defineSkin`.

```css
@import "burne-ui/styles.css";
@import "burne-ui-skin-__SKIN_NAME__/styles.css";
```

Классы из CSS пакета приезжают с `styles.css`. Утилиты Tailwind в `targets` — через `@source "../node_modules/burne-ui-skin-__SKIN_NAME__";`.

```tsx
import { __SKIN_IDENT__ } from "burne-ui-skin-__SKIN_NAME__";

<BurneUIProvider skin="__SKIN_NAME__" skins={[__SKIN_IDENT__]}>
  …
</BurneUIProvider>
```

Проверка: `npx burne-ui skin validate`. Сборка токенов: `npx burne-ui skin build`.

Слои (`src/layers.tsx`) прокидывают `ref` на DOM-узел (`{...props}` или `ref={ref}`). `--shadow-*` — любое число слоёв. Ширина и отступ кольца не задаются. Блок `forced-colors` допустим, если он не красит кольцо фокуса. Цвет `--color-focus-ring*` допустим при контрасте ≥3:1; без него кольцо берётся из `foreground`. `--color-foreground` на `--color-surface` — контраст WCAG AA (4.5:1). Свои переменные — с префиксом `--__SKIN_NAME__-`.
