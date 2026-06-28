import { IoChevronForward } from "react-icons/io5";
import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type HTMLAttributes,
  type MouseEvent,
  type OlHTMLAttributes,
  type ReactNode,
} from "react";

import { Dropdown } from "@/components/core/Dropdown";
import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  shouldSkipInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { getMotionConfig } from "@/components/core/utils/motionConfig";
import { TEXT_COLOR_TRANSITION } from "@/components/core/utils/hoverVariant";
import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

type BreadcrumbItemData = {
  label: ReactNode;
  href?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  current?: boolean;
};

type DisplayPiece =
  | { kind: "segment"; item: BreadcrumbItemData; isLast: boolean }
  | { kind: "ellipsis"; hiddenItems: BreadcrumbItemData[] };

function collapsedHiddenItems(items: BreadcrumbItemData[]): BreadcrumbItemData[] {
  if (items.length <= 3) return [];
  return items.slice(1, -2);
}

function toCollapsedPieces(items: BreadcrumbItemData[]): DisplayPiece[] {
  const n = items.length;
  if (n === 0) return [];
  if (n <= 3) {
    return items.map((item, i) => ({
      kind: "segment" as const,
      item,
      isLast: item.current ?? i === n - 1,
    }));
  }
  return [
    { kind: "segment", item: items[0]!, isLast: false },
    { kind: "ellipsis", hiddenItems: collapsedHiddenItems(items) },
    { kind: "segment", item: items[n - 2]!, isLast: false },
    { kind: "segment", item: items[n - 1]!, isLast: true },
  ];
}

function toExpandedPieces(items: BreadcrumbItemData[]): DisplayPiece[] {
  return items.map((item, i) => ({
    kind: "segment" as const,
    item,
    isLast: item.current ?? i === items.length - 1,
  }));
}

const CRUMB_INTERACTIVE_INNER =
  "inline-flex max-w-[min(12rem,46vw)] min-w-0 cursor-pointer truncate rounded-mid px-xsmall py-xsmall text-muted no-underline outline-none " +
  TEXT_COLOR_TRANSITION +
  " hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

type InteractiveCrumbProps = {
  href?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  children: ReactNode;
  className?: string;
  "aria-current"?: "page" | undefined;
};

