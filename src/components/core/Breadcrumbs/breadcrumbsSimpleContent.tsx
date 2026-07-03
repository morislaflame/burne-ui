import type { BreadcrumbsSimpleContentProps } from "./breadcrumbsTypes";
import { BreadcrumbsPiecesList } from "./breadcrumbsParts";
import { useBreadcrumbsPiecesFromItems } from "./useBreadcrumbsRootState";

/** Simple API: renders `<ol>` from `items` on root. */
export function BreadcrumbsSimpleContent({
  items,
  className,
  ...rest
}: BreadcrumbsSimpleContentProps) {
  const { pieces } = useBreadcrumbsPiecesFromItems(items);

  return <BreadcrumbsPiecesList pieces={pieces} className={className} {...rest} />;
}
