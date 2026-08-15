import { SurfaceClassNamesFullDemo } from "../demos/surface/SurfaceClassNamesFull.demo";
import surfaceClassNamesFullSource from "../demos/surface/SurfaceClassNamesFull.demo.tsx?raw";
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
import { SurfaceMotionInstantEnterDemo } from "../demos/surface/SurfaceMotionInstantEnter.demo";
import surfaceMotionInstantEnterSource from "../demos/surface/SurfaceMotionInstantEnter.demo.tsx?raw";
import { SurfaceMotionRootWaveDemo } from "../demos/surface/SurfaceMotionRootWave.demo";
import surfaceMotionRootWaveSource from "../demos/surface/SurfaceMotionRootWave.demo.tsx?raw";
import { SurfaceMotionEnterTintDemo } from "../demos/surface/SurfaceMotionEnterTint.demo";
import surfaceMotionEnterTintSource from "../demos/surface/SurfaceMotionEnterTint.demo.tsx?raw";
import { SeparatorMotionInstantEnterDemo } from "../demos/separator/SeparatorMotionInstantEnter.demo";
import separatorMotionInstantEnterSource from "../demos/separator/SeparatorMotionInstantEnter.demo.tsx?raw";
import { SeparatorMotionRootWaveDemo } from "../demos/separator/SeparatorMotionRootWave.demo";
import separatorMotionRootWaveSource from "../demos/separator/SeparatorMotionRootWave.demo.tsx?raw";
import { SeparatorMotionEnterTintDemo } from "../demos/separator/SeparatorMotionEnterTint.demo";
import separatorMotionEnterTintSource from "../demos/separator/SeparatorMotionEnterTint.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function SurfaceShowcase() {
  return (
    <ShowcasePage
      title="Surface"
      description="Background surfaces for grouping content with customizable padding."
      importPath='import { Surface } from "@/components/core/Surface";'
      tags={["core", "layout"]}
    >
      <ShowcaseSection title="Options" description="default, secondary and tertiary.">
        <ShowcaseDemoFromFile Demo={SurfaceVariantsDemo} source={surfaceVariantsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — glass surface with motion.">
        <ShowcaseDemoFromFile Demo={SurfaceGlossDemo} source={surfaceGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection title="classNames" description="Slots root and glossContent via classNames.">
        <ShowcaseDemoFromFile Demo={SurfaceClassNamesFullDemo} source={surfaceClassNamesFullSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Nested panels, dashboard widget and gloss-stack — `demos/surface/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={SurfaceNestedPanelsDemo} source={surfaceNestedPanelsSource} />
        <ShowcaseDemoFromFile Demo={SurfaceDashboardWidgetDemo} source={surfaceDashboardWidgetSource} />
        <ShowcaseDemoFromFile Demo={SurfaceGlassStackDemo} source={surfaceGlassStackSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Slot motion" description="Instant enter skip, root timeline + hover, enter tint.">
        <ShowcaseDemoFromFile align="stretch" Demo={SurfaceMotionInstantEnterDemo} source={surfaceMotionInstantEnterSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SurfaceMotionRootWaveDemo} source={surfaceMotionRootWaveSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SurfaceMotionEnterTintDemo} source={surfaceMotionEnterTintSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Slot motion (Separator)" description="Instant enter skip, scale-in timeline, enter tint.">
        <ShowcaseDemoFromFile align="stretch" Demo={SeparatorMotionInstantEnterDemo} source={separatorMotionInstantEnterSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SeparatorMotionRootWaveDemo} source={separatorMotionRootWaveSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SeparatorMotionEnterTintDemo} source={separatorMotionEnterTintSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Surface" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="variant and padding on the root - the main way to set the background and padding of the container."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Padding">
          <p>
            <code>mid</code>, <code>plus</code>, <code>large</code> — preset padding inside Surface.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
