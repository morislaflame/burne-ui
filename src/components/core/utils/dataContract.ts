/**
 * Public DOM state contract.
 * Presence flags are the empty string when on and omitted when off.
 * `data-state` is a word from the kit vocabulary.
 */

export type DataState =
  | "open"
  | "closed"
  | "checked"
  | "unchecked"
  | "indeterminate"
  | "active"
  | "inactive"
  | "selected"
  | "expanded"
  | "collapsed"
  | "on"
  | "off"
  | "loading"
  | "idle"
  | "success"
  | "error";

export function dataOpenState(open: boolean): "open" | "closed" {
  return open ? "open" : "closed";
}

export function dataExpandedState(expanded: boolean): "expanded" | "collapsed" {
  return expanded ? "expanded" : "collapsed";
}

export function dataCheckedState(
  checked: boolean,
  indeterminate = false): "checked" | "unchecked" | "indeterminate" {
  if (indeterminate) return "indeterminate";
  return checked ? "checked" : "unchecked";
}

export function dataOnState(on: boolean): "on" | "off" {
  return on ? "on" : "off";
}

export function dataActiveState(active: boolean): "active" | "inactive" {
  return active ? "active" : "inactive";
}

/** Empty attribute when on, omitted when off. */
export function dataFlag(on: boolean | null | undefined): "" | undefined {
  return on ? "" : undefined;
}

/** Joined group segment. Empty when the node sits in a group, omitted otherwise. */
export function dataGroupSegment(segmented: boolean | null | undefined): "" | undefined {
  return segmented ? "" : undefined;
}

export function dataValue(value: string | number | null | undefined): string | undefined {
  if (value == null || value === "") return undefined;
  return String(value);
}

/** `data-size` / `data-variant` / `data-status` for a component root. Omitted keys stay off the DOM. */
export function dataVariantProps({
  size,
  variant,
  status,
}: {
  size?: string | number | null;
  variant?: string | null;
  status?: string | null;
}): {
  "data-size"?: string;
  "data-variant"?: string;
  "data-status"?: string;
} {
  return {
    ...(size != null && size !== "" ? { "data-size": String(size) } : {}),
    ...(variant != null && variant !== "" ? { "data-variant": String(variant) } : {}),
    ...(status != null && status !== "" ? { "data-status": String(status) } : {}),
  };
}
