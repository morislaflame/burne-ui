import { KitChevronBack, KitChevronForward, type KitIconProps } from "@/components/core/utils/kitIcons";
import { createElement, forwardRef, useCallback, useMemo, type ForwardedRef, type ForwardRefExoticComponent, type KeyboardEvent, type MouseEvent, type Ref, type RefAttributes } from "react";
 
import { Text } from "@/components/core/Text";
import { useMotionPart } from "@/components/core/utils/slotMotion";
import { isInteractivePressKey } from "@/components/core/utils/hoverInteractiveLift";
import { useBurneLabels } from "@/theme/BurneLabelsProvider";
import { dataActiveState } from "@/components/core/utils/dataContract";
import { cn } from "@/utils/cn";
 
import { PAGINATION_ELLIPSIS_ARIA_HIDDEN, PAGINATION_ICON_ARIA_HIDDEN, resolvePaginationPageAriaLabel } from "./paginationA11y";
import { getPaginationRange, resolvePaginationNextDisabled, resolvePaginationPreviousDisabled } from "./paginationAPI";
import { playPaginationButtonPhase, usePaginationContentRef, usePaginationEllipsisSlot, usePaginationPageActiveSlot, usePaginationSummarySlot } from "./paginationAnimations";
import {
  useOptionalPagination,
  useOptionalPaginationMotionScope,
  usePagination,
  usePaginationClassNames,
} from "./paginationContext";
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
 
export const PaginationRootShell = forwardRef<HTMLElement, Omit<PaginationProps, "classNames" | "motion" | "motionController" | "motionState" | "motionPayload" | "playInitialState">>(
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
      motionSlot,
      href,
      onPointerDown,
      onPointerUp,
      onKeyDown,
      motion,
      ...rest
    },
    ref,
  ) {
    const scope = useOptionalPaginationMotionScope();
    const size = useOptionalPagination()?.size ?? "base";
    const playPress = useCallback(
      (phase: "pressIn" | "pressOut", el: HTMLElement) => {
        playPaginationButtonPhase(scope, motionSlot, phase, el, motion);
      },
      [motion, motionSlot, scope],
    );
    const { setRef, pointerHandlers } = useMotionPart<HTMLButtonElement>({
      scope,
      slot: motionSlot,
      motion,
      pressPhases: false,
      pointerPhases: !disabled,
      forwardedRef: ref,
      onPointerDown: (event) => {
        onPointerDown?.(event);
        if (disabled || event.defaultPrevented) return;
        playPress("pressIn", event.currentTarget);
      },
      onPointerUp: (event) => {
        onPointerUp?.(event);
        if (disabled || event.defaultPrevented) return;
        playPress("pressOut", event.currentTarget);
      },
    });

    const pressKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event as KeyboardEvent<HTMLButtonElement>);
      if (disabled || event.defaultPrevented || !isInteractivePressKey(event)) return;
      playPress("pressIn", event.currentTarget);
    };

    if (href) {
      return createElement(
        "a",
        {
          ref: setRef,
          href,
          className: paginationInteractiveButtonClass({ className, size }),
          ...rest,
          ...pointerHandlers,
          onKeyDown: pressKeyDown,
        } as never,
        children,
      );
    }

    return (
      <button
        ref={setRef}
        type="button"
        disabled={disabled}
        className={paginationInteractiveButtonClass({
          className,
          size,
        })}
        {...rest}
        {...pointerHandlers}
        onKeyDown={pressKeyDown}
      >
        {children}
      </button>
    );
  },
);
 
PaginationInteractive.displayName = "PaginationInteractive";
 
export const PaginationSummary = forwardRef<HTMLDivElement, PaginationSummaryProps>(
  function PaginationSummary({ className, children, motion, ...rest }, ref) {
    const slotClassNames = usePaginationClassNames();
    const { setRef } = usePaginationSummarySlot(motion, ref);
 
    return (
      <div
        ref={setRef}
        className={paginationSummaryClass({
          slotClass: slotClassNames.summary,
          className,
        })}
        {...rest}
      >
        <Text
          as="span"
          textStyle="small"
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
        motionSlot="previous"
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
              textStyle="small"
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
        motionSlot="next"
        disabled={resolvedDisabled}
        className={cn(slotClassNames.next, className)}
        {...(ariaLabel != null ? { "aria-label": ariaLabel } : {})}
        onClick={handleClick}
        {...rest}
      >
        {children ?? (
          <>
            <Text
              textStyle="small"
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
  KitIconProps & RefAttributes<SVGSVGElement>
>;
 
const PaginationBackIcon = KitChevronBack as PaginationChevronIcon;
const PaginationForwardIcon = KitChevronForward as PaginationChevronIcon;
 
export const PaginationPreviousIcon = forwardRef<SVGSVGElement, PaginationIconProps>(
  function PaginationPreviousIcon({ className, motion, ...rest }, ref) {
    const slotClassNames = usePaginationClassNames();
    const { setRef } = useMotionPart<HTMLElement>({
      scope: useOptionalPaginationMotionScope(),
      slot: "previousIcon",
      motion,
      forwardedRef: ref as ForwardedRef<HTMLElement>,
    });
 
    return (
      <PaginationBackIcon
        ref={setRef as Ref<SVGSVGElement>}
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
  function PaginationNextIcon({ className, motion, ...rest }, ref) {
    const slotClassNames = usePaginationClassNames();
    const { setRef } = useMotionPart<HTMLElement>({
      scope: useOptionalPaginationMotionScope(),
      slot: "nextIcon",
      motion,
      forwardedRef: ref as ForwardedRef<HTMLElement>,
    });
 
    return (
      <PaginationForwardIcon
        ref={setRef as Ref<SVGSVGElement>}
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
      href,
      children,
      onClick,
      className,
      motion,
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
    const pageActivePart = usePaginationPageActiveSlot(
      motion,
      ref as ForwardedRef<HTMLElement>,
      active,
    );
 
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
          ref={pageActivePart.setRef}
          as="span"
          textStyle={ctx?.size ?? "base"}
          aria-current="page"
          className={paginationPageActiveClass({
            size: ctx?.size ?? "base",
            slotClass: slotClassNames.pageActive,
            className,
          })}
          onClick={onClick as ((event: MouseEvent<HTMLElement>) => void) | undefined}
          {...(ariaLabel != null ? { "aria-label": ariaLabel } : {})}
          {...rest}
          {...pageActivePart.pointerHandlers}
          data-state={dataActiveState(active)}
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
        href={href}
        {...(pageAriaLabel != null ? { "aria-label": pageAriaLabel } : {})}
        onClick={handleClick}
        className={cn(slotClassNames.page, className)}
        motionSlot="page"
        motion={motion}
        {...rest}
        data-state={dataActiveState(active)}
      >
        <Text
          textStyle="small"
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
  function PaginationEllipsis(
    {
      className,
      children,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const slotClassNames = usePaginationClassNames();
    const part = usePaginationEllipsisSlot({
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
 
    return (
      <Text
        ref={part.setRef}
        as="span"
        textStyle="small"
        aria-hidden={PAGINATION_ELLIPSIS_ARIA_HIDDEN}
        className={paginationEllipsisClass({
          slotClass: slotClassNames.ellipsis,
          className,
        })}
        {...rest}
        {...part.pointerHandlers}
      >
        {children ?? "…"}
      </Text>
    );
  },
);
 
PaginationEllipsis.displayName = "Pagination.Ellipsis";
 
export const PaginationPages = forwardRef(function PaginationPages(_props, _ref) {
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
});
 
PaginationPages.displayName = "Pagination.Pages";
 