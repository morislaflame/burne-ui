/** Статусный тинт стекла (как у gloss-кнопки). */
export type GlossTintStatus = "danger" | "success" | "info" | "warning";

const GLOSS_TINT_CLASS: Record<GlossTintStatus, string> = {
  danger: "gloss-tint-danger",
  success: "gloss-tint-success",
  info: "gloss-tint-info",
  warning: "gloss-tint-warning",
};

/** CSS-класс тинта для gloss-поверхности по семантическому статусу. */
export function glossStatusTintClass(
  status: string | undefined,
): string {
  if (status === "danger" || status === "success" || status === "info" || status === "warning") {
    return GLOSS_TINT_CLASS[status];
  }
  return "";
}
