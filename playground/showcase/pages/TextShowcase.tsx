import { TextEditorialArticleDemo } from "../demos/text/TextEditorialArticle.demo";
import textEditorialArticleSource from "../demos/text/TextEditorialArticle.demo.tsx?raw";
import { TextHeroBlockDemo } from "../demos/text/TextHeroBlock.demo";
import textHeroBlockSource from "../demos/text/TextHeroBlock.demo.tsx?raw";
import { TextSemanticsDemo } from "../demos/text/TextSemantics.demo";
import textSemanticsSource from "../demos/text/TextSemantics.demo.tsx?raw";
import { TextStatsGridDemo } from "../demos/text/TextStatsGrid.demo";
import textStatsGridSource from "../demos/text/TextStatsGrid.demo.tsx?raw";
import { TextVariantsDemo } from "../demos/text/TextVariants.demo";
import textVariantsSource from "../demos/text/TextVariants.demo.tsx?raw";
import { TextSlotMotionGalleryDemo } from "../demos/text/slotMotion/gallery";
import { TextMotionControllerGalleryDemo } from "../demos/text/motionController/gallery";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function TextShowcase() {
  return (
    <ShowcasePage
      title="Text"
      description="Typographic variations for headings, body text, and captions."
      importPath='import { Text } from "@/components/core/Text";'
      tags={["core", "typography"]}
    >
      <ShowcaseSection title="Options" description="All preset-options variant on the component Text.">
        <ShowcaseDemoFromFile Demo={TextVariantsDemo} source={textVariantsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Semantics" description="Prop as sets HTML-element without changing visual style.">
        <ShowcaseDemoFromFile Demo={TextSemanticsDemo} source={textSemanticsSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Your colors, layout and compositions - demos in separate files, the code is pulled up via ?raw."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={TextHeroBlockDemo} source={textHeroBlockSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={TextEditorialArticleDemo} source={textEditorialArticleSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={TextStatsGridDemo} source={textStatsGridSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Slot motion" description="Instant enter skip, root timeline, enter tint, SplitText words, TextPlugin typewriter.">
        <TextSlotMotionGalleryDemo />
      </ShowcaseSection>

      <ShowcaseSection
        title="MotionController"
        description="One gallery: play / set, cancel a looping run, ping, timeline, waitForComplete, events false."
      >
        <TextMotionControllerGalleryDemo />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Text" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="variant and as on the root - the main type of typography in the application."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Options">
          <p>
            <code>accent-header</code>, <code>header-1</code>, <code>header-2</code>,{" "}
            <code>large</code>, <code>mid</code>, <code>base</code>, <code>small</code>, <code>xsmall</code>.
            Additional colors - via <code>className</code> (For example, <code>text-muted</code>).
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
