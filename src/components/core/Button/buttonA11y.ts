import type { ButtonAsyncState } from "./buttonTypes";

export function buttonAriaBusy(asyncState: ButtonAsyncState): boolean {
  return asyncState === "loading";
}
