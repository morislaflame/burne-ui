import { forwardRef } from "react";

import { PaginationClassNamesProvider, PaginationMotionProvider, PaginationProvider } from "./paginationContext";
import { PaginationRootShell } from "./paginationParts";
import type { PaginationProps } from "./paginationTypes";
import { usePaginationRootState } from "./usePaginationRootState";

export type {
  PaginationClassNames,
  PaginationContentProps,
  PaginationEllipsisProps,
  PaginationItemProps,
  PaginationNavButtonProps,
  PaginationPageProps,
  PaginationPagesProps,
  PaginationProps,
  PaginationSummaryProps,
  PaginationMotion,
  PaginationPartMotion,
  PaginationSummaryPartMotion,
} from "./paginationTypes";

export {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationNextIcon,
  PaginationPage,
  PaginationPages,
  PaginationPrevious,
  PaginationPreviousIcon,
  PaginationRootShell,
  PaginationSummary,
} from "./paginationParts";

export const PaginationRoot = forwardRef<HTMLElement, PaginationProps>(
  function PaginationRoot(
    {
      children,
      className,
      classNames,
      page,
      defaultPage,
      totalPages,
      onPageChange,
      siblingCount,
      "aria-label": ariaLabel,
      motion,
      motionController,
      motionState,
      motionPayload,
      playInitialState,
      ...rest
    },
    ref,
  ) {
    const { contextValue, ariaLabel: resolvedAriaLabel } = usePaginationRootState({
      page,
      defaultPage,
      totalPages,
      onPageChange,
      siblingCount,
      "aria-label": ariaLabel,
    });

    return (
      <PaginationProvider value={contextValue}>
        <PaginationClassNamesProvider classNames={classNames}>
          <PaginationMotionProvider motion={motion} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
          <PaginationRootShell
            ref={ref}
            className={className}
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
            siblingCount={siblingCount}
            aria-label={resolvedAriaLabel}
            {...rest}
          >
            {children}
          </PaginationRootShell>
          </PaginationMotionProvider>
        </PaginationClassNamesProvider>
      </PaginationProvider>
    );
  },
);

PaginationRoot.displayName = "Pagination";
