import { InputAuthPanelDemo } from "../demos/input/InputAuthPanel.demo";
import inputAuthPanelSource from "../demos/input/InputAuthPanel.demo.tsx?raw";
import { InputClassNamesCompoundDemo, InputClassNamesFullDemo } from "../demos/input/InputClassNamesFull.demo";
import inputClassNamesFullSource from "../demos/input/InputClassNamesFull.demo.tsx?raw";
import { LabelClassNamesFullDemo } from "../demos/label/LabelClassNamesFull.demo";
import labelClassNamesFullSource from "../demos/label/LabelClassNamesFull.demo.tsx?raw";
import { InputCompoundDemo } from "../demos/input/InputCompound.demo";
import inputCompoundSource from "../demos/input/InputCompound.demo.tsx?raw";
import { InputGlossDemo } from "../demos/input/InputGloss.demo";
import inputGlossSource from "../demos/input/InputGloss.demo.tsx?raw";
import { InputInlinePairDemo } from "../demos/input/InputInlinePair.demo";
import inputInlinePairSource from "../demos/input/InputInlinePair.demo.tsx?raw";
import { InputStatusesDemo } from "../demos/input/InputStatuses.demo";
import inputStatusesSource from "../demos/input/InputStatuses.demo.tsx?raw";
import { InputUrlAffixesDemo } from "../demos/input/InputUrlAffixes.demo";
import inputUrlAffixesSource from "../demos/input/InputUrlAffixes.demo.tsx?raw";
import { InputSizesDemo } from "../demos/input/InputSizes.demo";
import inputSizesSource from "../demos/input/InputSizes.demo.tsx?raw";
import { InputVariantsDemo } from "../demos/input/InputVariants.demo";
import inputVariantsSource from "../demos/input/InputVariants.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function InputShowcase() {
  return (
    <ShowcasePage
      title="Input"
      description="Text field with Simple and Compound API — label, hint and error on the root or through slots."
      importPath='import { Input } from "@/components/core/Input";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection title="Variants" description="default, outline, secondary and gloss — all field shells side by side.">
        <ShowcaseDemoFromFile align="stretch" Demo={InputVariantsDemo} source={inputVariantsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="center" Demo={InputSizesDemo} source={inputSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Statuses × variants" description="Every status with every variant — same matrix as Button.">
        <ShowcaseDemoFromFile align="stretch" Demo={InputStatusesDemo} source={inputStatusesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Compound API" description="Input.Label, Input.Control, Input.Hint — explicit markup.">
        <ShowcaseDemoFromFile align="center" Demo={InputCompoundDemo} source={inputCompoundSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Slots root, shell, control, prefix, suffix, hint and error — through prop classNames."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={InputClassNamesFullDemo} source={inputClassNamesFullSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={InputClassNamesCompoundDemo} source={inputClassNamesFullSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={LabelClassNamesFullDemo} source={labelClassNamesFullSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — glass shell with motion.">
        <ShowcaseDemoFromFile align="center" Demo={InputGlossDemo} source={inputGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Affixes, auth-panel and inline-pair — demo-files in `demos/input/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={InputUrlAffixesDemo} source={inputUrlAffixesSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={InputAuthPanelDemo} source={inputAuthPanelSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={InputInlinePairDemo} source={inputInlinePairSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Input" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="label, hint, error, placeholder, variant and status — props on the root Input."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Input.Label, Input.Control, Input.Hint, Input.Error — for custom markup."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Options">
          <p>
            <code>variant</code>: default, outline, secondary, gloss. <code>status</code>: default, danger,
            success, warning, info. Field tips — prop <code>hint</code>, not <code>description</code>.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
