import { mergeLabelSlotClass } from "./labelAPI";

export const LABEL_ROOT_WRAP_CLASS =
  "inline-flex flex-wrap items-baseline gap-x-xsmall gap-y-0";

export const LABEL_TEXT_CLASS = "font-medium";

export const LABEL_REQUIRED_CLASS = "text-danger";

export function labelRootClass({
  className,
  slotClass,
}: {
  className?: string;
  slotClass?: string;
}): string {
  return mergeLabelSlotClass(LABEL_ROOT_WRAP_CLASS, slotClass, className);
}

export function labelTextClass(slotClass?: string): string {
  return mergeLabelSlotClass(LABEL_TEXT_CLASS, slotClass);
}

export function labelRequiredClass(slotClass?: string): string {
  return mergeLabelSlotClass(LABEL_REQUIRED_CLASS, slotClass);
}
