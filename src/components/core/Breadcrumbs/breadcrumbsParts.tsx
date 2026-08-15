import { IoChevronForward } from "react-icons/io5";
import { forwardRef, useCallback, useMemo } from "react";

import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { mergeMotionSlotMaps, useMotionPart } from "@/components/core/utils/slotMotion";
import { isInteractivePressKey } from "@/components/core/utils/hoverInteractiveLift";

import { Dropdown } from "@/components/core/Dropdown";
import { Text } from "@/components/core/Text";
import { useBurneLabels } from "@/theme/BurneLabelsProvider";

import { breadcrumbsEllipsisPopoverAriaLabel, ellipsisTriggerAriaLabel } from "./breadcrumbsA11y";
import { breadcrumbListItemKey } from "./breadcrumbsAPI";
import {
  resolveBreadcrumbsEllipsisMotionDefaults,
  resolveBreadcrumbsItemMotionDefaults,
} from "./breadcrumbsAnimations";
import {
  BreadcrumbsClassNamesProvider,
  BreadcrumbsMotionProvider,
  useBreadcrumbsClassNames,
  useOptionalBreadcrumbsMotionScope,
} from "./breadcrumbsContext";
import { breadcrumbChevronClass, breadcrumbCurrentClass, breadcrumbListItemClass, breadcrumbStaticClass, breadcrumbsDropdownItemClass, breadcrumbsEllipsisPopoverBodyClass, breadcrumbsEllipsisLiftWrapperClass, breadcrumbsEllipsisTextClass, breadcrumbsEllipsisTriggerClass, breadcrumbsListClass, breadcrumbsSeparatorClass, crumbInteractiveButtonClass, crumbInteractiveInnerClass, crumbInteractiveTextClass, crumbInteractiveWrapperClass } from "./breadcrumbsStyles";
import { useBreadcrumbsListState } from "./useBreadcrumbsRootState";
import type {
  BreadcrumbListItemProps,
  BreadcrumbSegmentProps,
  BreadcrumbsEllipsisMenuProps,
  BreadcrumbsEllipsisDropdownItemProps,
  BreadcrumbsItemProps,
  BreadcrumbsListProps,
  BreadcrumbsPiecesListProps,
  BreadcrumbsSeparatorProps,
  InteractiveCrumbProps,
} from "./breadcrumbsTypes";

import { cn } from "@/utils/cn";

export function BreadcrumbsItem(_props: BreadcrumbsItemProps) {
  return null;
}

BreadcrumbsItem.displayName = "Breadcrumbs.Item";

export const BreadcrumbsList = forwardRef<HTMLOListElement, BreadcrumbsListProps>(
  function BreadcrumbsList({ className, classNames, children, ...rest }, ref) {
    const { pieces } = useBreadcrumbsListState(children);

    return (
      <BreadcrumbsClassNamesProvider classNames={classNames}>
        <BreadcrumbsPiecesList
          ref={ref}
          pieces={pieces}
          className={className}
          {...rest}
        />
      </BreadcrumbsClassNamesProvider>
    );
  },
);

BreadcrumbsList.displayName = "Breadcrumbs.List";

export const BreadcrumbsPiecesList = forwardRef<HTMLOListElement, BreadcrumbsPiecesListProps>(
function BreadcrumbsPiecesList({ pieces, className, ...rest }, ref) {
  const slotClassNames = useBreadcrumbsClassNames();

  return (
    <ol
      ref={ref}
      className={breadcrumbsListClass(cn("", slotClassNames.list, className))}
      {...rest}
    >
      {pieces.map((piece, idx) => (
        <BreadcrumbListItem
          key={breadcrumbListItemKey(piece, idx)}
          piece={piece}
          showSeparator={idx > 0}
        />
      ))}
    </ol>
  );
});

BreadcrumbsPiecesList.displayName = "BreadcrumbsPiecesList";

function BreadcrumbListItem({
  piece,
  showSeparator,
}: BreadcrumbListItemProps) {
  const slotClassNames = useBreadcrumbsClassNames();

  return (
    <li className={breadcrumbListItemClass(slotClassNames.item)}>
      {showSeparator ? <BreadcrumbChevronSeparator /> : null}
      {piece.kind === "ellipsis" ? (
        <BreadcrumbsEllipsisMenu hiddenItems={piece.hiddenItems} />
      ) : (
        <BreadcrumbSegment piece={piece} />
      )}
    </li>
  );
}

