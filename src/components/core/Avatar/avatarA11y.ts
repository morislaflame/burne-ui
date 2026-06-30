export function avatarRootRole(role?: string): "group" {
  return (role as "group" | undefined) ?? "group";
}

export function avatarRootAriaLabel(label?: string): string | undefined {
  const trimmed = label?.trim();
  return trimmed || undefined;
}

export function avatarGroupRole(): "group" {
  return "group";
}

export const AVATAR_FALLBACK_ARIA_HIDDEN = true;