export const InteractiveCrumb = forwardRef<HTMLSpanElement, InteractiveCrumbProps>(
  function InteractiveCrumb(
    { href, onClick, children, className = "", "aria-current": ariaCurrent },
    forwardedRef,
  ) {
    const innerRef = useRef<HTMLSpanElement | null>(null);

    const setRefs = useCallback(
      (node: HTMLSpanElement | null) => {
        innerRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );

    const handlePointerEnter = useCallback(() => {
      const el = innerRef.current;
      if (!el || shouldSkipInteractiveHoverLift()) return;
      animateInteractiveHoverLift(el, true, getMotionConfig().hoverLiftScale);
    }, []);

    const handlePointerLeave = useCallback(() => {
      const el = innerRef.current;
      if (!el) return;
      animateInteractiveHoverLift(el, false, getMotionConfig().hoverLiftScale);
    }, []);

    const handlePointerDown = useCallback(() => {
      const el = innerRef.current;
      if (!el || shouldSkipInteractiveHoverLift()) return;
      void animateInteractivePressSqueeze(el);
    }, []);

    return (
      <span
        ref={setRefs}
        className={cn("inline-flex min-w-0", className)}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
      >
        {href ? (
          <a
            href={href}
            onClick={onClick}
            aria-current={ariaCurrent}
            className={CRUMB_INTERACTIVE_INNER}
          >
            <Text variant="small" inheritColor as="span" className="min-w-0 truncate">
              {children}
            </Text>
          </a>
        ) : (
          <button
            type="button"
            onClick={onClick}
            aria-current={ariaCurrent}
            className={cn(CRUMB_INTERACTIVE_INNER, "border-0 bg-transparent font-[inherit]")}
          >
            <Text variant="small" inheritColor as="span" className="min-w-0 truncate">
              {children}
            </Text>
          </button>
        )}
      </span>
    );
  },
);

InteractiveCrumb.displayName = "BreadcrumbsInteractiveCrumb";

const ELLIPSIS_TRIGGER_CLASS =
  "inline-flex min-w-0 cursor-pointer rounded-mid border-0 bg-transparent px-xsmall py-xsmall font-[inherit] text-muted outline-none " +
  TEXT_COLOR_TRANSITION +
  " hover:text-foreground aria-expanded:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

type BreadcrumbsEllipsisMenuProps = {
  hiddenItems: BreadcrumbItemData[];
};

function BreadcrumbsEllipsisMenu({ hiddenItems }: BreadcrumbsEllipsisMenuProps) {
  const count = hiddenItems.length;
  const liftRef = useRef<HTMLSpanElement>(null);

  const handlePointerEnter = useCallback(() => {
    const el = liftRef.current;
    if (!el || shouldSkipInteractiveHoverLift()) return;
    animateInteractiveHoverLift(el, true, getMotionConfig().hoverLiftScale);
  }, []);

  const handlePointerLeave = useCallback(() => {
    const el = liftRef.current;
    if (!el) return;
    animateInteractiveHoverLift(el, false, getMotionConfig().hoverLiftScale);
  }, []);

  const handlePointerDown = useCallback(() => {
    const el = liftRef.current;
    if (!el || shouldSkipInteractiveHoverLift()) return;
    void animateInteractivePressSqueeze(el);
  }, []);

  if (count === 0) return null;

  return (
    <Dropdown>
      <Dropdown.Trigger
        aria-label={`Показать ${count} скрытых разделов`}
        className={ELLIPSIS_TRIGGER_CLASS}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
      >
        <span ref={liftRef} className="inline-flex will-change-transform">
          <Text as="span" variant="small" className="tabular-nums">
            …
          </Text>
        </span>
      </Dropdown.Trigger>
      <Dropdown.Popover aria-label="Скрытые разделы" bodyClassName="p-small">
        {hiddenItems.map((item) => {
          const itemKey = item.href ?? `hidden-${String(item.label)}`;
          return item.href ? (
            <Dropdown.Item
              key={itemKey}
              href={item.href}
              selection={false}
              onClick={item.onClick}
              className="text-small"
            >
              {item.label}
            </Dropdown.Item>
          ) : (
            <Dropdown.Item
              key={itemKey}
              value={itemKey}
              selection={false}
              onClick={item.onClick}
              className="text-small"
            >
              {item.label}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Popover>
    </Dropdown>
  );
}

const BreadcrumbsCollapseContext = createContext(true);

export type BreadcrumbsProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  collapse?: boolean;
  children?: ReactNode;
};

export const BreadcrumbsRoot = forwardRef<HTMLElement, BreadcrumbsProps>(function BreadcrumbsRoot(
  { collapse = true, className, children, "aria-label": ariaLabel = "Хлебные крошки", ...rest },
  ref,
) {
  return (
    <BreadcrumbsCollapseContext.Provider value={collapse}>
      <nav ref={ref} aria-label={ariaLabel} className={className} {...rest}>
        {children}
      </nav>
    </BreadcrumbsCollapseContext.Provider>
  );
});

BreadcrumbsRoot.displayName = "Breadcrumbs";

export type BreadcrumbsListProps = OlHTMLAttributes<HTMLOListElement> & {
  children?: ReactNode;
};

function collectItems(children: ReactNode): BreadcrumbItemData[] {
  const out: BreadcrumbItemData[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type !== BreadcrumbsItem) return;
    const props = child.props as BreadcrumbsItemProps;
    out.push({
      label: props.children,
      href: props.href,
      onClick: props.onClick,
      current: props.current,
    });
  });
  return out;
}

function renderSegment(piece: Extract<DisplayPiece, { kind: "segment" }>) {
  const { item, isLast } = piece;

  if (isLast) {
    return (
      <Text
        as="span"
        variant="small"
        aria-current="page"
        className="min-w-0 max-w-[min(14rem,50vw)] truncate px-xsmall py-xsmall font-medium  text-foreground"
      >
        {item.label}
      </Text>
    );
  }

  if (item.href || item.onClick) {
    return (
      <InteractiveCrumb href={item.href} onClick={item.onClick}>
        {item.label}
      </InteractiveCrumb>
    );
  }

  return (
    <Text
      as="span"
      variant="small"
      className="max-w-[min(12rem,46vw)] truncate px-xsmall py-xsmall text-muted"
    >
      {item.label}
    </Text>
  );
}

export const BreadcrumbsList = forwardRef<HTMLOListElement, BreadcrumbsListProps>(
  function BreadcrumbsList({ className, children, ...rest }, ref) {
    const collapse = useContext(BreadcrumbsCollapseContext);
    const items = useMemo(() => collectItems(children), [children]);
    const pieces = useMemo(
      () => (collapse ? toCollapsedPieces(items) : toExpandedPieces(items)),
      [collapse, items],
    );

    return (
      <ol
        ref={ref}
        className={cn(
          "m-0 flex list-none flex-wrap items-center gap-xsmall gap-y-xsmall p-0 text-left",
          className,
        )}
        {...rest}
      >
        {pieces.map((piece, idx) => (
          <li
            key={
              piece.kind === "ellipsis"
                ? "ellipsis"
                : `segment-${idx}-${typeof piece.item.label === "string" ? piece.item.label : idx}`
            }
            className="flex items-center gap-xsmall"
          >
            {idx > 0 ? (
              <IoChevronForward
                className="shrink-0 text-muted opacity-75 icon-small"
                aria-hidden
              />
            ) : null}
            {piece.kind === "ellipsis" ? (
              <BreadcrumbsEllipsisMenu hiddenItems={piece.hiddenItems} />
            ) : (
              renderSegment(piece)
            )}
          </li>
        ))}
      </ol>
    );
  },
);

export type BreadcrumbsItemProps = {
  href?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  current?: boolean;
  children?: ReactNode;
};

export function BreadcrumbsItem(_props: BreadcrumbsItemProps) {
  return null;
}

export function BreadcrumbsSeparator({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("inline-flex", className)} {...rest}>
      <IoChevronForward className="shrink-0 text-muted opacity-75 icon-small" aria-hidden />
    </span>
  );
}

BreadcrumbsList.displayName = "Breadcrumbs.List";
BreadcrumbsItem.displayName = "Breadcrumbs.Item";
BreadcrumbsSeparator.displayName = "Breadcrumbs.Separator";
