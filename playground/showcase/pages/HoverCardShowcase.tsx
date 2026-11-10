import { HoverCardClassNamesDemo } from "../demos/hoverCard/HoverCardClassNames.demo";
import hoverCardClassNamesSource from "../demos/hoverCard/HoverCardClassNames.demo.tsx?raw";
import { HoverCardCompoundDemo } from "../demos/hoverCard/HoverCardCompound.demo";
import hoverCardCompoundSource from "../demos/hoverCard/HoverCardCompound.demo.tsx?raw";
import { HoverCardDefaultDemo } from "../demos/hoverCard/HoverCardDefault.demo";
import hoverCardDefaultSource from "../demos/hoverCard/HoverCardDefault.demo.tsx?raw";
import { HoverCardSizesDemo } from "../demos/hoverCard/HoverCardSizes.demo";
import hoverCardSizesSource from "../demos/hoverCard/HoverCardSizes.demo.tsx?raw";
import { HoverCardInstantDemo } from "../demos/hoverCard/HoverCardInstant.demo";
import hoverCardInstantSource from "../demos/hoverCard/HoverCardInstant.demo.tsx?raw";
import { HoverCardSideDemo } from "../demos/hoverCard/HoverCardSide.demo";
import hoverCardSideSource from "../demos/hoverCard/HoverCardSide.demo.tsx?raw";
import { HoverCardMotionControllerGalleryDemo } from "../demos/hoverCard/motionController/gallery";
import { HoverCardSlotMotionGalleryDemo } from "../demos/hoverCard/slotMotion/gallery";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function HoverCardShowcase() {
  return (
    <ShowcasePage
      title="HoverCard"
      description="A card that opens on hover and focus. The pointer can move onto the card. Click does not toggle it."
      importPath='import { HoverCard } from "@/components/core/HoverCard";'
      tags={["core", "overlay"]}
    >
      <ShowcaseSection
        title="Profile"
        description="Opens after 400ms. Leaving the name starts a 300ms close. Entering the card cancels it."
      >
        <ShowcaseDemoFromFile Demo={HoverCardDefaultDemo} source={hoverCardDefaultSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large. Padding, type, and panel width, same as Popover.">
        <ShowcaseDemoFromFile Demo={HoverCardSizesDemo} source={hoverCardSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Instant" description="openDelay={0} opens on the first pointer enter.">
        <ShowcaseDemoFromFile Demo={HoverCardInstantDemo} source={hoverCardInstantSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Side" description="side='top' places the card above the trigger.">
        <ShowcaseDemoFromFile Demo={HoverCardSideDemo} source={hoverCardSideSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Compound"
        description="Trigger, Content, Arrow, Header, Title, Description, and Body. Arrow is a direct child of Content."
      >
        <ShowcaseDemoFromFile Demo={HoverCardCompoundDemo} source={hoverCardCompoundSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Slot motion"
        description="Title nudge keeps hoverOut off so the yoyo can finish. Appear plays the panel, title, description, and body in order. Trigger nudge moves the name, then the card opens."
      >
        <HoverCardSlotMotionGalleryDemo />
      </ShowcaseSection>

      <ShowcaseSection
        title="MotionController"
        description="Handle on the card portal. play() skips. playSlot(title / content) and events run on the open card."
      >
        <HoverCardMotionControllerGalleryDemo />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Same slots as the Popover panel. Width and the accent border sit on the panel, and the arrow uses the same border."
      >
        <ShowcaseDemoFromFile Demo={HoverCardClassNamesDemo} source={hoverCardClassNamesSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/HoverCard" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="trigger, title, description, and children. Compound: Trigger, Content, Header, Title, Description, Body, Arrow."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization>
          <p>
            <code>classNames</code> matches the Popover panel slots. <code>motion.trigger</code> is the anchor.
            The card slots and <code>motionController</code> belong to <code>HoverCard.Content</code>.
          </p>
        </ShowcaseDoc.Customization>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
