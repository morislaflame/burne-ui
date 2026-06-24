import { GlossComponentsDemo } from "../demos/gloss/GlossComponents.demo";
import glossComponentsSource from "../demos/gloss/GlossComponents.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function GlossShowcase() {
  return (
    <ShowcasePage
      title="Gloss"
      description="Система стеклянных поверхностей variant=&quot;gloss&quot; — кнопки, поля, карточки, модалки и интерактивные ячейки."
      importPath='variant="gloss" на поддерживаемых компонентах'
      tags={["variant", "theme"]}
    >
      <ShowcaseSection
        title="Компоненты с gloss"
        description="Единый визуальный язык стеклянных панелей с conic-обводкой и hover-lift."
      >
        <ShowcaseDemoFromFile padding="plus" align="stretch" Demo={GlossComponentsDemo} source={glossComponentsSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Применение">
          <p>
            Передайте <code>variant=&quot;gloss&quot;</code> на Button, Input, Card, Dialog, Alert и
            других компонентах, где вариант поддерживается. Токены темы управляют прозрачностью и
            обводкой.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Кастомизация">
          <p>
            Gloss-интерактив (hover, press) настраивается через CSS-переменные темы и утилиты{" "}
            <code>glossInteractiveMotion</code>. Для фона демо используйте dotted-grid из{" "}
            <code>glossStoryChrome</code>.
          </p>
        </ShowcaseDoc.Block>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
