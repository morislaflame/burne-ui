import { forwardRef } from "react";

import { resolveBreadcrumbsAriaLabel } from "./breadcrumbsA11y";
import { hasBreadcrumbCompoundChildren } from "./breadcrumbsAPI";
import {
  BreadcrumbsClassNamesProvider,
  BreadcrumbsCollapseProvider,
} from "./breadcrumbsContext";
import {
  BreadcrumbsItem,
  BreadcrumbsList,
  BreadcrumbsSeparator,
} from "./breadcrumbsParts";
import { BreadcrumbsSimpleContent } from "./breadcrumbsSimpleContent";
import type { BreadcrumbsProps } from "./breadcrumbsTypes";

export type {
  BreadcrumbsItemProps,
  BreadcrumbsListProps,
  BreadcrumbsSimpleContentProps,
  BreadcrumbsProps,
  BreadcrumbsClassNames,
  BreadcrumbItem,
} from "./breadcrumbsTypes";

export const BreadcrumbsRoot = forwardRef<HTMLElement, BreadcrumbsProps>(
  function BreadcrumbsRoot(
    {
      collapse = true,
      className,
      classNames,
      items,
      children,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) {
    const isCompound = hasBreadcrumbCompoundChildren(children);

    return (
      <BreadcrumbsCollapseProvider collapse={collapse}>
        <BreadcrumbsClassNamesProvider classNames={classNames}>
          <nav
            ref={ref}
            aria-label={resolveBreadcrumbsAriaLabel(ariaLabel)}
            className={className}
            {...rest}
          >
            {isCompound ? (
              children
            ) : items != null ? (
              <BreadcrumbsSimpleContent items={items} />
            ) : (
              children
            )}
          </nav>
        </BreadcrumbsClassNamesProvider>
      </BreadcrumbsCollapseProvider>
    );
  },
);

BreadcrumbsRoot.displayName = "Breadcrumbs";

export { BreadcrumbsItem, BreadcrumbsList, BreadcrumbsSeparator };
export { BreadcrumbsSimpleContent } from "./breadcrumbsSimpleContent";
