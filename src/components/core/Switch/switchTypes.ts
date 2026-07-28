import type {
  HTMLAttributes,
  InputHTMLAttributes,
  KeyboardEvent,
  LabelHTMLAttributes,
  PointerEvent,
  ReactNode,
  RefObject,
} from "react";
import type { Prettify } from "@/utils/prettify";

import type { FieldErrorProps, FieldHintProps } from "@/components/core/Field";
import type { LabelProps } from "@/components/core/Label";

import type { SwitchSize } from "./switchGeometry";

export type { SwitchSize };

export type SwitchLabelPosition = "left" | "right";

export type SwitchClassNames = {
  root?: string;
  control?: string;
  input?: string;
  track?: string;
  fill?: string;
  thumb?: string;
  thumbShell?: string;
  icon?: string;
  content?: string;
  label?: string;
  labelText?: string;
  hint?: string;
  error?: string;
  simpleLabelWrap?: string;
  simpleLabelText?: string;
};

export type SwitchFieldContextValue = {
  switchId: string;
  hintId: string;
  errorId: string;
  size: SwitchSize;
  labelPosition: SwitchLabelPosition;
  disabled?: boolean;
  isCompound: boolean;
  hasCompoundHint: boolean;
  hasCompoundError: boolean;
  hasTextColumn: boolean;
  hintConnected: boolean;
  errorConnected: boolean;
  useInlineCompoundMotion: boolean;
  textMotionRef: RefObject<HTMLElement | null>;
  setSqueezeToken: (fn: (t: number) => number) => void;
};

export type SwitchTrackContextValue = {
  checked: boolean;
  disabled?: boolean;
  size: SwitchSize;
  color?: string;
  gloss?: boolean;
  trackFillRef: RefObject<HTMLSpanElement | null>;
  thumbRef: RefObject<HTMLSpanElement | null>;
  thumbShellRef: RefObject<HTMLSpanElement | null>;
  iconOffRef: RefObject<HTMLSpanElement | null>;
  iconOnRef: RefObject<HTMLSpanElement | null>;
};

export type SwitchControlProps = Omit<
  LabelHTMLAttributes<HTMLLabelElement>,
  "children" | "htmlFor" | "onChange"
> &
  Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "children" | "className"> & {
    size?: SwitchSize;
    thickness?: number | string;
    iconOff?: ReactNode;
    iconOn?: ReactNode;
    color?: string;
    gloss?: boolean;
    className?: string;
    classNames?: Prettify<
      Pick<
        SwitchClassNames,
        "control" | "input" | "track" | "fill" | "thumb" | "thumbShell" | "icon"
      >
    >;
    children?: ReactNode;
  };

export type SwitchTrackProps = HTMLAttributes<HTMLSpanElement> & {
  size: SwitchSize;
  thickness?: number | string;
  checked?: boolean;
  disabled?: boolean;
  color?: string;
  squeezeToken?: number;
  iconOff?: ReactNode;
  iconOn?: ReactNode;
  gloss?: boolean;
  classNames?: Prettify<
    Pick<SwitchClassNames, "track" | "fill" | "thumb" | "thumbShell" | "icon">
  >;
};

export type SwitchFillProps = HTMLAttributes<HTMLSpanElement>;

export type SwitchThumbProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

export type SwitchIconWhen = "off" | "on";

export type SwitchIconProps = HTMLAttributes<HTMLSpanElement> & {
  when: SwitchIconWhen;
  children?: ReactNode;
};

export type SwitchProps = Omit<
  LabelHTMLAttributes<HTMLLabelElement>,
  "children" | "htmlFor" | "onChange" | "onPointerDown"
> & {
  children?: ReactNode;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  labelPosition?: SwitchLabelPosition;
  size?: SwitchSize;
  disabled?: boolean;
  className?: string;
  classNames?: Prettify<SwitchClassNames>;
  onPointerDown?: (e: PointerEvent<HTMLLabelElement>) => void;
};

export type SwitchSimpleProps = SwitchProps & SwitchControlProps;

export type SwitchContentProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export type SwitchLabelProps = Omit<LabelProps, "htmlFor">;

export type SwitchHintProps = Omit<FieldHintProps, "id" | "as">;

export type SwitchErrorProps = Omit<FieldErrorProps, "id" | "as">;

export type SwitchClassNamesProviderProps = {
  classNames?: Prettify<SwitchClassNames>;
  children: ReactNode;
};

export type UseSwitchRootStateProps = Omit<SwitchProps, "className" | "classNames" | "onPointerDown"> &
  Partial<SwitchControlProps>;

export type UseSwitchAnimationsProps = {
  isDisabled?: boolean;
  enableTextMotion: boolean;
  textMotionRef: RefObject<HTMLElement | null>;
  onPointerDown?: (e: PointerEvent<HTMLLabelElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLLabelElement>) => void;
};

export type UseSwitchTrackAnimationsProps = {
  checked: boolean;
  disabled?: boolean;
  size: SwitchSize;
  thickness?: number | string;
  squeezeToken: number;
  trackRef: RefObject<HTMLSpanElement | null>;
  trackFillRef: RefObject<HTMLSpanElement | null>;
  thumbRef: RefObject<HTMLSpanElement | null>;
  thumbShellRef: RefObject<HTMLSpanElement | null>;
  iconOffRef: RefObject<HTMLSpanElement | null>;
  iconOnRef: RefObject<HTMLSpanElement | null>;
};
