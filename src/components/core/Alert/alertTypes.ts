import type { HTMLAttributes, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";

import type { MessageBannerGridSlots } from "@/components/core/utils/messageBannerGridLayout";
import type { MessageBannerSize, MessageBannerSizePreset } from "@/components/core/utils/sizeLayout";
import type { ShadowLevel } from "@/tokens/shadows";

export type AlertSize = MessageBannerSize;

export type AlertVariant = "default" | "outline" | "secondary" | "gloss";

export type AlertStatus = "default" | "danger" | "success" | "info" | "warning";

export type AlertLiveRole = "status" | "alert";

export type AlertClassNames = {
  root?: string;
  indicator?: string;
  message?: string;
  content?: string;
  title?: string;
  description?: string;
  action?: string;
};

export type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, "role"> & {
  variant?: AlertVariant;
  status?: AlertStatus;
  size?: AlertSize;
  role?: AlertLiveRole;
  /** Simple API: title. In compound is ignored. */
  title?: ReactNode;
  /** Simple API: description. In compound is `<Alert.Description>`. */
  description?: ReactNode;
  icon?: ReactNode | null;
  /** Simple API: action slot on the right. In compound is `<Alert.Action>`. */
  action?: ReactNode;
  classNames?: Prettify<AlertClassNames>;
  /**
   * Hover lift + stronger shadow in the same `shadow` family (`--shadow-{shadow}-hover`).
   * Rest elevation stays when `false`.
   * @default true
   */
  hoverLift?: boolean;
  /**
   * Rest shadow size. Hover uses the same family (`--shadow-{size}-hover`), not the next tier.
   * @default "base"
   */
  shadow?: ShadowLevel;
};

export type AlertContextValue = {
  variant: AlertVariant;
  status: AlertStatus;
  size: AlertSize;
  sizePreset: MessageBannerSizePreset;
  titleId: string;
  descriptionId: string;
  gridSlots: MessageBannerGridSlots;
};

export type AlertIndicatorProps = HTMLAttributes<HTMLSpanElement> & {
  status?: AlertStatus;
};

export type AlertContentProps = HTMLAttributes<HTMLDivElement>;

export type AlertMessageProps = HTMLAttributes<HTMLDivElement>;

export type AlertTitleProps = HTMLAttributes<HTMLDivElement>;

export type AlertDescriptionProps = HTMLAttributes<HTMLDivElement>;

export type AlertActionProps = HTMLAttributes<HTMLDivElement>;

export type AlertSimpleContentProps = {
  gridSlots: MessageBannerGridSlots;
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode | null;
  action?: ReactNode;
  children?: ReactNode;
};
