import type { MotionController } from "@/components/core/utils/slotMotion/motionControllerTypes";

const nodeScopes = new WeakMap<HTMLElement, object>();
const scopeControllers = new WeakMap<object, MotionController>();

/** Live studio node → the motion scope that owns it. */
export function bindStudioNode(node: HTMLElement, scope: object): void {
  nodeScopes.set(node, scope);
}

export function unbindStudioNode(node: HTMLElement, scope: object): void {
  if (nodeScopes.get(node) === scope) nodeScopes.delete(node);
}

/** Scope → the controller the ▶ button should call. An attached app handle wins. */
export function bindStudioController(scope: object, controller: MotionController): void {
  scopeControllers.set(scope, controller);
}

/** Walk ancestors until a studio-bound node has a controller. */
export function findMotionController(node: HTMLElement | null): MotionController | null {
  let current: HTMLElement | null = node;
  while (current) {
    const scope = nodeScopes.get(current);
    if (scope) return scopeControllers.get(scope) ?? null;
    current = current.parentElement;
  }
  return null;
}
