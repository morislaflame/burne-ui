import { IoArrowForward } from "react-icons/io5";

import { LINK_DEFAULT_ICON_ARIA_HIDDEN } from "./linkA11y";
import { linkDefaultIconClass } from "./linkStyles";
import type { LinkSize } from "./linkTypes";

export function LinkDefaultIcon({ size }: { size: LinkSize }) {
  return (
    <IoArrowForward
      aria-hidden={LINK_DEFAULT_ICON_ARIA_HIDDEN}
      className={linkDefaultIconClass(size)}
    />
  );
}
