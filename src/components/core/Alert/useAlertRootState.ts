import {
  useId,
  useMemo,
  type ReactNode,
} from "react";

import type { MessageBannerGridSlots } from "@/components/core/utils/messageBannerGridLayout";

import {
  alertHasAction,
  alertHasDescription,
  alertHasTitle,
  alertShowsIndicator,
  hasAlertCompoundChildren,
  resolveAlertStatus,
  resolveAlertVariant,
} from "./alertAPI";
import {
  resolveAlertAriaDescribedBy,
  resolveAlertAriaLabelledBy,
  resolveAlertLiveRole,
} from "./alertA11y";
import type {
  AlertContextValue,
  AlertLiveRole,
  AlertStatus,
  AlertVariant,
} from "./alertTypes";

function resolveAlertGridSlots(
  variant: AlertVariant,
  status: AlertStatus,
  icon: ReactNode | null | undefined,
  action: ReactNode | undefined,
  isCompound: boolean,
  children: ReactNode,
  hasTitle: boolean,
  hasDescription: boolean,
): MessageBannerGridSlots {
  return {
    hasIndicator: alertShowsIndicator(variant, status, icon, isCompound, children),
    hasTitle,
    hasDescription,
    hasAction: isCompound ? alertHasAction(children) : action != null,
    hasClose: false,
  };
}

export function useAlertRootState({
  variant: variantProp,
  status: statusProp,
  role: roleProp,
  title,
  description,
  icon,
  action,
  children,
  ariaLabelledByProp,
  ariaDescribedByProp,
}: {
  variant?: AlertVariant;
  status?: AlertStatus;
  role?: AlertLiveRole;
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode | null;
  action?: ReactNode;
  children?: ReactNode;
  ariaLabelledByProp?: string;
  ariaDescribedByProp?: string;
}) {
  const variant = resolveAlertVariant(variantProp);
  const status = resolveAlertStatus(statusProp);
  const autoId = useId();
  const titleId = `${autoId}-title`;
  const descriptionId = `${autoId}-description`;

  const isCompound = hasAlertCompoundChildren(children);
  const hasTitle = useMemo(
    () => title != null || alertHasTitle(children),
    [children, title],
  );
  const hasDescription = useMemo(
    () => description != null || alertHasDescription(children),
    [children, description],
  );

  const gridSlots = useMemo(
    () =>
      resolveAlertGridSlots(
        variant,
        status,
        icon,
        action,
        isCompound,
        children,
        hasTitle,
        hasDescription,
      ),
    [action, children, hasDescription, hasTitle, icon, isCompound, status, variant],
  );

  const liveRole = resolveAlertLiveRole(status, roleProp);
  const ariaLabelledBy =
    ariaLabelledByProp ??
    resolveAlertAriaLabelledBy(titleId, descriptionId, hasTitle, hasDescription);
  const ariaDescribedBy =
    ariaDescribedByProp ??
    resolveAlertAriaDescribedBy(descriptionId, hasTitle, hasDescription);

  const contextValue = useMemo<AlertContextValue>(
    () => ({ variant, status, titleId, descriptionId, gridSlots }),
    [descriptionId, gridSlots, status, titleId, variant],
  );

  return {
    variant,
    status,
    isCompound,
    gridSlots,
    liveRole,
    ariaLabelledBy,
    ariaDescribedBy,
    contextValue,
  };
}
