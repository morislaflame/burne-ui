
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

import "@testing-library/jest-dom/vitest";

import { resetBodyScrollLockForTests } from "@/components/core/utils/bodyScrollLock";

import { setReducedMotion } from "./helpers";

function installResizeObserver() {
  if (typeof globalThis.ResizeObserver !== "undefined") return;
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
}

function installDialogEscape() {
  // happy-dom implements showModal/close but does not fire `cancel` on Escape.
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Escape") return;
      const open = [...document.querySelectorAll("dialog[open]")] as HTMLDialogElement[];
      const top = open.at(-1);
      if (!top) return;
      const cancel = new Event("cancel", { cancelable: true });
      if (top.dispatchEvent(cancel)) {
        top.close();
      }
    },
    true);
}

function normalizeTransform(value: unknown): string {
  if (typeof value !== "string" || value === "" || value === "none") return "none";
  if (value.startsWith("matrix")) return value;
  return "none";
}

/** GSAP CSSPlugin parses getComputedStyle().transform as a matrix(); happy-dom keeps `translate()`. */
function installComputedStyleForGsap() {
  const original = window.getComputedStyle.bind(window);
  window.getComputedStyle = ((elt: Element, pseudoElt?: string | null) => {
    const style = original(elt, pseudoElt);
    return new Proxy(style, {
      get(target, prop, receiver) {
        if (prop === "transform" || prop === "webkitTransform" || prop === "WebkitTransform") {
          return normalizeTransform(Reflect.get(target, prop, receiver));
        }
        if (prop === "getPropertyValue") {
          return (name: string) => {
            const value = target.getPropertyValue(name);
            if (
              name === "transform" ||
              name === "-webkit-transform" ||
              name === "webkitTransform"
            ) {
              return normalizeTransform(value);
            }
            return value;
          };
        }
        const value = Reflect.get(target, prop, receiver);
        if (typeof value === "function") return value.bind(target);
        return value;
      },
    });
  }) as typeof window.getComputedStyle;
}

function installFocusOptions() {
  const nativeFocus = HTMLElement.prototype.focus;
  HTMLElement.prototype.focus = function focus(options?: FocusOptions) {
    try {
      nativeFocus.call(this, options);
    } catch {
      nativeFocus.call(this);
    }
  };
}

installComputedStyleForGsap();
installResizeObserver();
installDialogEscape();
installFocusOptions();
setReducedMotion(true);

if (!window.visualViewport) {
  Object.defineProperty(window, "visualViewport", {
    configurable: true,
    value: {
      width: 1024,
      height: 768,
      offsetLeft: 0,
      offsetTop: 0,
      pageLeft: 0,
      pageTop: 0,
      scale: 1,
      addEventListener() {},
      removeEventListener() {},
    },
  });
}

afterEach(() => {
  cleanup();
  setReducedMotion(true);
  resetBodyScrollLockForTests();
});
