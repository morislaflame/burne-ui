import { SelectClassNamesFullDemo } from "../demos/select/SelectClassNamesFull.demo";
import selectClassNamesFullSource from "../demos/select/SelectClassNamesFull.demo.tsx?raw";
import { SelectCompoundDemo } from "../demos/select/SelectCompound.demo";
import selectCompoundSource from "../demos/select/SelectCompound.demo.tsx?raw";
import { SelectDefaultDemo } from "../demos/select/SelectDefault.demo";
import selectDefaultSource from "../demos/select/SelectDefault.demo.tsx?raw";
import { SelectGlossDemo } from "../demos/select/SelectGloss.demo";
import selectGlossSource from "../demos/select/SelectGloss.demo.tsx?raw";
import { SelectSizesDemo } from "../demos/select/SelectSizes.demo";
import selectSizesSource from "../demos/select/SelectSizes.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function SelectShowcase() {
  return (
    <ShowcasePage
      title="Select"
      description="Drop-down list without search - select one value from options."
      importPath='import { Select } from "@/components/core/Select";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection title="Default" description="options, value and onValueChange — controlled mode.">
        <ShowcaseDemoFromFile align="center" Demo={SelectDefaultDemo} source={selectDefaultSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Compound" description="Label, TriggerGroup, Value, Trigger, Popover.">
        <ShowcaseDemoFromFile align="center" Demo={SelectCompoundDemo} source={selectCompoundSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="center" Demo={SelectSizesDemo} source={selectSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — glass shell.">
        <ShowcaseDemoFromFile align="center" Demo={SelectGlossDemo} source={selectGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection title="classNames" description="Slot customization triggerGroup, value, popover and listBox.">
        <ShowcaseDemoFromFile
          align="center"
          Demo={SelectClassNamesFullDemo}
          source={selectClassNamesFullSource}
        />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Select" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="options: { value, label }[], value, onValueChange, label, hint, variant."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="TriggerGroup, Value, Trigger, Popover, Hint, Error + classNames."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
