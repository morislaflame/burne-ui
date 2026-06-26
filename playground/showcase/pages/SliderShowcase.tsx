import { SliderBudgetPanelDemo } from "../demos/slider/SliderBudgetPanel.demo";
import sliderBudgetPanelSource from "../demos/slider/SliderBudgetPanel.demo.tsx?raw";
import { SliderGlossDemo } from "../demos/slider/SliderGloss.demo";
import sliderGlossSource from "../demos/slider/SliderGloss.demo.tsx?raw";
import { SliderOpacityStripDemo } from "../demos/slider/SliderOpacityStrip.demo";
import sliderOpacityStripSource from "../demos/slider/SliderOpacityStrip.demo.tsx?raw";
import { SliderPriceRangeDemo } from "../demos/slider/SliderPriceRange.demo";
import sliderPriceRangeSource from "../demos/slider/SliderPriceRange.demo.tsx?raw";
import { SliderSizesDemo } from "../demos/slider/SliderSizes.demo";
import sliderSizesSource from "../demos/slider/SliderSizes.demo.tsx?raw";
import { SliderThumbShapeDemo } from "../demos/slider/SliderThumbShape.demo";
import sliderThumbShapeSource from "../demos/slider/SliderThumbShape.demo.tsx?raw";
import { SliderVariantsDemo } from "../demos/slider/SliderVariants.demo";
import sliderVariantsSource from "../demos/slider/SliderVariants.demo.tsx?raw";
import { SliderVolumeCardDemo } from "../demos/slider/SliderVolumeCard.demo";
import sliderVolumeCardSource from "../demos/slider/SliderVolumeCard.demo.tsx?raw";
import { SliderVolumeDemo } from "../demos/slider/SliderVolume.demo";
import sliderVolumeSource from "../demos/slider/SliderVolume.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function SliderShowcase() {
  return (
    <ShowcasePage
      title="Slider"
      description="Ползунок для одного значения или диапазона с метками и форматированием."
      importPath='import { Slider } from "@/components/core/Slider";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection title="Одиночный" description="showValue и marks для шкалы с подписями.">
        <ShowcaseDemoFromFile align="center" Demo={SliderVolumeDemo} source={sliderVolumeSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="center" Demo={SliderSizesDemo} source={sliderSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Диапазон" description="range + formatValue для двух ползунков.">
        <ShowcaseDemoFromFile align="center" Demo={SliderPriceRangeDemo} source={sliderPriceRangeSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Disabled и вертикальный" description="orientation vertical и disabled состояние.">
        <ShowcaseDemoFromFile align="center" Demo={SliderVariantsDemo} source={sliderVariantsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="gloss — стеклянный кружок на рельсе.">
        <ShowcaseDemoFromFile align="center" Demo={SliderGlossDemo} source={sliderGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Форма thumb, compound Track и gradient range — demo-файлы в `demos/slider/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={SliderThumbShapeDemo} source={sliderThumbShapeSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SliderVolumeCardDemo} source={sliderVolumeCardSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SliderBudgetPanelDemo} source={sliderBudgetPanelSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SliderOpacityStripDemo} source={sliderOpacityStripSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Slider" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="value, onValueChange, min, max, step, range, marks, showValue, formatValue, orientation."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Диапазон">
          <p>
            При <code>range</code> value — кортеж <code>[number, number]</code>, onValueChange получает тот же
            тип. <code>formatValue</code> форматирует отображаемое значение.
          </p>
        </ShowcaseDoc.Block>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
