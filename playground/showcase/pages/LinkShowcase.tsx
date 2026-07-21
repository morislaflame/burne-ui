import { LinkArticleInlineDemo } from "../demos/link/LinkArticleInline.demo";
import linkArticleInlineSource from "../demos/link/LinkArticleInline.demo.tsx?raw";
import { LinkCompoundApiDemo } from "../demos/link/LinkCompoundApi.demo";
import linkCompoundApiSource from "../demos/link/LinkCompoundApi.demo.tsx?raw";
import { LinkCardActionsDemo } from "../demos/link/LinkCardActions.demo";
import linkCardActionsSource from "../demos/link/LinkCardActions.demo.tsx?raw";
import { LinkClassNamesFullDemo } from "../demos/link/LinkClassNamesFull.demo";
import linkClassNamesFullSource from "../demos/link/LinkClassNamesFull.demo.tsx?raw";
import { LinkFooterNavDemo } from "../demos/link/LinkFooterNav.demo";
import linkFooterNavSource from "../demos/link/LinkFooterNav.demo.tsx?raw";
import { LinkSizesDemo } from "../demos/link/LinkSizes.demo";
import linkSizesSource from "../demos/link/LinkSizes.demo.tsx?raw";
import { LinkVariantsDemo } from "../demos/link/LinkVariants.demo";
import linkVariantsSource from "../demos/link/LinkVariants.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function LinkShowcase() {
  return (
    <ShowcasePage
      title="Link"
      description="Stylized links for internal and external navigation with icons and underlining."
      importPath='import { Link } from "@/components/core/Link";'
      tags={["core", "navigation"]}
    >
      <ShowcaseSection title="Options" description="Internal, external links and icon customization.">
        <ShowcaseDemoFromFile Demo={LinkVariantsDemo} source={linkVariantsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Compound API" description="Link.Icon — icon marker in markup; without children — standard ↗.">
        <ShowcaseDemoFromFile Demo={LinkCompoundApiDemo} source={linkCompoundApiSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile Demo={LinkSizesDemo} source={linkSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Slots motion, anchor, text, iconStart and iconEnd — through prop classNames."
      >
        <ShowcaseDemoFromFile align="center" Demo={LinkClassNamesFullDemo} source={linkClassNamesFullSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Basement, inline-links in the text and card actions — `demos/link/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={LinkFooterNavDemo} source={linkFooterNavSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={LinkArticleInlineDemo} source={linkArticleInlineSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={LinkCardActionsDemo} source={linkCardActionsSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Link" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="href, underline, icon and showDefaultIcon on the root - the main props for links."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Link.Icon with position start|end; empty Link.Icon — standard icon ↗."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="External links">
          <p>
            <code>showDefaultIcon</code> adds an “open in new tab” icon. For external URL use{" "}
            <code>target=&quot;_blank&quot;</code> and <code>rel=&quot;noreferrer&quot;</code>.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
