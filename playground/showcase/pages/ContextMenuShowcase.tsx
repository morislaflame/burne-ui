import { ContextMenuActionsDemo } from "../demos/contextMenu/ContextMenuActions.demo";
import contextMenuActionsSource from "../demos/contextMenu/ContextMenuActions.demo.tsx?raw";
import { ContextMenuAsChildDemo } from "../demos/contextMenu/ContextMenuAsChild.demo";
import contextMenuAsChildSource from "../demos/contextMenu/ContextMenuAsChild.demo.tsx?raw";
import { ContextMenuClassNamesDemo } from "../demos/contextMenu/ContextMenuClassNames.demo";
import contextMenuClassNamesSource from "../demos/contextMenu/ContextMenuClassNames.demo.tsx?raw";
import { ContextMenuDefaultDemo } from "../demos/contextMenu/ContextMenuDefault.demo";
import contextMenuDefaultSource from "../demos/contextMenu/ContextMenuDefault.demo.tsx?raw";
import { ContextMenuSelectionDemo } from "../demos/contextMenu/ContextMenuSelection.demo";
import contextMenuSelectionSource from "../demos/contextMenu/ContextMenuSelection.demo.tsx?raw";
import { ContextMenuSideDemo } from "../demos/contextMenu/ContextMenuSide.demo";
import contextMenuSideSource from "../demos/contextMenu/ContextMenuSide.demo.tsx?raw";
import { ContextMenuSubIconDemo } from "../demos/contextMenu/ContextMenuSubIcon.demo";
import contextMenuSubIconSource from "../demos/contextMenu/ContextMenuSubIcon.demo.tsx?raw";
import { ContextMenuMotionControllerGalleryDemo } from "../demos/contextMenu/motionController/gallery";
import { ContextMenuSlotMotionGalleryDemo } from "../demos/contextMenu/slotMotion/gallery";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function ContextMenuShowcase() {
  return (
    <ShowcasePage
      title="ContextMenu"
      description="Right-click menu. Same items, icons, and submenus as Dropdown, anchored at the pointer."
      importPath='import { ContextMenu } from "@/components/core/ContextMenu";'
      tags={["core", "overlay"]}
    >
      <ShowcaseSection
        title="Default"
        description="Right-click or Shift+F10. Icons sit in ItemIcon. Share opens a submenu."
      >
        <ShowcaseDemoFromFile Demo={ContextMenuDefaultDemo} source={contextMenuDefaultSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="File actions"
        description="Labels, hints, and a danger item. The panel keeps the Dropdown item grid."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={ContextMenuActionsDemo} source={contextMenuActionsSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Selection"
        description="Pass selection on the item and render ItemIndicator. The field shows the current value."
      >
        <ShowcaseDemoFromFile Demo={ContextMenuSelectionDemo} source={contextMenuSelectionSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Slot motion"
        description="One gallery: instant leave, item stagger, label, separator, submenu slide, scale from the pointer."
      >
        <ContextMenuSlotMotionGalleryDemo />
      </ShowcaseSection>

      <ShowcaseSection
        title="MotionController"
        description="Handle on ContextMenu.Content. play() skips. playSlot(content / item) and playAll move the open menu."
      >
        <ContextMenuMotionControllerGalleryDemo />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom SubTrigger icon"
        description="SubTrigger icon replaces the default chevron."
      >
        <ShowcaseDemoFromFile Demo={ContextMenuSubIconDemo} source={contextMenuSubIconSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Content side" description="ContextMenu.Content side='top' opens the menu upward.">
        <ShowcaseDemoFromFile Demo={ContextMenuSideDemo} source={contextMenuSideSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="asChild — merged props"
        description="Trigger asChild merges id, data-*, className, and ref onto the child."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={ContextMenuAsChildDemo} source={contextMenuAsChildSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Slots match Dropdown: trigger, panel, label, item, icon, and the submenu panel."
      >
        <ShowcaseDemoFromFile Demo={ContextMenuClassNamesDemo} source={contextMenuClassNamesSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/ContextMenu" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="ContextMenu.Trigger, Content, Item, ItemLabel, ItemHint, ItemIcon, ItemIndicator, Sub."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization>
          <p>
            <code>classNames</code> uses the Dropdown slots. Menu motion is the Dropdown map.
            The controller lives on <code>ContextMenu.Content</code>.
          </p>
        </ShowcaseDoc.Customization>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
