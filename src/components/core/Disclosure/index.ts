import {
  DisclosureChevron,
  DisclosureContent,
  DisclosureHandleInner,
  DisclosureIcon,
  DisclosureRoot,
  DisclosureTrigger,
} from "./Disclosure";
import { DisclosureGroup } from "./disclosureGroup";

export const Disclosure = Object.assign(DisclosureRoot, {
  Trigger: DisclosureTrigger,
  Icon: DisclosureIcon,
  Chevron: DisclosureChevron,
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
  DisclosureIconProps,
  DisclosureChevronProps,
  DisclosureVariant,
  DisclosureSize,
  DisclosureChevronPos,
  DisclosureClassNames,
  DisclosureMotion,
  DisclosureLifecycleMotion,
  DisclosureTitleLiftMotion,
} from "./disclosureTypes";
