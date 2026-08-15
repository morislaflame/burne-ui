import { SliderBudgetPanelDemo } from "../demos/slider/SliderBudgetPanel.demo";
import sliderBudgetPanelSource from "../demos/slider/SliderBudgetPanel.demo.tsx?raw";
import { SliderClassNamesFullDemo } from "../demos/slider/SliderClassNamesFull.demo";
import sliderClassNamesFullSource from "../demos/slider/SliderClassNamesFull.demo.tsx?raw";
import { SliderGlossDemo } from "../demos/slider/SliderGloss.demo";
import sliderGlossSource from "../demos/slider/SliderGloss.demo.tsx?raw";
import { SliderOpacityStripDemo } from "../demos/slider/SliderOpacityStrip.demo";
import sliderOpacityStripSource from "../demos/slider/SliderOpacityStrip.demo.tsx?raw";
import { SliderPriceRangeDemo } from "../demos/slider/SliderPriceRange.demo";
import sliderPriceRangeSource from "../demos/slider/SliderPriceRange.demo.tsx?raw";
import { SliderSizesDemo } from "../demos/slider/SliderSizes.demo";
import sliderSizesSource from "../demos/slider/SliderSizes.demo.tsx?raw";
import { SliderThumbShapeDemo } from "../demos/slider/SliderThumbShape.demo";
import sliderThumbShapeSource from "../demos/slider/SliderThumbShape.demo.tsx?raw";
import { SliderVariantsDemo } from "../demos/slider/SliderVariants.demo";
import sliderVariantsSource from "../demos/slider/SliderVariants.demo.tsx?raw";
import { SliderVolumeCardDemo } from "../demos/slider/SliderVolumeCard.demo";
import sliderVolumeCardSource from "../demos/slider/SliderVolumeCard.demo.tsx?raw";
import { SliderVolumeDemo } from "../demos/slider/SliderVolume.demo";
import sliderVolumeSource from "../demos/slider/SliderVolume.demo.tsx?raw";
import { SliderMotionChangeTintDemo } from "../demos/slider/SliderMotionChangeTint.demo";
import sliderMotionChangeTintSource from "../demos/slider/SliderMotionChangeTint.demo.tsx?raw";
import { SliderMotionInstantPressDemo } from "../demos/slider/SliderMotionInstantPress.demo";
import sliderMotionInstantPressSource from "../demos/slider/SliderMotionInstantPress.demo.tsx?raw";
import { SliderMotionRangeSplitDemo } from "../demos/slider/SliderMotionRangeSplit.demo";
import sliderMotionRangeSplitSource from "../demos/slider/SliderMotionRangeSplit.demo.tsx?raw";
import { SliderMotionThumbInertiaDemo } from "../demos/slider/SliderMotionThumbInertia.demo";
import sliderMotionThumbInertiaSource from "../demos/slider/SliderMotionThumbInertia.demo.tsx?raw";
import { SliderMotionTrackGlowDemo } from "../demos/slider/SliderMotionTrackGlow.demo";
import sliderMotionTrackGlowSource from "../demos/slider/SliderMotionTrackGlow.demo.tsx?raw";
import { SliderMotionValuePopDemo } from "../demos/slider/SliderMotionValuePop.demo";
import sliderMotionValuePopSource from "../demos/slider/SliderMotionValuePop.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function SliderShowcase() {
  return (
    <ShowcasePage
      title="Slider"
      description="Slider for a single value or range with labels and formatting."
      importPath='import { Slider } from "@/components/core/Slider";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection title="Single" description="showValue and marks for scale with labels.">
        <ShowcaseDemoFromFile align="center" Demo={SliderVolumeDemo} source={sliderVolumeSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="center" Demo={SliderSizesDemo} source={sliderSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Range" description="range + formatValue for two sliders.">
        <ShowcaseDemoFromFile align="center" Demo={SliderPriceRangeDemo} source={sliderPriceRangeSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Disabled and vertical" description="orientation vertical and disabled state.">
        <ShowcaseDemoFromFile align="center" Demo={SliderVariantsDemo} source={sliderVariantsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="gloss — glass circle on rail (prop gloss on the root).">
        <ShowcaseDemoFromFile align="center" Demo={SliderGlossDemo} source={sliderGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Slot motion"
        description="Instant thumb press, change-phase pulse, inertia bubble (quickTo, not change), value pop timeline, range thumbs with different part motion, track hover glow."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={SliderMotionInstantPressDemo} source={sliderMotionInstantPressSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SliderMotionChangeTintDemo} source={sliderMotionChangeTintSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SliderMotionThumbInertiaDemo} source={sliderMotionThumbInertiaSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SliderMotionValuePopDemo} source={sliderMotionValuePopSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SliderMotionRangeSplitDemo} source={sliderMotionRangeSplitSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SliderMotionTrackGlowDemo} source={sliderMotionTrackGlowSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Full customization of slots via classNames on root."
      >
        <ShowcaseDemoFromFile
          align="stretch"
          Demo={SliderClassNamesFullDemo}
          source={sliderClassNamesFullSource}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Form thumb, compound Track and gradient range — demo-files in `demos/slider/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={SliderThumbShapeDemo} source={sliderThumbShapeSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SliderVolumeCardDemo} source={sliderVolumeCardSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SliderBudgetPanelDemo} source={sliderBudgetPanelSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SliderOpacityStripDemo} source={sliderOpacityStripSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Slider" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="value, onValueChange, min, max, step, range, marks, showValue, formatValue, orientation, gloss."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Slider.Track, Slider.Rail, Slider.Fill, Slider.Thumb — custom rail markings."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Range">
          <p>
            At <code>range</code> value — motorcade <code>[number, number]</code>, onValueChange gets the same
            type. <code>formatValue</code> formats the displayed value.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss="gloss">
          <p>
            Boolean prop <code>gloss</code> on the root - glass thumb. Filling during change value —{" "}
            <code>configureMotion()</code> not applicable; thumb drag uses interactive tokens.
          </p>
        </ShowcaseDoc.Customization>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
