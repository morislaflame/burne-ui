import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  RefObject,
} from "react";
import type { Prettify } from "@/utils/prettify";
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";

import type { ComponentSize } from "@/components/core/utils/sizeLayout";

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

export type TabsPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
  check?: MotionValue;
  uncheck?: MotionValue;
  /** Plays on `root` when the selected tab value updates. */
  change?: MotionValue;
};

export type TabsMotion = {
  root?: TabsPartMotion;
  list?: TabsPartMotion;
  tab?: TabsPartMotion;
  tabText?: TabsPartMotion;
  panel?: TabsPartMotion;
};

export type TabsProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
  children?: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: TabsOrientation;
  size?: TabsSize;
  variant?: TabsVariant;
  disabled?: boolean;
  classNames?: Prettify<TabsClassNames>;
  /**
   * Per-slot motion (`root`, `list`, `tab`, `tabText`, `panel`).
   * Indicator FLIP is kit-internal — not a public slot. Do not tween `width`/`left` of the indicator.
   * Inactive tabs default to `hoverLiftFirstLevel` + `pressSqueeze` on `tabText`.
   * Phase `change` plays on `root` when the selected value updates.
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   */
  motion?: Prettify<MotionMapWithEvents<TabsMotion>>;
  /**
   * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
   * One handle → this Tabs chrome scope (`root` / `list`). Nested `Tabs.Tab` /
   * `Tabs.Panel` are separate scopes — pass a handle there. Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;

export type UseTabsRootStateProps = Pick<
  TabsProps,
  | "value"
  | "defaultValue"
  | "onValueChange"
  | "orientation"
  | "size"
  | "variant"
  | "disabled"
>;

export type TabsListProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<TabsPartMotion>;
};

export type TabsTabProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> & {
  value: string;
  children?: ReactNode;
  asChild?: boolean;
  motion?: Prettify<TabsPartMotion>;
  /**
   * Handle for this tab's nested scope. `play()` looks for `root` (skip) —
   * use `playSlot("tab")` / `playSlot("tabText")`.
   */
  motionController?: MotionController;
} & MotionStateHostProps;

export type TabsPanelProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
  children?: ReactNode;
  motion?: Prettify<TabsPartMotion>;
  /**
   * Handle for this panel's nested scope. `play()` looks for `root` (skip) —
   * use `playSlot("panel")`.
   */
  motionController?: MotionController;
} & MotionStateHostProps;

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
  classNames?: Prettify<TabsClassNames>;
  children: ReactNode;
};
