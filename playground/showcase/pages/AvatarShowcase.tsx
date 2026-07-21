import { AvatarClassNamesGlossDemo } from "../demos/avatar/AvatarClassNamesGloss.demo";
import avatarClassNamesGlossSource from "../demos/avatar/AvatarClassNamesGloss.demo.tsx?raw";
import { AvatarCommentRowDemo } from "../demos/avatar/AvatarCommentRow.demo";
import avatarCommentRowSource from "../demos/avatar/AvatarCommentRow.demo.tsx?raw";
import { AvatarGlossDemo } from "../demos/avatar/AvatarGloss.demo";
import avatarGlossSource from "../demos/avatar/AvatarGloss.demo.tsx?raw";
import { AvatarGroupDemo } from "../demos/avatar/AvatarGroup.demo";
import avatarGroupSource from "../demos/avatar/AvatarGroup.demo.tsx?raw";
import { AvatarPresenceRowDemo } from "../demos/avatar/AvatarPresenceRow.demo";
import avatarPresenceRowSource from "../demos/avatar/AvatarPresenceRow.demo.tsx?raw";
import { AvatarProjectMembersDemo } from "../demos/avatar/AvatarProjectMembers.demo";
import avatarProjectMembersSource from "../demos/avatar/AvatarProjectMembers.demo.tsx?raw";
import { AvatarSizesFallbackDemo } from "../demos/avatar/AvatarSizesFallback.demo";
import avatarSizesFallbackSource from "../demos/avatar/AvatarSizesFallback.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function AvatarShowcase() {
  return (
    <ShowcasePage
      title="Avatar"
      description="User avatars with initials, image and grouping."
      importPath='import { Avatar } from "@/components/core/Avatar";'
      tags={["core", "media"]}
    >
      <ShowcaseSection title="Dimensions and fallback" description="size, label, src and custom Fallback.">
        <ShowcaseDemoFromFile Demo={AvatarSizesFallbackDemo} source={avatarSizesFallbackSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Avatar.Group" description="Stack of avatars in one group.">
        <ShowcaseDemoFromFile Demo={AvatarGroupDemo} source={avatarGroupSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — glass surface.">
        <ShowcaseDemoFromFile Demo={AvatarGlossDemo} source={avatarGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="In gloss: root and className — on the avatar circle, glossWrap — on the outer shell."
      >
        <ShowcaseDemoFromFile Demo={AvatarClassNamesGlossDemo} source={avatarClassNamesGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Comment line, project participants and online status — `demos/avatar/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={AvatarCommentRowDemo} source={avatarCommentRowSource} />
        <ShowcaseDemoFromFile Demo={AvatarProjectMembersDemo} source={avatarProjectMembersSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={AvatarPresenceRowDemo} source={avatarPresenceRowSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Avatar" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="label, src, size and variant on the root Avatar — main method."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Avatar.Fallback — custom content if there is no image."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Dimensions">
          <p>
            <code>small</code>, <code>base</code>, <code>mid</code>, <code>large</code>. Initials are generated from{" "}
            <code>label</code>.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
