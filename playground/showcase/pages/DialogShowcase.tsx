import { DialogClassNamesFullDemo } from "../demos/dialog/DialogClassNamesFull.demo";
import dialogClassNamesFullSource from "../demos/dialog/DialogClassNamesFull.demo.tsx?raw";
import { DialogMotionBouncePanelDemo } from "../demos/dialog/DialogMotionBouncePanel.demo";
import dialogMotionBouncePanelSource from "../demos/dialog/DialogMotionBouncePanel.demo.tsx?raw";
import { DialogMotionInstantPanelDemo } from "../demos/dialog/DialogMotionInstantPanel.demo";
import dialogMotionInstantPanelSource from "../demos/dialog/DialogMotionInstantPanel.demo.tsx?raw";
import { DialogMotionPanelTimelineDemo } from "../demos/dialog/DialogMotionPanelTimeline.demo";
import dialogMotionPanelTimelineSource from "../demos/dialog/DialogMotionPanelTimeline.demo.tsx?raw";
import { DialogMotionPerPartDemo } from "../demos/dialog/DialogMotionPerPart.demo";
import dialogMotionPerPartSource from "../demos/dialog/DialogMotionPerPart.demo.tsx?raw";
import { DialogMotionTitleHoverColorDemo } from "../demos/dialog/DialogMotionTitleHoverColor.demo";
import dialogMotionTitleHoverColorSource from "../demos/dialog/DialogMotionTitleHoverColor.demo.tsx?raw";
import { DialogMotionTitleStaggerDemo } from "../demos/dialog/DialogMotionTitleStagger.demo";
import dialogMotionTitleStaggerSource from "../demos/dialog/DialogMotionTitleStagger.demo.tsx?raw";
import { DialogAsChildMergedPropsDemo } from "../demos/dialog/DialogAsChildMergedProps.demo";
import dialogAsChildMergedPropsSource from "../demos/dialog/DialogAsChildMergedProps.demo.tsx?raw";
import { DialogBasicDemo } from "../demos/dialog/DialogBasic.demo";
import dialogBasicSource from "../demos/dialog/DialogBasic.demo.tsx?raw";
import { DialogCompactConfirmDemo } from "../demos/dialog/DialogCompactConfirm.demo";
import dialogCompactConfirmSource from "../demos/dialog/DialogCompactConfirm.demo.tsx?raw";
import { DialogGlossDemo } from "../demos/dialog/DialogGloss.demo";
import dialogGlossSource from "../demos/dialog/DialogGloss.demo.tsx?raw";
import { DialogInviteTeamDemo } from "../demos/dialog/DialogInviteTeam.demo";
import dialogInviteTeamSource from "../demos/dialog/DialogInviteTeam.demo.tsx?raw";
import { DialogPortalContainerDemo } from "../demos/dialog/DialogPortalContainer.demo";
import dialogPortalContainerSource from "../demos/dialog/DialogPortalContainer.demo.tsx?raw";
import { DialogSettingsModalDemo } from "../demos/dialog/DialogSettingsModal.demo";
import dialogSettingsModalSource from "../demos/dialog/DialogSettingsModal.demo.tsx?raw";
import { DialogSizesDemo } from "../demos/dialog/DialogSizes.demo";
import dialogSizesSource from "../demos/dialog/DialogSizes.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function DialogShowcase() {
  return (
    <ShowcasePage
      title="Dialog"
      description="Modal window on native &lt;dialog&gt; with animation and compound API."
      importPath='import { Dialog } from "@/components/core/Dialog";'
      tags={["core", "overlay"]}
    >
      <ShowcaseSection title="Basic dialogue" description="open / onOpenChange, Header, Body, Footer.">
        <ShowcaseDemoFromFile Demo={DialogBasicDemo} source={dialogBasicSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile Demo={DialogSizesDemo} source={dialogSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant=&quot;gloss&quot; — glass modal panel.">
        <ShowcaseDemoFromFile Demo={DialogGlossDemo} source={dialogGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="portalContainer"
        description="Custom portal host — non-modal show() + absolute, overlay stays inside the container."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={DialogPortalContainerDemo} source={dialogPortalContainerSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="asChild — merged props"
        description="Trigger asChild merges id, data-*, className, and ref onto the child via mergeAsChildProps."
      >
        <ShowcaseDemoFromFile Demo={DialogAsChildMergedPropsDemo} source={dialogAsChildMergedPropsSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Slot motion"
        description="Each card is a separate copyable example — instant panel, bounce factory, title stagger, per-part enter/leave, hover color, panel timeline."
      >
        <ShowcaseDemoFromFile Demo={DialogMotionInstantPanelDemo} source={dialogMotionInstantPanelSource} />
        <ShowcaseDemoFromFile Demo={DialogMotionBouncePanelDemo} source={dialogMotionBouncePanelSource} />
        <ShowcaseDemoFromFile Demo={DialogMotionTitleStaggerDemo} source={dialogMotionTitleStaggerSource} />
        <ShowcaseDemoFromFile Demo={DialogMotionPerPartDemo} source={dialogMotionPerPartSource} />
        <ShowcaseDemoFromFile Demo={DialogMotionTitleHoverColorDemo} source={dialogMotionTitleHoverColorSource} />
        <ShowcaseDemoFromFile Demo={DialogMotionPanelTimelineDemo} source={dialogMotionPanelTimelineSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Slot customization panel, header, title, body, footer through classNames."
      >
        <ShowcaseDemoFromFile
          Demo={DialogClassNamesFullDemo}
          source={dialogClassNamesFullSource}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Invitation to the team, privacy settings and compact confirmation — `demos/dialog/`."
      >
        <ShowcaseDemoFromFile Demo={DialogInviteTeamDemo} source={dialogInviteTeamSource} />
        <ShowcaseDemoFromFile Demo={DialogSettingsModalDemo} source={dialogSettingsModalSource} />
        <ShowcaseDemoFromFile Demo={DialogCompactConfirmDemo} source={dialogCompactConfirmSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Dialog" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Dialog.Header, Dialog.Body, Dialog.Footer, Dialog.Close — full panel layout."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="dialog, overlay, panel, content, header, title, description, body, footer, close."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Custom HTMLElement host. Contained portals use show() + absolute (not showModal top layer)."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss>
          <p>
            <code>size</code> and <code>variant</code> on the root. Closing by Escape and click on backdrop —
            custom props. Enter/leave — <code>configureMotion()</code>.
          </p>
        </ShowcaseDoc.Customization>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
