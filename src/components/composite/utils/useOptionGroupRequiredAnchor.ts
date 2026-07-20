import { useCallback, useEffect, useRef, type DependencyList } from "react";

/**
 * First option in a required single-select group claims the native `required` attribute.
 * Resets when `resetDeps` change (e.g. isRequired, selection, group name).
 */
export function useOptionGroupRequiredAnchor(resetDeps: DependencyList) {
  const claimedRef = useRef(false);

  useEffect(() => {
    claimedRef.current = false;
    // Caller owns the reset dependency list.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resetDeps is intentional
  }, resetDeps);

  const claimRequiredAnchor = useCallback(() => {
    if (claimedRef.current) return false;
    claimedRef.current = true;
    return true;
  }, []);

  return { claimRequiredAnchor };
}
