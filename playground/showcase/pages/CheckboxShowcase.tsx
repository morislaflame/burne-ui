import { CheckboxConsentCardDemo } from "../demos/checkbox/CheckboxConsentCard.demo";
import checkboxConsentCardSource from "../demos/checkbox/CheckboxConsentCard.demo.tsx?raw";
import { CheckboxFeatureFlagsDemo } from "../demos/checkbox/CheckboxFeatureFlags.demo";
import checkboxFeatureFlagsSource from "../demos/checkbox/CheckboxFeatureFlags.demo.tsx?raw";
import { CheckboxGlossDemo } from "../demos/checkbox/CheckboxGloss.demo";
import checkboxGlossSource from "../demos/checkbox/CheckboxGloss.demo.tsx?raw";
import { CheckboxIndicatorShapeDemo } from "../demos/checkbox/CheckboxIndicatorShape.demo";
import checkboxIndicatorShapeSource from "../demos/checkbox/CheckboxIndicatorShape.demo.tsx?raw";
import { CheckboxSizesDemo } from "../demos/checkbox/CheckboxSizes.demo";
import checkboxSizesSource from "../demos/checkbox/CheckboxSizes.demo.tsx?raw";
import { CheckboxTaskListDemo } from "../demos/checkbox/CheckboxTaskList.demo";
import checkboxTaskListSource from "../demos/checkbox/CheckboxTaskList.demo.tsx?raw";
import { CheckboxTermsDemo } from "../demos/checkbox/CheckboxTerms.demo";
import checkboxTermsSource from "../demos/checkbox/CheckboxTerms.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function CheckboxShowcase() {
  return (
    <ShowcasePage
      title="Checkbox"
      description="Флажок выбора с поддержкой размеров и состояния disabled."
      importPath='import { Checkbox } from "@/components/core/Checkbox";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection title="Базовый" description="Контролируемый чекбокс с label на корне.">
        <ShowcaseDemoFromFile Demo={CheckboxTermsDemo} source={checkboxTermsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile Demo={CheckboxSizesDemo} source={checkboxSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — стеклянный индикатор с motion.">
        <ShowcaseDemoFromFile Demo={CheckboxGlossDemo} source={checkboxGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Форма индикатора, compound API и variant-микс — demo-файлы в `demos/checkbox/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={CheckboxIndicatorShapeDemo} source={checkboxIndicatorShapeSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={CheckboxFeatureFlagsDemo} source={checkboxFeatureFlagsSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={CheckboxConsentCardDemo} source={checkboxConsentCardSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={CheckboxTaskListDemo} source={checkboxTaskListSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Checkbox" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="label, checked, onChange, size, disabled на корне. SelectionIndicator внутри."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Группы">
          <p>
            Для набора чекбоксов используйте <code>CheckboxGroup</code> из{" "}
            <code>@/components/composite/CheckboxGroup</code>.
          </p>
        </ShowcaseDoc.Block>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
