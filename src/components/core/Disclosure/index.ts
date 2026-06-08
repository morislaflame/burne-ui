import { DisclosureContent, DisclosureRoot, DisclosureTrigger } from "./Disclosure";

export const Disclosure = Object.assign(DisclosureRoot, {
  Trigger: DisclosureTrigger,
  Content: DisclosureContent,
});

export { DisclosureGroup } from "./Disclosure";

export type {
  DisclosureProps,
  DisclosureGroupProps,
  DisclosureTriggerProps,
  DisclosureContentProps,
  DisclosureVariant,
  DisclosureSize,
  DisclosureIconPos,
} from "./Disclosure";
