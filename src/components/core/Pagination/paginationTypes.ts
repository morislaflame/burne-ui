import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  LiHTMLAttributes,
  OlHTMLAttributes,
  ReactNode,
} from "react";
import type { IconBaseProps } from "react-icons";
import type { Prettify } from "@/utils/prettify";
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";

export type PaginationClassNames = {
  /** Root `<nav>`. */
  root?: string;
  /** `Pagination.Summary`. */
  summary?: string;
  /** Text in `Pagination.Summary`. */
  summaryText?: string;
  /** `Pagination.Content` (`<ol>`). */
  content?: string;
  /** `Pagination.Item` (`<li>`). */
  item?: string;
  /** `Pagination.Previous` button. */
  previous?: string;
  /** `Pagination.Next` button. */
  next?: string;
  /** `Pagination.Page` button (inactive). */
  page?: string;
  /** Active `Pagination.Page` (`aria-current="page"`). */
  pageActive?: string;
  /** Page number text in inactive `Pagination.Page`. */
  pageText?: string;
  /** `Pagination.Ellipsis`. */
  ellipsis?: string;
  /** Default "Back" label text in `Pagination.Previous`. */
  previousText?: string;
  /** Default "Forward" label text in `Pagination.Next`. */
  nextText?: string;
  /** `Pagination.PreviousIcon`. */
  previousIcon?: string;
  /** `Pagination.NextIcon`. */
  nextIcon?: string;
};

export type PaginationPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
};

export type PaginationSummaryPartMotion = PaginationPartMotion & {
  change?: MotionValue;
};

export type PaginationMotion = {
  control?: PaginationPartMotion;
  previousIcon?: PaginationPartMotion;
  nextIcon?: PaginationPartMotion;
  summary?: PaginationSummaryPartMotion;
  ellipsis?: PaginationPartMotion;
};

export type PaginationContextValue = {
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  siblingCount: number;
};

export type PaginationProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  children?: ReactNode;
  page?: number;
  defaultPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  siblingCount?: number;
  classNames?: Prettify<PaginationClassNames>;
  /**
   * Per-slot motion (`control`, `previousIcon`, `nextIcon`, `summary`, `ellipsis`).
   * `Pagination.Content` / `Item` / `Page` are not separate slots (`control` covers buttons).
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   * There is no `root` slot — `play()` skips; use `playSlot("summary")` / `playAll`.
   */
  motion?: Prettify<MotionMapWithEvents<PaginationMotion>>;
  /**
   * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
   * One handle → this pagination chrome scope (`summary` / `ellipsis`).
   * Nested Previous / Next / Page are separate scopes — pass a handle there.
   * FLIP on `<ol>` is kit-internal. Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;

export type PaginationClassNamesProviderProps = {
  classNames?: Prettify<PaginationClassNames>;
  children: ReactNode;
};

export type UsePaginationRootStateProps = Omit<
  PaginationProps,
  "className" | "classNames" | "children"
>;

export type PaginationSummaryProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<PaginationSummaryPartMotion>;
};

export type PaginationContentProps = OlHTMLAttributes<HTMLOListElement>;

export type PaginationItemProps = LiHTMLAttributes<HTMLLIElement>;

export type PaginationNavButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  motion?: Prettify<PaginationPartMotion>;
  /**
   * Handle for this control's nested scope. `play()` looks for `root` (skip) —
   * use `playSlot("control")`. Icons live here.
   */
  motionController?: MotionController;
} & MotionStateHostProps;

export type PaginationPageProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  page: number;
  active?: boolean;
  children?: ReactNode;
  motion?: Prettify<PaginationPartMotion>;
  /**
   * Handle for this page button's nested scope. `play()` looks for `root` (skip) —
   * use `playSlot("control")`. Active page is a `<span>` (no control scope).
   */
  motionController?: MotionController;
} & MotionStateHostProps;

export type PaginationEllipsisProps = HTMLAttributes<HTMLSpanElement> & {
  motion?: Prettify<PaginationPartMotion>;
};

export type PaginationPagesProps = Record<string, never>;

export type PaginationInteractiveProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  motion?: Prettify<PaginationPartMotion>;
  motionController?: MotionController;
} & MotionStateHostProps;

export type PaginationIconProps = IconBaseProps & {
  motion?: Prettify<PaginationPartMotion>;
};
