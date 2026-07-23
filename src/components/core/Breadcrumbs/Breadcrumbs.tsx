import { forwardRef } from "react";

import { BreadcrumbsClassNamesProvider, BreadcrumbsCollapseProvider } from "./breadcrumbsContext";
import { BreadcrumbsItem, BreadcrumbsList, BreadcrumbsSeparator } from "./breadcrumbsParts";
import { BreadcrumbsSimpleContent } from "./breadcrumbsSimpleContent";
import { resolveBreadcrumbsAriaLabel } from "./breadcrumbsA11y";

import { breadcrumbsRootClass } from "./breadcrumbsStyles";
import type { BreadcrumbsProps } from "./breadcrumbsTypes";
import { useBreadcrumbsRootState } from "./useBreadcrumbsRootState";

import { useBurneLabel } from "@/theme/BurneLabelsProvider";
import { cn } from "@/utils/cn";

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
    const { isCompound } = useBreadcrumbsRootState({ children });
    const breadcrumbsLabel = useBurneLabel("breadcrumbs");

    return (
      <BreadcrumbsCollapseProvider collapse={collapse}>
        <BreadcrumbsClassNamesProvider classNames={classNames}>
          <nav
            ref={ref}
            aria-label={resolveBreadcrumbsAriaLabel(ariaLabel, breadcrumbsLabel)}
            className={breadcrumbsRootClass(
              cn("", classNames?.root, className),
            )}
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
