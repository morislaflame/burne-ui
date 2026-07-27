import { SearchInputBasicDemo } from "../demos/search-input/SearchInputBasic.demo";
import searchInputBasicSource from "../demos/search-input/SearchInputBasic.demo.tsx?raw";
import { SearchInputVariantsDemo } from "../demos/search-input/SearchInputVariants.demo";
import searchInputVariantsSource from "../demos/search-input/SearchInputVariants.demo.tsx?raw";
import { SearchInputClassNamesFullDemo } from "../demos/search-input/SearchInputClassNamesFull.demo";
import searchInputClassNamesFullSource from "../demos/search-input/SearchInputClassNamesFull.demo.tsx?raw";
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
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function SearchInputShowcase() {
  return (
    <ShowcasePage
      title="SearchInput"
      description="Search field with icon and controlled value."
      importPath='import { SearchInput } from "@/components/core/SearchInput";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection title="Search" description="Controlled through value and onChange.">
        <ShowcaseDemoFromFile align="center" Demo={SearchInputBasicDemo} source={searchInputBasicSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Variants" description="default, outline, secondary and gloss — all field shells side by side.">
        <ShowcaseDemoFromFile align="stretch" Demo={SearchInputVariantsDemo} source={searchInputVariantsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="center" Demo={SearchInputSizesDemo} source={searchInputSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Result" description="Current search field value.">
        <ShowcaseDemoFromFile align="center" Demo={SearchInputWithResultDemo} source={searchInputWithResultSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Slots root, icon, input and clear — through prop classNames."
      >
        <ShowcaseDemoFromFile
          align="center"
          Demo={SearchInputClassNamesFullDemo}
          source={searchInputClassNamesFullSource}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — glass shell with motion.">
        <ShowcaseDemoFromFile align="center" Demo={SearchInputGlossDemo} source={searchInputGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Command bar, filter with badges and gloss hero — demo-files in `demos/search-input/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={SearchInputCommandBarDemo} source={searchInputCommandBarSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SearchInputFilterResultsDemo} source={searchInputFilterResultsSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SearchInputGlossHeroDemo} source={searchInputGlossHeroSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/SearchInput" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="value, onChange, placeholder, aria-label — controlled search icon field."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Availability">
          <p>
            Be sure to indicate <code>aria-label</code>, if there is no visible label — the component does not render
            default text signature.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
