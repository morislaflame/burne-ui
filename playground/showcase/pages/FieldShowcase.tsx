import { FieldAddressSetDemo } from "../demos/field/FieldAddressSet.demo";
import fieldAddressSetSource from "../demos/field/FieldAddressSet.demo.tsx?raw";
import { FieldClassNamesFullDemo, FieldSetClassNamesFullDemo } from "../demos/field/FieldClassNamesFull.demo";
import fieldClassNamesFullSource from "../demos/field/FieldClassNamesFull.demo.tsx?raw";
import { FieldBillingSetDemo } from "../demos/field/FieldBillingSet.demo";
import fieldBillingSetSource from "../demos/field/FieldBillingSet.demo.tsx?raw";
import { FieldContactSetDemo } from "../demos/field/FieldContactSet.demo";
import fieldContactSetSource from "../demos/field/FieldContactSet.demo.tsx?raw";
import { FieldHorizontalPairDemo } from "../demos/field/FieldHorizontalPair.demo";
import fieldHorizontalPairSource from "../demos/field/FieldHorizontalPair.demo.tsx?raw";
import { FieldSettingsPanelDemo } from "../demos/field/FieldSettingsPanel.demo";
import fieldSettingsPanelSource from "../demos/field/FieldSettingsPanel.demo.tsx?raw";
import { FieldSizesDemo } from "../demos/field/FieldSizes.demo";
import fieldSizesSource from "../demos/field/FieldSizes.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function FieldShowcase() {
  return (
    <ShowcasePage
      title="Field"
      description="Low-level form field primitives: legend, group, tips and actions."
      importPath='import { Field } from "@/components/core/Field";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection title="Field.Set" description="Compound API for a set of related fields.">
        <ShowcaseDemoFromFile align="stretch" Demo={FieldContactSetDemo} source={fieldContactSetSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Sizes"
        description="size scales Field.Set chrome (gaps + Label / Hint type). No surface on Set — legend is outside the fieldset content box."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={FieldSizesDemo} source={fieldSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Legend and Hint" description="Field.LegendHeader combines title and tooltip.">
        <ShowcaseDemoFromFile align="stretch" Demo={FieldAddressSetDemo} source={fieldAddressSetSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Field: surface on root OK. Field.Set: layout slots only — no surface on fieldset (legend is outside content box)."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={FieldClassNamesFullDemo} source={fieldClassNamesFullSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={FieldSetClassNamesFullDemo} source={fieldClassNamesFullSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Billing fieldset, horizontal pair of dates and settings panel — demo-files in `demos/field/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={FieldBillingSetDemo} source={fieldBillingSetSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={FieldHorizontalPairDemo} source={fieldHorizontalPairSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={FieldSettingsPanelDemo} source={fieldSettingsPanelSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Field" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Field, Field.Label, Field.Hint, Field.Error — field wrapper primitive. Field.Set, Field.Legend, Field.Group, Field.Actions — set of form fields."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="small | base | mid | large — Field / Set chrome only (gaps + Label / Hint type)."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Compound">
          <p>
            <code>Field.Hint</code> — tooltip below the field (not to be confused with <code>Card.Description</code>).{" "}
            <code>Field.Legend</code> + <code>Field.LegendHeader</code> — section header.{" "}
            <code>Field.Group</code> — container for Input/TextArea.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization>
          <p>
            <code>className</code> on Set/Group. Hint status — <code>Field.Hint status=&quot;danger&quot;</code>.
            For custom controls, wrap input in <code>Field</code>.
          </p>
        </ShowcaseDoc.Customization>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
