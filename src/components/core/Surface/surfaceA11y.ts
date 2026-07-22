/**
 * Surface is a presentational panel — no landmark role.
 * Callers that need a region must set `role` / name via props.
 */
export function surfaceIsLandmark(): false {
  return false;
}
