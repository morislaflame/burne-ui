# burne-ui-skin-__SKIN_NAME__

Ярус 1. Токены — `src/skin.json`. CSS — `src/skin.css`. Импорт пакета вызывает `registerSkin`.

```css
@import "burne-ui/styles.css";
@import "burne-ui-skin-__SKIN_NAME__/styles.css";
```

```tsx
import { __SKIN_IDENT__ } from "burne-ui-skin-__SKIN_NAME__";

<BurneUIProvider skin="__SKIN_NAME__" skins={[__SKIN_IDENT__]}>
  …
</BurneUIProvider>
```

Проверка: `npx burne-ui skin validate`.

Слои (`src/layers.tsx`) прокидывают `ref` на DOM-узел (`{...props}` или `ref={ref}`). `--shadow-*` — целая строка из двух слоёв, как у кита. Focus ring и `forced-colors` не задаются. `--color-foreground` на `--color-surface` — контраст WCAG AA (4.5:1).
