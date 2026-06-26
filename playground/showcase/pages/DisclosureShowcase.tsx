import { DisclosureCardGroupDemo } from "../demos/disclosure/DisclosureCardGroup.demo";
import disclosureCardGroupSource from "../demos/disclosure/DisclosureCardGroup.demo.tsx?raw";
import { DisclosureChangelogDemo } from "../demos/disclosure/DisclosureChangelog.demo";
import disclosureChangelogSource from "../demos/disclosure/DisclosureChangelog.demo.tsx?raw";
import { DisclosureCheckoutStepsDemo } from "../demos/disclosure/DisclosureCheckoutSteps.demo";
import disclosureCheckoutStepsSource from "../demos/disclosure/DisclosureCheckoutSteps.demo.tsx?raw";
import { DisclosureGlossDemo } from "../demos/disclosure/DisclosureGloss.demo";
import disclosureGlossSource from "../demos/disclosure/DisclosureGloss.demo.tsx?raw";
import { DisclosureOutlineFaqDemo } from "../demos/disclosure/DisclosureOutlineFaq.demo";
import disclosureOutlineFaqSource from "../demos/disclosure/DisclosureOutlineFaq.demo.tsx?raw";
import { DisclosureSettingsGroupDemo } from "../demos/disclosure/DisclosureSettingsGroup.demo";
import disclosureSettingsGroupSource from "../demos/disclosure/DisclosureSettingsGroup.demo.tsx?raw";
import { DisclosureSingleDemo } from "../demos/disclosure/DisclosureSingle.demo";
import disclosureSingleSource from "../demos/disclosure/DisclosureSingle.demo.tsx?raw";
import { DisclosureSizesDemo } from "../demos/disclosure/DisclosureSizes.demo";
import disclosureSizesSource from "../demos/disclosure/DisclosureSizes.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function DisclosureShowcase() {
  return (
    <ShowcasePage
      title="Disclosure"
      description="Раскрывающиеся блоки с анимацией высоты — для FAQ и одиночных секций."
      importPath='import { Disclosure, DisclosureGroup } from "@/components/core/Disclosure";'
      tags={["core", "disclosure"]}
    >
      <ShowcaseSection title="Одиночный" description="Один Disclosure без группы.">
        <ShowcaseDemoFromFile align="stretch" Demo={DisclosureSingleDemo} source={disclosureSingleSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="stretch" Demo={DisclosureSizesDemo} source={disclosureSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Card group" description="DisclosureGroup variant card — общая карточка.">
        <ShowcaseDemoFromFile align="stretch" Demo={DisclosureCardGroupDemo} source={disclosureCardGroupSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Outline FAQ" description="DisclosureGroup variant outline с иконками.">
        <ShowcaseDemoFromFile align="stretch" Demo={DisclosureOutlineFaqDemo} source={disclosureOutlineFaqSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — стеклянная панель с hover-lift.">
        <ShowcaseDemoFromFile align="stretch" Demo={DisclosureGlossDemo} source={disclosureGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Шаги оформления, группа настроек и changelog — `demos/disclosure/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={DisclosureCheckoutStepsDemo} source={disclosureCheckoutStepsSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={DisclosureSettingsGroupDemo} source={disclosureSettingsGroupSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={DisclosureChangelogDemo} source={disclosureChangelogSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Disclosure" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Disclosure.Trigger и Disclosure.Content — слоты блока. DisclosureGroup объединяет несколько."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Группы">
          <p>
            <code>variant=&quot;card&quot;</code> и <code>variant=&quot;outline&quot;</code> на DisclosureGroup.
            <code>defaultValue</code> — открытый пункт по умолчанию.
          </p>
        </ShowcaseDoc.Block>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
