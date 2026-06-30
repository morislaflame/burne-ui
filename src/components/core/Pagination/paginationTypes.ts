import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  LiHTMLAttributes,
  OlHTMLAttributes,
  ReactNode,
} from "react";

export type PaginationClassNames = {
  /** Корень `<nav>`. */
  root?: string;
  /** `Pagination.Summary`. */
  summary?: string;
  /** Текст в `Pagination.Summary`. */
  summaryText?: string;
  /** `Pagination.Content` (`<ol>`). */
  content?: string;
  /** `Pagination.Item` (`<li>`). */
  item?: string;
  /** Кнопка `PaginationInteractive`. */
  interactive?: string;
  /** Активная страница (`aria-current="page"`). */
  pageActive?: string;
  /** Текст номера страницы в кнопке. */
  pageText?: string;
  /** `Pagination.Ellipsis`. */
  ellipsis?: string;
  /** Текст «Back» / «Forward» в nav-кнопках. */
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
