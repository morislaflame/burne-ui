import { DropdownClassNamesFullDemo } from "../demos/dropdown/DropdownClassNamesFull.demo";
import dropdownClassNamesFullSource from "../demos/dropdown/DropdownClassNamesFull.demo.tsx?raw";
import { DropdownActionMenuDemo } from "../demos/dropdown/DropdownActionMenu.demo";
import dropdownActionMenuSource from "../demos/dropdown/DropdownActionMenu.demo.tsx?raw";
import { DropdownGlossDemo } from "../demos/dropdown/DropdownGloss.demo";
import dropdownGlossSource from "../demos/dropdown/DropdownGloss.demo.tsx?raw";
import { DropdownMultipleDemo } from "../demos/dropdown/DropdownMultiple.demo";
import dropdownMultipleSource from "../demos/dropdown/DropdownMultiple.demo.tsx?raw";
import { DropdownSingleSelectDemo } from "../demos/dropdown/DropdownSingleSelect.demo";
import dropdownSingleSelectSource from "../demos/dropdown/DropdownSingleSelect.demo.tsx?raw";
import { DropdownStatusPickerDemo } from "../demos/dropdown/DropdownStatusPicker.demo";
import dropdownStatusPickerSource from "../demos/dropdown/DropdownStatusPicker.demo.tsx?raw";
import { DropdownUserMenuDemo } from "../demos/dropdown/DropdownUserMenu.demo";
import dropdownUserMenuSource from "../demos/dropdown/DropdownUserMenu.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

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
            <code>href</code> rendered as links with a role menuitem.
          </p>
        </ShowcaseDoc.Customization>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
