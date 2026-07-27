import { ComboBoxClassNamesFullDemo } from "../demos/combobox/ComboBoxClassNamesFull.demo";
import comboBoxClassNamesFullSource from "../demos/combobox/ComboBoxClassNamesFull.demo.tsx?raw";
import { ComboBoxCustomTriggerIconDemo } from "../demos/combobox/ComboBoxCustomTriggerIcon.demo";
import comboBoxCustomTriggerIconSource from "../demos/combobox/ComboBoxCustomTriggerIcon.demo.tsx?raw";
import { ComboBoxDefaultDemo } from "../demos/combobox/ComboBoxDefault.demo";
import comboBoxDefaultSource from "../demos/combobox/ComboBoxDefault.demo.tsx?raw";
import { ComboBoxVariantsDemo } from "../demos/combobox/ComboBoxVariants.demo";
import comboBoxVariantsSource from "../demos/combobox/ComboBoxVariants.demo.tsx?raw";
import { ComboBoxStatusesDemo } from "../demos/combobox/ComboBoxStatuses.demo";
import comboBoxStatusesSource from "../demos/combobox/ComboBoxStatuses.demo.tsx?raw";
import { ComboBoxSizesDemo } from "../demos/combobox/ComboBoxSizes.demo";
import comboBoxSizesSource from "../demos/combobox/ComboBoxSizes.demo.tsx?raw";
import { ComboBoxGlossDemo } from "../demos/combobox/ComboBoxGloss.demo";
import comboBoxGlossSource from "../demos/combobox/ComboBoxGloss.demo.tsx?raw";
import { ComboBoxPopoverSideDemo } from "../demos/combobox/ComboBoxPopoverSide.demo";
import comboBoxPopoverSideSource from "../demos/combobox/ComboBoxPopoverSide.demo.tsx?raw";
import { ComboBoxStackPickerDemo } from "../demos/combobox/ComboBoxStackPicker.demo";
import comboBoxStackPickerSource from "../demos/combobox/ComboBoxStackPicker.demo.tsx?raw";
import { ComboBoxInlineToolbarDemo } from "../demos/combobox/ComboBoxInlineToolbar.demo";
import comboBoxInlineToolbarSource from "../demos/combobox/ComboBoxInlineToolbar.demo.tsx?raw";
import { ComboBoxWorkspacePickerDemo } from "../demos/combobox/ComboBoxWorkspacePicker.demo";
import comboBoxWorkspacePickerSource from "../demos/combobox/ComboBoxWorkspacePicker.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function ComboBoxShowcase() {
  return (
    <ShowcasePage
      title="ComboBox"
      description="Dropdown list with search and controlled value."
      importPath='import { ComboBox } from "@/components/core/ComboBox";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection title="Default" description="options, value and onValueChange — controlled mode.">
        <ShowcaseDemoFromFile align="center" Demo={ComboBoxDefaultDemo} source={comboBoxDefaultSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Variants" description="default, outline, secondary and gloss — all field shells side by side.">
        <ShowcaseDemoFromFile align="stretch" Demo={ComboBoxVariantsDemo} source={comboBoxVariantsSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Statuses × variants" description="Every status with every variant — same matrix as Button.">
        <ShowcaseDemoFromFile align="stretch" Demo={ComboBoxStatusesDemo} source={comboBoxStatusesSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom trigger icon"
        description="ComboBox.Trigger children replace the default chevron."
      >
        <ShowcaseDemoFromFile
          align="center"
          Demo={ComboBoxCustomTriggerIconDemo}
          source={comboBoxCustomTriggerIconSource}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Popover side"
        description="ComboBox.Popover side / align / offset — open the menu upward."
      >
        <ShowcaseDemoFromFile
          align="center"
          Demo={ComboBoxPopoverSideDemo}
          source={comboBoxPopoverSideSource}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="center" Demo={ComboBoxSizesDemo} source={comboBoxSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — glass shell.">
        <ShowcaseDemoFromFile align="center" Demo={ComboBoxGlossDemo} source={comboBoxGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Slot customization inputGroup, input, trigger, popover and listBox."
      >
        <ShowcaseDemoFromFile
          align="center"
          Demo={ComboBoxClassNamesFullDemo}
          source={comboBoxClassNamesFullSource}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Compound ListBox in Popover, gradient Fill, segmented TimeField — demo-files in `demos/combobox/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={ComboBoxWorkspacePickerDemo} source={comboBoxWorkspacePickerSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ComboBoxInlineToolbarDemo} source={comboBoxInlineToolbarSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ComboBoxStackPickerDemo} source={comboBoxStackPickerSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/ComboBox" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="options: { value, label }[], value, onValueChange, label, hint, variant."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="root, inputGroup, input, trigger, popover, popoverBody, listBox, hint, error."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Options">
          <p>
            Array <code>options</code> with margins <code>value</code> and <code>label</code>. For gloss-style
            pass it on <code>variant=&quot;gloss&quot;</code>.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
