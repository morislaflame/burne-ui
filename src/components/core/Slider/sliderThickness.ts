/** CSS-значение толщины: число → px, строка — как есть (`"1rem"`, `"12px"`). */
export function sliderThicknessToCss(thickness: number | string): string {
  return typeof thickness === "number" ? `${thickness}px` : thickness;
}
