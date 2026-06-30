import {
  AlertAction,
  AlertDescription,
  AlertIndicator,
  AlertTitle,
} from "./alertParts";
import type { AlertSimpleContentProps } from "./alertTypes";

/** Simple API: собирает подчасти из props на root. */
export function AlertSimpleContent({
  gridSlots,
  title,
  description,
  icon,
  action,
  children,
}: AlertSimpleContentProps) {
  return (
    <>
      {gridSlots.hasIndicator ? <AlertIndicator>{icon}</AlertIndicator> : null}
      {title != null ? <AlertTitle>{title}</AlertTitle> : null}
      {description != null ? <AlertDescription>{description}</AlertDescription> : null}
      {children}
      {action != null ? <AlertAction>{action}</AlertAction> : null}
    </>
  );
}
