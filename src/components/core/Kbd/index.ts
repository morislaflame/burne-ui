import { KbdRoot } from "./Kbd";
import { KbdGroup, KbdText } from "./kbdParts";

export const Kbd = Object.assign(KbdRoot, {
  Group: KbdGroup,
  Text: KbdText,
});

export type {
  KbdProps,
  KbdVariant,
  KbdSize,
  KbdClassNames,
  KbdGroupProps,
} from "./Kbd";
