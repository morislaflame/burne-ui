import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { CalendarMotionInstantHoverDemo } from "./CalendarMotionInstantHover.demo";
import calendarMotionInstantHoverSource from "./CalendarMotionInstantHover.demo.tsx?raw";
import { CalendarMotionNavWaveDemo } from "./CalendarMotionNavWave.demo";
import calendarMotionNavWaveSource from "./CalendarMotionNavWave.demo.tsx?raw";
import { CalendarMotionNavTintDemo } from "./CalendarMotionNavTint.demo";
import calendarMotionNavTintSource from "./CalendarMotionNavTint.demo.tsx?raw";
import { CalendarMotionChromeDemo } from "./CalendarMotionChrome.demo";
import calendarMotionChromeSource from "./CalendarMotionChrome.demo.tsx?raw";
import { CalendarMotionFooterActionsDemo } from "./CalendarMotionFooterActions.demo";
import calendarMotionFooterActionsSource from "./CalendarMotionFooterActions.demo.tsx?raw";

export const calendarSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-hover", title: "Instant hover", Demo: CalendarMotionInstantHoverDemo, source: calendarMotionInstantHoverSource },
  { id: "nav-wave", title: "Nav wave", Demo: CalendarMotionNavWaveDemo, source: calendarMotionNavWaveSource },
  { id: "nav-tint", title: "Nav tint", Demo: CalendarMotionNavTintDemo, source: calendarMotionNavTintSource },
  { id: "chrome", title: "Chrome", Demo: CalendarMotionChromeDemo, source: calendarMotionChromeSource },
  { id: "footer-actions", title: "Footer actions", Demo: CalendarMotionFooterActionsDemo, source: calendarMotionFooterActionsSource },
];

export function CalendarSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Calendar Slot motion demos"
      items={calendarSlotMotionGallery}
    />
  );
}
