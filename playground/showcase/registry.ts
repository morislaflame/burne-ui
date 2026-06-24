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
import { CardShowcase } from "./pages/CardShowcase";
import { CheckboxShowcase } from "./pages/CheckboxShowcase";
import { CloseButtonShowcase } from "./pages/CloseButtonShowcase";
import { ColorPickerShowcase } from "./pages/ColorPickerShowcase";
import { ComboBoxShowcase } from "./pages/ComboBoxShowcase";
import { DialogShowcase } from "./pages/DialogShowcase";
import { DisclosureShowcase } from "./pages/DisclosureShowcase";
import { DrawerShowcase } from "./pages/DrawerShowcase";
import { DropdownShowcase } from "./pages/DropdownShowcase";
import { ExpandableShowcase } from "./pages/ExpandableShowcase";
import { FieldShowcase } from "./pages/FieldShowcase";
import { FormShowcase } from "./pages/FormShowcase";
import { GlossShowcase } from "./pages/GlossShowcase";
import { InputShowcase } from "./pages/InputShowcase";
import { LinkShowcase } from "./pages/LinkShowcase";
import { ListBoxShowcase } from "./pages/ListBoxShowcase";
import { LoadingShowcase } from "./pages/LoadingShowcase";
import { MeterShowcase } from "./pages/MeterShowcase";
import { PaginationShowcase } from "./pages/PaginationShowcase";
import { PopoverShowcase } from "./pages/PopoverShowcase";
import { ProgressBarShowcase } from "./pages/ProgressBarShowcase";
import { RadioGroupShowcase } from "./pages/RadioGroupShowcase";
import { RippleShowcase } from "./pages/RippleShowcase";
import { SearchInputShowcase } from "./pages/SearchInputShowcase";
import { SelectionIndicatorShowcase } from "./pages/SelectionIndicatorShowcase";
import { SkeletonShowcase } from "./pages/SkeletonShowcase";
import { SliderShowcase } from "./pages/SliderShowcase";
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
    label: "Типографика",
    pages: [{ id: "text", label: "Text", Page: TextShowcase }],
  },
  {
    id: "actions",
    label: "Действия",
    pages: [
      { id: "button", label: "Button", Page: ButtonShowcase },
      { id: "close-button", label: "CloseButton", Page: CloseButtonShowcase },
      { id: "toggle-button", label: "ToggleButton", Page: ToggleButtonShowcase },
      { id: "button-group", label: "ButtonGroup", Page: ButtonGroupShowcase },
      { id: "ripple", label: "Ripple", Page: RippleShowcase },
    ],
  },
  {
    id: "feedback",
    label: "Обратная связь",
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
    label: "Формы",
    pages: [
      { id: "form", label: "Form", Page: FormShowcase },
      { id: "field", label: "Field", Page: FieldShowcase },
      { id: "input", label: "Input", Page: InputShowcase },
      { id: "textarea", label: "TextArea", Page: TextAreaShowcase },
      { id: "combobox", label: "ComboBox", Page: ComboBoxShowcase },
      { id: "search-input", label: "SearchInput", Page: SearchInputShowcase },
      { id: "slider", label: "Slider", Page: SliderShowcase },
      { id: "time-field", label: "TimeField", Page: TimeFieldShowcase },
      { id: "checkbox", label: "Checkbox", Page: CheckboxShowcase },
      { id: "switch", label: "Switch", Page: SwitchShowcase },
      { id: "radio-group", label: "RadioGroup", Page: RadioGroupShowcase },
      { id: "toggle-button-group", label: "ToggleButtonGroup", Page: ToggleButtonGroupShowcase },
      { id: "color-picker", label: "ColorPicker", Page: ColorPickerShowcase },
      { id: "selection-indicator", label: "SelectionIndicator", Page: SelectionIndicatorShowcase },
      { id: "calendar", label: "Calendar", Page: CalendarShowcase },
    ],
  },
  {
    id: "navigation",
    label: "Навигация",
    pages: [
      { id: "breadcrumbs", label: "Breadcrumbs", Page: BreadcrumbsShowcase },
      { id: "link", label: "Link", Page: LinkShowcase },
      { id: "pagination", label: "Pagination", Page: PaginationShowcase },
      { id: "tabs", label: "Tabs", Page: TabsShowcase },
    ],
  },
  {
    id: "overlays",
    label: "Оверлеи",
    pages: [
      { id: "tooltip", label: "Tooltip", Page: TooltipShowcase },
      { id: "popover", label: "Popover", Page: PopoverShowcase },
      { id: "dropdown", label: "Dropdown", Page: DropdownShowcase },
      { id: "dialog", label: "Dialog", Page: DialogShowcase },
      { id: "drawer", label: "Drawer", Page: DrawerShowcase },
      { id: "alert-dialog", label: "AlertDialog", Page: AlertDialogShowcase },
    ],
  },
  {
    id: "data-display",
    label: "Отображение данных",
    pages: [
      { id: "listbox", label: "ListBox", Page: ListBoxShowcase },
      { id: "card", label: "Card", Page: CardShowcase },
      { id: "table", label: "Table", Page: TableShowcase },
      { id: "surface", label: "Surface", Page: SurfaceShowcase },
      { id: "avatar", label: "Avatar", Page: AvatarShowcase },
      { id: "skeleton", label: "Skeleton", Page: SkeletonShowcase },
    ],
  },
  {
    id: "disclosure",
    label: "Раскрытие",
    pages: [
      { id: "expandable", label: "Expandable", Page: ExpandableShowcase },
      { id: "disclosure", label: "Disclosure", Page: DisclosureShowcase },
      { id: "accordion", label: "Accordion", Page: AccordionShowcase },
    ],
  },
  {
    id: "theme",
    label: "Тема",
    pages: [{ id: "gloss", label: "Gloss", Page: GlossShowcase }],
  },
];

export const SHOWCASE_PAGES = SHOWCASE_GROUPS.flatMap((group) => group.pages);

export const DEFAULT_SHOWCASE_PAGE_ID = SHOWCASE_PAGES[0]?.id ?? "text";

export function findShowcasePage(id: string): ShowcasePageEntry | undefined {
  return SHOWCASE_PAGES.find((page) => page.id === id);
}
