import type { BreadcrumbsSimpleContentProps } from "./breadcrumbsTypes";
import { BreadcrumbsPiecesList } from "./breadcrumbsParts";
import { useBreadcrumbsPiecesFromItems } from "./useBreadcrumbsRootState";

/** Simple API: рендер `<ol>` из `items` на root. */
export function BreadcrumbsSimpleContent({
  items,
  className,
  ...rest
}: BreadcrumbsSimpleContentProps) {
  const { pieces } = useBreadcrumbsPiecesFromItems(items);

  return <BreadcrumbsPiecesList pieces={pieces} className={className} {...rest} />;
}
