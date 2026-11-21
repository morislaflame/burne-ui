import { SkinEditor } from "../../skinEditor/SkinEditor";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function SkinEditorShowcase() {
  return (
    <ShowcasePage
      title="Skin"
      description="Edit a skin by tier, preview it in its own box, then export JSON, CSS, or a package. A share link keeps the file in the URL."
      importPath='import { SkinProvider, type SkinDefinition } from "burne-ui";'
      tags={["skin"]}
    >
      <ShowcaseSection title="Editor" description="Tokens, slot classes, and declarative layers. The preview portal stays inside the box.">
        <SkinEditor />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
