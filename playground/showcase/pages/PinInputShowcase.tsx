import { PinInputAlphanumericDemo } from "../demos/pinInput/Alphanumeric.demo";
import alphanumericSource from "../demos/pinInput/Alphanumeric.demo.tsx?raw";
import { PinInputClassNamesDemo } from "../demos/pinInput/ClassNames.demo";
import classNamesSource from "../demos/pinInput/ClassNames.demo.tsx?raw";
import { PinInputCodeDemo } from "../demos/pinInput/Code.demo";
import codeSource from "../demos/pinInput/Code.demo.tsx?raw";
import { PinInputSizesDemo } from "../demos/pinInput/Sizes.demo";
import sizesSource from "../demos/pinInput/Sizes.demo.tsx?raw";
import { PinInputVariantsDemo } from "../demos/pinInput/Variants.demo";
import variantsSource from "../demos/pinInput/Variants.demo.tsx?raw";
import { PinInputCompoundDemo } from "../demos/pinInput/Compound.demo";
import compoundSource from "../demos/pinInput/Compound.demo.tsx?raw";
import { PinInputInvalidDemo } from "../demos/pinInput/Invalid.demo";
import invalidSource from "../demos/pinInput/Invalid.demo.tsx?raw";
import { PinInputMaskDemo } from "../demos/pinInput/Mask.demo";
import maskSource from "../demos/pinInput/Mask.demo.tsx?raw";
import { PinInputMotionControllerGalleryDemo } from "../demos/pinInput/motionController/gallery";
import { PinInputSeparatorDemo } from "../demos/pinInput/Separator.demo";
import separatorSource from "../demos/pinInput/Separator.demo.tsx?raw";
import { PinInputSlotMotionGalleryDemo } from "../demos/pinInput/slotMotion/gallery";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function PinInputShowcase() {
  return (
    <ShowcasePage
      title="PinInput"
      description="One cell per character. Digits by default, letters when type is text. Paste fills from the focused cell."
      importPath='import { PinInput } from "@/components/core/PinInput";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection title="Code" description="Six cells. The lock sits in the label. Typing moves to the next cell.">
        <ShowcaseDemoFromFile align="start" Demo={PinInputCodeDemo} source={codeSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Variants" description="default, outline, secondary — the same field shells as Input.">
        <ShowcaseDemoFromFile align="stretch" Demo={PinInputVariantsDemo} source={variantsSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large. The cell side follows the size.">
        <ShowcaseDemoFromFile align="center" Demo={PinInputSizesDemo} source={sizesSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Mask" description="mask draws dots. The cell stays a text field, so the browser does not offer a saved password.">
        <ShowcaseDemoFromFile align="start" Demo={PinInputMaskDemo} source={maskSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Letters" description="type text keeps letters and digits.">
        <ShowcaseDemoFromFile align="start" Demo={PinInputAlphanumericDemo} source={alphanumericSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Invalid" description="error paints danger, sets aria-invalid, and shows the message. status alone does not.">
        <ShowcaseDemoFromFile align="start" Demo={PinInputInvalidDemo} source={invalidSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Separator" description="separator is drawn once, after the first half of the cells.">
        <ShowcaseDemoFromFile align="start" Demo={PinInputSeparatorDemo} source={separatorSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Compound" description="Label, Hint, and Group in the order you write them.">
        <ShowcaseDemoFromFile align="start" Demo={PinInputCompoundDemo} source={compoundSource} />
      </ShowcaseSection>
      <ShowcaseSection title="classNames" description="label, group, field, and separator.">
        <ShowcaseDemoFromFile align="start" Demo={PinInputClassNamesDemo} source={classNamesSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Slot motion" description="Every slot: group, field, label, hint, error.">
        <PinInputSlotMotionGalleryDemo />
      </ShowcaseSection>
      <ShowcaseSection title="MotionController" description="playSlot and set on the cells, then one timeline that reveals the label, group, cells, hint, and error in order.">
        <PinInputMotionControllerGalleryDemo />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
