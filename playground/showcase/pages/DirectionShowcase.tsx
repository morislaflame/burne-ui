import { DirectionGalleryDemo } from "../demos/direction/gallery";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function DirectionShowcase() {
  return (
    <ShowcasePage
      title="Direction"
      description="Put dir=rtl on a parent. Text, groups, affixes, and fills follow the writing direction. A named screen edge stays on that edge."
      importPath='import { Button, ButtonGroup, Input } from "burne-ui";'
      tags={["direction", "rtl"]}
    >
      <ShowcaseSection
        title="Gallery"
        description="Each slide renders the same tree twice: dir=ltr and dir=rtl."
      >
        <DirectionGalleryDemo />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="API">
          <p>
            <code>dir=&quot;rtl&quot;</code> on any parent is enough. Component styles use{" "}
            <code>text-start</code>, <code>border-s-token</code> / <code>border-e-token</code>,{" "}
            <code>start</code> / <code>end</code>, and <code>rounded-s</code> / <code>rounded-e</code>
            . Drawer <code>side</code>, Toast viewport, Badge <code>placement</code>, and Calendar
            cell halves keep their physical side.
          </p>
        </ShowcaseDoc.Block>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
