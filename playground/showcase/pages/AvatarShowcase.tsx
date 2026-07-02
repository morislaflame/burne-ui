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
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function AvatarShowcase() {
  return (
    <ShowcasePage
      title="Avatar"
      description="Аватары пользователей с инициалами, изображением и группировкой."
      importPath='import { Avatar, AvatarGroup } from "@/components/core/Avatar";'
      tags={["core", "media"]}
    >
      <ShowcaseSection title="Размеры и fallback" description="size, label, src и кастомный Fallback.">
        <ShowcaseDemoFromFile Demo={AvatarSizesFallbackDemo} source={avatarSizesFallbackSource} />
      </ShowcaseSection>

      <ShowcaseSection title="AvatarGroup" description="Стек аватаров в одной группе.">
        <ShowcaseDemoFromFile Demo={AvatarGroupDemo} source={avatarGroupSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — стеклянная поверхность.">
        <ShowcaseDemoFromFile Demo={AvatarGlossDemo} source={avatarGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="В gloss: root и className — на круге аватара, glossWrap — на внешней оболочке."
      >
        <ShowcaseDemoFromFile Demo={AvatarClassNamesGlossDemo} source={avatarClassNamesGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Строка комментария, участники проекта и статус в сети — `demos/avatar/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={AvatarCommentRowDemo} source={avatarCommentRowSource} />
        <ShowcaseDemoFromFile Demo={AvatarProjectMembersDemo} source={avatarProjectMembersSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={AvatarPresenceRowDemo} source={avatarPresenceRowSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Avatar" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="label, src, size и variant на корне Avatar — основной способ."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Avatar.Fallback — кастомный контент при отсутствии изображения."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Размеры">
          <p>
            <code>small</code>, <code>base</code>, <code>mid</code>, <code>large</code>. Инициалы генерируются из{" "}
            <code>label</code>.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
