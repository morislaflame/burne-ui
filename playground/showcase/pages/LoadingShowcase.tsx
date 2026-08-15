import { LoadingCardOverlayDemo } from "../demos/loading/LoadingCardOverlay.demo";
import loadingCardOverlaySource from "../demos/loading/LoadingCardOverlay.demo.tsx?raw";
import { LoadingClassNamesFullDemo } from "../demos/loading/LoadingClassNamesFull.demo";
import loadingClassNamesFullSource from "../demos/loading/LoadingClassNamesFull.demo.tsx?raw";
import { LoadingColorGridDemo } from "../demos/loading/LoadingColorGrid.demo";
import loadingColorGridSource from "../demos/loading/LoadingColorGrid.demo.tsx?raw";
import { LoadingDotsWaveDemo } from "../demos/loading/LoadingDotsWave.demo";
import loadingDotsWaveSource from "../demos/loading/LoadingDotsWave.demo.tsx?raw";
import { LoadingInlineStatusDemo } from "../demos/loading/LoadingInlineStatus.demo";
import loadingInlineStatusSource from "../demos/loading/LoadingInlineStatus.demo.tsx?raw";
import { LoadingSizesColorsDemo } from "../demos/loading/LoadingSizesColors.demo";
import loadingSizesColorsSource from "../demos/loading/LoadingSizesColors.demo.tsx?raw";
import { LoadingMotionInstantEnterDemo } from "../demos/loading/LoadingMotionInstantEnter.demo";
import loadingMotionInstantEnterSource from "../demos/loading/LoadingMotionInstantEnter.demo.tsx?raw";
import { LoadingMotionRootWaveDemo } from "../demos/loading/LoadingMotionRootWave.demo";
import loadingMotionRootWaveSource from "../demos/loading/LoadingMotionRootWave.demo.tsx?raw";
import { LoadingMotionEnterTintDemo } from "../demos/loading/LoadingMotionEnterTint.demo";
import loadingMotionEnterTintSource from "../demos/loading/LoadingMotionEnterTint.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function LoadingShowcase() {
  return (
    <ShowcasePage
      title="Loading"
      description="Loading indicator: spinner and jumping dots (GSAP)."
      importPath='import { Loading } from "@/components/core/Loading";'
      tags={["core", "feedback"]}
    >
      <ShowcaseSection title="Sizes and colors" description="spinner: size and color on the root.">
        <ShowcaseDemoFromFile Demo={LoadingSizesColorsDemo} source={loadingSizesColorsSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Jumping dots"
        description='type="dots" — wave 1 → 2 → 3. Speed: configureMotion() (loadingDotsDuration, enableLoadingDots). Slider in panel Motion.'
      >
        <ShowcaseDemoFromFile Demo={LoadingDotsWaveDemo} source={loadingDotsWaveSource} />
      </ShowcaseSection>

      <ShowcaseSection title="classNames" description="Slots root, spinner, dots, dot via classNames.">
        <ShowcaseDemoFromFile Demo={LoadingClassNamesFullDemo} source={loadingClassNamesFullSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Overlay on the card, inline-status and color grid — demo-files in `demos/loading/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={LoadingCardOverlayDemo} source={loadingCardOverlaySource} />
        <ShowcaseDemoFromFile align="stretch" Demo={LoadingInlineStatusDemo} source={loadingInlineStatusSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={LoadingColorGridDemo} source={loadingColorGridSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Slot motion" description="Instant enter skip, root→dots timeline, spinner enter tint. Dots wave stays kit-internal.">
        <ShowcaseDemoFromFile align="center" Demo={LoadingMotionInstantEnterDemo} source={loadingMotionInstantEnterSource} />
        <ShowcaseDemoFromFile align="center" Demo={LoadingMotionRootWaveDemo} source={loadingMotionRootWaveSource} />
        <ShowcaseDemoFromFile align="center" Demo={LoadingMotionEnterTintDemo} source={loadingMotionEnterTintSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Loading" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="variant spinner | dots, size, color on the root."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization>
          <p>
            Colors: <code>primary</code>, <code>success</code>, <code>muted</code> etc. Dimensions:{" "}
            <code>small</code>, <code>base</code>, <code>mid</code>, <code>large</code>. Points:{" "}
            <code>loadingDotsDuration</code> (full jump, wave step = duration / 3),{" "}
            <code>loadingDotsEaseUp</code>, <code>loadingDotsEaseDown</code>,{" "}
            <code>enableLoadingDots</code>.
          </p>
        </ShowcaseDoc.Customization>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
