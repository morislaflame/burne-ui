import { MotionLevel1GalleryDemo } from "../demos/motion/gallery";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function MotionShowcase() {
  return (
    <ShowcasePage
      title="Motion"
      description="Slow a tree down, snap when motion is off, or replace one slot phase. The same motion object goes on BurneUIProvider at the app root."
      importPath='import { BurneUIProvider, Button, MotionConfigProvider } from "burne-ui";'
      tags={["motion"]}
    >
      <ShowcaseSection
        title="Gallery"
        description="Five snippets: duration, enableAnimations, a recipe name, false, and a vars map."
      >
        <MotionLevel1GalleryDemo />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="API">
          <p>
            <code>BurneUIProvider</code> <code>motion</code> / <code>config.motion</code> overlays
            this tree. <code>MotionConfigProvider</code> is the same overlay without a second theme
            root. <code>configureMotion()</code> is the default for trees with no provider.{" "}
            <code>prefers-reduced-motion</code> and <code>enableAnimations: false</code> snap a
            recipe and a vars map. A slot phase is <code>motion.root.hoverIn</code>.
          </p>
        </ShowcaseDoc.Block>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
