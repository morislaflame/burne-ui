import type { DrawerPlacement } from "./drawerTypes";

export const DRAWER_CLOSE_DEFAULT_ARIA_LABEL = "Закрыть";

export function drawerHandleAriaLabel(placement: DrawerPlacement): string {
  switch (placement) {
    case "bottom":
      return "Потянуть вниз для закрытия";
    case "top":
      return "Потянуть вверх для закрытия";
    case "left":
      return "Потянуть влево для закрытия";
    case "right":
      return "Потянуть вправо для закрытия";
  }
}
