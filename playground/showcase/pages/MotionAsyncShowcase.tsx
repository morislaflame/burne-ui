import { MotionAsyncGalleryDemo } from "../demos/motionAsync/gallery";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function MotionAsyncShowcase() {
  return (
    <ShowcasePage
      title="MotionAsync"
      description="Cancellable delays and sequences on MotionContext. Opt-in GSAP plugins stay in the app bundle — not in burne-ui."
      importPath='import { registerMotionPlugins } from "burne-ui";'
      tags={["motion"]}
    >
      <ShowcaseSection
        title="Gallery"
        description="One gallery: ctx.wait, sequence/parallel, onInterrupt/onError, registerMotionPlugins."
      >
        <MotionAsyncGalleryDemo />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="API">
          <p>
            Factories use <code>ctx.wait</code> (seconds or a duration token),{" "}
            <code>ctx.sequence</code> / <code>ctx.parallel</code>, and{" "}
            <code>ctx.onInterrupt</code> / <code>ctx.onError</code>. Cancel rejects wait with{" "}
            <code>AbortError</code> — that is not <code>failed</code>.{" "}
            <code>registerMotionPlugins</code> is app-side (Flip, ScrollTrigger, Draggable, TextPlugin).{" "}
            CustomEase stays kit-internal.
          </p>
        </ShowcaseDoc.Block>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
