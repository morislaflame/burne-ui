import { SkeletonAnimationsDemo } from "../demos/skeleton/SkeletonAnimations.demo";
import skeletonAnimationsSource from "../demos/skeleton/SkeletonAnimations.demo.tsx?raw";
import { SkeletonArticlePreviewDemo } from "../demos/skeleton/SkeletonArticlePreview.demo";
import skeletonArticlePreviewSource from "../demos/skeleton/SkeletonArticlePreview.demo.tsx?raw";
import { SkeletonBasicShapesDemo } from "../demos/skeleton/SkeletonBasicShapes.demo";
import skeletonBasicShapesSource from "../demos/skeleton/SkeletonBasicShapes.demo.tsx?raw";
import { SkeletonProfileCardDemo } from "../demos/skeleton/SkeletonProfileCard.demo";
import skeletonProfileCardSource from "../demos/skeleton/SkeletonProfileCard.demo.tsx?raw";
import { SkeletonTableRowsDemo } from "../demos/skeleton/SkeletonTableRows.demo";
import skeletonTableRowsSource from "../demos/skeleton/SkeletonTableRows.demo.tsx?raw";
import { SkeletonTextBlockDemo } from "../demos/skeleton/SkeletonTextBlock.demo";
import skeletonTextBlockSource from "../demos/skeleton/SkeletonTextBlock.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function SkeletonShowcase() {
  return (
    <ShowcasePage
      title="Skeleton"
      description="Плейсхолдеры загрузки с анимациями pulse, wave и shimmer."
      importPath='import { Skeleton } from "@/components/core/Skeleton";'
      tags={["core", "feedback"]}
    >
      <ShowcaseSection title="Базовые формы" description="Прямоугольник и круг.">
        <ShowcaseDemoFromFile Demo={SkeletonBasicShapesDemo} source={skeletonBasicShapesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Text и Block" description="Многострочный текст и блок-контейнер.">
        <ShowcaseDemoFromFile align="stretch" Demo={SkeletonTextBlockDemo} source={skeletonTextBlockSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Анимации" description="variant pulse, wave и shimmer.">
        <ShowcaseDemoFromFile align="stretch" Demo={SkeletonAnimationsDemo} source={skeletonAnimationsSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Профиль, строки таблицы и превью статьи — `demos/skeleton/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={SkeletonProfileCardDemo} source={skeletonProfileCardSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SkeletonTableRowsDemo} source={skeletonTableRowsSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SkeletonArticlePreviewDemo} source={skeletonArticlePreviewSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Skeleton" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Skeleton.Circle, Skeleton.Text и Skeleton.Block — готовые формы плейсхолдера."
          />
          <ShowcaseDoc.ApiRow
            api="simple"
            description="Корневой Skeleton с className — произвольная форма через размеры."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Анимации">
          <p>
            <code>pulse</code>, <code>wave</code>, <code>shimmer</code> — проп <code>variant</code> на любом
            подкомпоненте Skeleton.
          </p>
        </ShowcaseDoc.Block>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
