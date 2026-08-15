/**
 * Slot motion for Breadcrumbs — look here first.
 *
 * DOM slots: `itemLink` (interactive `<a>` / `<button>`), `itemLinkText`,
 * `ellipsisLiftWrapper`
 *
 * Each interactive crumb / ellipsis nests a scope. Defaults: `pressSqueeze`
 * on `itemLink` / `ellipsisLiftWrapper` (`pressOut: false`).
 */
import type { BreadcrumbsMotion } from "./breadcrumbsTypes";

export function resolveBreadcrumbsItemMotionDefaults(): BreadcrumbsMotion {
  return {
    itemLink: {
      pressIn: "pressSqueeze",
      pressOut: false,
    },
  };
}

export function resolveBreadcrumbsEllipsisMotionDefaults(): BreadcrumbsMotion {
  return {
    ellipsisLiftWrapper: {
      pressIn: "pressSqueeze",
      pressOut: false,
    },
  };
}
