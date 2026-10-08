import { NumberInputBoundsDemo } from "../demos/numberInput/Bounds.demo";
import boundsSource from "../demos/numberInput/Bounds.demo.tsx?raw";
import { NumberInputClassNamesDemo } from "../demos/numberInput/ClassNames.demo";
import classNamesSource from "../demos/numberInput/ClassNames.demo.tsx?raw";
import { NumberInputCompoundDemo } from "../demos/numberInput/Compound.demo";
import compoundSource from "../demos/numberInput/Compound.demo.tsx?raw";
import { NumberInputDecimalDemo } from "../demos/numberInput/Decimal.demo";
import decimalSource from "../demos/numberInput/Decimal.demo.tsx?raw";
import { NumberInputInvalidDemo } from "../demos/numberInput/Invalid.demo";
import invalidSource from "../demos/numberInput/Invalid.demo.tsx?raw";
import { NumberInputMotionControllerGalleryDemo } from "../demos/numberInput/motionController/gallery";
import { NumberInputQuantityDemo } from "../demos/numberInput/Quantity.demo";
import quantitySource from "../demos/numberInput/Quantity.demo.tsx?raw";
import { NumberInputSizesDemo } from "../demos/numberInput/Sizes.demo";
import sizesSource from "../demos/numberInput/Sizes.demo.tsx?raw";
import { NumberInputVariantsDemo } from "../demos/numberInput/Variants.demo";
import variantsSource from "../demos/numberInput/Variants.demo.tsx?raw";
import { NumberInputSlotMotionGalleryDemo } from "../demos/numberInput/slotMotion/gallery";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function NumberInputShowcase() {
  return (
    <ShowcasePage
      title="NumberInput"
      description="Numeric field with steppers. Step, minimum, and maximum. Blur snaps the typed value onto the step."
      importPath='import { NumberInput } from "@/components/core/NumberInput";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection title="Quantity" description="Starts at 1. Minus stops at 0. The next plus adds the step.">
        <ShowcaseDemoFromFile align="start" Demo={NumberInputQuantityDemo} source={quantitySource} />
      </ShowcaseSection>
      <ShowcaseSection title="Variants" description="default, outline, secondary — the same field shells as Input.">
        <ShowcaseDemoFromFile align="stretch" Demo={NumberInputVariantsDemo} source={variantsSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="center" Demo={NumberInputSizesDemo} source={sizesSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Bounds" description="A stepper turns off when the value is already on that edge.">
        <ShowcaseDemoFromFile align="start" Demo={NumberInputBoundsDemo} source={boundsSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Step" description="0.5 grid. A typed 1.2 becomes 1 on blur.">
        <ShowcaseDemoFromFile align="start" Demo={NumberInputDecimalDemo} source={decimalSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Invalid" description="error paints danger, sets aria-invalid, and shows the message. status alone does not.">
        <ShowcaseDemoFromFile align="start" Demo={NumberInputInvalidDemo} source={invalidSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Compound" description="Decrement, Control, and Increment share one shell, in the order you write them.">
        <ShowcaseDemoFromFile align="start" Demo={NumberInputCompoundDemo} source={compoundSource} />
      </ShowcaseSection>
      <ShowcaseSection title="classNames" description="shell and control slots.">
        <ShowcaseDemoFromFile align="start" Demo={NumberInputClassNamesDemo} source={classNamesSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Slot motion" description="Every slot: shell, control, decrement, increment, label, hint, error.">
        <NumberInputSlotMotionGalleryDemo />
      </ShowcaseSection>
      <ShowcaseSection title="MotionController" description="playSlot and set, then one timeline that reveals the shell, steppers, value, label, hint, and error in order.">
        <NumberInputMotionControllerGalleryDemo />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
