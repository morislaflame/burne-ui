import { RadioGroupContactMethodDemo } from "../demos/radioGroup/RadioGroupContactMethod.demo";
import radioGroupContactMethodSource from "../demos/radioGroup/RadioGroupContactMethod.demo.tsx?raw";
import { RadioClassNamesFullDemo } from "../demos/radio/RadioClassNamesFull.demo";
import radioClassNamesFullSource from "../demos/radio/RadioClassNamesFull.demo.tsx?raw";
import { RadioClassNamesSimpleLabelDemo } from "../demos/radio/RadioClassNamesSimpleLabel.demo";
import radioClassNamesSimpleLabelSource from "../demos/radio/RadioClassNamesSimpleLabel.demo.tsx?raw";
import { RadioSizesDemo } from "../demos/radioGroup/RadioSizes.demo";
import radioSizesSource from "../demos/radioGroup/RadioSizes.demo.tsx?raw";
import { RadioGroupCustomIndicatorDemo } from "../demos/radioGroup/RadioGroupCustomIndicator.demo";
import radioGroupCustomIndicatorSource from "../demos/radioGroup/RadioGroupCustomIndicator.demo.tsx?raw";
import { RadioGroupGlossDemo } from "../demos/radioGroup/RadioGroupGloss.demo";
import radioGroupGlossSource from "../demos/radioGroup/RadioGroupGloss.demo.tsx?raw";
import { RadioGroupHorizontalSizesDemo } from "../demos/radioGroup/RadioGroupHorizontalSizes.demo";
import radioGroupHorizontalSizesSource from "../demos/radioGroup/RadioGroupHorizontalSizes.demo.tsx?raw";
import { RadioGroupPlanCardsDemo } from "../demos/radioGroup/RadioGroupPlanCards.demo";
import radioGroupPlanCardsSource from "../demos/radioGroup/RadioGroupPlanCards.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function RadioGroupShowcase() {
  return (
    <ShowcasePage
      title="RadioGroup"
      description="Группа взаимоисключающих вариантов выбора с Radio внутри."
      importPath='import { RadioGroup } from "@/components/composite/RadioGroup"; import { Radio } from "@/components/core/Radio";'
      tags={["composite", "forms"]}
    >
      <ShowcaseSection title="Способ связи" description="RadioGroup + Radio с Legend и List.">
        <ShowcaseDemoFromFile align="stretch" Demo={RadioGroupContactMethodDemo} source={radioGroupContactMethodSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="size на Radio: small, base, mid, large.">
        <ShowcaseDemoFromFile Demo={RadioSizesDemo} source={radioSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss на Radio — стеклянный индикатор.">
        <ShowcaseDemoFromFile align="stretch" Demo={RadioGroupGlossDemo} source={radioGroupGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Полная кастомизация слотов Radio через classNames на root."
      >
        <ShowcaseDemoFromFile
          align="stretch"
          Demo={RadioClassNamesFullDemo}
          source={radioClassNamesFullSource}
        />
        <ShowcaseDemoFromFile
          align="stretch"
          Demo={RadioClassNamesSimpleLabelDemo}
          source={radioClassNamesSimpleLabelSource}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Карточки тарифов, горизонтальный список и кастомный индикатор — `demos/radioGroup/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={RadioGroupPlanCardsDemo} source={radioGroupPlanCardsSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={RadioGroupHorizontalSizesDemo} source={radioGroupHorizontalSizesSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={RadioGroupCustomIndicatorDemo} source={radioGroupCustomIndicatorSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/composite/RadioGroup" />
          <ShowcaseDoc.Import path="@/components/core/Radio" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="RadioGroup.Legend, RadioGroup.Label, RadioGroup.List — обёртка. Radio — отдельный пункт с value и label."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Состояние">
          <p>
            <code>value</code> и <code>onValueChange</code> на RadioGroup. Каждый <code>Radio</code> задаёт{" "}
            <code>value</code> и <code>label</code>.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
