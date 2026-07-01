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
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function SelectShowcase() {
  return (
    <ShowcasePage
      title="Select"
      description="Выпадающий список без поиска — выбор одного значения из options."
      importPath='import { Select } from "@/components/core/Select";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection title="Default" description="options, value и onValueChange — controlled режим.">
        <ShowcaseDemoFromFile align="center" Demo={SelectDefaultDemo} source={selectDefaultSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Compound" description="Label, TriggerGroup, Value, Trigger, Popover.">
        <ShowcaseDemoFromFile align="center" Demo={SelectCompoundDemo} source={selectCompoundSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="center" Demo={SelectSizesDemo} source={selectSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — стеклянная оболочка.">
        <ShowcaseDemoFromFile align="center" Demo={SelectGlossDemo} source={selectGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection title="classNames" description="Кастомизация слотов triggerGroup, value, popover и listBox.">
        <ShowcaseDemoFromFile
          align="center"
          Demo={SelectClassNamesFullDemo}
          source={selectClassNamesFullSource}
        />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
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
