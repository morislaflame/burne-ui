import { MotionConfigGalleryDemo } from "../demos/motionConfig/gallery";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function MotionConfigShowcase() {
  return (
    <ShowcasePage
      title="MotionConfig"
      description="Scoped GSAP timings: innermost BurneUIProvider / ThemeProvider / MotionConfigProvider overlay wins. CSS --motion-surface-duration stays on that theme root."
      importPath='import { MotionConfigProvider, useMotionConfig } from "burne-ui";'
      tags={["motion"]}
    >
      <ShowcaseSection
        title="Gallery"
        description="One gallery: two roots, nested overlay, ThemeProvider.motion."
      >
        <MotionConfigGalleryDemo />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="API">
          <p>
            Precedence (inner wins): <code>MotionConfigProvider</code> /{" "}
            <code>BurneUIProvider</code> <code>motion</code> / <code>config.motion</code> /{" "}
            <code>ThemeProvider</code> <code>motion</code> → parent overlay →{" "}
            <code>configureMotion()</code> → <code>MOTION_CONFIG_DEFAULTS</code>. Unspecified keys
            inherit. GSAP reads <code>useMotionConfig()</code> / <code>ctx.config</code> at play
            start. CSS tokens are per DOM root, not the global singleton.
          </p>
        </ShowcaseDoc.Block>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
