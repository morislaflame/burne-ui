import { SkeletonAnimationsDemo } from "../demos/skeleton/SkeletonAnimations.demo";
import skeletonAnimationsSource from "../demos/skeleton/SkeletonAnimations.demo.tsx?raw";
import { SkeletonClassNamesFullDemo } from "../demos/skeleton/SkeletonClassNamesFull.demo";
import skeletonClassNamesFullSource from "../demos/skeleton/SkeletonClassNamesFull.demo.tsx?raw";
import { SkeletonArticlePreviewDemo } from "../demos/skeleton/SkeletonArticlePreview.demo";
import skeletonArticlePreviewSource from "../demos/skeleton/SkeletonArticlePreview.demo.tsx?raw";
import { SkeletonBasicShapesDemo } from "../demos/skeleton/SkeletonBasicShapes.demo";
import skeletonBasicShapesSource from "../demos/skeleton/SkeletonBasicShapes.demo.tsx?raw";
import { SkeletonProfileCardDemo } from "../demos/skeleton/SkeletonProfileCard.demo";
import skeletonProfileCardSource from "../demos/skeleton/SkeletonProfileCard.demo.tsx?raw";
import { SkeletonRegionDemo } from "../demos/skeleton/SkeletonRegion.demo";
import skeletonRegionSource from "../demos/skeleton/SkeletonRegion.demo.tsx?raw";
import { SkeletonTableRowsDemo } from "../demos/skeleton/SkeletonTableRows.demo";
import skeletonTableRowsSource from "../demos/skeleton/SkeletonTableRows.demo.tsx?raw";
import { SkeletonTextBlockDemo } from "../demos/skeleton/SkeletonTextBlock.demo";
import skeletonTextBlockSource from "../demos/skeleton/SkeletonTextBlock.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function SkeletonShowcase() {
  return (
    <ShowcasePage
      title="Skeleton"
      description="Loading placeholders with animations pulse, wave and shimmer."
      importPath='import { Skeleton } from "@/components/core/Skeleton";'
      tags={["core", "feedback"]}
    >
      <ShowcaseSection title="Basic forms" description="Rectangle and circle.">
        <ShowcaseDemoFromFile Demo={SkeletonBasicShapesDemo} source={skeletonBasicShapesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Text and Block" description="Multiline text and block container.">
        <ShowcaseDemoFromFile align="stretch" Demo={SkeletonTextBlockDemo} source={skeletonTextBlockSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Animations" description="variant pulse, wave and shimmer.">
        <ShowcaseDemoFromFile align="stretch" Demo={SkeletonAnimationsDemo} source={skeletonAnimationsSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Full customization of slots via classNames on each subcomponent."
      >
        <ShowcaseDemoFromFile
          align="stretch"
          Demo={SkeletonClassNamesFullDemo}
          source={skeletonClassNamesFullSource}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Skeleton.Region"
        description="Parent container with `aria-busy` / `aria-live` — decorative skeletons stay hidden from AT."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={SkeletonRegionDemo} source={skeletonRegionSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Profile, table rows and article preview — `demos/skeleton/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={SkeletonProfileCardDemo} source={skeletonProfileCardSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SkeletonTableRowsDemo} source={skeletonTableRowsSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SkeletonArticlePreviewDemo} source={skeletonArticlePreviewSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Skeleton" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Skeleton.Circle, Skeleton.Text, Skeleton.Block, Skeleton.Region — ready-made forms and a11y parent. classNames on each subcomponent."
          />
          <ShowcaseDoc.ApiRow
            api="simple"
            description="Root Skeleton with className — arbitrary shape through dimensions."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Animations">
          <p>
            <code>pulse</code>, <code>wave</code>, <code>shimmer</code> — prop <code>animation</code> on any
            subcomponent Skeleton.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Accessibility">
          <p>
            Wrap placeholders in <code>Skeleton.Region</code> (<code>busy</code> → <code>aria-busy</code>,
            always <code>aria-live=&quot;polite&quot;</code>). Add <code>aria-label</code> for the region name.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
