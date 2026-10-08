import { DatePickerClassNamesDemo } from "../demos/datePicker/ClassNames.demo";
import classNamesSource from "../demos/datePicker/ClassNames.demo.tsx?raw";
import { DatePickerCompoundDemo } from "../demos/datePicker/Compound.demo";
import compoundSource from "../demos/datePicker/Compound.demo.tsx?raw";
import { DatePickerLocaleDemo } from "../demos/datePicker/Locale.demo";
import localeSource from "../demos/datePicker/Locale.demo.tsx?raw";
import { DatePickerInvalidDemo } from "../demos/datePicker/Invalid.demo";
import invalidSource from "../demos/datePicker/Invalid.demo.tsx?raw";
import { DatePickerMotionControllerGalleryDemo } from "../demos/datePicker/motionController/gallery";
import { DatePickerRangeDemo } from "../demos/datePicker/Range.demo";
import rangeSource from "../demos/datePicker/Range.demo.tsx?raw";
import { DatePickerSingleDemo } from "../demos/datePicker/Single.demo";
import singleSource from "../demos/datePicker/Single.demo.tsx?raw";
import { DatePickerSizesDemo } from "../demos/datePicker/Sizes.demo";
import sizesSource from "../demos/datePicker/Sizes.demo.tsx?raw";
import { DatePickerVariantsDemo } from "../demos/datePicker/Variants.demo";
import variantsSource from "../demos/datePicker/Variants.demo.tsx?raw";
import { DatePickerSlotMotionGalleryDemo } from "../demos/datePicker/slotMotion/gallery";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function DatePickerShowcase() {
  return (
    <ShowcasePage
      title="DatePicker"
      description="Field that opens a calendar. Single day or a range. The popup closes when the value is complete."
      importPath='import { DatePicker } from "@/components/core/DatePicker";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection title="Single" description="One day. Choosing the same day again clears the value and leaves the calendar open.">
        <ShowcaseDemoFromFile align="start" Demo={DatePickerSingleDemo} source={singleSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Variants" description="default, outline, secondary — the same field shells as Input.">
        <ShowcaseDemoFromFile align="stretch" Demo={DatePickerVariantsDemo} source={variantsSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large. The calendar uses the same size.">
        <ShowcaseDemoFromFile align="center" Demo={DatePickerSizesDemo} source={sizesSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Range" description="First click sets the start. The field closes after the end is set.">
        <ShowcaseDemoFromFile align="start" Demo={DatePickerRangeDemo} source={rangeSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Locale" description="en-GB reads 15 Oct 2026. ru reads 15 окт. 2026 г. The calendar inside uses the same tag.">
        <ShowcaseDemoFromFile align="start" Demo={DatePickerLocaleDemo} source={localeSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Invalid" description="error paints danger, sets aria-invalid, and shows the message. status alone does not.">
        <ShowcaseDemoFromFile align="start" Demo={DatePickerInvalidDemo} source={invalidSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Compound" description="Label, Trigger, Popover, Hint, and Error can be rearranged.">
        <ShowcaseDemoFromFile align="start" Demo={DatePickerCompoundDemo} source={compoundSource} />
      </ShowcaseSection>
      <ShowcaseSection title="classNames" description="trigger and value slots. Calendar keeps its own classNames when you render it inside Popover.">
        <ShowcaseDemoFromFile align="start" Demo={DatePickerClassNamesDemo} source={classNamesSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Slot motion" description="Every slot: trigger, icon, label, hint, error. Hover, enter, a wave across parts, and motion on compound parts.">
        <DatePickerSlotMotionGalleryDemo />
      </ShowcaseSection>
      <ShowcaseSection title="MotionController" description="playSlot and set, then one timeline that reveals the field, chevron, label, hint, and error in order. Events sit beside the slots.">
        <DatePickerMotionControllerGalleryDemo />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
