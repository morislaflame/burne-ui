import { KitChevronBack, KitChevronForward, type KitIconProps } from "@/components/core/utils/kitIcons";
import { createElement, forwardRef, useCallback, useMemo, type ForwardedRef, type ForwardRefExoticComponent, type KeyboardEvent, type MouseEvent, type Ref, type RefAttributes } from "react";
 
import { Text } from "@/components/core/Text";
import { useMotionPart } from "@/components/core/utils/slotMotion";
import { isInteractivePressKey } from "@/components/core/utils/hoverInteractiveLift";
import { useBurneLabels } from "@/theme/BurneLabelsProvider";
import { dataActiveState, dataFlag } from "@/components/core/utils/dataContract";
import { cn } from "@/utils/cn";
 
import { PAGINATION_ELLIPSIS_ARIA_HIDDEN, PAGINATION_ICON_ARIA_HIDDEN, resolvePaginationPageAriaLabel } from "./paginationA11y";
import {
  clampPaginationPage,
  getPaginationRange,
  normalizePaginationTotalPages,
  resolvePaginationNextDisabled,
  resolvePaginationPreviousDisabled,
} from "./paginationAPI";
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
      dataState,
      onClick,
      onAuxClick,
      onPointerDown,
      onPointerUp,
      onKeyDown,
      tabIndex,
      "aria-disabled": ariaDisabledProp,
      motion,
      ...rest
    },
    ref,
  ) {
    const scope = useOptionalPaginationMotionScope();
    const size = useOptionalPagination()?.size ?? "base";
    const isBlocked =
      Boolean(disabled) ||
      ariaDisabledProp === true ||
      ariaDisabledProp === "true";
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
      pointerPhases: !isBlocked,
      forwardedRef: ref,
      onPointerDown: (event) => {
        onPointerDown?.(event);
        if (isBlocked || event.defaultPrevented) return;
        playPress("pressIn", event.currentTarget);
      },
      onPointerUp: (event) => {
        onPointerUp?.(event);
        if (isBlocked || event.defaultPrevented) return;
        playPress("pressOut", event.currentTarget);
      },
    });

    const pressKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      if (isBlocked && (event.key === "Enter" || event.key === " " || event.key === "Spacebar")) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      onKeyDown?.(event as KeyboardEvent<HTMLButtonElement>);
      if (isBlocked || event.defaultPrevented || !isInteractivePressKey(event)) return;
      playPress("pressIn", event.currentTarget);
    };

    if (href != null) {
      return createElement(
        "a",
        {
          ref: setRef,
          ...(isBlocked ? {} : { href }),
          "aria-disabled": isBlocked || undefined,
          ...(isBlocked
            ? { tabIndex: -1 }
            : tabIndex !== undefined
              ? { tabIndex }
              : {}),
          className: paginationInteractiveButtonClass({
            className,
            disabled: isBlocked,
            size,
          }),
          ...rest,
          ...pointerHandlers,
          onClick: (event: MouseEvent<HTMLAnchorElement>) => {
            if (isBlocked) {
              event.preventDefault();
              event.stopPropagation();
              return;
            }
            onClick?.(event as unknown as MouseEvent<HTMLButtonElement>);
          },
          onAuxClick: (event: MouseEvent<HTMLAnchorElement>) => {
            if (isBlocked) {
              event.preventDefault();
              event.stopPropagation();
              return;
            }
            onAuxClick?.(event as unknown as MouseEvent<HTMLButtonElement>);
          },
          onKeyDown: pressKeyDown,
          "data-disabled": dataFlag(isBlocked),
          ...(dataState != null ? { "data-state": dataState } : {}),
        } as never,
        children,
      );
    }

    return (
      <button
        ref={setRef}
        type="button"
        disabled={isBlocked}
        tabIndex={tabIndex}
        className={paginationInteractiveButtonClass({
          className,
          disabled: isBlocked,
          size,
        })}
        onClick={onClick}
        onAuxClick={onAuxClick}
        {...rest}
        {...pointerHandlers}
        onKeyDown={pressKeyDown}
        data-disabled={dataFlag(isBlocked)}
        data-state={dataState}
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
    const totalPages = ctx?.totalPages;
    const resolvedDisabled = resolvePaginationPreviousDisabled({
      disabled,
      page,
      totalPages,
    });
 
    const handleClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented || resolvedDisabled) return;
        if (ctx?.onPageChange && page != null && Number.isFinite(page)) {
          const safeTotal =
            totalPages != null ? normalizePaginationTotalPages(totalPages) : undefined;
          if (safeTotal != null && safeTotal <= 0) return;
          const current =
            safeTotal != null
              ? clampPaginationPage(page, safeTotal)
              : Math.max(1, Math.floor(page));
          if (current > 1) {
            ctx.onPageChange(current - 1);
          }
        }
      },
      [ctx, onClick, page, resolvedDisabled, totalPages],
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
        if (ctx?.onPageChange && page != null && totalPages != null && Number.isFinite(page)) {
          const safeTotal = normalizePaginationTotalPages(totalPages);
          if (safeTotal <= 0) return;
          const current = clampPaginationPage(page, safeTotal);
          if (current < safeTotal) {
            ctx.onPageChange(current + 1);
          }
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
      disabled,
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
    const invalidPage =
      !Number.isFinite(pageNumber) ||
      pageNumber < 1 ||
      (ctx?.totalPages != null && pageNumber > normalizePaginationTotalPages(ctx.totalPages));
    const resolvedDisabled = Boolean(disabled) || invalidPage;
    const active =
      activeProp ?? (!invalidPage && ctx?.page != null ? ctx.page === pageNumber : false);
    const pageActivePart = usePaginationPageActiveSlot(
      motion,
      ref as ForwardedRef<HTMLElement>,
      active,
    );
 
    const handleClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented || active || resolvedDisabled) return;
        ctx?.onPageChange?.(Math.floor(pageNumber));
      },
      [active, ctx, onClick, pageNumber, resolvedDisabled],
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
        disabled={resolvedDisabled}
        dataState={dataActiveState(active)}
        {...(pageAriaLabel != null ? { "aria-label": pageAriaLabel } : {})}
        onClick={handleClick}
        className={cn(slotClassNames.page, className)}
        motionSlot="page"
        motion={motion}
        {...rest}
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
 