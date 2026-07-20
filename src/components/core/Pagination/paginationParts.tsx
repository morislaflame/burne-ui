import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  type MouseEvent,
  type Ref,
} from "react";

import { Text } from "@/components/core/Text";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { usePressableElementTextMotion } from "@/components/core/utils/usePressableElementTextMotion";

import {
  PAGINATION_ELLIPSIS_ARIA_HIDDEN,
  PAGINATION_ICON_ARIA_HIDDEN,
  PAGINATION_NEXT_DEFAULT_LABEL,
  PAGINATION_PREVIOUS_DEFAULT_LABEL,
  resolvePaginationPageAriaLabel,
} from "./paginationA11y";
import {
  getPaginationRange,
  resolvePaginationNextDisabled,
  resolvePaginationPreviousDisabled,
} from "./paginationAPI";
import { usePaginationContentRef } from "./paginationAnimations";
import {
  useOptionalPagination,
  usePagination,
  usePaginationClassNames,
} from "./paginationContext";
import {
  paginationContentClass,
  paginationEllipsisClass,
  paginationInteractiveButtonClass,
  paginationItemClass,
  paginationNavTextClass,
  paginationNextIconClass,
  paginationPageActiveClass,
  paginationPageTextClass,
  paginationPreviousIconClass,
  paginationRootClass,
  paginationSummaryClass,
  paginationSummaryTextClass,
} from "./paginationStyles";
import type {
  PaginationContentProps,
  PaginationEllipsisProps,
  PaginationIconProps,
  PaginationInteractiveProps,
  PaginationItemProps,
  PaginationNavButtonProps,
  PaginationPageProps,
  PaginationProps,
  PaginationSummaryProps,
} from "./paginationTypes";

