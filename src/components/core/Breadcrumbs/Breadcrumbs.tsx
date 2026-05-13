import { IoChevronForward } from "react-icons/io5";
import {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";

import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { MOTION_HOVER_LIFT_SCALE } from "@/components/core/utils/motionTokens";
import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

export type BreadcrumbItem = {
  /** Подпись сегмента. */
  label: ReactNode;
  /** Внешняя ссылка (все сегменты кроме последнего с ховером должны иметь `href` и/или `onClick`). */
  href?: string;
  /** Клик без навигации (кнопка). */
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
};

type DisplayPiece =
  | { kind: "segment"; item: BreadcrumbItem; isLast: boolean }
  | { kind: "ellipsis" };

function toDisplayPieces(items: readonly BreadcrumbItem[]): DisplayPiece[] {
  const n = items.length;
  if (n === 0) return [];
  if (n <= 3) {
    return items.map((item, i) => ({
      kind: "segment" as const,
      item,
      isLast: i === n - 1,
    }));
  }
  return [
    { kind: "segment", item: items[0]!, isLast: false },
    { kind: "ellipsis" },
    { kind: "segment", item: items[n - 2]!, isLast: false },
    { kind: "segment", item: items[n - 1]!, isLast: true },
  ];
}

type InteractiveCrumbProps = {
  href?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  children: ReactNode;
  className?: string;
};

const InteractiveCrumb = forwardRef<HTMLSpanElement, InteractiveCrumbProps>(
  function InteractiveCrumb(
    { href, onClick, children, className = "" },
    forwardedRef,
  ) {
    const innerRef = useRef<HTMLSpanElement | null>(null);
    const hoverInsideRef = useRef(false);

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
      if (!el || prefersReducedInteractiveHoverLift()) return;
      hoverInsideRef.current = true;
      animateInteractiveHoverLift(el, true, MOTION_HOVER_LIFT_SCALE);
    }, []);

    const handlePointerLeave = useCallback(() => {
      hoverInsideRef.current = false;
      const el = innerRef.current;
      if (!el || prefersReducedInteractiveHoverLift()) return;
      animateInteractiveHoverLift(el, false, MOTION_HOVER_LIFT_SCALE);
    }, []);

    const handlePointerDown = useCallback(() => {
      const el = innerRef.current;
      if (!el || prefersReducedInteractiveHoverLift()) return;
      void animateInteractivePressSqueeze(el).then(() => {
        const shell = innerRef.current;
        if (
          !shell ||
          prefersReducedInteractiveHoverLift() ||
          !hoverInsideRef.current
        ) {
          return;
        }
        animateInteractiveHoverLift(shell, true, MOTION_HOVER_LIFT_SCALE);
      });
    }, []);

    const commonInner =
      "inline-flex max-w-[min(12rem,46vw)] min-w-0 cursor-pointer items-center justify-start rounded-mid px-xsmall py-xsmall text-left text-muted no-underline outline-none " +
      "transition-colors hover:text-muted motion-reduce:transition-none " +
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

    return (
      <span
        ref={setRefs}
        className={cn(
          "inline-flex origin-center items-center rounded-mid motion-reduce:animate-none",
          className,
        )}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
      >
        {href != null && href !== "" ? (
          <a
            href={href}
            onClick={onClick}
            className={cn(commonInner, "border-0 bg-transparent font-[inherit]")}
          >
            <Text variant="small" inheritColor as="span" className="min-w-0 truncate leading-none">
              {children}
            </Text>
          </a>
        ) : (
          <button
            type="button"
            onClick={onClick}
            className={cn(
              commonInner,
              "inline-flex border-0 bg-transparent font-[inherit]",
            )}
          >
            <Text variant="small" inheritColor as="span" className="min-w-0 truncate leading-none">
              {children}
            </Text>
          </button>
        )}
      </span>
    );
  },
);

export type BreadcrumbsProps = Omit<
  HTMLAttributes<HTMLElement>,
  "children" | "role"
> & {
  items: readonly BreadcrumbItem[];
};

/**
 * Навигационная цепочка: последний пункт — текст; остальные — `muted` с hover-scale и squeeze при нажатии (без тени и без рамки при клике мышью).
 * Если сегментов больше трёх: первый, затем «…», затем два последних.
 */
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  function Breadcrumbs(
    {
      items,
      className = "",
      "aria-label": ariaLabel = "Хлебные крошки",
      ...rest
    },
    ref,
  ) {
    const pieces = useMemo(() => toDisplayPieces(items), [items]);

    return (
      <nav ref={ref} aria-label={ariaLabel} {...rest}>
        <ol
          className={cn(
            "m-0 flex list-none flex-wrap items-center gap-xsmall gap-y-xsmall p-0 text-left",
            className,
          )}
        >
          {pieces.map((piece, idx) => (
            <li
              key={piece.kind === "ellipsis" ? "ellipsis" : `segment-${idx}`}
              className="flex items-center gap-xsmall"
              {...(piece.kind === "segment" && piece.isLast
                ? ({ "aria-current": "page" } as const)
                : {})}
            >
              {idx > 0 ? (
                <IoChevronForward className="shrink-0 text-muted opacity-75 icon-small" aria-hidden />
              ) : null}
              {piece.kind === "ellipsis" ? (
                <Text
                  as="span"
                  variant="small"
                  className="leading-none px-xsmall py-xsmall text-muted tabular-nums"
                  aria-hidden
                >
                  …
                </Text>
              ) : piece.isLast ? (
                <Text
                  as="span"
                  variant="small"
                  className="min-w-0 max-w-[min(14rem,50vw)] truncate px-xsmall py-xsmall font-medium leading-none text-foreground"
                >
                  {piece.item.label}
                </Text>
              ) : piece.item.href || piece.item.onClick ? (
                <InteractiveCrumb
                  href={piece.item.href}
                  onClick={piece.item.onClick}
                >
                  {piece.item.label}
                </InteractiveCrumb>
              ) : (
                <Text
                  as="span"
                  variant="small"
                  className="max-w-[min(12rem,46vw)] truncate px-xsmall py-xsmall leading-none text-muted"
                >
                  {piece.item.label}
                </Text>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  },
);
