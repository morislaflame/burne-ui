/** True when `related` is null/non-Node or lies outside `root`. */
export function cameFromOutsideContainer(
  root: HTMLElement,
  related: EventTarget | null,
): boolean {
  if (related == null) return true;
  if (!(related instanceof Node)) return true;
  return !root.contains(related);
}
