import type { IconType } from "react-icons";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoInformationCircleOutline,
  IoWarning,
} from "react-icons/io5";

/** Semantic statuses with their own icon and color (size set in component via `className`). */
export type SemanticStatus = "danger" | "success" | "info" | "warning";

export const SEMANTIC_STATUS_ICONS: Record<SemanticStatus, IconType> = {
  danger: IoCloseCircleOutline,
  success: IoCheckmarkCircleOutline,
  info: IoInformationCircleOutline,
  warning: IoWarning,
};
