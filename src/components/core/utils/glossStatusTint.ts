/** Семантический статус для gloss-текста (без тинта заливки). */
export type GlossTextStatus = "danger" | "success" | "info" | "warning";

const GLOSS_TEXT_CLASS: Record<GlossTextStatus, string> = {
  danger: "gloss-text-danger",
  success: "gloss-text-success",
  info: "gloss-text-info",
  warning: "gloss-text-warning",
};

/** CSS-класс статусного текста для gloss-поверхности (без цветного фона стекла). */
export function glossStatusTextClass(status: string | undefined): string {
  if (status === "danger" || status === "success" || status === "info" || status === "warning") {
    return GLOSS_TEXT_CLASS[status];
  }
  return "";
}
