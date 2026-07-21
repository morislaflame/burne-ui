import type { IconType } from "react-icons";
import { IoCheckmarkCircleOutline, IoCloseCircleOutline, IoInformationCircleOutline, IoWarning } from "react-icons/io5";

/** Shared semantic status scale (size is set by the consuming component). */
export type SemanticStatus = "default" | "danger" | "success" | "info" | "warning";

export const SEMANTIC_STATUS_ICONS: Record<
  Exclude<SemanticStatus, "default">,
  IconType
> = {
  danger: IoCloseCircleOutline,
  success: IoCheckmarkCircleOutline,
  info: IoInformationCircleOutline,
  warning: IoWarning,
};
