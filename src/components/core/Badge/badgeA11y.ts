import { cloneElement, type HTMLAttributes, type ReactElement } from "react";

export function badgeHasAccessibleName(props: HTMLAttributes<HTMLSpanElement>): boolean {
  return (
    typeof props["aria-label"] === "string" ||
    typeof props["aria-labelledby"] === "string"
  );
}

/** Dot/icon-only badges use `aria-label` on a `<span>` — `role="img"` is required. */
export function badgeRootA11yProps(
  props: HTMLAttributes<HTMLSpanElement>,
): Pick<HTMLAttributes<HTMLSpanElement>, "aria-hidden" | "role"> {
  if (badgeHasAccessibleName(props)) {
    return { role: "img" };
  }
  return { "aria-hidden": true, role: "presentation" };
}

export function ensureDecorativeIcon(el: ReactElement): ReactElement {
  const props = el.props as { "aria-hidden"?: boolean; "aria-label"?: string };
  if (props["aria-hidden"] === true || props["aria-label"]) return el;
  return cloneElement(el, { "aria-hidden": true } as Record<string, unknown>);
}
