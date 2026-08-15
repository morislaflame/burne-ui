import { AvatarRoot } from "./Avatar";
import { AvatarFallback, AvatarGroup, AvatarImage } from "./avatarParts";

export const Avatar = Object.assign(AvatarRoot, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
  Group: AvatarGroup,
});

export type {
  AvatarProps,
  AvatarClassNames,
  AvatarVariant,
  AvatarSize,
  AvatarImageProps,
  AvatarFallbackProps,
  AvatarGroupProps,
  AvatarMotion,
  AvatarPartMotion,
} from "./avatarTypes";