export function BreadcrumbsSeparator({
  className,
  iconClassName,
  ...rest
}: BreadcrumbsSeparatorProps) {
  const slotClassNames = useBreadcrumbsClassNames();

  return (
    <span
      className={breadcrumbsSeparatorClass(
        cn("", slotClassNames.separatorWrapper, className),
      )}
      {...rest}
    >
      <IoChevronForward
        className={breadcrumbChevronClass(
          cn("", slotClassNames.separator, iconClassName),
        )}
        aria-hidden
      />
    </span>
  );
}

BreadcrumbsSeparator.displayName = "Breadcrumbs.Separator";

function BreadcrumbSegment({ piece }: BreadcrumbSegmentProps) {
  const slotClassNames = useBreadcrumbsClassNames();
  const { item, isLast } = piece;

  if (isLast) {
    return (
      <Text
        as="span"
        variant="small"
        aria-current="page"
        className={breadcrumbCurrentClass(
          cn("", slotClassNames.itemActive, item.className),
        )}
      >
        {item.label}
      </Text>
    );
  }

  if (item.href || item.onClick) {
    return (
      <InteractiveCrumb
        href={item.href}
        onClick={item.onClick}
        className={slotClassNames.itemLinkWrapper}
        innerClassName={cn("", slotClassNames.itemLink, item.className)}
        textClassName={slotClassNames.itemLinkText}
      >
        {item.label}
      </InteractiveCrumb>
    );
  }

  return (
    <Text
      as="span"
      variant="small"
      className={breadcrumbStaticClass(
        cn("", slotClassNames.itemStatic, item.className),
      )}
    >
      {item.label}
    </Text>
  );
}

function BreadcrumbChevronSeparator() {
  const slotClassNames = useBreadcrumbsClassNames();

  return (
    <IoChevronForward
      className={breadcrumbChevronClass(slotClassNames.separator)}
      aria-hidden
    />
  );
}

export const InteractiveCrumb = forwardRef<HTMLSpanElement, InteractiveCrumbProps>(
  function InteractiveCrumb(
    {
      href,
      onClick,
      children,
      className = "",
      innerClassName,
      textClassName,
      "aria-current": ariaCurrent,
    },
    forwardedRef,
  ) {
    const parentScope = useOptionalBreadcrumbsMotionScope();
    const motionDefaults = useMemo(() => resolveBreadcrumbsItemMotionDefaults(), []);
    const mergedMotion = mergeMotionSlotMaps(parentScope?.getRootMotion(), undefined);

    return (
      <BreadcrumbsMotionProvider motion={mergedMotion} defaults={motionDefaults}>
        <InteractiveCrumbSurface
          href={href}
          onClick={onClick}
          className={className}
          innerClassName={innerClassName}
          textClassName={textClassName}
          ariaCurrent={ariaCurrent}
          forwardedRef={forwardedRef}
        >
          {children}
        </InteractiveCrumbSurface>
      </BreadcrumbsMotionProvider>
    );
  },
);

function InteractiveCrumbSurface({
  href,
  onClick,
  children,
  className,
  innerClassName,
  textClassName,
  ariaCurrent,
  forwardedRef,
}: {
  href?: InteractiveCrumbProps["href"];
  onClick?: InteractiveCrumbProps["onClick"];
  children: React.ReactNode;
  className: string;
  innerClassName?: string;
  textClassName?: string;
  ariaCurrent?: InteractiveCrumbProps["aria-current"];
  forwardedRef: React.ForwardedRef<HTMLSpanElement>;
}) {
    const scope = useOptionalBreadcrumbsMotionScope();
    const { setRef: setLinkRef, pointerHandlers } = useMotionPart<HTMLAnchorElement | HTMLButtonElement>({
      scope,
      slot: "itemLink",
      pressPhases: true,
      pointerPhases: true,
    });
    const { setRef: setTextRef, pointerHandlers: textPointer } = useMotionPart<HTMLSpanElement>({
      scope,
      slot: "itemLinkText",
      pointerPhases: true,
    });

    const setTextMerged = useCallback(
      (node: HTMLSpanElement | null) => {
        setTextRef(node);
        mergeForwardedRef(forwardedRef, node);
      },
      [forwardedRef, setTextRef],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLAnchorElement | HTMLButtonElement>) => {
        if (!isInteractivePressKey(e) || !scope) return;
        const el = e.currentTarget;
        const value = scope.resolve("itemLink", "pressIn");
        if (value === false || value === undefined) return;
        scope.play("itemLink", "pressIn", { el });
      },
      [scope],
    );

    const innerCls = href
      ? crumbInteractiveInnerClass(innerClassName)
      : crumbInteractiveButtonClass(innerClassName);

    const text = (
      <Text
        ref={setTextMerged}
        variant="small"
        inheritColor
        as="span"
        className={crumbInteractiveTextClass(textClassName)}
        {...textPointer}
      >
        {children}
      </Text>
    );

    return (
      <span className={crumbInteractiveWrapperClass(className)}>
        {href ? (
          <a
            ref={setLinkRef as React.Ref<HTMLAnchorElement>}
            href={href}
            onClick={onClick}
            aria-current={ariaCurrent}
            className={innerCls}
            onKeyDown={handleKeyDown}
            {...pointerHandlers}
          >
            {text}
          </a>
        ) : (
          <button
            ref={setLinkRef as React.Ref<HTMLButtonElement>}
            type="button"
            onClick={onClick}
            aria-current={ariaCurrent}
            className={innerCls}
            onKeyDown={handleKeyDown}
            {...pointerHandlers}
          >
            {text}
          </button>
        )}
      </span>
    );
}

