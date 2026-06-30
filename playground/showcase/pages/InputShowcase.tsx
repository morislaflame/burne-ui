import { InputAuthPanelDemo } from "../demos/input/InputAuthPanel.demo";
import inputAuthPanelSource from "../demos/input/InputAuthPanel.demo.tsx?raw";
import {
  InputClassNamesCompoundDemo,
  InputClassNamesFullDemo,
} from "../demos/input/InputClassNamesFull.demo";
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
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function InputShowcase() {
  return (
    <ShowcasePage
      title="Input"
      description="Текстовое поле с Simple и Compound API — label, hint и error на корне или через слоты."
      importPath='import { Input } from "@/components/core/Input";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection title="Варианты" description="default и variant outline — альтернативные оболочки поля.">
        <ShowcaseDemoFromFile align="center" Demo={InputVariantsDemo} source={inputVariantsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="center" Demo={InputSizesDemo} source={inputSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Статусы" description="status меняет цвет обводки и текста ошибки.">
        <ShowcaseDemoFromFile align="center" Demo={InputStatusesDemo} source={inputStatusesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Compound API" description="Input.Label, Input.Control, Input.Hint — явная разметка.">
        <ShowcaseDemoFromFile align="center" Demo={InputCompoundDemo} source={inputCompoundSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Слоты root, shell, control, prefix, suffix, hint и error — через prop classNames."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={InputClassNamesFullDemo} source={inputClassNamesFullSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={InputClassNamesCompoundDemo} source={inputClassNamesFullSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={LabelClassNamesFullDemo} source={labelClassNamesFullSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — стеклянная оболочка с motion.">
        <ShowcaseDemoFromFile align="center" Demo={InputGlossDemo} source={inputGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Affixes, auth-панель и inline-пара — demo-файлы в `demos/input/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={InputUrlAffixesDemo} source={inputUrlAffixesSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={InputAuthPanelDemo} source={inputAuthPanelSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={InputInlinePairDemo} source={inputInlinePairSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Input" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="label, hint, error, placeholder, variant и status — props на корне Input."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Input.Label, Input.Control, Input.Hint, Input.Error — для кастомной разметки."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Варианты">
          <p>
            <code>variant</code>: default, gloss, outline. <code>status</code>: default, danger, success,
            warning. Подсказки поля — проп <code>hint</code>, не <code>description</code>.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
