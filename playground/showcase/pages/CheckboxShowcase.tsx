import { CheckboxClassNamesFullDemo } from "../demos/checkbox/CheckboxClassNamesFull.demo";
import checkboxClassNamesFullSource from "../demos/checkbox/CheckboxClassNamesFull.demo.tsx?raw";
import { CheckboxClassNamesSimpleLabelDemo } from "../demos/checkbox/CheckboxClassNamesSimpleLabel.demo";
import checkboxClassNamesSimpleLabelSource from "../demos/checkbox/CheckboxClassNamesSimpleLabel.demo.tsx?raw";
import { CheckboxConsentCardDemo } from "../demos/checkbox/CheckboxConsentCard.demo";
import checkboxConsentCardSource from "../demos/checkbox/CheckboxConsentCard.demo.tsx?raw";
import { CheckboxFeatureFlagsDemo } from "../demos/checkbox/CheckboxFeatureFlags.demo";
import checkboxFeatureFlagsSource from "../demos/checkbox/CheckboxFeatureFlags.demo.tsx?raw";
import { CheckboxGlossDemo } from "../demos/checkbox/CheckboxGloss.demo";
import checkboxGlossSource from "../demos/checkbox/CheckboxGloss.demo.tsx?raw";
import { CheckboxIndicatorShapeDemo } from "../demos/checkbox/CheckboxIndicatorShape.demo";
import checkboxIndicatorShapeSource from "../demos/checkbox/CheckboxIndicatorShape.demo.tsx?raw";
import { CheckboxIndicatorCompoundDemo } from "../demos/checkbox/CheckboxIndicatorCompound.demo";
import checkboxIndicatorCompoundSource from "../demos/checkbox/CheckboxIndicatorCompound.demo.tsx?raw";
import { CheckboxSizesDemo } from "../demos/checkbox/CheckboxSizes.demo";
import checkboxSizesSource from "../demos/checkbox/CheckboxSizes.demo.tsx?raw";
import { CheckboxTaskListDemo } from "../demos/checkbox/CheckboxTaskList.demo";
import checkboxTaskListSource from "../demos/checkbox/CheckboxTaskList.demo.tsx?raw";
import { CheckboxTermsDemo } from "../demos/checkbox/CheckboxTerms.demo";
import checkboxTermsSource from "../demos/checkbox/CheckboxTerms.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function CheckboxShowcase() {
  return (
    <ShowcasePage
      title="Checkbox"
      description="Selection checkbox with size and state support disabled."
      importPath='import { Checkbox } from "@/components/core/Checkbox";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection title="Base" description="Controlled checkbox with label on the root.">
        <ShowcaseDemoFromFile Demo={CheckboxTermsDemo} source={checkboxTermsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile Demo={CheckboxSizesDemo} source={checkboxSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — glass indicator with motion.">
        <ShowcaseDemoFromFile Demo={CheckboxGlossDemo} source={checkboxGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Full customization of slots via classNames on root."
      >
        <ShowcaseDemoFromFile
          align="stretch"
          Demo={CheckboxClassNamesFullDemo}
          source={checkboxClassNamesFullSource}
        />
        <ShowcaseDemoFromFile
          align="stretch"
          Demo={CheckboxClassNamesSimpleLabelDemo}
          source={checkboxClassNamesSimpleLabelSource}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Indicator shape, compound API and variant-mix — demo-files in `demos/checkbox/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={CheckboxIndicatorShapeDemo} source={checkboxIndicatorShapeSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={CheckboxIndicatorCompoundDemo} source={checkboxIndicatorCompoundSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={CheckboxFeatureFlagsDemo} source={checkboxFeatureFlagsSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={CheckboxConsentCardDemo} source={checkboxConsentCardSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={CheckboxTaskListDemo} source={checkboxTaskListSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Checkbox" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="label, checked, onChange, size, disabled on the root. SelectionIndicator inside."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="root, control, indicator, indicatorFill, indicatorMark, content, label, hint, error."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Checkbox.Indicator.Fill / .Mark; classNames.root / fill / mark."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Groups">
          <p>
            To set checkboxes use <code>CheckboxGroup</code> from{" "}
            <code>@/components/composite/CheckboxGroup</code>.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
