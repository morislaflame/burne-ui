import { forwardRef } from "react";

import type { LinkIconProps } from "./linkTypes";
 
export const LinkIcon = forwardRef<HTMLSpanElement, LinkIconProps>(function LinkIcon(_props, _ref) {
  return null;
});
 
LinkIcon.displayName = "Link.Icon";
 
export { LinkDefaultIcon } from "./linkDefaultIconPart";
export { LinkIconSlot } from "./linkIconSlotPart";
export { LinkAnchorBody, LinkBodyContent } from "./linkAnchorBodyPart";
 