export const PaginationRootShell = forwardRef<HTMLElement, Omit<PaginationProps, "classNames">>(
  function PaginationRootShell(
    {
      children,
      className,
      page: _page,
      totalPages: _totalPages,
      onPageChange: _onPageChange,
      siblingCount: _siblingCount,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) {
    const slotClassNames = usePaginationClassNames();

    return (
      <nav
        ref={ref}
        aria-label={ariaLabel}
        className={paginationRootClass({
          slotClass: slotClassNames.root,
          className,
        })}
        {...rest}
      >
        {children}
      </nav>
    );
  },
);

PaginationRootShell.displayName = "Pagination";

const PaginationInteractive = forwardRef<HTMLButtonElement, PaginationInteractiveProps>(
  function PaginationInteractive(
    {
      children,
      className,
      disabled,
      onPointerDown,
      ...rest
    },
    ref,
  ) {
    const slotClassNames = usePaginationClassNames();
    const btnRef = useRef<HTMLButtonElement>(null);

    const setRefs = useCallback(
      (node: HTMLButtonElement | null) => {
        btnRef.current = node;
        mergeForwardedRef(ref, node);
      },
      [ref],
    );

    const { handlePointerDown } = usePressableElementTextMotion({
      isDisabled: !!disabled,
      enabled: !disabled,
      textMotionRef: btnRef,
      onPointerDown,
    });

    return (
      <button
        ref={setRefs}
        type="button"
        disabled={disabled}
        className={paginationInteractiveButtonClass({
          slotClass: slotClassNames.interactive,
          className,
        })}
        onPointerDown={handlePointerDown}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

PaginationInteractive.displayName = "PaginationInteractive";

export const PaginationSummary = forwardRef<HTMLDivElement, PaginationSummaryProps>(
  function PaginationSummary({ className, children, ...rest }, ref) {
    const slotClassNames = usePaginationClassNames();

    return (
      <div
        ref={ref}
        className={paginationSummaryClass({
          slotClass: slotClassNames.summary,
          className,
        })}
        {...rest}
      >
        <Text
          as="span"
          variant="small"
          className={paginationSummaryTextClass({
            slotClass: slotClassNames.summaryText,
          })}
        >
          {children}
        </Text>
      </div>
    );
  },
);

PaginationSummary.displayName = "Pagination.Summary";

export const PaginationContent = forwardRef<HTMLOListElement, PaginationContentProps>(
  function PaginationContent({ className, children, ...rest }, ref) {
    const slotClassNames = usePaginationClassNames();
    const { setRefs } = usePaginationContentRef(ref);

    return (
      <ol
        ref={setRefs}
        className={paginationContentClass({
          slotClass: slotClassNames.content,
          className,
        })}
        {...rest}
      >
        {children}
      </ol>
    );
  },
);

PaginationContent.displayName = "Pagination.Content";

export const PaginationItem = forwardRef<HTMLLIElement, PaginationItemProps>(
  function PaginationItem({ className, children, ...rest }, ref) {
    const slotClassNames = usePaginationClassNames();

    return (
      <li
        ref={ref}
        className={paginationItemClass({
          slotClass: slotClassNames.item,
          className,
        })}
        {...rest}
      >
        {children}
      </li>
    );
  },
);

PaginationItem.displayName = "Pagination.Item";

export const PaginationPrevious = forwardRef<HTMLButtonElement, PaginationNavButtonProps>(
  function PaginationPrevious(
    { disabled, onClick, children, "aria-label": ariaLabel, ...rest },
    ref,
  ) {
    const ctx = useOptionalPagination();
    const slotClassNames = usePaginationClassNames();
    const page = ctx?.page;
    const resolvedDisabled = resolvePaginationPreviousDisabled({ disabled, page });

    const handleClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented || resolvedDisabled) return;
        if (ctx?.onPageChange && page != null && page > 1) {
          ctx.onPageChange(page - 1);
        }
      },
      [ctx, onClick, page, resolvedDisabled],
    );

    return (
      <PaginationInteractive
        ref={ref}
        disabled={resolvedDisabled}
        {...(ariaLabel != null ? { "aria-label": ariaLabel } : {})}
        onClick={handleClick}
        {...rest}
      >
        {children ?? (
          <>
            <PaginationPreviousIcon />
            <Text
              variant="small"
              inheritColor
              as="span"
              className={paginationNavTextClass({
                slotClass: slotClassNames.navText,
              })}
            >
              {PAGINATION_PREVIOUS_DEFAULT_LABEL}
            </Text>
          </>
        )}
      </PaginationInteractive>
    );
  },
);

PaginationPrevious.displayName = "Pagination.Previous";

export const PaginationNext = forwardRef<HTMLButtonElement, PaginationNavButtonProps>(
  function PaginationNext(
    { disabled, onClick, children, "aria-label": ariaLabel, ...rest },
    ref,
  ) {
    const ctx = useOptionalPagination();
    const slotClassNames = usePaginationClassNames();
    const page = ctx?.page;
    const totalPages = ctx?.totalPages;
    const resolvedDisabled = resolvePaginationNextDisabled({
      disabled,
      page,
      totalPages,
    });

    const handleClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented || resolvedDisabled) return;
        if (
          ctx?.onPageChange &&
          page != null &&
          totalPages != null &&
          page < totalPages
        ) {
          ctx.onPageChange(page + 1);
        }
      },
      [ctx, onClick, page, resolvedDisabled, totalPages],
    );

    return (
      <PaginationInteractive
        ref={ref}
        disabled={resolvedDisabled}
        {...(ariaLabel != null ? { "aria-label": ariaLabel } : {})}
        onClick={handleClick}
        {...rest}
      >
        {children ?? (
          <>
            <Text
              variant="small"
              inheritColor
              as="span"
              className={paginationNavTextClass({
                slotClass: slotClassNames.navText,
              })}
            >
              {PAGINATION_NEXT_DEFAULT_LABEL}
            </Text>
            <PaginationNextIcon />
          </>
        )}
      </PaginationInteractive>
    );
  },
);

PaginationNext.displayName = "Pagination.Next";

export function PaginationPreviousIcon({ className }: PaginationIconProps) {
  const slotClassNames = usePaginationClassNames();

  return (
    <IoChevronBack
      aria-hidden={PAGINATION_ICON_ARIA_HIDDEN}
      className={paginationPreviousIconClass({
        slotClass: slotClassNames.previousIcon,
        className,
      })}
    />
  );
}

