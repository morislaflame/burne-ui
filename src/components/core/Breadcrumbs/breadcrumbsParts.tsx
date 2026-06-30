import { IoChevronForward } from "react-icons/io5";
import {
  forwardRef,
  useCallback,
} from "react";

import { Dropdown } from "@/components/core/Dropdown";
import { Text } from "@/components/core/Text";

import {
  BREADCRUMBS_ELLIPSIS_POPOVER_ARIA_LABEL,
  ellipsisTriggerAriaLabel,
} from "./breadcrumbsA11y";
import { mergeBreadcrumbSlotClass, breadcrumbListItemKey } from "./breadcrumbsAPI";
import { useBreadcrumbInteractiveMotion } from "./breadcrumbsAnimations";
import {
  BreadcrumbsClassNamesProvider,
  useBreadcrumbsClassNames,
} from "./breadcrumbsContext";
import {
  breadcrumbChevronClass,
  breadcrumbCurrentClass,
  breadcrumbListItemClass,
  breadcrumbStaticClass,
  breadcrumbsDropdownItemClass,
  breadcrumbsEllipsisPopoverBodyClass,
  breadcrumbsEllipsisLiftWrapperClass,
  breadcrumbsEllipsisTextClass,
  breadcrumbsEllipsisTriggerClass,
  breadcrumbsListClass,
  breadcrumbsSeparatorClass,
  crumbInteractiveButtonClass,
  crumbInteractiveInnerClass,
  crumbInteractiveTextClass,
  crumbInteractiveWrapperClass,
} from "./breadcrumbsStyles";
import { useBreadcrumbsRootState } from "./useBreadcrumbsRootState";
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

export function BreadcrumbsItem(_props: BreadcrumbsItemProps) {
  return null;
}

BreadcrumbsItem.displayName = "Breadcrumbs.Item";

export const BreadcrumbsList = forwardRef<HTMLOListElement, BreadcrumbsListProps>(
  function BreadcrumbsList({ className, classNames, children, ...rest }, ref) {
    const { pieces } = useBreadcrumbsRootState(children);

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
      className={breadcrumbsListClass(mergeBreadcrumbSlotClass("", slotClassNames.list, className))}
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
    <li className={breadcrumbListItemClass(slotClassNames.listItem)}>
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
        mergeBreadcrumbSlotClass("", slotClassNames.separatorWrapper, className),
      )}
      {...rest}
    >
      <IoChevronForward
        className={breadcrumbChevronClass(
          mergeBreadcrumbSlotClass("", slotClassNames.separator, iconClassName),
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
          mergeBreadcrumbSlotClass("", slotClassNames.current, item.className),
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
        className={slotClassNames.linkWrapper}
        innerClassName={mergeBreadcrumbSlotClass("", slotClassNames.link, item.className)}
        textClassName={slotClassNames.linkText}
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
        mergeBreadcrumbSlotClass("", slotClassNames.static, item.className),
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
    const {
      innerRef,
      handlePointerEnter,
      handlePointerLeave,
      handlePointerDown,
    } = useBreadcrumbInteractiveMotion();

    const setRefs = useCallback(
      (node: HTMLSpanElement | null) => {
        innerRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef, innerRef],
    );

    const innerCls = href
      ? crumbInteractiveInnerClass(innerClassName)
      : crumbInteractiveButtonClass(innerClassName);

    return (
      <span
        ref={setRefs}
        className={crumbInteractiveWrapperClass(className)}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
      >
        {href ? (
          <a href={href} onClick={onClick} aria-current={ariaCurrent} className={innerCls}>
            <Text
              variant="small"
              inheritColor
              as="span"
              className={crumbInteractiveTextClass(textClassName)}
            >
              {children}
            </Text>
          </a>
        ) : (
          <button type="button" onClick={onClick} aria-current={ariaCurrent} className={innerCls}>
            <Text
              variant="small"
              inheritColor
              as="span"
              className={crumbInteractiveTextClass(textClassName)}
            >
              {children}
            </Text>
          </button>
        )}
      </span>
    );
  },
);

InteractiveCrumb.displayName = "BreadcrumbsInteractiveCrumb";

export function BreadcrumbsEllipsisMenu({ hiddenItems }: BreadcrumbsEllipsisMenuProps) {
  const slotClassNames = useBreadcrumbsClassNames();
  const count = hiddenItems.length;
  const {
    innerRef: liftRef,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerDown,
  } = useBreadcrumbInteractiveMotion();

  if (count === 0) return null;

  return (
    <Dropdown>
      <Dropdown.Trigger
        aria-label={ellipsisTriggerAriaLabel(count)}
        className={breadcrumbsEllipsisTriggerClass(slotClassNames.ellipsisTrigger)}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
      >
        <span
          ref={liftRef}
          className={breadcrumbsEllipsisLiftWrapperClass(slotClassNames.ellipsisLiftWrapper)}
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
        aria-label={BREADCRUMBS_ELLIPSIS_POPOVER_ARIA_LABEL}
        bodyClassName={breadcrumbsEllipsisPopoverBodyClass(slotClassNames.ellipsisPopover)}
      >
        {hiddenItems.map((item) => {
          const itemKey = item.href ?? `hidden-${String(item.label)}`;
          return (
            <BreadcrumbsEllipsisDropdownItem
              key={itemKey}
              item={item}
              className={breadcrumbsDropdownItemClass(
                mergeBreadcrumbSlotClass("", slotClassNames.dropdownItem, item.className),
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
