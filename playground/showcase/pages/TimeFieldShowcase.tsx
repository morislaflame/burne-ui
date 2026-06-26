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
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function TimeFieldShowcase() {
  return (
    <ShowcasePage
      title="TimeField"
      description="Поле ввода времени в формате ЧЧ:ММ с prefix и вариантами segmented/gloss."
      importPath='import { TimeField } from "@/components/core/TimeField";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection title="Simple API" description="Controlled value в формате 24 часа.">
        <ShowcaseDemoFromFile align="center" Demo={TimeFieldSimpleDemo} source={timeFieldSimpleSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="center" Demo={TimeFieldSizesDemo} source={timeFieldSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — стеклянная оболочка.">
        <ShowcaseDemoFromFile align="center" Demo={TimeFieldGlossDemo} source={timeFieldGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Compound и Segmented" description="TimeField.Label/Control/Hint и variant segmented.">
        <ShowcaseDemoFromFile align="center" Demo={TimeFieldCompoundSegmentedDemo} source={timeFieldCompoundSegmentedSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Segmented + affixes, HH:mm:ss и compact compound-пара — demo-файлы в `demos/time-field/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={TimeFieldShiftWindowDemo} source={timeFieldShiftWindowSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={TimeFieldReminderCardDemo} source={timeFieldReminderCardSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={TimeFieldSegmentedRowDemo} source={timeFieldSegmentedRowSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/TimeField" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="value, onValueChange, label, hint, prefix, variant (default | gloss | segmented)."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="TimeField.Label, TimeField.Control, TimeField.Hint — явная разметка поля."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Формат">
          <p>
            Значение — строка <code>&quot;ЧЧ:ММ&quot;</code> в 24-часовом формате. prefix принимает ReactNode
            (обычно иконку времени).
          </p>
        </ShowcaseDoc.Block>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
