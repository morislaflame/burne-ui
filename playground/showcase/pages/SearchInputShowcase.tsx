import { SearchInputBasicDemo } from "../demos/search-input/SearchInputBasic.demo";
import searchInputBasicSource from "../demos/search-input/SearchInputBasic.demo.tsx?raw";
import { SearchInputSizesDemo } from "../demos/search-input/SearchInputSizes.demo";
import searchInputSizesSource from "../demos/search-input/SearchInputSizes.demo.tsx?raw";
import { SearchInputCommandBarDemo } from "../demos/search-input/SearchInputCommandBar.demo";
import searchInputCommandBarSource from "../demos/search-input/SearchInputCommandBar.demo.tsx?raw";
import { SearchInputFilterResultsDemo } from "../demos/search-input/SearchInputFilterResults.demo";
import searchInputFilterResultsSource from "../demos/search-input/SearchInputFilterResults.demo.tsx?raw";
import { SearchInputGlossDemo } from "../demos/search-input/SearchInputGloss.demo";
import searchInputGlossSource from "../demos/search-input/SearchInputGloss.demo.tsx?raw";
import { SearchInputGlossHeroDemo } from "../demos/search-input/SearchInputGlossHero.demo";
import searchInputGlossHeroSource from "../demos/search-input/SearchInputGlossHero.demo.tsx?raw";
import { SearchInputWithResultDemo } from "../demos/search-input/SearchInputWithResult.demo";
import searchInputWithResultSource from "../demos/search-input/SearchInputWithResult.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function SearchInputShowcase() {
  return (
    <ShowcasePage
      title="SearchInput"
      description="Поле поиска с иконкой и controlled value."
      importPath='import { SearchInput } from "@/components/core/SearchInput";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection title="Поиск" description="Controlled через value и onValueChange.">
        <ShowcaseDemoFromFile align="center" Demo={SearchInputBasicDemo} source={searchInputBasicSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="center" Demo={SearchInputSizesDemo} source={searchInputSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Результат" description="Текущее значение поля поиска.">
        <ShowcaseDemoFromFile align="center" Demo={SearchInputWithResultDemo} source={searchInputWithResultSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — стеклянная оболочка с motion.">
        <ShowcaseDemoFromFile align="center" Demo={SearchInputGlossDemo} source={searchInputGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Command bar, фильтр с бейджами и gloss hero — demo-файлы в `demos/search-input/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={SearchInputCommandBarDemo} source={searchInputCommandBarSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SearchInputFilterResultsDemo} source={searchInputFilterResultsSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SearchInputGlossHeroDemo} source={searchInputGlossHeroSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/SearchInput" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="value, onValueChange, placeholder, aria-label — controlled поле с иконкой поиска."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Доступность">
          <p>
            Обязательно укажите <code>aria-label</code>, если нет видимого label — компонент не рендерит
            текстовую подпись по умолчанию.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
