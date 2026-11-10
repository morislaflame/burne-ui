import { StepperCheckoutDemo } from "../demos/stepper/Checkout.demo";
import checkoutSource from "../demos/stepper/Checkout.demo.tsx?raw";
import { StepperSizesDemo } from "../demos/stepper/Sizes.demo";
import sizesSource from "../demos/stepper/Sizes.demo.tsx?raw";
import { StepperClassNamesDemo } from "../demos/stepper/ClassNames.demo";
import classNamesSource from "../demos/stepper/ClassNames.demo.tsx?raw";
import { StepperCompoundDemo } from "../demos/stepper/Compound.demo";
import compoundSource from "../demos/stepper/Compound.demo.tsx?raw";
import { StepperFreeDemo } from "../demos/stepper/Free.demo";
import freeSource from "../demos/stepper/Free.demo.tsx?raw";
import { StepperMotionControllerGalleryDemo } from "../demos/stepper/motionController/gallery";
import { StepperSlotMotionGalleryDemo } from "../demos/stepper/slotMotion/gallery";
import { StepperVerticalDemo } from "../demos/stepper/Vertical.demo";
import verticalSource from "../demos/stepper/Vertical.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function StepperShowcase() {
  return (
    <ShowcasePage
      title="Stepper"
      description="A track of steps. Earlier ones are complete, the current one is active, and later ones wait. Linear mode only lets you go back."
      importPath='import { Stepper } from "@/components/core/Stepper";'
      tags={["core", "navigation"]}
    >
      <ShowcaseSection
        title="Checkout"
        description="Shipping is current. Account can be selected again. Payment stays disabled until the value reaches it."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={StepperCheckoutDemo} source={checkoutSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large. The mark and the type scale follow the size.">
        <ShowcaseDemoFromFile align="stretch" Demo={StepperSizesDemo} source={sizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Vertical" description="orientation vertical stacks the track. The connector sits under the mark.">
        <ShowcaseDemoFromFile Demo={StepperVerticalDemo} source={verticalSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Any step" description="linear={false} makes every step selectable, including ones that are still ahead.">
        <ShowcaseDemoFromFile align="stretch" Demo={StepperFreeDemo} source={freeSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Compound"
        description="Item, Indicator, Title, and Description. The connector is drawn between items."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={StepperCompoundDemo} source={compoundSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Slot motion"
        description="Indicator nudge keeps hoverOut off so the yoyo can finish. Appear plays the mark, title, description, and connector in order."
      >
        <StepperSlotMotionGalleryDemo />
      </ShowcaseSection>

      <ShowcaseSection
        title="MotionController"
        description="Handle on the root. playSlot(indicator) nudges every mark. playSlot(root, enter) runs the appear timeline."
      >
        <StepperMotionControllerGalleryDemo />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="indicator, title, description, and separator. The mark border and the title use the primary color."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={StepperClassNamesDemo} source={classNamesSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Stepper" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="steps, value, and onValueChange. Compound: Item, Indicator, Title, Description."
          />
        </ShowcaseDoc.Block>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
