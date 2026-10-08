import { KitArrowForward } from "@/components/core/utils/kitIcons";
 
import { LINK_DEFAULT_ICON_ARIA_HIDDEN } from "./linkA11y";
import { linkDefaultIconClass } from "./linkStyles";

export function LinkDefaultIcon() {
  return (
    <KitArrowForward
      aria-hidden={LINK_DEFAULT_ICON_ARIA_HIDDEN}
      className={linkDefaultIconClass()}
    />
  );
}
 