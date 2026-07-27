import { ButtonAsChildDemo } from "../demos/button/ButtonAsChild.demo";
import buttonAsChildSource from "../demos/button/ButtonAsChild.demo.tsx?raw";
import { ButtonAsyncClickDemo } from "../demos/button/ButtonAsyncClick.demo";
import buttonAsyncClickSource from "../demos/button/ButtonAsyncClick.demo.tsx?raw";
import { ButtonCtaCardDemo } from "../demos/button/ButtonCtaCard.demo";
import buttonCtaCardSource from "../demos/button/ButtonCtaCard.demo.tsx?raw";
import { ButtonDangerBannerDemo } from "../demos/button/ButtonDangerBanner.demo";
import buttonDangerBannerSource from "../demos/button/ButtonDangerBanner.demo.tsx?raw";
import { ButtonFabClusterDemo } from "../demos/button/ButtonFabCluster.demo";
import buttonFabClusterSource from "../demos/button/ButtonFabCluster.demo.tsx?raw";
import { ButtonGlossDemo } from "../demos/button/ButtonGloss.demo";
import buttonGlossSource from "../demos/button/ButtonGloss.demo.tsx?raw";
import { ButtonSizesDemo } from "../demos/button/ButtonSizes.demo";
import buttonSizesSource from "../demos/button/ButtonSizes.demo.tsx?raw";
import { ButtonStatusesDemo } from "../demos/button/ButtonStatuses.demo";
import buttonStatusesSource from "../demos/button/ButtonStatuses.demo.tsx?raw";
import { ButtonVariantsDemo } from "../demos/button/ButtonVariants.demo";
import buttonVariantsSource from "../demos/button/ButtonVariants.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function ButtonShowcase() {
  return (
    <ShowcasePage
      title="Button"
      description="Main action button: fill options, sizes, statuses, icons, gloss and asynchronous click."
      importPath='import { Button } from "@/components/core/Button";'
      tags={["core", "actions"]}
    >
      <ShowcaseSection title="Options" description="variant, status, disabled, icons and built-in ripple.">
        <ShowcaseDemoFromFile Demo={ButtonVariantsDemo} source={buttonVariantsSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Statuses × variants"
        description="Every status with every variant — same matrix as Storybook."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={ButtonStatusesDemo} source={buttonStatusesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile Demo={ButtonSizesDemo} source={buttonSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — glass surface with motion and optional ripple.">
        <ShowcaseDemoFromFile Demo={ButtonGlossDemo} source={buttonGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Asynchronous click"
        description="onAsyncClick returns Promise; ripple and state loading/success/error."
      >
        <ShowcaseDemoFromFile Demo={ButtonAsyncClickDemo} source={buttonAsyncClickSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="asChild"
        description="Button styles on <a> / router Link — asChild merges onto the child."
      >
        <ShowcaseDemoFromFile Demo={ButtonAsChildDemo} source={buttonAsChildSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Mine layout and palette - one `.demo.tsx` for variation, code from ?raw."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={ButtonCtaCardDemo} source={buttonCtaCardSource} />
        <ShowcaseDemoFromFile Demo={ButtonFabClusterDemo} source={buttonFabClusterSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ButtonDangerBannerDemo} source={buttonDangerBannerSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Button" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="variant, size, status, icon, iconOnly, ripple, onAsyncClick, disabled, asChild, variant gloss."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Ripple">
          <p>
            Prop <code>ripple</code> mounts built-in <code>&lt;Ripple /&gt;</code> with a tone underneath{" "}
            <code>variant</code>/<code>status</code>. For a custom layer —{" "}
            <code>buttonRippleTone(variant, status)</code> from the package.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Customization">
          <p>
            Additional styles — <code>className</code>. <code>variant=&quot;gloss&quot;</code> — glass
            surface (tokens <code>--color-surface</code>, <code>--color-border</code>). In{" "}
            <code>ButtonGroup</code> segments are rounded through group context. Ripple and hover/press —{" "}
            <code>configureMotion()</code> and <code>buttonRippleTone(variant, status)</code> from the package.
          </p>
        </ShowcaseDoc.Block>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
