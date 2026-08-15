import { DropdownAsChildMergedPropsDemo } from "../demos/dropdown/DropdownAsChildMergedProps.demo";
import dropdownAsChildMergedPropsSource from "../demos/dropdown/DropdownAsChildMergedProps.demo.tsx?raw";
import { DropdownPortalContainerDemo } from "../demos/dropdown/DropdownPortalContainer.demo";
import dropdownPortalContainerSource from "../demos/dropdown/DropdownPortalContainer.demo.tsx?raw";
import { DropdownClassNamesFullDemo } from "../demos/dropdown/DropdownClassNamesFull.demo";
import dropdownClassNamesFullSource from "../demos/dropdown/DropdownClassNamesFull.demo.tsx?raw";
import { DropdownActionMenuDemo } from "../demos/dropdown/DropdownActionMenu.demo";
import dropdownActionMenuSource from "../demos/dropdown/DropdownActionMenu.demo.tsx?raw";
import { DropdownCustomSubTriggerIconDemo } from "../demos/dropdown/DropdownCustomSubTriggerIcon.demo";
import dropdownCustomSubTriggerIconSource from "../demos/dropdown/DropdownCustomSubTriggerIcon.demo.tsx?raw";
import { DropdownGlossDemo } from "../demos/dropdown/DropdownGloss.demo";
import dropdownGlossSource from "../demos/dropdown/DropdownGloss.demo.tsx?raw";
import { DropdownMotionBodyStaggerDemo } from "../demos/dropdown/DropdownMotionBodyStagger.demo";
import dropdownMotionBodyStaggerSource from "../demos/dropdown/DropdownMotionBodyStagger.demo.tsx?raw";
import { DropdownMotionInstantLeaveDemo } from "../demos/dropdown/DropdownMotionInstantLeave.demo";
import dropdownMotionInstantLeaveSource from "../demos/dropdown/DropdownMotionInstantLeave.demo.tsx?raw";
import { DropdownMotionOriginScaleDemo } from "../demos/dropdown/DropdownMotionOriginScale.demo";
import dropdownMotionOriginScaleSource from "../demos/dropdown/DropdownMotionOriginScale.demo.tsx?raw";
import { DropdownMotionSubSlideXDemo } from "../demos/dropdown/DropdownMotionSubSlideX.demo";
import dropdownMotionSubSlideXSource from "../demos/dropdown/DropdownMotionSubSlideX.demo.tsx?raw";
import { DropdownMultipleDemo } from "../demos/dropdown/DropdownMultiple.demo";
import dropdownMultipleSource from "../demos/dropdown/DropdownMultiple.demo.tsx?raw";
import { DropdownPopoverSideDemo } from "../demos/dropdown/DropdownPopoverSide.demo";
import dropdownPopoverSideSource from "../demos/dropdown/DropdownPopoverSide.demo.tsx?raw";
import { DropdownSingleSelectDemo } from "../demos/dropdown/DropdownSingleSelect.demo";
import dropdownSingleSelectSource from "../demos/dropdown/DropdownSingleSelect.demo.tsx?raw";
import { DropdownStatusPickerDemo } from "../demos/dropdown/DropdownStatusPicker.demo";
import dropdownStatusPickerSource from "../demos/dropdown/DropdownStatusPicker.demo.tsx?raw";
import { DropdownUserMenuDemo } from "../demos/dropdown/DropdownUserMenu.demo";
import dropdownUserMenuSource from "../demos/dropdown/DropdownUserMenu.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function DropdownShowcase() {
  return (
    <ShowcasePage
      title="Dropdown"
      description="Dropdown menu with single and multiple selection of values."
      importPath='import { Dropdown } from "@/components/core/Dropdown";'
      tags={["core", "overlay"]}
    >
      <ShowcaseSection title="Single selection" description="selectionIndicator and grouping of items.">
        <ShowcaseDemoFromFile Demo={DropdownSingleSelectDemo} source={dropdownSingleSelectSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Multi-select" description="multiple and array defaultValue.">
        <ShowcaseDemoFromFile Demo={DropdownMultipleDemo} source={dropdownMultipleSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description='popoverVariant="gloss" — glass drop down menu.'>
        <ShowcaseDemoFromFile Demo={DropdownGlossDemo} source={dropdownGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Slot motion"
        description="Each card is a separate copyable example — instant leave, body stagger, submenu slide, origin scale."
      >
        <ShowcaseDemoFromFile Demo={DropdownMotionInstantLeaveDemo} source={dropdownMotionInstantLeaveSource} />
        <ShowcaseDemoFromFile Demo={DropdownMotionBodyStaggerDemo} source={dropdownMotionBodyStaggerSource} />
        <ShowcaseDemoFromFile Demo={DropdownMotionSubSlideXDemo} source={dropdownMotionSubSlideXSource} />
        <ShowcaseDemoFromFile Demo={DropdownMotionOriginScaleDemo} source={dropdownMotionOriginScaleSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom SubTrigger icon"
        description="Dropdown.SubTrigger icon replaces the default chevron."
      >
        <ShowcaseDemoFromFile
          Demo={DropdownCustomSubTriggerIconDemo}
          source={dropdownCustomSubTriggerIconSource}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Popover side"
        description="Dropdown.Popover side / align / offset — open the menu upward."
      >
        <ShowcaseDemoFromFile Demo={DropdownPopoverSideDemo} source={dropdownPopoverSideSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="portalContainer"
        description="Custom portal host — menu mounts into the container."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={DropdownPortalContainerDemo} source={dropdownPortalContainerSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="asChild — merged props"
        description="Trigger asChild merges id, data-*, className, and ref onto the child."
      >
        <ShowcaseDemoFromFile Demo={DropdownAsChildMergedPropsDemo} source={dropdownAsChildMergedPropsSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Full customization of slots via classNames on Root."
      >
        <ShowcaseDemoFromFile
          Demo={DropdownClassNamesFullDemo}
          source={dropdownClassNamesFullSource}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Account menu, line actions and status selection — `demos/dropdown/`."
      >
        <ShowcaseDemoFromFile Demo={DropdownUserMenuDemo} source={dropdownUserMenuSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={DropdownActionMenuDemo} source={dropdownActionMenuSource} />
        <ShowcaseDemoFromFile Demo={DropdownStatusPickerDemo} source={dropdownStatusPickerSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Dropdown" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Dropdown.Trigger, Dropdown.Popover (variant gloss), Group, Item, ItemLabel, ItemHint, ItemIcon, Sub."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Choice">
          <p>
            <code>defaultValue</code> / <code>value</code> + <code>onValueChange</code> for controlled mode.
            <code>multiple</code> switches to an array of values.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss>
          <p>
            <code>variant=&quot;gloss&quot;</code> on <code>Dropdown.Popover</code>. Items with{" "}
            <code>href</code> rendered as links with a role menuitem. Slot motion —{" "}
            <code>motion.content</code> forwarded to Popover; <code>subContent</code> on{" "}
            <code>Dropdown.SubContent</code>.
          </p>
        </ShowcaseDoc.Customization>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
