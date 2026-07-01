import { KbdRoot } from "./Kbd";
import { KbdGroup } from "./kbdParts";

export const Kbd = Object.assign(KbdRoot, {
  Group: KbdGroup,
});

export type {
  KbdProps,
  KbdVariant,
  KbdSize,
  KbdClassNames,
  KbdGroupProps,
} from "./Kbd";
