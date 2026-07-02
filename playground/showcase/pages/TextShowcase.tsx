import { TextEditorialArticleDemo } from "../demos/text/TextEditorialArticle.demo";
import textEditorialArticleSource from "../demos/text/TextEditorialArticle.demo.tsx?raw";
import { TextHeroBlockDemo } from "../demos/text/TextHeroBlock.demo";
import textHeroBlockSource from "../demos/text/TextHeroBlock.demo.tsx?raw";
import { TextSemanticsDemo } from "../demos/text/TextSemantics.demo";
import textSemanticsSource from "../demos/text/TextSemantics.demo.tsx?raw";
import { TextStatsGridDemo } from "../demos/text/TextStatsGrid.demo";
import textStatsGridSource from "../demos/text/TextStatsGrid.demo.tsx?raw";
import { TextVariantsDemo } from "../demos/text/TextVariants.demo";
import textVariantsSource from "../demos/text/TextVariants.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function TextShowcase() {
  return (
    <ShowcasePage
      title="Text"
      description="Типографические варианты для заголовков, основного текста и служебных подписей."
      importPath='import { Text } from "@/components/core/Text";'
      tags={["core", "typography"]}
    >
      <ShowcaseSection title="Варианты" description="Все preset-варианты variant на компоненте Text.">
        <ShowcaseDemoFromFile Demo={TextVariantsDemo} source={textVariantsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Семантика" description="Проп as задаёт HTML-элемент без смены визуального стиля.">
        <ShowcaseDemoFromFile Demo={TextSemanticsDemo} source={textSemanticsSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Свои цвета, layout и композиции — демо в отдельных файлах, код подтягивается через ?raw."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={TextHeroBlockDemo} source={textHeroBlockSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={TextEditorialArticleDemo} source={textEditorialArticleSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={TextStatsGridDemo} source={textStatsGridSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Text" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="variant и as на корне — основной способ типографики в приложении."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Варианты">
          <p>
            <code>accent-header</code>, <code>header-1</code>, <code>header-2</code>,{" "}
            <code>large</code>, <code>mid</code>, <code>base</code>, <code>small</code>, <code>tools</code>.
            Дополнительные цвета — через <code>className</code> (например, <code>text-muted</code>).
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
