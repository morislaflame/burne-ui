export function separatorAriaOrientation(
  orientation: "horizontal" | "vertical",
): "vertical" | undefined {
  return orientation === "vertical" ? "vertical" : undefined;
}
