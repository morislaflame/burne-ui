import { TimeFieldClassNamesCompoundDemo, TimeFieldClassNamesFullDemo } from "../demos/time-field/TimeFieldClassNamesFull.demo";
import timeFieldClassNamesFullSource from "../demos/time-field/TimeFieldClassNamesFull.demo.tsx?raw";
import { TimeFieldCompoundSegmentedDemo } from "../demos/time-field/TimeFieldCompoundSegmented.demo";
import timeFieldCompoundSegmentedSource from "../demos/time-field/TimeFieldCompoundSegmented.demo.tsx?raw";
import { TimeFieldGlossDemo } from "../demos/time-field/TimeFieldGloss.demo";
import timeFieldGlossSource from "../demos/time-field/TimeFieldGloss.demo.tsx?raw";
import { TimeFieldReminderCardDemo } from "../demos/time-field/TimeFieldReminderCard.demo";
import timeFieldReminderCardSource from "../demos/time-field/TimeFieldReminderCard.demo.tsx?raw";
import { TimeFieldSegmentedRowDemo } from "../demos/time-field/TimeFieldSegmentedRow.demo";
import timeFieldSegmentedRowSource from "../demos/time-field/TimeFieldSegmentedRow.demo.tsx?raw";
import { TimeFieldShiftWindowDemo } from "../demos/time-field/TimeFieldShiftWindow.demo";
import timeFieldShiftWindowSource from "../demos/time-field/TimeFieldShiftWindow.demo.tsx?raw";
import { TimeFieldSimpleDemo } from "../demos/time-field/TimeFieldSimple.demo";
import timeFieldSimpleSource from "../demos/time-field/TimeFieldSimple.demo.tsx?raw";
import { TimeFieldSizesDemo } from "../demos/time-field/TimeFieldSizes.demo";
import timeFieldSizesSource from "../demos/time-field/TimeFieldSizes.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function TimeFieldShowcase() {
  return (
    <ShowcasePage
      title="TimeField"
      description="Time input field in HH:MM s format prefix and options segmented/gloss."
      importPath='import { TimeField } from "@/components/core/TimeField";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection title="Simple API" description="Controlled value in 24 hour format.">
        <ShowcaseDemoFromFile align="center" Demo={TimeFieldSimpleDemo} source={timeFieldSimpleSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="center" Demo={TimeFieldSizesDemo} source={timeFieldSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — glass shell.">
        <ShowcaseDemoFromFile align="center" Demo={TimeFieldGlossDemo} source={timeFieldGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Full customization classNames"
        description="Slots root, shell, prefix, suffix, segments, segment, hint, error through classNames on the root."
      >
        <ShowcaseDemoFromFile align="center" Demo={TimeFieldClassNamesFullDemo} source={timeFieldClassNamesFullSource} />
        <ShowcaseDemoFromFile align="center" Demo={TimeFieldClassNamesCompoundDemo} source={timeFieldClassNamesFullSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Compound and Segmented" description="TimeField.Label/Control/Hint and variant segmented.">
        <ShowcaseDemoFromFile align="center" Demo={TimeFieldCompoundSegmentedDemo} source={timeFieldCompoundSegmentedSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Segmented + affixes, HH:mm:ss and compact compound-pair — demo-files in `demos/time-field/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={TimeFieldShiftWindowDemo} source={timeFieldShiftWindowSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={TimeFieldReminderCardDemo} source={timeFieldReminderCardSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={TimeFieldSegmentedRowDemo} source={timeFieldSegmentedRowSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/TimeField" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="value, onValueChange, label, hint, prefix, variant (default | gloss | segmented)."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="TimeField.Label, TimeField.Control, TimeField.Hint — explicit field marking."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Format">
          <p>
            Value is string <code>&quot;HH:MM&quot;</code> in 24 hour format. prefix accepts ReactNode
            (usually a time icon).
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
