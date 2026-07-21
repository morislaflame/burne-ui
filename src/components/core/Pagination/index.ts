import { PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationNextIcon, PaginationPage, PaginationPages, PaginationPrevious, PaginationPreviousIcon, PaginationRoot, PaginationSummary } from "./Pagination";

export const Pagination = Object.assign(PaginationRoot, {
  Summary: PaginationSummary,
  Content: PaginationContent,
  Item: PaginationItem,
  Previous: PaginationPrevious,
  Next: PaginationNext,
  PreviousIcon: PaginationPreviousIcon,
  NextIcon: PaginationNextIcon,
  Page: PaginationPage,
  Pages: PaginationPages,
  Ellipsis: PaginationEllipsis,
});

export type {
  PaginationProps,
  PaginationClassNames,
  PaginationSummaryProps,
  PaginationContentProps,
  PaginationItemProps,
  PaginationNavButtonProps,
  PaginationPageProps,
  PaginationEllipsisProps,
  PaginationPagesProps,
} from "./Pagination";