InteractiveCrumb.displayName = "BreadcrumbsInteractiveCrumb";

export function BreadcrumbsEllipsisMenu({ hiddenItems }: BreadcrumbsEllipsisMenuProps) {
  const slotClassNames = useBreadcrumbsClassNames();
  const labels = useBurneLabels();
  const count = hiddenItems.length;
  const parentScope = useOptionalBreadcrumbsMotionScope();
  const motionDefaults = useMemo(() => resolveBreadcrumbsEllipsisMotionDefaults(), []);
  const mergedMotion = mergeMotionSlotMaps(parentScope?.getRootMotion(), undefined);

  if (count === 0) return null;

  return (
    <BreadcrumbsMotionProvider motion={mergedMotion} defaults={motionDefaults}>
      <BreadcrumbsEllipsisMenuSurface
        hiddenItems={hiddenItems}
        slotClassNames={slotClassNames}
        labels={labels}
        count={count}
      />
    </BreadcrumbsMotionProvider>
  );
}

function BreadcrumbsEllipsisMenuSurface({
  hiddenItems,
  slotClassNames,
  labels,
  count,
}: {
  hiddenItems: BreadcrumbsEllipsisMenuProps["hiddenItems"];
  slotClassNames: ReturnType<typeof useBreadcrumbsClassNames>;
  labels: ReturnType<typeof useBurneLabels>;
  count: number;
}) {
  const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
    scope: useOptionalBreadcrumbsMotionScope(),
    slot: "ellipsisLiftWrapper",
    pressPhases: true,
  });

  return (
    <Dropdown>
      <Dropdown.Trigger
        aria-label={ellipsisTriggerAriaLabel(count, labels.breadcrumbsShowHidden)}
        className={breadcrumbsEllipsisTriggerClass(slotClassNames.ellipsisTrigger)}
      >
        <span
          ref={setRef}
          className={breadcrumbsEllipsisLiftWrapperClass(slotClassNames.ellipsisLiftWrapper)}
          {...pointerHandlers}
        >
          <Text
            as="span"
            variant="small"
            className={breadcrumbsEllipsisTextClass(slotClassNames.ellipsisText)}
          >
            …
          </Text>
        </span>
      </Dropdown.Trigger>
      <Dropdown.Popover
        aria-label={breadcrumbsEllipsisPopoverAriaLabel(labels.breadcrumbsHiddenSections)}
        bodyClassName={breadcrumbsEllipsisPopoverBodyClass(slotClassNames.ellipsisPopover)}
      >
        {hiddenItems.map((item) => {
          const itemKey = item.href ?? `hidden-${String(item.label)}`;
          return (
            <BreadcrumbsEllipsisDropdownItem
              key={itemKey}
              item={item}
              className={breadcrumbsDropdownItemClass(
                cn("", slotClassNames.dropdownItem, item.className),
              )}
            />
          );
        })}
      </Dropdown.Popover>
    </Dropdown>
  );
}

function BreadcrumbsEllipsisDropdownItem({
  item,
  className,
}: BreadcrumbsEllipsisDropdownItemProps) {
  const itemKey = item.href ?? `hidden-${String(item.label)}`;

  if (item.href) {
    return (
      <Dropdown.Item
        href={item.href}
        selection={false}
        onClick={item.onClick}
        className={className}
      >
        {item.label}
      </Dropdown.Item>
    );
  }

  return (
    <Dropdown.Item
      value={itemKey}
      selection={false}
      onClick={item.onClick}
      className={className}
    >
      {item.label}
    </Dropdown.Item>
  );
}
