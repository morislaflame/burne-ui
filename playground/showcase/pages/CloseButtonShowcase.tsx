import { CloseButtonClassNamesFullDemo } from "../demos/close-button/CloseButtonClassNamesFull.demo";
import closeButtonClassNamesFullSource from "../demos/close-button/CloseButtonClassNamesFull.demo.tsx?raw";
import { CloseButtonFilterChipDemo } from "../demos/close-button/CloseButtonFilterChip.demo";
import closeButtonFilterChipSource from "../demos/close-button/CloseButtonFilterChip.demo.tsx?raw";
import { CloseButtonGlossDemo } from "../demos/close-button/CloseButtonGloss.demo";
import closeButtonGlossSource from "../demos/close-button/CloseButtonGloss.demo.tsx?raw";
import { CloseButtonInfoBannerDemo } from "../demos/close-button/CloseButtonInfoBanner.demo";
import closeButtonInfoBannerSource from "../demos/close-button/CloseButtonInfoBanner.demo.tsx?raw";
import { CloseButtonPreviewCardDemo } from "../demos/close-button/CloseButtonPreviewCard.demo";
import closeButtonPreviewCardSource from "../demos/close-button/CloseButtonPreviewCard.demo.tsx?raw";
import { CloseButtonSizesDemo } from "../demos/close-button/CloseButtonSizes.demo";
import closeButtonSizesSource from "../demos/close-button/CloseButtonSizes.demo.tsx?raw";
import { CloseButtonVariantsDemo } from "../demos/close-button/CloseButtonVariants.demo";
import closeButtonVariantsSource from "../demos/close-button/CloseButtonVariants.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function CloseButtonShowcase() {
  return (
    <ShowcasePage
      title="CloseButton"
      description="Compact closure icon with surface options like Button."
      importPath='import { CloseButton } from "@/components/core/CloseButton";'
      tags={["core", "actions"]}
    >
      <ShowcaseSection title="Options" description="default, primary, outline, secondary, ghost, gloss.">
        <ShowcaseDemoFromFile Demo={CloseButtonVariantsDemo} source={closeButtonVariantsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size coincides with Button: small … large.">
        <ShowcaseDemoFromFile Demo={CloseButtonSizesDemo} source={closeButtonSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="Glass surface on a dark background.">
        <ShowcaseDemoFromFile Demo={CloseButtonGlossDemo} source={closeButtonGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Slot customization root, icon and ripple through classNames."
      >
        <ShowcaseDemoFromFile
          Demo={CloseButtonClassNamesFullDemo}
          source={closeButtonClassNamesFullSource}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="CloseButton in real layout — demo in `demos/close-button/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={CloseButtonInfoBannerDemo} source={closeButtonInfoBannerSource} />
        <ShowcaseDemoFromFile Demo={CloseButtonPreviewCardDemo} source={closeButtonPreviewCardSource} />
        <ShowcaseDemoFromFile Demo={CloseButtonFilterChipDemo} source={closeButtonFilterChipSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/CloseButton" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="variant, size, aria-label (required), onClick. Icon IoClose built-in."
          />
          <ShowcaseDoc.ApiRow
            api="simple"
            description="root, icon, ripple — slots classNames on the root."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss>
          <p>
            Fill options match <code>Button</code> (without status tones). For Dialog and Drawer —
            in header with sufficient pressing area; required <code>aria-label</code>.
          </p>
        </ShowcaseDoc.Customization>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
