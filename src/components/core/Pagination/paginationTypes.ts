import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  LiHTMLAttributes,
  OlHTMLAttributes,
  ReactNode,
} from "react";
import type { IconBaseProps } from "react-icons";

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
  active?: boolean;
  children?: ReactNode;
};

export type PaginationEllipsisProps = HTMLAttributes<HTMLSpanElement>;

export type PaginationPagesProps = Record<string, never>;

export type PaginationInteractiveProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export type PaginationIconProps = IconBaseProps;
