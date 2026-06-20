import { AvatarFallback, AvatarImage, AvatarRoot } from "./Avatar";

export const Avatar = Object.assign(AvatarRoot, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
});

export { AvatarGroup } from "./Avatar";

export type {
  AvatarProps,
  AvatarVariant,
  AvatarSize,
  AvatarImageProps,
  AvatarFallbackProps,
  AvatarGroupProps,
} from "./Avatar";
