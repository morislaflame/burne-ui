import { TagsInputClassNamesDemo } from "../demos/tagsInput/ClassNames.demo";
import classNamesSource from "../demos/tagsInput/ClassNames.demo.tsx?raw";
import { TagsInputCompoundDemo } from "../demos/tagsInput/Compound.demo";
import compoundSource from "../demos/tagsInput/Compound.demo.tsx?raw";
import { TagsInputInvalidDemo } from "../demos/tagsInput/Invalid.demo";
import invalidSource from "../demos/tagsInput/Invalid.demo.tsx?raw";
import { TagsInputLimitDemo } from "../demos/tagsInput/Limit.demo";
import limitSource from "../demos/tagsInput/Limit.demo.tsx?raw";
import { TagsInputMotionControllerGalleryDemo } from "../demos/tagsInput/motionController/gallery";
import { TagsInputSizesDemo } from "../demos/tagsInput/Sizes.demo";
import sizesSource from "../demos/tagsInput/Sizes.demo.tsx?raw";
import { TagsInputSlotMotionGalleryDemo } from "../demos/tagsInput/slotMotion/gallery";
import { TagsInputTopicsDemo } from "../demos/tagsInput/Topics.demo";
import topicsSource from "../demos/tagsInput/Topics.demo.tsx?raw";
import { TagsInputVariantsDemo } from "../demos/tagsInput/Variants.demo";
import variantsSource from "../demos/tagsInput/Variants.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function TagsInputShowcase() {
  return (
    <ShowcasePage
      title="TagsInput"
      description="Chips in a field. Enter, a comma, or blur commits the text. Backspace on an empty field removes the last chip."
      importPath='import { TagsInput } from "@/components/core/TagsInput";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection title="Topics" description="One chip is already there. A duplicate is ignored.">
        <ShowcaseDemoFromFile align="center" Demo={TagsInputTopicsDemo} source={topicsSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Variants" description="default, outline, secondary — the same field shells as Input.">
        <ShowcaseDemoFromFile align="stretch" Demo={TagsInputVariantsDemo} source={variantsSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="center" Demo={TagsInputSizesDemo} source={sizesSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Limit" description="max={3} disables the field once three chips are in. Removing one opens it again.">
        <ShowcaseDemoFromFile align="center" Demo={TagsInputLimitDemo} source={limitSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Invalid" description="error paints danger, sets aria-invalid, and shows the message. status alone does not.">
        <ShowcaseDemoFromFile align="center" Demo={TagsInputInvalidDemo} source={invalidSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Compound" description="Label, Control, and Hint in the order you write them.">
        <ShowcaseDemoFromFile align="center" Demo={TagsInputCompoundDemo} source={compoundSource} />
      </ShowcaseSection>
      <ShowcaseSection title="classNames" description="shell, tag, and input.">
        <ShowcaseDemoFromFile align="center" Demo={TagsInputClassNamesDemo} source={classNamesSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Slot motion" description="Chip nudge keeps hoverOut off so the yoyo can finish. Appear plays the shell, chips, field, label, hint, and error in order.">
        <TagsInputSlotMotionGalleryDemo />
      </ShowcaseSection>
      <ShowcaseSection title="MotionController" description="Handle on the root. playSlot(tag) nudges every chip. playSlot(shell, enter) runs the appear timeline.">
        <TagsInputMotionControllerGalleryDemo />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
