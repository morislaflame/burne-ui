import type { RefAttributes } from "react";

import { Link, LinkIcon, LinkRoot } from "./Link";
import type { LinkProps } from "./linkTypes";

export type LinkComponent = ((
  props: LinkProps & RefAttributes<HTMLAnchorElement>,
) => ReturnType<typeof Link>) & {
  Icon: typeof LinkIcon;
  Root: typeof LinkRoot;
};

const LinkCompound = Object.assign(Link, {
  Icon: LinkIcon,
  Root: LinkRoot,
}) as LinkComponent;

export { LinkCompound as Link, LinkRoot, LinkIcon };

export type {
  LinkProps,
  LinkSize,
  LinkIconPosition,
  LinkIconProps,
  LinkClassNames,
} from "./linkTypes";
