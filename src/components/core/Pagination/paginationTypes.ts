import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  LiHTMLAttributes,
  OlHTMLAttributes,
  ReactNode,
} from "react";

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
  /** `PaginationInteractive` button. */
  interactive?: string;
  /** Active page (`aria-current="page"`). */
  pageActive?: string;
  /** Page number text in button. */
  pageText?: string;
  /** `Pagination.Ellipsis`. */
  ellipsis?: string;
  /** "Back" / "Forward" text in nav buttons. */
  navText?: string;
  /** `Pagination.PreviousIcon`. */
  previousIcon?: string;
  /** `Pagination.NextIcon`. */
  nextIcon?: string;
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
  totalPages?: number;
  onPageChange?: (page: number) => void;
  siblingCount?: number;
  classNames?: PaginationClassNames;
};

export type PaginationClassNamesProviderProps = {
  classNames?: PaginationClassNames;
  children: ReactNode;
};

export type UsePaginationRootStateProps = Omit<
  PaginationProps,
  "className" | "classNames" | "children"
>;

export type PaginationSummaryProps = HTMLAttributes<HTMLDivElement>;

export type PaginationContentProps = OlHTMLAttributes<HTMLOListElement>;

export type PaginationItemProps = LiHTMLAttributes<HTMLLIElement>;

export type PaginationNavButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export type PaginationPageProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  page: number;
  isActive?: boolean;
  children?: ReactNode;
};

export type PaginationEllipsisProps = HTMLAttributes<HTMLSpanElement>;

export type PaginationPagesProps = Record<string, never>;

export type PaginationInteractiveProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export type PaginationIconProps = {
  className?: string;
};
