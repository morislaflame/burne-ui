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
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";

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

export type SwitchCheckMotion = {
  check?: MotionValue;
  uncheck?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
};

export type SwitchMotion = {
  fill?: SwitchCheckMotion;
  thumb?: SwitchCheckMotion;
  iconOff?: SwitchCheckMotion;
  iconOn?: SwitchCheckMotion;
  track?: SwitchCheckMotion;
  label?: SwitchCheckMotion;
  hint?: SwitchCheckMotion;
  error?: SwitchCheckMotion;
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
  /** `null` until `Switch.Control` syncs (compound). Chrome `check`/`uncheck` wait for this. */
  mergedChecked: boolean | null;
  setMergedChecked: (next: boolean) => void;
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
    /**
     * Forwarded to an auto-created `Switch.Track` (simple / Control without a Track child).
     * Explicit `<Switch.Track motionController>` wins on that nested host.
     */
    motionController?: MotionController;
  } & MotionStateHostProps;

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
  motion?: Prettify<MotionMapWithEvents<SwitchMotion>>;
  /**
   * Handle for this Track nested host (`track` / `fill` / `thumb` / `iconOn` / `iconOff`).
   * Simple API: pass `motionController` on `Switch` — it is forwarded here.
   * There is no `root` on this scope — `play()` skips; use `playSlot("track")`.
   */
  motionController?: MotionController;
} & MotionStateHostProps;

export type SwitchFillProps = HTMLAttributes<HTMLSpanElement> & {
  motion?: Prettify<SwitchCheckMotion>;
};

export type SwitchThumbProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
  motion?: Prettify<SwitchCheckMotion>;
};

export type SwitchIconWhen = "off" | "on";

export type SwitchIconProps = HTMLAttributes<HTMLSpanElement> & {
  when: SwitchIconWhen;
  children?: ReactNode;
  motion?: Prettify<SwitchCheckMotion>;
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
  /**
   * Per-slot motion (`track`, `fill`, `thumb`, `iconOn`, `iconOff`, `label`, `hint`, `error`).
   * Track is the nested fill host. Chrome registers on the Root scope.
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   * Simple API: `motionController` is forwarded to `Switch.Track`.
   * Compound: this handle attaches to the Root chrome scope; pass another handle on `Track`.
   */
  motion?: Prettify<MotionMapWithEvents<SwitchMotion>>;
  /**
   * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
   * Simple API: forwarded to the Track nested Provider. Compound: Root chrome scope.
   * Not placed on the DOM.
   */
  motionController?: MotionController;
  onPointerDown?: (e: PointerEvent<HTMLLabelElement>) => void;
} & MotionStateHostProps;

export type SwitchSimpleProps = SwitchProps & SwitchControlProps;

export type SwitchContentProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export type SwitchLabelProps = Omit<LabelProps, "htmlFor" | "motion"> & {
  motion?: Prettify<SwitchCheckMotion>;
};

export type SwitchHintProps = Omit<FieldHintProps, "id" | "as" | "motion"> & {
  motion?: Prettify<SwitchCheckMotion>;
};

export type SwitchErrorProps = Omit<FieldErrorProps, "id" | "as" | "motion"> & {
  motion?: Prettify<SwitchCheckMotion>;
};

export type SwitchClassNamesProviderProps = {
  classNames?: Prettify<SwitchClassNames>;
  children: ReactNode;
};

export type UseSwitchRootStateProps = Omit<
  SwitchProps,
  "className" | "classNames" | "onPointerDown" | "motion" | "motionController" | "motionState" | "motionPayload" | "playInitialState"
> &
  Partial<Omit<SwitchControlProps, "motionController">>;

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
  travelPxRef: RefObject<number>;
  trackRef: RefObject<HTMLSpanElement | null>;
  trackFillRef: RefObject<HTMLSpanElement | null>;
  thumbRef: RefObject<HTMLSpanElement | null>;
  thumbShellRef: RefObject<HTMLSpanElement | null>;
  iconOffRef: RefObject<HTMLSpanElement | null>;
  iconOnRef: RefObject<HTMLSpanElement | null>;
};
