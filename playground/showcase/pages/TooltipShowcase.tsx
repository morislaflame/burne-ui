import { TooltipFormHintDemo } from "../demos/tooltip/TooltipFormHint.demo";
import tooltipFormHintSource from "../demos/tooltip/TooltipFormHint.demo.tsx?raw";
import { TooltipGlossDemo } from "../demos/tooltip/TooltipGloss.demo";
import tooltipGlossSource from "../demos/tooltip/TooltipGloss.demo.tsx?raw";
import { TooltipIconToolbarDemo } from "../demos/tooltip/TooltipIconToolbar.demo";
import tooltipIconToolbarSource from "../demos/tooltip/TooltipIconToolbar.demo.tsx?raw";
import { TooltipShortcutGridDemo } from "../demos/tooltip/TooltipShortcutGrid.demo";
import tooltipShortcutGridSource from "../demos/tooltip/TooltipShortcutGrid.demo.tsx?raw";
import { TooltipSidesDemo } from "../demos/tooltip/TooltipSides.demo";
import tooltipSidesSource from "../demos/tooltip/TooltipSides.demo.tsx?raw";
import { TooltipSizesDemo } from "../demos/tooltip/TooltipSizes.demo";
import tooltipSizesSource from "../demos/tooltip/TooltipSizes.demo.tsx?raw";
import { TooltipVariantsDemo } from "../demos/tooltip/TooltipVariants.demo";
import tooltipVariantsSource from "../demos/tooltip/TooltipVariants.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function TooltipShowcase() {
  return (
    <ShowcasePage
      title="Tooltip"
      description="Всплывающие подсказки по hover и focus на триггере."
      importPath='import { Tooltip } from "@/components/core/Tooltip";'
      tags={["core", "overlay"]}
    >
      <ShowcaseSection title="Варианты" description="Семантические variant для разных контекстов.">
        <ShowcaseDemoFromFile Demo={TooltipVariantsDemo} source={tooltipVariantsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile Demo={TooltipSizesDemo} source={tooltipSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description='surface="gloss" — стеклянная подсказка с hover-lift.'>
        <ShowcaseDemoFromFile Demo={TooltipGlossDemo} source={tooltipGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размещение" description="side: top, right, bottom, left.">
        <ShowcaseDemoFromFile Demo={TooltipSidesDemo} source={tooltipSidesSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Тулбар иконок, подсказка у поля и горячие клавиши — `demos/tooltip/`."
      >
        <ShowcaseDemoFromFile Demo={TooltipIconToolbarDemo} source={tooltipIconToolbarSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={TooltipFormHintDemo} source={tooltipFormHintSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={TooltipShortcutGridDemo} source={tooltipShortcutGridSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Tooltip" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Tooltip.Trigger оборачивает интерактивный элемент, Tooltip.Content — текст подсказки."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Позиционирование">
          <p>
            Проп <code>side</code> на корне — <code>top</code>, <code>bottom</code>, <code>left</code>,{" "}
            <code>right</code>. Размер — <code>small</code> или <code>base</code>.
          </p>
        </ShowcaseDoc.Block>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
