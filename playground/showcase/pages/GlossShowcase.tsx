import { GlossComponentsDemo } from "../demos/gloss/GlossComponents.demo";
import glossComponentsSource from "../demos/gloss/GlossComponents.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function GlossShowcase() {
  return (
    <ShowcasePage
      title="Gloss"
      description="Glass surface system variant=&quot;gloss&quot; — buttons, fields, cards, modals and interactive cells."
      importPath='variant="gloss" on supported components'
      tags={["variant", "theme"]}
    >
      <ShowcaseSection
        title="Components with gloss"
        description="Unified visual language of glass panels with conic-stroke and hover-lift."
      >
        <ShowcaseDemoFromFile padding="plus" align="stretch" Demo={GlossComponentsDemo} source={glossComponentsSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Application">
          <p>
            Pass it on <code>variant=&quot;gloss&quot;</code> on Button, Input, Card, Dialog, Drawer,
            Alert, Badge, Popover and other components where the option is supported. U Tooltip —{" "}
            <code>surface=&quot;gloss&quot;</code>, at Slider and Switch — boolean prop <code>gloss</code>.
            Theme tokens control transparency and conic-stroke.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss>
          <p>
            Hover/press For gloss-surfaces - through <code>configureMotion()</code> (
            <code>enableHoverLift</code>, <code>interactiveDuration</code>,{" "}
            <code>pressSqueezeScale</code>). Glass colors — CSS-variables <code>--color-surface</code>,{" "}
            <code>--color-border</code> and associated tokens after import{" "}
            <code>burne-ui/styles.css</code>.
          </p>
        </ShowcaseDoc.Customization>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
