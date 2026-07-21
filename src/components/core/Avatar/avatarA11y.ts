export function avatarRootRole(role?: string): "group" {
  return (role as "group" | undefined) ?? "group";
}

/** Prefer explicit `aria-label`; fall back to trimmed visual `label` (initials source). */
export function avatarRootAriaLabel(
  ariaLabel?: string,
  label?: string,
): string | undefined {
  const fromAria = ariaLabel?.trim();
  if (fromAria) return fromAria;
  const fromLabel = label?.trim();
  return fromLabel || undefined;
}

export function avatarGroupRole(): "group" {
  return "group";
}

export const AVATAR_FALLBACK_ARIA_HIDDEN = true;
