import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import type { IconBaseProps } from "react-icons";
import { forwardRef, useCallback, useMemo, useRef, type ForwardRefExoticComponent, type MouseEvent, type Ref, type RefAttributes } from "react";

import { Text } from "@/components/core/Text";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { usePressableElementTextMotion } from "@/components/core/utils/usePressableElementTextMotion";
import { useBurneLabels } from "@/theme/BurneLabelsProvider";
import { cn } from "@/utils/cn";

import { PAGINATION_ELLIPSIS_ARIA_HIDDEN, PAGINATION_ICON_ARIA_HIDDEN, resolvePaginationPageAriaLabel } from "./paginationA11y";
import { getPaginationRange, resolvePaginationNextDisabled, resolvePaginationPreviousDisabled } from "./paginationAPI";
import { usePaginationContentRef } from "./paginationAnimations";
import { useOptionalPagination, usePagination, usePaginationClassNames } from "./paginationContext";
import { paginationContentClass, paginationEllipsisClass, paginationInteractiveButtonClass, paginationItemClass, paginationNavTextClass, paginationNextIconClass, paginationPageActiveClass, paginationPageTextClass, paginationPreviousIconClass, paginationRootClass, paginationSummaryClass, paginationSummaryTextClass } from "./paginationStyles";
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
    const btnRef = useRef<HTMLButtonElement>(null);

    const setRefs = useCallback(
      (node: HTMLButtonElement | null) => {
        btnRef.current = node;
        mergeForwardedRef(ref, node);
      },
      [ref],
    );

    const { handlePointerDown, handleKeyDown } = usePressableElementTextMotion({
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
          className,
        })}
        {...rest}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
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
    const ctx = useOptionalPagination();
    const { setRefs } = usePaginationContentRef(ref, {
      page: ctx?.page,
      totalPages: ctx?.totalPages,
      siblingCount: ctx?.siblingCount,
      children,
    });

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
    { disabled, onClick, children, className, "aria-label": ariaLabel, ...rest },
    ref,
  ) {
    const labels = useBurneLabels();
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
        className={cn(slotClassNames.previous, className)}
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
                slotClass: slotClassNames.previousText,
              })}
            >
              {labels.paginationPrevious}
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
    { disabled, onClick, children, className, "aria-label": ariaLabel, ...rest },
    ref,
  ) {
    const labels = useBurneLabels();
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
        className={cn(slotClassNames.next, className)}
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
                slotClass: slotClassNames.nextText,
              })}
            >
              {labels.paginationNext}
            </Text>
            <PaginationNextIcon />
          </>
        )}
      </PaginationInteractive>
    );
  },
);

PaginationNext.displayName = "Pagination.Next";

type PaginationChevronIcon = ForwardRefExoticComponent<
  IconBaseProps & RefAttributes<SVGSVGElement>
>;

const PaginationBackIcon = IoChevronBack as PaginationChevronIcon;
const PaginationForwardIcon = IoChevronForward as PaginationChevronIcon;

export const PaginationPreviousIcon = forwardRef<SVGSVGElement, PaginationIconProps>(
  function PaginationPreviousIcon({ className, ...rest }, ref) {
    const slotClassNames = usePaginationClassNames();

    return (
      <PaginationBackIcon
        ref={ref}
        aria-hidden={PAGINATION_ICON_ARIA_HIDDEN}
        className={paginationPreviousIconClass({
          slotClass: slotClassNames.previousIcon,
          className,
        })}
        {...rest}
      />
    );
  },
);

PaginationPreviousIcon.displayName = "Pagination.PreviousIcon";

export const PaginationNextIcon = forwardRef<SVGSVGElement, PaginationIconProps>(
  function PaginationNextIcon({ className, ...rest }, ref) {
    const slotClassNames = usePaginationClassNames();

    return (
      <PaginationForwardIcon
        ref={ref}
        aria-hidden={PAGINATION_ICON_ARIA_HIDDEN}
        className={paginationNextIconClass({
          slotClass: slotClassNames.nextIcon,
          className,
        })}
        {...rest}
      />
    );
  },
);

PaginationNextIcon.displayName = "Pagination.NextIcon";

export const PaginationPage = forwardRef<HTMLButtonElement, PaginationPageProps>(
  function PaginationPage(
    {
      page: pageNumber,
      active: activeProp,
      children,
      onClick,
      className,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) {
    const labels = useBurneLabels();
    const ctx = useOptionalPagination();
    const slotClassNames = usePaginationClassNames();
    const active =
      activeProp ?? (ctx?.page != null ? ctx.page === pageNumber : false);

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
      pageTemplate: labels.paginationPage,
    });

    return (
      <PaginationInteractive
        ref={ref}
        {...(pageAriaLabel != null ? { "aria-label": pageAriaLabel } : {})}
        onClick={handleClick}
        className={cn(slotClassNames.page, className)}
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
  function PaginationEllipsis({ className, children, ...rest }, ref) {
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
        {children ?? "…"}
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
