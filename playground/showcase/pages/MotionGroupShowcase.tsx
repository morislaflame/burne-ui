import { MotionGroupGalleryDemo } from "../demos/motionGroup/gallery";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function MotionGroupShowcase() {
  return (
    <ShowcasePage
      title="MotionGroup"
      description="Register child MotionController handles by id. Orchestrate checkout, lists, and route-level motion without a global bus or querySelector."
      importPath='import { createMotionGroup, useMotionGroupHandle } from "burne-ui";'
      tags={["motion"]}
    >
      <ShowcaseSection
        title="Gallery"
        description="One gallery: register + play(id), getTarget, group timeline, unregister on unmount."
      >
        <MotionGroupGalleryDemo />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="API">
          <p>
            App code registers existing <code>motionController</code> handles with{" "}
            <code>useMotionGroupMember(id, controller, group)</code>. There is no{" "}
            <code>motionId</code> prop on kit roots. Targets come from the child
            controller — never <code>querySelector</code>.
          </p>
        </ShowcaseDoc.Block>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
