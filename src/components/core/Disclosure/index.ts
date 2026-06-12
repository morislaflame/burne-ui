import {
  DisclosureContent,
  DisclosureHandleInner,
  DisclosureRoot,
  DisclosureTrigger,
} from "./Disclosure";

export const Disclosure = Object.assign(DisclosureRoot, {
  Trigger: DisclosureTrigger,
  Handle: DisclosureHandleInner,
  Content: DisclosureContent,
});

export { DisclosureGroup } from "./Disclosure";

export type {
  DisclosureProps,
  DisclosureGroupProps,
  DisclosureTriggerProps,
  DisclosureHandleProps,
  DisclosureContentProps,
  DisclosureVariant,
  DisclosureSize,
  DisclosureIconPos,
} from "./Disclosure";
