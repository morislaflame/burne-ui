import { ProgressBarClassNamesFullDemo } from "../demos/progress-bar/ProgressBarClassNamesFull.demo";
import progressBarClassNamesFullSource from "../demos/progress-bar/ProgressBarClassNamesFull.demo.tsx?raw";
import { ProgressPipelineDemo } from "../demos/progress-bar/ProgressPipeline.demo";
import progressPipelineSource from "../demos/progress-bar/ProgressPipeline.demo.tsx?raw";
import { ProgressHorizontalDemo } from "../demos/progress-bar/ProgressHorizontal.demo";
import progressHorizontalSource from "../demos/progress-bar/ProgressHorizontal.demo.tsx?raw";
import { ProgressBarSizesDemo } from "../demos/progress-bar/ProgressBarSizes.demo";
import progressBarSizesSource from "../demos/progress-bar/ProgressBarSizes.demo.tsx?raw";
import { ProgressUploadCardDemo } from "../demos/progress-bar/ProgressUploadCard.demo";
import progressUploadCardSource from "../demos/progress-bar/ProgressUploadCard.demo.tsx?raw";
import { ProgressVerticalDemo } from "../demos/progress-bar/ProgressVertical.demo";
import progressVerticalSource from "../demos/progress-bar/ProgressVertical.demo.tsx?raw";
import { ProgressVerticalMetersDemo } from "../demos/progress-bar/ProgressVerticalMeters.demo";
import progressVerticalMetersSource from "../demos/progress-bar/ProgressVerticalMeters.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function ProgressBarShowcase() {
  return (
    <ShowcasePage
      title="ProgressBar"
      description="Индикатор прогресса с определённым и неопределённым состоянием."
      importPath='import { ProgressBar } from "@/components/core/ProgressBar";'
      tags={["core", "feedback"]}
    >
      <ShowcaseSection title="Горизонтальный" description="label, value, indeterminate и color.">
        <ShowcaseDemoFromFile align="stretch" Demo={ProgressHorizontalDemo} source={progressHorizontalSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="stretch" Demo={ProgressBarSizesDemo} source={progressBarSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Вертикальный" description="orientation=&quot;vertical&quot; с showValue.">
        <ShowcaseDemoFromFile Demo={ProgressVerticalDemo} source={progressVerticalSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Слоты root, header, value, track, fill, indeterminateFill, hint и error — через prop classNames."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={ProgressBarClassNamesFullDemo} source={progressBarClassNamesFullSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Карточка загрузки, pipeline и вертикальные метры — demo-файлы в `demos/progress-bar/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={ProgressUploadCardDemo} source={progressUploadCardSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ProgressPipelineDemo} source={progressPipelineSource} />
        <ShowcaseDemoFromFile Demo={ProgressVerticalMetersDemo} source={progressVerticalMetersSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/ProgressBar" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="label, value, min, max, indeterminate, orientation, showValue, color на корне."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization>
          <p>
            <code>color</code> — семантический ключ или CSS-цвет заливки. <code>indeterminate</code> — анимация
            без value. Плавное заполнение — <code>configureMotion()</code> (<code>enableProgressFill</code>,{" "}
            <code>progressFillDuration</code>).
          </p>
        </ShowcaseDoc.Customization>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
