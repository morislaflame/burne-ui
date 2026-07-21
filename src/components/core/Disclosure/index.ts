import {
  DisclosureContent,
  DisclosureHandleInner,
  DisclosureRoot,
  DisclosureTrigger,
} from "./Disclosure";
import { DisclosureGroup } from "./disclosureGroup";

export const Disclosure = Object.assign(DisclosureRoot, {
  Trigger: DisclosureTrigger,
  Handle: DisclosureHandleInner,
  Content: DisclosureContent,
  Group: DisclosureGroup,
});

export type {
  DisclosureProps,
  DisclosureGroupProps,
  DisclosureTriggerProps,
  DisclosureHandleProps,
  DisclosureContentProps,
  DisclosureVariant,
  DisclosureSize,
  DisclosureIconPos,
  DisclosureClassNames,
} from "./disclosureTypes";
