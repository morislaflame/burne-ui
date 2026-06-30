import { forwardRef } from "react";

import { LinkClassNamesProvider } from "./linkContext";
import { LinkRoot } from "./linkParts";
import type { LinkProps } from "./linkTypes";

export type {
  LinkProps,
  LinkSize,
  LinkIconPosition,
  LinkClassNames,
} from "./linkTypes";

export { LinkRoot } from "./linkParts";

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { classNames, ...rest },
  ref,
) {
  return (
    <LinkClassNamesProvider classNames={classNames}>
      <LinkRoot ref={ref} {...rest} />
    </LinkClassNamesProvider>
  );
});

Link.displayName = "Link";