PaginationPreviousIcon.displayName = "Pagination.PreviousIcon";

export function PaginationNextIcon({ className }: PaginationIconProps) {
  const slotClassNames = usePaginationClassNames();

  return (
    <IoChevronForward
      aria-hidden={PAGINATION_ICON_ARIA_HIDDEN}
      className={paginationNextIconClass({
        slotClass: slotClassNames.nextIcon,
        className,
      })}
    />
  );
}

PaginationNextIcon.displayName = "Pagination.NextIcon";

export const PaginationPage = forwardRef<HTMLButtonElement, PaginationPageProps>(
  function PaginationPage(
    {
      page: pageNumber,
      isActive,
      children,
      onClick,
      className,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) {
    const ctx = useOptionalPagination();
    const slotClassNames = usePaginationClassNames();
    const active =
      isActive ?? (ctx?.page != null ? ctx.page === pageNumber : false);

    const handleClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented || active) return;
        ctx?.onPageChange?.(pageNumber);
      },
      [active, ctx, onClick, pageNumber],
    );

    const label = children ?? pageNumber;

    if (active) {
      return (
        <Text
          ref={ref as Ref<HTMLElement>}
          as="span"
          variant="small"
          aria-current="page"
          className={paginationPageActiveClass({
            slotClass: slotClassNames.pageActive,
            className,
          })}
          onClick={onClick as ((event: MouseEvent<HTMLElement>) => void) | undefined}
          {...(ariaLabel != null ? { "aria-label": ariaLabel } : {})}
          {...rest}
        >
          {label}
        </Text>
      );
    }

    const pageAriaLabel = resolvePaginationPageAriaLabel({
      ariaLabel,
      children,
      pageNumber,
    });

    return (
      <PaginationInteractive
        ref={ref}
        {...(pageAriaLabel != null ? { "aria-label": pageAriaLabel } : {})}
        onClick={handleClick}
        className={className}
        {...rest}
      >
        <Text
          variant="small"
          inheritColor
          as="span"
          className={paginationPageTextClass({
            slotClass: slotClassNames.pageText,
          })}
        >
          {label}
        </Text>
      </PaginationInteractive>
    );
  },
);

PaginationPage.displayName = "Pagination.Page";

export const PaginationEllipsis = forwardRef<HTMLSpanElement, PaginationEllipsisProps>(
  function PaginationEllipsis({ className, ...rest }, ref) {
    const slotClassNames = usePaginationClassNames();

    return (
      <Text
        ref={ref}
        as="span"
        variant="small"
        aria-hidden={PAGINATION_ELLIPSIS_ARIA_HIDDEN}
        className={paginationEllipsisClass({
          slotClass: slotClassNames.ellipsis,
          className,
        })}
        {...rest}
      >
        …
      </Text>
    );
  },
);

PaginationEllipsis.displayName = "Pagination.Ellipsis";

export function PaginationPages() {
  const { page, totalPages, siblingCount } = usePagination();

  if (page == null || totalPages == null) {
    throw new Error(
      "Pagination.Pages requires `page` and `totalPages` on the root <Pagination>.",
    );
  }

  const range = useMemo(
    () => getPaginationRange(page, totalPages, siblingCount),
    [page, siblingCount, totalPages],
  );

  let ellipsisSeen = 0;

  return (
    <>
      {range.map((item) => {
        if (item === "ellipsis") {
          const side = ellipsisSeen === 0 ? "left" : "right";
          ellipsisSeen += 1;
          const flipKey = `ellipsis-${side}`;
          return (
            <PaginationItem key={flipKey} data-flip-key={flipKey}>
              <PaginationEllipsis />
            </PaginationItem>
          );
        }
        return (
          <PaginationItem key={item} data-flip-key={`page-${item}`}>
            <PaginationPage page={item} />
          </PaginationItem>
        );
      })}
    </>
  );
}

PaginationPages.displayName = "Pagination.Pages";
