import { BadgeAnchorDemo } from "../demos/badge/BadgeAnchor.demo";
import badgeAnchorSource from "../demos/badge/BadgeAnchor.demo.tsx?raw";
import { BadgeGlossDemo } from "../demos/badge/BadgeGloss.demo";
import badgeGlossSource from "../demos/badge/BadgeGloss.demo.tsx?raw";
import { BadgeInboxButtonDemo } from "../demos/badge/BadgeInboxButton.demo";
import badgeInboxButtonSource from "../demos/badge/BadgeInboxButton.demo.tsx?raw";
import { BadgePlacementsDemo } from "../demos/badge/BadgePlacements.demo";
import badgePlacementsSource from "../demos/badge/BadgePlacements.demo.tsx?raw";
import { BadgeServiceStatusListDemo } from "../demos/badge/BadgeServiceStatusList.demo";
import badgeServiceStatusListSource from "../demos/badge/BadgeServiceStatusList.demo.tsx?raw";
import { BadgeTagCloudDemo } from "../demos/badge/BadgeTagCloud.demo";
import badgeTagCloudSource from "../demos/badge/BadgeTagCloud.demo.tsx?raw";
import { BadgeSizesDemo } from "../demos/badge/BadgeSizes.demo";
import badgeSizesSource from "../demos/badge/BadgeSizes.demo.tsx?raw";
import { BadgeVariantsDemo } from "../demos/badge/BadgeVariants.demo";
import badgeVariantsSource from "../demos/badge/BadgeVariants.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function BadgeShowcase() {
  return (
    <ShowcasePage
      title="Badge"
      description="Метки статуса, счётчики и точки-индикаторы на элементах интерфейса."
      importPath='import { Badge } from "@/components/core/Badge";'
      tags={["core", "feedback"]}
    >
      <ShowcaseSection title="Варианты и статусы" description="variant, status и иконка на корне Badge.">
        <ShowcaseDemoFromFile Demo={BadgeVariantsDemo} source={badgeVariantsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile Demo={BadgeSizesDemo} source={badgeSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — стеклянная поверхность с motion.">
        <ShowcaseDemoFromFile Demo={BadgeGlossDemo} source={badgeGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Badge.Anchor" description="Счётчик и dot-индикатор поверх аватара.">
        <ShowcaseDemoFromFile Demo={BadgeAnchorDemo} source={badgeAnchorSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Размещение"
        description="placement у Badge внутри Badge.Anchor: top-right, top-left, bottom-right, bottom-left."
      >
        <ShowcaseDemoFromFile Demo={BadgePlacementsDemo} source={badgePlacementsSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Теги, статусы и Badge.Anchor — demo-файлы в `demos/badge/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={BadgeTagCloudDemo} source={badgeTagCloudSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={BadgeServiceStatusListDemo} source={badgeServiceStatusListSource} />
        <ShowcaseDemoFromFile Demo={BadgeInboxButtonDemo} source={badgeInboxButtonSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Badge" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="variant, status, size, icon на корне Badge. Badge.Anchor — compound-обёртка для позиционирования поверх children."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Кастомизация">
          <p>
            <code>placement</code> для dot-режима, <code>variant=&quot;gloss&quot;</code> — стеклянная
            оболочка. Размеры: <code>small</code>, <code>base</code>.
          </p>
        </ShowcaseDoc.Block>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
