import { FieldAddressSetDemo } from "../demos/field/FieldAddressSet.demo";
import fieldAddressSetSource from "../demos/field/FieldAddressSet.demo.tsx?raw";
import {
  FieldClassNamesFullDemo,
  FieldSetClassNamesFullDemo,
} from "../demos/field/FieldClassNamesFull.demo";
import fieldClassNamesFullSource from "../demos/field/FieldClassNamesFull.demo.tsx?raw";
import { FieldBillingSetDemo } from "../demos/field/FieldBillingSet.demo";
import fieldBillingSetSource from "../demos/field/FieldBillingSet.demo.tsx?raw";
import { FieldContactSetDemo } from "../demos/field/FieldContactSet.demo";
import fieldContactSetSource from "../demos/field/FieldContactSet.demo.tsx?raw";
import { FieldHorizontalPairDemo } from "../demos/field/FieldHorizontalPair.demo";
import fieldHorizontalPairSource from "../demos/field/FieldHorizontalPair.demo.tsx?raw";
import { FieldSettingsPanelDemo } from "../demos/field/FieldSettingsPanel.demo";
import fieldSettingsPanelSource from "../demos/field/FieldSettingsPanel.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function FieldShowcase() {
  return (
    <ShowcasePage
      title="Field"
      description="Низкоуровневые примитивы поля формы: legend, группа, подсказки и действия."
      importPath='import { Field } from "@/components/core/Field";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection title="Field.Set" description="Compound API для набора связанных полей.">
        <ShowcaseDemoFromFile align="stretch" Demo={FieldContactSetDemo} source={fieldContactSetSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Legend и Hint" description="Field.LegendHeader объединяет заголовок и подсказку.">
        <ShowcaseDemoFromFile align="stretch" Demo={FieldAddressSetDemo} source={fieldAddressSetSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Field.Root и Field.Set — кастомизация слотов через classNames."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={FieldClassNamesFullDemo} source={fieldClassNamesFullSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={FieldSetClassNamesFullDemo} source={fieldClassNamesFullSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Billing fieldset, горизонтальная пара дат и панель настроек — demo-файлы в `demos/field/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={FieldBillingSetDemo} source={fieldBillingSetSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={FieldHorizontalPairDemo} source={fieldHorizontalPairSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={FieldSettingsPanelDemo} source={fieldSettingsPanelSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Field" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Field.Root, Field.Label, Field.Hint, Field.Error — примитив оболочки поля. Field.Set, Field.Legend, Field.Group, Field.Actions — набор полей формы."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Состав">
          <p>
            <code>Field.Hint</code> — подсказка под полем (не путать с <code>Card.Description</code>).{" "}
            <code>Field.Legend</code> + <code>Field.LegendHeader</code> — заголовок секции.{" "}
            <code>Field.Group</code> — контейнер для Input/TextArea.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization>
          <p>
            <code>className</code> на Set/Group. Статус подсказки — <code>Field.Hint status=&quot;danger&quot;</code>.
            Для кастомных контролов оборачивайте input в <code>Field.Root</code>.
          </p>
        </ShowcaseDoc.Customization>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
