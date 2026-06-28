import { SurfaceDashboardWidgetDemo } from "../demos/surface/SurfaceDashboardWidget.demo";
import surfaceDashboardWidgetSource from "../demos/surface/SurfaceDashboardWidget.demo.tsx?raw";
import { SurfaceGlassStackDemo } from "../demos/surface/SurfaceGlassStack.demo";
import surfaceGlassStackSource from "../demos/surface/SurfaceGlassStack.demo.tsx?raw";
import { SurfaceGlossDemo } from "../demos/surface/SurfaceGloss.demo";
import surfaceGlossSource from "../demos/surface/SurfaceGloss.demo.tsx?raw";
import { SurfaceNestedPanelsDemo } from "../demos/surface/SurfaceNestedPanels.demo";
import surfaceNestedPanelsSource from "../demos/surface/SurfaceNestedPanels.demo.tsx?raw";
import { SurfaceVariantsDemo } from "../demos/surface/SurfaceVariants.demo";
import surfaceVariantsSource from "../demos/surface/SurfaceVariants.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function SurfaceShowcase() {
  return (
    <ShowcasePage
      title="Surface"
      description="Фоновые поверхности для группировки контента с настраиваемым padding."
      importPath='import { Surface } from "@/components/core/Surface";'
      tags={["core", "layout"]}
    >
      <ShowcaseSection title="Варианты" description="default, secondary и tertiary.">
        <ShowcaseDemoFromFile Demo={SurfaceVariantsDemo} source={surfaceVariantsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — стеклянная поверхность с motion.">
        <ShowcaseDemoFromFile Demo={SurfaceGlossDemo} source={surfaceGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Вложенные панели, виджет дашборда и gloss-стек — `demos/surface/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={SurfaceNestedPanelsDemo} source={surfaceNestedPanelsSource} />
        <ShowcaseDemoFromFile Demo={SurfaceDashboardWidgetDemo} source={surfaceDashboardWidgetSource} />
        <ShowcaseDemoFromFile Demo={SurfaceGlassStackDemo} source={surfaceGlassStackSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Surface" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="variant и padding на корне — основной способ задать фон и отступы контейнера."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Padding">
          <p>
            <code>mid</code>, <code>plus</code>, <code>large</code> — предустановленные отступы внутри Surface.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
