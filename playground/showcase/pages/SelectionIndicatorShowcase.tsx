import { SelectionIndicatorGalleryDemo } from "../demos/selectionIndicator/SelectionIndicatorGallery.demo";
import selectionIndicatorGallerySource from "../demos/selectionIndicator/SelectionIndicatorGallery.demo.tsx?raw";
import { SelectionIndicatorGlossDemo } from "../demos/selectionIndicator/SelectionIndicatorGloss.demo";
import selectionIndicatorGlossSource from "../demos/selectionIndicator/SelectionIndicatorGloss.demo.tsx?raw";
import { SelectionIndicatorClassNamesDemo } from "../demos/selectionIndicator/SelectionIndicatorClassNames.demo";
import selectionIndicatorClassNamesSource from "../demos/selectionIndicator/SelectionIndicatorClassNames.demo.tsx?raw";
import { SelectionIndicatorShapeCompareDemo } from "../demos/selectionIndicator/SelectionIndicatorShapeCompare.demo";
import selectionIndicatorShapeCompareSource from "../demos/selectionIndicator/SelectionIndicatorShapeCompare.demo.tsx?raw";
import { SelectionIndicatorThumbGalleryDemo } from "../demos/selectionIndicator/SelectionIndicatorThumbGallery.demo";
import selectionIndicatorThumbGallerySource from "../demos/selectionIndicator/SelectionIndicatorThumbGallery.demo.tsx?raw";
import { SelectionIndicatorVariantMixDemo } from "../demos/selectionIndicator/SelectionIndicatorVariantMix.demo";
import selectionIndicatorVariantMixSource from "../demos/selectionIndicator/SelectionIndicatorVariantMix.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function SelectionIndicatorShowcase() {
  return (
    <ShowcasePage
      title="SelectionIndicator"
      description="Public selection indicator primitive for Radio, Checkbox and Slider thumb."
      importPath='import { SelectionIndicator } from "@/components/core/SelectionIndicator";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection
        title="Sizes and options"
        description="Public selection indicator primitive (Radio, Checkbox, Slider thumb)."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={SelectionIndicatorGalleryDemo} source={selectionIndicatorGallerySource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — glass indicator.">
        <ShowcaseDemoFromFile align="stretch" Demo={SelectionIndicatorGlossDemo} source={selectionIndicatorGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Slots shell, fill and mark on SelectionIndicator."
      >
        <ShowcaseDemoFromFile
          align="stretch"
          Demo={SelectionIndicatorClassNamesDemo}
          source={selectionIndicatorClassNamesSource}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Comparison of forms, grid of options and SelectionThumb — `demos/selectionIndicator/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={SelectionIndicatorShapeCompareDemo} source={selectionIndicatorShapeCompareSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SelectionIndicatorVariantMixDemo} source={selectionIndicatorVariantMixSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SelectionIndicatorThumbGalleryDemo} source={selectionIndicatorThumbGallerySource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/SelectionIndicator" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="size, variant, selected, check on the root. Used inside Checkbox, Radio and SelectionThumb."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Related Components">
          <p>
            <code>SelectionThumb</code> and <code>SelectionThumb.Icon</code> — for sliders Slider. Dimensions:{" "}
            <code>small</code>, <code>base</code>, <code>mid</code>, <code>large</code>.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
