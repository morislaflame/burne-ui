import { MeterHorizontalDemo } from "../demos/meter/MeterHorizontal.demo";
import meterHorizontalSource from "../demos/meter/MeterHorizontal.demo.tsx?raw";
import { MeterSizesDemo } from "../demos/meter/MeterSizes.demo";
import meterSizesSource from "../demos/meter/MeterSizes.demo.tsx?raw";
import { MeterQuotaBannerDemo } from "../demos/meter/MeterQuotaBanner.demo";
import meterQuotaBannerSource from "../demos/meter/MeterQuotaBanner.demo.tsx?raw";
import { MeterStorageGridDemo } from "../demos/meter/MeterStorageGrid.demo";
import meterStorageGridSource from "../demos/meter/MeterStorageGrid.demo.tsx?raw";
import { MeterVerticalDemo } from "../demos/meter/MeterVertical.demo";
import meterVerticalSource from "../demos/meter/MeterVertical.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function MeterShowcase() {
  return (
    <ShowcasePage
      title="Meter"
      description="Измеритель заполненности с min, max и отображением значения."
      importPath='import { Meter } from "@/components/core/Meter";'
      tags={["core", "feedback"]}
    >
      <ShowcaseSection title="Горизонтальный" description="label, value, showValue и color.">
        <ShowcaseDemoFromFile align="stretch" Demo={MeterHorizontalDemo} source={meterHorizontalSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="stretch" Demo={MeterSizesDemo} source={meterSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Вертикальный" description="orientation=&quot;vertical&quot;.">
        <ShowcaseDemoFromFile Demo={MeterVerticalDemo} source={meterVerticalSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Сетка метрик и баннер квоты — demo-файлы в `demos/meter/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={MeterStorageGridDemo} source={meterStorageGridSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={MeterQuotaBannerDemo} source={meterQuotaBannerSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Meter" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Meter.Header, Meter.Label, Meter.Value, Meter.Track, Meter.Hint, Meter.Error — compound-слоты."
          />
          <ShowcaseDoc.ApiRow
            api="simple"
            description="label, value, min, max, showValue, orientation, color на корне."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Отличие от ProgressBar">
          <p>
            Meter — для текущего уровня (диск, память). ProgressBar — для процесса с завершением. Оба поддерживают
            вертикальную ориентацию.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
