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
 
export const KIT_TABS_VARIANTS = ["default", "outline", "secondary"] as const;
export type KitTabsVariant = (typeof KIT_TABS_VARIANTS)[number];
export type TabsVariant = KitTabsVariant | (string & {});
 
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
  /** FLIP move. Layout box stays on the host; the recipe tweens `x` / `y` / `scaleX` / `scaleY`. */
  indicator?: TabsPartMotion;
  tab?: TabsPartMotion;
  tabText?: TabsPartMotion;
  panel?: TabsPartMotion;
};
 
export type TabsActivationMode = "automatic" | "manual";

export type TabsItem = {
  value: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};

export type TabsProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
  children?: ReactNode;
  /** Data-driven tabs. Fills the list or panels that children do not already render. */
  items?: readonly TabsItem[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  orientation?: TabsOrientation;
  size?: TabsSize;
  variant?: TabsVariant;
  disabled?: boolean;
  /** `automatic` selects the tab on arrow keys. `manual` only moves focus. */
  activationMode?: TabsActivationMode;
  /**
   * Keep inactive panels mounted (hidden). Default keeps them mounted so panel `leave` can play.
   * `false` unmounts an inactive panel. A panel prop overrides this.
   */
  keepMounted?: boolean;
  classNames?: Prettify<TabsClassNames>;
  /**
   * Per-slot motion (`root`, `list`, `indicator`, `tab`, `tabText`, `panel`).
   * `indicator.change` is the FLIP move (`tabsIndicatorMove`). Do not tween `width` / `left`.
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
  | "activationMode"
  | "keepMounted"
>;
 
export type TabsListProps = HTMLAttributes<HTMLDivElement> & {
  /** Overrides the root `classNames` map for this list and its tabs. */
  classNames?: Prettify<TabsClassNames>;
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
  /** Keeps this panel mounted while another tab is selected. Overrides the root `keepMounted`. */
  keepMounted?: boolean;
  motion?: Prettify<TabsPartMotion>;
  /**
   * Handle for this panel's nested scope. `play()` looks for `root` (skip) —
   * use `playSlot("panel")`.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
export type TabsContextValue = {
  value: string | null;
  setValue: (next: string) => void;
  orientation: TabsOrientation;
  size: TabsSize;
  variant: TabsVariant;
  baseId: string;
  disabled: boolean;
  activationMode: TabsActivationMode;
  keepMounted: boolean;
  tabElementsRef: RefObject<Map<string, HTMLButtonElement>>;
  layoutEpoch: number;
  notifyTabLayout: () => void;
};
 
export type TabsClassNamesProviderProps = {
  classNames?: Prettify<TabsClassNames>;
  children: ReactNode;
};
 