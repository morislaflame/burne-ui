import type { MotionValue } from "@/components/core/utils/slotMotion";
import type {
  ChangeEvent,
  FocusEvent,
  ForwardedRef,
  InputHTMLAttributes,
  KeyboardEvent,
  MutableRefObject,
  RefObject,
} from "react";
import type { Prettify } from "@/utils/prettify";
 
import type { ButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupTypes";
import type { ComponentSize } from "@/components/core/utils/sizeLayout";
 
export type SearchInputSize = ComponentSize;
 
export const KIT_SEARCH_INPUT_VARIANTS = ["default", "outline", "secondary"] as const;
export type KitSearchInputVariant = (typeof KIT_SEARCH_INPUT_VARIANTS)[number];
export type SearchInputVariant = KitSearchInputVariant | (string & {});
 
export type SearchInputClassNames = {
  root?: string;
  icon?: string;
  input?: string;
  clear?: string;
  /** Collapsed expand control (`role=button` overlay). */
  expandTrigger?: string;
};
 
export type SearchInputPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};
 
export type SearchInputMotion = {
  root?: SearchInputPartMotion;
  icon?: Pick<SearchInputPartMotion, "enter" | "leave" | "hoverIn" | "hoverOut">;
  clear?: SearchInputPartMotion;
  input?: SearchInputPartMotion;
  expandTrigger?: SearchInputPartMotion;
};
 
export type SearchSizeLayout = {
  defaultExpandedW: number;
  iconBox: number;
  padX: number;
  iconClass: string;
  controlPad: string;
  shellWCollapsed: string;
  shellH: string;
  clearTap: number;
  clearIconClass: string;
  textGapClear: number;
};
 
export type SearchInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> & {
  size?: SearchInputSize;
  variant?: SearchInputVariant;
  expandedWidth?: number;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  collapseOnBlur?: boolean;
  ripple?: boolean;
  groupSegment?: ButtonGroupSegment;
  "aria-label"?: string;
  /** `aria-invalid` and `data-invalid` without a message. Native `aria-invalid` still wins when it is true. */
  invalid?: boolean;
  classNames?: Prettify<SearchInputClassNames>;
  /**
   * Per-slot motion (`root`, `icon`, `clear`, `input`, `expandTrigger`).
   * Expand/collapse: `root` / `icon` `enter` / `leave` (`searchExpand` / `searchIconShift`).
   * `searchExpand` tweens shell `width` (kit layout exception), not `scaleX`.
   */
  motion?: Prettify<SearchInputMotion>;
};
 
export type UseSearchInputRootStateProps = {
  size?: SearchInputSize;
  variant?: SearchInputVariant;
  expandedWidth?: number;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  collapseOnBlur?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  value?: InputHTMLAttributes<HTMLInputElement>["value"];
  defaultValue?: InputHTMLAttributes<HTMLInputElement>["defaultValue"];
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  id?: string;
  "aria-label"?: string;
  ripple?: boolean;
  groupSegment?: ButtonGroupSegment;
  className?: string;
  classNames?: Prettify<SearchInputClassNames>;
  forwardedRef: ForwardedRef<HTMLInputElement>;
};
 
export type UseSearchInputAnimationsProps = {
  size: SearchInputSize;
  expanded: boolean;
  blocked: boolean;
  variant: SearchInputVariant;
  groupSegment?: ButtonGroupSegment;
  layout: SearchSizeLayout;
  targetW: number;
  motion?: SearchInputMotion;
  rootRef: RefObject<HTMLDivElement | null>;
  iconRef: RefObject<HTMLSpanElement | null>;
  pointerInsideRef: MutableRefObject<boolean>;
};
 