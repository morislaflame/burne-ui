import type { RefAttributes } from "react";

import { Link, LinkIcon } from "./Link";
import type { LinkProps } from "./linkTypes";

export type LinkComponent = ((
  props: LinkProps & RefAttributes<HTMLAnchorElement>,
) => ReturnType<typeof Link>) & {
  Icon: typeof LinkIcon;
};

const LinkCompound = Object.assign(Link, {
  Icon: LinkIcon,
}) as LinkComponent;

export { LinkCompound as Link };

export type {
  LinkProps,
  LinkSize,
  LinkIconPos,
  LinkIconProps,
  LinkClassNames,
} from "./linkTypes";
