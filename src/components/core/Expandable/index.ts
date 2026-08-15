import { ExpandableChevron, ExpandableContent, ExpandableDescription, ExpandableIcon, ExpandableMessage, ExpandablePanel, ExpandableRoot, ExpandableTitle, ExpandableTrigger } from "./Expandable";

export const Expandable = Object.assign(ExpandableRoot, {
  Trigger: ExpandableTrigger,
  Message: ExpandableMessage,
  Icon: ExpandableIcon,
  Content: ExpandableContent,
  Title: ExpandableTitle,
  Description: ExpandableDescription,
  Chevron: ExpandableChevron,
  Panel: ExpandablePanel,
});

export { useExpandableContext } from "./expandableContext";

export type {
  ExpandableProps,
  ExpandableTriggerProps,
  ExpandableMessageProps,
  ExpandableIconProps,
  ExpandableContentProps,
  ExpandableTitleProps,
  ExpandableDescriptionProps,
  ExpandableChevronProps,
  ExpandablePanelProps,
  ExpandableSize,
  ExpandableVariant,
  ExpandableClassNames,
  ExpandableMotion,
  ExpandableLifecycleMotion,
  ExpandableTriggerLiftMotion,
} from "./expandableTypes";
