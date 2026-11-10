import type { MouseEvent } from "react";

export const preventNav = (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
  e.preventDefault();
};
