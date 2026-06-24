import { LoadingCardOverlayDemo } from "../demos/loading/LoadingCardOverlay.demo";
import loadingCardOverlaySource from "../demos/loading/LoadingCardOverlay.demo.tsx?raw";
import { LoadingColorGridDemo } from "../demos/loading/LoadingColorGrid.demo";
import loadingColorGridSource from "../demos/loading/LoadingColorGrid.demo.tsx?raw";
import { LoadingInlineStatusDemo } from "../demos/loading/LoadingInlineStatus.demo";
import loadingInlineStatusSource from "../demos/loading/LoadingInlineStatus.demo.tsx?raw";
import { LoadingSizesColorsDemo } from "../demos/loading/LoadingSizesColors.demo";
import loadingSizesColorsSource from "../demos/loading/LoadingSizesColors.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function LoadingShowcase() {
  return (
    <ShowcasePage
      title="Loading"
      description="Индикатор загрузки с размерами и цветовыми вариантами."
      importPath='import { Loading } from "@/components/core/Loading";'
      tags={["core", "feedback"]}
    >
      <ShowcaseSection title="Размеры и цвета" description="size и color на корне.">
        <ShowcaseDemoFromFile Demo={LoadingSizesColorsDemo} source={loadingSizesColorsSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Overlay на карточке, inline-статус и сетка цветов — demo-файлы в `demos/loading/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={LoadingCardOverlayDemo} source={loadingCardOverlaySource} />
        <ShowcaseDemoFromFile align="stretch" Demo={LoadingInlineStatusDemo} source={loadingInlineStatusSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={LoadingColorGridDemo} source={loadingColorGridSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Loading" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="size, color на корне — SVG-спиннер с анимацией."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Кастомизация">
          <p>
            Цвета: <code>primary</code>, <code>success</code>, <code>muted</code> и др. Размеры:{" "}
            <code>small</code>, <code>base</code>, <code>mid</code>, <code>large</code>.
          </p>
        </ShowcaseDoc.Block>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
