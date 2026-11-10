import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  LiHTMLAttributes,
  OlHTMLAttributes,
  ReactNode,
} from "react";
import type { KitIconProps } from "@/components/core/utils/kitIcons";
import type { Prettify } from "@/utils/prettify";
import type { ComponentSize } from "@/components/core/utils/sizeLayout";
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
  /** `Pagination.Previous` button. */
  previous?: PaginationPartMotion;
  /** `Pagination.Next` button. */
  next?: PaginationPartMotion;
  /** Inactive `Pagination.Page` button. Repeated. */
  page?: PaginationPartMotion;
  /** Active `Pagination.Page` (`aria-current="page"`). */
  pageActive?: PaginationPartMotion;
  previousIcon?: PaginationPartMotion;
  nextIcon?: PaginationPartMotion;
  summary?: PaginationSummaryPartMotion;
  ellipsis?: PaginationPartMotion;
};
 
export type PaginationSize = ComponentSize;

export type PaginationContextValue = {
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  siblingCount: number;
  size: PaginationSize;
};
 
export type PaginationProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  children?: ReactNode;
  page?: number;
  defaultPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  siblingCount?: number;
  /** Page control scale. Default `base`. */
  size?: PaginationSize;
  classNames?: Prettify<PaginationClassNames>;
  /**
   * Per-slot motion (`previous`, `next`, `page`, `pageActive`, `previousIcon`, `nextIcon`, `summary`, `ellipsis`).
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   * There is no `root` slot — `play()` skips; use `playSlot("previous")` / `playSlot("page")` / `playAll`.
   */
  motion?: Prettify<MotionMapWithEvents<PaginationMotion>>;
  /**
   * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
   * One handle → this pagination scope (nav buttons, icons, summary, ellipsis).
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
  /** Wins over `motion.previous` / `motion.next` on the root. */
  motion?: Prettify<PaginationPartMotion>;
};
 
export type PaginationPageProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  page: number;
  active?: boolean;
  /** Renders an `<a>` instead of a button. */
  href?: string;
  children?: ReactNode;
  /** Inactive page wins over `motion.page`. Active page wins over `motion.pageActive`. */
  motion?: Prettify<PaginationPartMotion>;
};
 
export type PaginationEllipsisProps = HTMLAttributes<HTMLSpanElement> & {
  motion?: Prettify<PaginationPartMotion>;
};
 
export type PaginationPagesProps = Record<string, never>;
 
export type PaginationButtonSlot = "previous" | "next" | "page";

export type PaginationInteractiveProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  /** Motion slot. The HTML `slot` attribute stays on the button type and is not this. */
  motionSlot: PaginationButtonSlot;
  motion?: Prettify<PaginationPartMotion>;
  href?: string;
};
 
export type PaginationIconProps = KitIconProps & {
  motion?: Prettify<PaginationPartMotion>;
};
 