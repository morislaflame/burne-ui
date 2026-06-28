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
            Передайте <code>variant=&quot;gloss&quot;</code> на Button, Input, Card, Dialog, Drawer,
            Alert, Badge, Popover и других компонентах, где вариант поддерживается. У Tooltip —{" "}
            <code>surface=&quot;gloss&quot;</code>, у Slider и Switch — булевый проп <code>gloss</code>.
            Токены темы управляют прозрачностью и conic-обводкой.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss>
          <p>
            Hover/press для gloss-поверхностей — через <code>configureMotion()</code> (
            <code>enableHoverLift</code>, <code>interactiveDuration</code>,{" "}
            <code>pressSqueezeScale</code>). Цвета стекла — CSS-переменные <code>--color-surface</code>,{" "}
            <code>--color-border</code> и связанные токены после импорта{" "}
            <code>burne-ui/styles.css</code>.
          </p>
        </ShowcaseDoc.Customization>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
