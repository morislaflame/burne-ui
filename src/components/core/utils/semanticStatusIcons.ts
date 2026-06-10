import type { IconType } from "react-icons";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoInformationCircleOutline,
  IoWarning,
} from "react-icons/io5";

/** Семантические статусы с собственной иконкой и цветом (размер задаётся в компоненте через `className`). */
export type SemanticStatus = "danger" | "success" | "info" | "warning";

export const SEMANTIC_STATUS_ICONS: Record<SemanticStatus, IconType> = {
  danger: IoCloseCircleOutline,
  success: IoCheckmarkCircleOutline,
  info: IoInformationCircleOutline,
  warning: IoWarning,
};
