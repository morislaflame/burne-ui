/** Общая обёртка секций модалки: padding на контейнере, gap между Header / Body / Footer. */
export const MODAL_CONTENT_CLASS =
  "flex min-h-0 flex-1 flex-col gap-mid p-mid text-left";

export const MODAL_CONTENT_COMPACT_CLASS =
  "flex min-h-0 flex-1 flex-col gap-mid p-plus text-left";

/**
 * Скролл body модалки. Внутренний padding + отрицательный margin дают место
 * для hover-lift и тени у Input/Button, не сдвигая контент и не ломая gap секций.
 */
export const MODAL_BODY_SCROLL_CLASS =
  "min-h-0 flex-1 overflow-y-auto p-small -m-small";
