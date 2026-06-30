import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  RefObject,
} from "react";

import type { ComponentSize } from "@/components/core/utils/componentSize";

export type TabsOrientation = "horizontal" | "vertical";

export type TabsVariant = "default" | "outline" | "secondary" | "gloss";

export type TabsSize = ComponentSize;

export type TabsClassNames = {
  root?: string;
  list?: string;
  indicator?: string;
  tab?: string;
  tabText?: string;
  panel?: string;
};

export type TabsRootProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
  children?: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: TabsOrientation;
  size?: TabsSize;
  variant?: TabsVariant;
  disabled?: boolean;
  classNames?: TabsClassNames;
};

export type UseTabsRootStateProps = Pick<
  TabsRootProps,
  | "value"
  | "defaultValue"
  | "onValueChange"
  | "orientation"
  | "size"
  | "variant"
  | "disabled"
>;

export type TabsListProps = HTMLAttributes<HTMLDivElement>;

export type TabsTabProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> & {
  value: string;
  children?: ReactNode;
  asChild?: boolean;
};

export type TabsPanelProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
  children?: ReactNode;
};

export type TabsContextValue = {
  value: string;
  setValue: (next: string) => void;
  orientation: TabsOrientation;
  size: TabsSize;
  variant: TabsVariant;
  baseId: string;
  disabled: boolean;
  tabElementsRef: RefObject<Map<string, HTMLButtonElement>>;
  layoutEpoch: number;
  notifyTabLayout: () => void;
};

export type TabsClassNamesProviderProps = {
  classNames?: TabsClassNames;
  children: ReactNode;
};
