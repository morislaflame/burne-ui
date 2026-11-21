import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { DatePickerMotionChevronDemo } from "./Chevron.demo";
import chevronSource from "./Chevron.demo.tsx?raw";
import { DatePickerMotionChromeDemo } from "./Chrome.demo";
import chromeSource from "./Chrome.demo.tsx?raw";
import { DatePickerMotionCompoundDemo } from "./Compound.demo";
import compoundSource from "./Compound.demo.tsx?raw";
import { DatePickerMotionHoverOffDemo } from "./HoverOff.demo";
import hoverOffSource from "./HoverOff.demo.tsx?raw";
import { DatePickerMotionTriggerLiftDemo } from "./TriggerLift.demo";
import triggerLiftSource from "./TriggerLift.demo.tsx?raw";
import { DatePickerMotionWaveDemo } from "./Wave.demo";
import waveSource from "./Wave.demo.tsx?raw";
import { DatePickerMotionMenuEnterDemo } from "./MenuEnter.demo";
import menuEnterSource from "./MenuEnter.demo.tsx?raw";
import { DatePickerMotionCalendarEnterDemo } from "./CalendarEnter.demo";
import calendarEnterSource from "./CalendarEnter.demo.tsx?raw";

export const datePickerSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "hover-off", title: "Hover off", Demo: DatePickerMotionHoverOffDemo, source: hoverOffSource },
  { id: "trigger-lift", title: "Trigger lift", Demo: DatePickerMotionTriggerLiftDemo, source: triggerLiftSource },
  { id: "chevron", title: "Chevron", Demo: DatePickerMotionChevronDemo, source: chevronSource },
  { id: "chrome", title: "Label hint error", Demo: DatePickerMotionChromeDemo, source: chromeSource },
  { id: "wave", title: "Field wave", Demo: DatePickerMotionWaveDemo, source: waveSource },
  { id: "menu-enter", title: "Menu enter", Demo: DatePickerMotionMenuEnterDemo, source: menuEnterSource },
  { id: "calendar-enter", title: "Calendar enter", Demo: DatePickerMotionCalendarEnterDemo, source: calendarEnterSource },
  { id: "compound", title: "Compound parts", Demo: DatePickerMotionCompoundDemo, source: compoundSource },
];

export function DatePickerSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="DatePicker Slot motion demos"
      align="start"
      items={datePickerSlotMotionGallery}
    />
  );
}
