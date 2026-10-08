/**
 * Nested-safe body scroll lock for Dialog / Drawer / AlertDialog.
 *
 * `overflow: hidden` alone does not stop iOS rubber-band; `position: fixed` +
 * `top: -scrollY` pins the page. A ref-count keeps nested overlays from
 * restoring scroll while another modal is still open.
 */
 
type InlineSnapshot = {
  overflow: string;
  position: string;
  top: string;
  left: string;
  right: string;
  width: string;
  paddingRight: string;
  overscrollBehavior: string;
};
 
type LockSnapshot = {
  scrollY: number;
  body: InlineSnapshot;
  html: Pick<InlineSnapshot, "overflow" | "overscrollBehavior">;
};
 
let lockCount = 0;
let snapshot: LockSnapshot | null = null;
 
function getDocument(): Document | null {
  if (typeof document === "undefined") return null;
  return document;
}
 
function getWindow(): Window | null {
  if (typeof window === "undefined") return null;
  return window;
}
 
function parsePx(value: string): number {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}
 
function readInline(style: CSSStyleDeclaration): InlineSnapshot {
  return {
    overflow: style.overflow,
    position: style.position,
    top: style.top,
    left: style.left,
    right: style.right,
    width: style.width,
    paddingRight: style.paddingRight,
    overscrollBehavior: style.overscrollBehavior,
  };
}
 
function applyLock(doc: Document, win: Window): LockSnapshot {
  const body = doc.body;
  const html = doc.documentElement;
  const scrollY = win.scrollY || win.pageYOffset || 0;
  const next: LockSnapshot = {
    scrollY,
    body: readInline(body.style),
    html: {
      overflow: html.style.overflow,
      overscrollBehavior: html.style.overscrollBehavior,
    },
  };
 
  const scrollbarGap = Math.max(0, win.innerWidth - html.clientWidth);
  const paddingRight =
    parsePx(win.getComputedStyle(body).paddingRight) + scrollbarGap;
 
  body.style.position = "fixed";
  body.style.top = `-${scrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  body.style.overflow = "hidden";
  body.style.overscrollBehavior = "none";
  if (scrollbarGap > 0) {
    body.style.paddingRight = `${paddingRight}px`;
  }
 
  html.style.overflow = "hidden";
  html.style.overscrollBehavior = "none";
 
  return next;
}
 
function restoreLock(doc: Document, win: Window, prev: LockSnapshot): void {
  const body = doc.body;
  const html = doc.documentElement;
 
  body.style.overflow = prev.body.overflow;
  body.style.position = prev.body.position;
  body.style.top = prev.body.top;
  body.style.left = prev.body.left;
  body.style.right = prev.body.right;
  body.style.width = prev.body.width;
  body.style.paddingRight = prev.body.paddingRight;
  body.style.overscrollBehavior = prev.body.overscrollBehavior;
 
  html.style.overflow = prev.html.overflow;
  html.style.overscrollBehavior = prev.html.overscrollBehavior;
 
  win.scrollTo(0, prev.scrollY);
}
 
/** Acquire a body lock. Nested calls increment a counter; styles apply once. */
export function lockBodyScroll(): void {
  const doc = getDocument();
  const win = getWindow();
  if (!doc?.body || !win) return;
 
  lockCount += 1;
  if (lockCount === 1) {
    snapshot = applyLock(doc, win);
  }
}
 
/** Release one lock. Styles restore only when the count returns to 0. */
export function unlockBodyScroll(): void {
  if (lockCount === 0) return;
  lockCount -= 1;
  if (lockCount > 0 || !snapshot) return;
 
  const doc = getDocument();
  const win = getWindow();
  if (doc?.body && win) {
    restoreLock(doc, win, snapshot);
  }
  snapshot = null;
}
 
/** Test helper — live ref-count (0 when unlocked). */
export function getBodyScrollLockCountForTests(): number {
  return lockCount;
}
 
/** Test helper — release every lock and restore styles. */
export function resetBodyScrollLockForTests(): void {
  while (lockCount > 0) {
    unlockBodyScroll();
  }
}
 