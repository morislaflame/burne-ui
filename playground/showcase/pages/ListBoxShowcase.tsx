import { ListBoxClassNamesFullDemo } from "../demos/listBox/ListBoxClassNamesFull.demo";
import listBoxClassNamesFullSource from "../demos/listBox/ListBoxClassNamesFull.demo.tsx?raw";
import { ListBoxCommandPaletteDemo } from "../demos/listBox/ListBoxCommandPalette.demo";
import listBoxCommandPaletteSource from "../demos/listBox/ListBoxCommandPalette.demo.tsx?raw";
import { ListBoxCompoundDemo } from "../demos/listBox/ListBoxCompound.demo";
import listBoxCompoundSource from "../demos/listBox/ListBoxCompound.demo.tsx?raw";
import { ListBoxGlossDemo } from "../demos/listBox/ListBoxGloss.demo";
import listBoxGlossSource from "../demos/listBox/ListBoxGloss.demo.tsx?raw";
import { ListBoxPermissionsDemo } from "../demos/listBox/ListBoxPermissions.demo";
import listBoxPermissionsSource from "../demos/listBox/ListBoxPermissions.demo.tsx?raw";
import { ListBoxSimpleApiDemo } from "../demos/listBox/ListBoxSimpleApi.demo";
import listBoxSimpleApiSource from "../demos/listBox/ListBoxSimpleApi.demo.tsx?raw";
import { ListBoxSizesDemo } from "../demos/listBox/ListBoxSizes.demo";
import listBoxSizesSource from "../demos/listBox/ListBoxSizes.demo.tsx?raw";
import { ListBoxWorkspacePickerDemo } from "../demos/listBox/ListBoxWorkspacePicker.demo";
import listBoxWorkspacePickerSource from "../demos/listBox/ListBoxWorkspacePicker.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function ListBoxShowcase() {
  return (
    <ShowcasePage
      title="ListBox"
      description="Selection list for embedding in panels, forms and drop-down menus."
      importPath='import { ListBox } from "@/components/core/ListBox";'
      tags={["core", "selection"]}
    >
      <ShowcaseSection title="Compound" description="Sections, tips and icons for items.">
        <ShowcaseDemoFromFile align="stretch" Demo={ListBoxCompoundDemo} source={listBoxCompoundSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Simple API" description="label on Item and multiple choice.">
        <ShowcaseDemoFromFile align="stretch" Demo={ListBoxSimpleApiDemo} source={listBoxSimpleApiSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="stretch" Demo={ListBoxSizesDemo} source={listBoxSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — glass list panel with hover-lift.">
        <ShowcaseDemoFromFile align="stretch" Demo={ListBoxGlossDemo} source={listBoxGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Slots root, section, header, item, label, hint and icon — through prop classNames."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={ListBoxClassNamesFullDemo} source={listBoxClassNamesFullSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Choice workspace, access rights and command palette — `demos/listBox/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={ListBoxWorkspacePickerDemo} source={listBoxWorkspacePickerSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ListBoxPermissionsDemo} source={listBoxPermissionsSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ListBoxCommandPaletteDemo} source={listBoxCommandPaletteSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/ListBox" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Section, Header, Item, ItemIndicator, Label, Hint and Icon — full list markup."
          />
          <ShowcaseDoc.ApiRow
            api="simple"
            description="ListBox.Item with props label, hint and disabled — shortened version."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Choice">
          <p>
            Single mode - line in <code>value</code>. <code>multiple</code> — array of strings.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
