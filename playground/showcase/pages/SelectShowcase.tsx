import { SelectClassNamesFullDemo } from "../demos/select/SelectClassNamesFull.demo";
import selectClassNamesFullSource from "../demos/select/SelectClassNamesFull.demo.tsx?raw";
import { SelectCompoundDemo } from "../demos/select/SelectCompound.demo";
import selectCompoundSource from "../demos/select/SelectCompound.demo.tsx?raw";
import { SelectCustomTriggerIconDemo } from "../demos/select/SelectCustomTriggerIcon.demo";
import selectCustomTriggerIconSource from "../demos/select/SelectCustomTriggerIcon.demo.tsx?raw";
import { SelectMultipleDemo } from "../demos/select/SelectMultiple.demo";
import selectMultipleSource from "../demos/select/SelectMultiple.demo.tsx?raw";
import { SelectVirtualizedDemo } from "../demos/select/SelectVirtualized.demo";
import selectVirtualizedSource from "../demos/select/SelectVirtualized.demo.tsx?raw";
import { SelectDefaultDemo } from "../demos/select/SelectDefault.demo";
import selectDefaultSource from "../demos/select/SelectDefault.demo.tsx?raw";
import { SelectVariantsDemo } from "../demos/select/SelectVariants.demo";
import selectVariantsSource from "../demos/select/SelectVariants.demo.tsx?raw";
import { SelectStatusesDemo } from "../demos/select/SelectStatuses.demo";
import selectStatusesSource from "../demos/select/SelectStatuses.demo.tsx?raw";
import { SelectPopoverSideDemo } from "../demos/select/SelectPopoverSide.demo";
import selectPopoverSideSource from "../demos/select/SelectPopoverSide.demo.tsx?raw";
import { SelectSizesDemo } from "../demos/select/SelectSizes.demo";
import selectSizesSource from "../demos/select/SelectSizes.demo.tsx?raw";
import { SelectSlotMotionGalleryDemo } from "../demos/select/slotMotion/gallery";
import { SelectMotionControllerGalleryDemo } from "../demos/select/motionController/gallery";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function SelectShowcase() {
  return (
    <ShowcasePage
      title="Select"
      description="Drop-down list without search. One value, or several with multiple."
      importPath='import { Select } from "@/components/core/Select";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection title="Default" description="options, value and onValueChange — controlled mode.">
        <ShowcaseDemoFromFile align="center" Demo={SelectDefaultDemo} source={selectDefaultSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Virtualized" description="virtualized mounts only the visible options. Arrow keys still walk the full list.">
        <ShowcaseDemoFromFile align="center" Demo={SelectVirtualizedDemo} source={selectVirtualizedSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Multiple" description="values and onValuesChange. A click toggles the item and leaves the menu open. Labels stay in option order.">
        <ShowcaseDemoFromFile align="center" Demo={SelectMultipleDemo} source={selectMultipleSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Variants" description="default, outline, secondary and default — all field shells side by side.">
        <ShowcaseDemoFromFile align="stretch" Demo={SelectVariantsDemo} source={selectVariantsSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Statuses × variants" description="Every status with every variant — same matrix as Button.">
        <ShowcaseDemoFromFile align="stretch" Demo={SelectStatusesDemo} source={selectStatusesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Compound" description="Label, TriggerGroup, Value, Trigger, Popover.">
        <ShowcaseDemoFromFile align="center" Demo={SelectCompoundDemo} source={selectCompoundSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom trigger icon"
        description="Select.Trigger children replace the default chevron."
      >
        <ShowcaseDemoFromFile
          align="center"
          Demo={SelectCustomTriggerIconDemo}
          source={selectCustomTriggerIconSource}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Popover side"
        description="Select.Popover side / align / offset — open the menu upward."
      >
        <ShowcaseDemoFromFile
          align="center"
          Demo={SelectPopoverSideDemo}
          source={selectPopoverSideSource}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="center" Demo={SelectSizesDemo} source={selectSizesSource} />
      </ShowcaseSection>
<ShowcaseSection title="classNames" description="Slot customization triggerGroup, value, popover and listBox.">
        <ShowcaseDemoFromFile
          align="center"
          Demo={SelectClassNamesFullDemo}
          source={selectClassNamesFullSource}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Slot motion" description="Instant skip, timeline across sibling slots, compound part motion.">
        <SelectSlotMotionGalleryDemo />
      </ShowcaseSection>

      <ShowcaseSection
        title="MotionController"
        description="One gallery: playSlot on triggerGroup (no play: no root slot), chrome label on Root, cancel loop, select events."
      >
        <SelectMotionControllerGalleryDemo />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Select" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="options: { value, label }[], value / onValueChange, or multiple with values / onValuesChange."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="TriggerGroup, Value, Trigger, Popover, Hint, Error + classNames."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
