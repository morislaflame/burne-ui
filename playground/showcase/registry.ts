import type { ComponentType } from "react";

import { AccordionShowcase } from "./pages/AccordionShowcase";
import { AlertDialogShowcase } from "./pages/AlertDialogShowcase";
import { AlertShowcase } from "./pages/AlertShowcase";
import { AvatarShowcase } from "./pages/AvatarShowcase";
import { BadgeShowcase } from "./pages/BadgeShowcase";
import { BreadcrumbsShowcase } from "./pages/BreadcrumbsShowcase";
import { ButtonGroupShowcase } from "./pages/ButtonGroupShowcase";
import { ButtonShowcase } from "./pages/ButtonShowcase";
import { CalendarShowcase } from "./pages/CalendarShowcase";
import { DatePickerShowcase } from "./pages/DatePickerShowcase";
import { NumberInputShowcase } from "./pages/NumberInputShowcase";
import { PinInputShowcase } from "./pages/PinInputShowcase";
import { TagsInputShowcase } from "./pages/TagsInputShowcase";
import { StepperShowcase } from "./pages/StepperShowcase";
import { CardShowcase } from "./pages/CardShowcase";
import { CheckboxShowcase } from "./pages/CheckboxShowcase";
import { CloseButtonShowcase } from "./pages/CloseButtonShowcase";
import { ColorPickerShowcase } from "./pages/ColorPickerShowcase";
import { ComboBoxShowcase } from "./pages/ComboBoxShowcase";
import { ContextMenuShowcase } from "./pages/ContextMenuShowcase";
import { DialogShowcase } from "./pages/DialogShowcase";
import { DirectionShowcase } from "./pages/DirectionShowcase";
import { DisclosureShowcase } from "./pages/DisclosureShowcase";
import { DrawerShowcase } from "./pages/DrawerShowcase";
import { DropdownShowcase } from "./pages/DropdownShowcase";
import { ExpandableShowcase } from "./pages/ExpandableShowcase";
import { FieldShowcase } from "./pages/FieldShowcase";
import { FormShowcase } from "./pages/FormShowcase";
import { MotionAsyncShowcase } from "./pages/MotionAsyncShowcase";
import { SkinEditorShowcase } from "./pages/SkinEditorShowcase";
import { MotionShowcase } from "./pages/MotionShowcase";
import { MotionConfigShowcase } from "./pages/MotionConfigShowcase";
import { MotionGroupShowcase } from "./pages/MotionGroupShowcase";
import { InputShowcase } from "./pages/InputShowcase";
import { KbdShowcase } from "./pages/KbdShowcase";
import { LinkShowcase } from "./pages/LinkShowcase";
import { ListBoxShowcase } from "./pages/ListBoxShowcase";
import { LoadingShowcase } from "./pages/LoadingShowcase";
import { MeterShowcase } from "./pages/MeterShowcase";
import { PaginationShowcase } from "./pages/PaginationShowcase";
import { HoverCardShowcase } from "./pages/HoverCardShowcase";
import { PopoverShowcase } from "./pages/PopoverShowcase";
import { ProgressBarShowcase } from "./pages/ProgressBarShowcase";
import { RadioGroupShowcase } from "./pages/RadioGroupShowcase";
import { RippleShowcase } from "./pages/RippleShowcase";
import { SearchInputShowcase } from "./pages/SearchInputShowcase";
import { SelectShowcase } from "./pages/SelectShowcase";
import { SelectionIndicatorShowcase } from "./pages/SelectionIndicatorShowcase";
import { SkeletonShowcase } from "./pages/SkeletonShowcase";
import { SliderShowcase } from "./pages/SliderShowcase";
import { ScrollAreaShowcase } from "./pages/ScrollAreaShowcase";
import { SurfaceShowcase } from "./pages/SurfaceShowcase";
import { SwitchShowcase } from "./pages/SwitchShowcase";
import { TableShowcase } from "./pages/TableShowcase";
import { TabsShowcase } from "./pages/TabsShowcase";
import { TextAreaShowcase } from "./pages/TextAreaShowcase";
import { TextShowcase } from "./pages/TextShowcase";
import { TimeFieldShowcase } from "./pages/TimeFieldShowcase";
import { ToastShowcase } from "./pages/ToastShowcase";
import { ToggleButtonGroupShowcase } from "./pages/ToggleButtonGroupShowcase";
import { ToggleButtonShowcase } from "./pages/ToggleButtonShowcase";
import { TooltipShowcase } from "./pages/TooltipShowcase";

export type ShowcasePageEntry = {
  id: string;
  label: string;
  Page: ComponentType;
};

export type ShowcaseGroup = {
  id: string;
  label: string;
  pages: ShowcasePageEntry[];
};

