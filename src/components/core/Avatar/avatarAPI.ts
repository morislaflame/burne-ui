import type { AvatarSize, AvatarVariant } from "./avatarTypes";

export function letterFromLabel(label: string | undefined): string {
  const t = label?.trim();
  if (!t) return "?";
  const first = [...t][0];
  return first ? first.toLocaleUpperCase() : "?";
}

export function resolveAvatarVariant(variant?: AvatarVariant): AvatarVariant {
  return variant ?? "default";
}

export function resolveAvatarSize(size?: AvatarSize): AvatarSize {
  return size ?? "base";
}

export function resolveAvatarNickname(nickname?: string): string | undefined {
  const nick = nickname?.trim();
  return nick || undefined;
}

export function avatarHasLabel(label?: string): boolean {
  return Boolean(label?.trim());
}
