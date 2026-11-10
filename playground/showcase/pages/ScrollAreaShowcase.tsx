import { ScrollAreaAlwaysDemo } from "../demos/scrollArea/Always.demo";
import alwaysSource from "../demos/scrollArea/Always.demo.tsx?raw";
import { ScrollAreaBothDemo } from "../demos/scrollArea/Both.demo";
import bothSource from "../demos/scrollArea/Both.demo.tsx?raw";
import { ScrollAreaClassNamesDemo } from "../demos/scrollArea/ClassNames.demo";
import classNamesSource from "../demos/scrollArea/ClassNames.demo.tsx?raw";
import { ScrollAreaCompoundDemo } from "../demos/scrollArea/Compound.demo";
import compoundSource from "../demos/scrollArea/Compound.demo.tsx?raw";
import { ScrollAreaHorizontalDemo } from "../demos/scrollArea/Horizontal.demo";
import horizontalSource from "../demos/scrollArea/Horizontal.demo.tsx?raw";
import { ScrollAreaMotionControllerGalleryDemo } from "../demos/scrollArea/motionController/gallery";
import { ScrollAreaSlotMotionGalleryDemo } from "../demos/scrollArea/slotMotion/gallery";
import { ScrollAreaVerticalDemo } from "../demos/scrollArea/Vertical.demo";
import verticalSource from "../demos/scrollArea/Vertical.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function ScrollAreaShowcase() {
  return (
    <ShowcasePage
      title="ScrollArea"
      description="A frame with its own scrollbar. The native bar stays hidden. Hover shows the thumb; always keeps it while the content overflows."
      importPath='import { ScrollArea } from "@/components/core/ScrollArea";'
      tags={["core", "layout"]}
    >
      <ShowcaseSection title="Vertical" description="The bar appears on hover or focus. Arrow keys work once the bar is focused.">
        <ShowcaseDemoFromFile align="start" Demo={ScrollAreaVerticalDemo} source={verticalSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Horizontal" description="orientation horizontal scrolls a single row.">
        <ShowcaseDemoFromFile align="start" Demo={ScrollAreaHorizontalDemo} source={horizontalSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Both" description="Two bars. The corner sits where they meet.">
        <ShowcaseDemoFromFile align="start" Demo={ScrollAreaBothDemo} source={bothSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Always" description="visibility always keeps the bar while the list is taller than the frame.">
        <ShowcaseDemoFromFile align="start" Demo={ScrollAreaAlwaysDemo} source={alwaysSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Compound" description="Viewport and Scrollbar in the order you write them. Thumb is optional.">
        <ShowcaseDemoFromFile align="start" Demo={ScrollAreaCompoundDemo} source={compoundSource} />
      </ShowcaseSection>
      <ShowcaseSection title="classNames" description="scrollbar and thumb.">
        <ShowcaseDemoFromFile align="start" Demo={ScrollAreaClassNamesDemo} source={classNamesSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Slot motion" description="Thumb transform, then the viewport, bar, and thumb in order. Bar opacity stays the show and hide channel.">
        <ScrollAreaSlotMotionGalleryDemo />
      </ShowcaseSection>
      <ShowcaseSection title="MotionController" description="playSlot and set on the thumb, then one timeline that reveals the viewport, bar, and thumb in order.">
        <ScrollAreaMotionControllerGalleryDemo />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
