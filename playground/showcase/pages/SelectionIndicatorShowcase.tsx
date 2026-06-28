import { SelectionIndicatorGalleryDemo } from "../demos/selectionIndicator/SelectionIndicatorGallery.demo";
import selectionIndicatorGallerySource from "../demos/selectionIndicator/SelectionIndicatorGallery.demo.tsx?raw";
import { SelectionIndicatorGlossDemo } from "../demos/selectionIndicator/SelectionIndicatorGloss.demo";
import selectionIndicatorGlossSource from "../demos/selectionIndicator/SelectionIndicatorGloss.demo.tsx?raw";
import { SelectionIndicatorShapeCompareDemo } from "../demos/selectionIndicator/SelectionIndicatorShapeCompare.demo";
import selectionIndicatorShapeCompareSource from "../demos/selectionIndicator/SelectionIndicatorShapeCompare.demo.tsx?raw";
import { SelectionIndicatorThumbGalleryDemo } from "../demos/selectionIndicator/SelectionIndicatorThumbGallery.demo";
import selectionIndicatorThumbGallerySource from "../demos/selectionIndicator/SelectionIndicatorThumbGallery.demo.tsx?raw";
import { SelectionIndicatorVariantMixDemo } from "../demos/selectionIndicator/SelectionIndicatorVariantMix.demo";
import selectionIndicatorVariantMixSource from "../demos/selectionIndicator/SelectionIndicatorVariantMix.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function SelectionIndicatorShowcase() {
  return (
    <ShowcasePage
      title="SelectionIndicator"
      description="Публичный примитив индикатора выбора для Radio, Checkbox и Slider thumb."
      importPath='import { SelectionIndicator } from "@/components/core/SelectionIndicator";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection
        title="Размеры и варианты"
        description="Публичный примитив индикатора выбора (Radio, Checkbox, Slider thumb)."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={SelectionIndicatorGalleryDemo} source={selectionIndicatorGallerySource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — стеклянный индикатор.">
        <ShowcaseDemoFromFile align="stretch" Demo={SelectionIndicatorGlossDemo} source={selectionIndicatorGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Сравнение форм, сетка вариантов и SelectionThumb — `demos/selectionIndicator/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={SelectionIndicatorShapeCompareDemo} source={selectionIndicatorShapeCompareSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SelectionIndicatorVariantMixDemo} source={selectionIndicatorVariantMixSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SelectionIndicatorThumbGalleryDemo} source={selectionIndicatorThumbGallerySource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/SelectionIndicator" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="size, variant, selected, check на корне. Используется внутри Checkbox, Radio и SelectionThumb."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Связанные компоненты">
          <p>
            <code>SelectionThumb</code> и <code>SelectionThumbIcon</code> — для ползунков Slider. Размеры:{" "}
            <code>small</code>, <code>base</code>, <code>mid</code>, <code>large</code>.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
