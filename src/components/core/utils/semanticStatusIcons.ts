import type { ComponentType } from "react";
import {
  KitCheckmarkCircleOutline,
  KitCloseCircleOutline,
  KitInformationCircleOutline,
  KitWarning,
  type KitIconProps,
} from "@/components/core/utils/kitIcons";
 
/** Shared semantic status scale (size is set by the consuming component). */
export type SemanticStatus = "default" | "danger" | "success" | "info" | "warning";
 
export const SEMANTIC_STATUS_ICONS: Record<
  Exclude<SemanticStatus, "default">,
  ComponentType<KitIconProps>
> = {
  danger: KitCloseCircleOutline,
  success: KitCheckmarkCircleOutline,
  info: KitInformationCircleOutline,
  warning: KitWarning,
};
 