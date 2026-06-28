
export function sliderThicknessToCss(thickness: number | string): string {
  return typeof thickness === "number" ? `${thickness}px` : thickness;
}