export const SHOWCASE_GROUPS: ShowcaseGroup[] = [
  {
    id: "typography",
    label: "Typography",
    pages: [{ id: "text", label: "Text", Page: TextShowcase }, { id: "kbd", label: "Kbd", Page: KbdShowcase }],
  },
  {
    id: "actions",
    label: "Actions",
    pages: [
      { id: "button", label: "Button", Page: ButtonShowcase },
      { id: "close-button", label: "CloseButton", Page: CloseButtonShowcase },
      { id: "toggle-button", label: "ToggleButton", Page: ToggleButtonShowcase },
      { id: "toggle-button-group", label: "ToggleButtonGroup", Page: ToggleButtonGroupShowcase },
      { id: "button-group", label: "ButtonGroup", Page: ButtonGroupShowcase },
      { id: "ripple", label: "Ripple", Page: RippleShowcase },
    ],
  },
  {
    id: "feedback",
    label: "Feedback",
    pages: [
      { id: "badge", label: "Badge", Page: BadgeShowcase },
      { id: "alert", label: "Alert", Page: AlertShowcase },
      { id: "toast", label: "Toast", Page: ToastShowcase },
      { id: "loading", label: "Loading", Page: LoadingShowcase },
      { id: "progress-bar", label: "ProgressBar", Page: ProgressBarShowcase },
      { id: "meter", label: "Meter", Page: MeterShowcase },
    ],
  },
  {
    id: "forms",
    label: "Forms",
    pages: [
      { id: "form", label: "Form", Page: FormShowcase },
      { id: "field", label: "Field", Page: FieldShowcase },
      { id: "input", label: "Input", Page: InputShowcase },
      { id: "textarea", label: "TextArea", Page: TextAreaShowcase },
      { id: "combobox", label: "ComboBox", Page: ComboBoxShowcase },
      { id: "select", label: "Select", Page: SelectShowcase },
      { id: "search-input", label: "SearchInput", Page: SearchInputShowcase },
      { id: "slider", label: "Slider", Page: SliderShowcase },
      { id: "time-field", label: "TimeField", Page: TimeFieldShowcase },
      { id: "checkbox", label: "Checkbox", Page: CheckboxShowcase },
      { id: "switch", label: "Switch", Page: SwitchShowcase },
      { id: "radio-group", label: "RadioGroup", Page: RadioGroupShowcase },
      { id: "color-picker", label: "ColorPicker", Page: ColorPickerShowcase },
      { id: "selection-indicator", label: "SelectionIndicator", Page: SelectionIndicatorShowcase },
      { id: "calendar", label: "Calendar", Page: CalendarShowcase },
      { id: "date-picker", label: "DatePicker", Page: DatePickerShowcase },
      { id: "number-input", label: "NumberInput", Page: NumberInputShowcase },
      { id: "pin-input", label: "PinInput", Page: PinInputShowcase },
      { id: "tags-input", label: "TagsInput", Page: TagsInputShowcase },
    ],
  },
  {
    id: "navigation",
    label: "Navigation",
    pages: [
      { id: "breadcrumbs", label: "Breadcrumbs", Page: BreadcrumbsShowcase },
      { id: "link", label: "Link", Page: LinkShowcase },
      { id: "pagination", label: "Pagination", Page: PaginationShowcase },
      { id: "stepper", label: "Stepper", Page: StepperShowcase },
      { id: "tabs", label: "Tabs", Page: TabsShowcase },
    ],
  },
  {
    id: "overlays",
    label: "Overlays",
    pages: [
      { id: "tooltip", label: "Tooltip", Page: TooltipShowcase },
      { id: "popover", label: "Popover", Page: PopoverShowcase },
      { id: "hover-card", label: "HoverCard", Page: HoverCardShowcase },
      { id: "dropdown", label: "Dropdown", Page: DropdownShowcase },
      { id: "context-menu", label: "ContextMenu", Page: ContextMenuShowcase },
      { id: "dialog", label: "Dialog", Page: DialogShowcase },
      { id: "drawer", label: "Drawer", Page: DrawerShowcase },
      { id: "alert-dialog", label: "AlertDialog", Page: AlertDialogShowcase },
    ],
  },
  {
    id: "data-display",
    label: "Data display",
    pages: [
      { id: "listbox", label: "ListBox", Page: ListBoxShowcase },
      { id: "card", label: "Card", Page: CardShowcase },
      { id: "table", label: "Table", Page: TableShowcase },
      { id: "surface", label: "Surface", Page: SurfaceShowcase },
      { id: "scroll-area", label: "ScrollArea", Page: ScrollAreaShowcase },
      { id: "avatar", label: "Avatar", Page: AvatarShowcase },
      { id: "skeleton", label: "Skeleton", Page: SkeletonShowcase },
    ],
  },
  {
    id: "disclosure",
    label: "Disclosure",
    pages: [
      { id: "expandable", label: "Expandable", Page: ExpandableShowcase },
      { id: "disclosure", label: "Disclosure", Page: DisclosureShowcase },
      { id: "accordion", label: "Accordion", Page: AccordionShowcase },
    ],
  },
  {
    id: "theme",
    label: "Theme",
    pages: [
      { id: "skin", label: "Skin", Page: SkinEditorShowcase },
      { id: "direction", label: "Direction", Page: DirectionShowcase },
      { id: "motion", label: "Motion", Page: MotionShowcase },
      { id: "motion-group", label: "MotionGroup", Page: MotionGroupShowcase },
      { id: "motion-async", label: "MotionAsync", Page: MotionAsyncShowcase },
      { id: "motion-config", label: "MotionConfig", Page: MotionConfigShowcase },
    ],
  },
];

export const SHOWCASE_PAGES = SHOWCASE_GROUPS.flatMap((group) => group.pages);

export const DEFAULT_SHOWCASE_PAGE_ID = SHOWCASE_PAGES[0]?.id ?? "text";

export function findShowcasePage(id: string): ShowcasePageEntry | undefined {
  return SHOWCASE_PAGES.find((page) => page.id === id);
}
