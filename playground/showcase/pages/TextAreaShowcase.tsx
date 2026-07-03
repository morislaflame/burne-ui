import { TextAreaClassNamesCompoundDemo, TextAreaClassNamesFullDemo } from "../demos/textarea/TextAreaClassNamesFull.demo";
import textAreaClassNamesFullSource from "../demos/textarea/TextAreaClassNamesFull.demo.tsx?raw";
import { TextAreaBasicDemo } from "../demos/textarea/TextAreaBasic.demo";
import textAreaBasicSource from "../demos/textarea/TextAreaBasic.demo.tsx?raw";
import { TextAreaSizesDemo } from "../demos/textarea/TextAreaSizes.demo";
import textAreaSizesSource from "../demos/textarea/TextAreaSizes.demo.tsx?raw";
import { TextAreaCommentThreadDemo } from "../demos/textarea/TextAreaCommentThread.demo";
import textAreaCommentThreadSource from "../demos/textarea/TextAreaCommentThread.demo.tsx?raw";
import { TextAreaGlossDemo } from "../demos/textarea/TextAreaGloss.demo";
import textAreaGlossSource from "../demos/textarea/TextAreaGloss.demo.tsx?raw";
import { TextAreaReleaseNotesDemo } from "../demos/textarea/TextAreaReleaseNotes.demo";
import textAreaReleaseNotesSource from "../demos/textarea/TextAreaReleaseNotes.demo.tsx?raw";
import { TextAreaSupportTicketDemo } from "../demos/textarea/TextAreaSupportTicket.demo";
import textAreaSupportTicketSource from "../demos/textarea/TextAreaSupportTicket.demo.tsx?raw";
import { TextAreaWithErrorDemo } from "../demos/textarea/TextAreaWithError.demo";
import textAreaWithErrorSource from "../demos/textarea/TextAreaWithError.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function TextAreaShowcase() {
  return (
    <ShowcasePage
      title="TextArea"
      description="Multiline input field with the same Simple API, what and Input."
      importPath='import { TextArea } from "@/components/core/TextArea";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection title="Base" description="label, hint and rows at the root of the component.">
        <ShowcaseDemoFromFile align="center" Demo={TextAreaBasicDemo} source={textAreaBasicSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="center" Demo={TextAreaSizesDemo} source={textAreaSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="With an error" description="status danger and prop error for validation message.">
        <ShowcaseDemoFromFile align="center" Demo={TextAreaWithErrorDemo} source={textAreaWithErrorSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — glass shell with motion.">
        <ShowcaseDemoFromFile align="center" Demo={TextAreaGlossDemo} source={textAreaGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Full customization classNames"
        description="Slots root, shell, control, resizeHandle, hint, error through classNames on the root."
      >
        <ShowcaseDemoFromFile align="center" Demo={TextAreaClassNamesFullDemo} source={textAreaClassNamesFullSource} />
        <ShowcaseDemoFromFile align="center" Demo={TextAreaClassNamesCompoundDemo} source={textAreaClassNamesFullSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Release notes, support ticket and comment thread — demo-files in `demos/textarea/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={TextAreaReleaseNotesDemo} source={textAreaReleaseNotesSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={TextAreaSupportTicketDemo} source={textAreaSupportTicketSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={TextAreaCommentThreadDemo} source={textAreaCommentThreadSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/TextArea" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="label, hint, error, rows, placeholder, variant, status — on the root TextArea without children."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="TextArea.Label, TextArea.Control, TextArea.Hint, TextArea.Error — custom markup."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Behavior">
          <p>
            Inherits visual variant and status from Input. Hints — <code>hint</code>, not{" "}
            <code>description</code>. Controlled/uncontrolled through value/defaultValue.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
