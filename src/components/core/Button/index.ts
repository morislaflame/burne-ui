import { ButtonRoot, ButtonContent, ButtonLabel, ButtonIcon, ButtonText, ButtonLoader, ButtonSuccess, ButtonError } from "./Button";

export const Button = Object.assign(ButtonRoot, {
  Content: ButtonContent,
  Label: ButtonLabel,
  Icon: ButtonIcon,
  Text: ButtonText,
  Loader: ButtonLoader,
  Success: ButtonSuccess,
  Error: ButtonError,
});

export type {
  ButtonProps,
  ButtonAsyncState,
  ButtonSize,
  ButtonVariant,
  ButtonStatus,
  ButtonClassNames,
  ButtonContentProps,
  ButtonLabelProps,
  ButtonIconProps,
  ButtonTextProps,
  ButtonLoaderProps,
  ButtonSuccessProps,
  ButtonErrorProps,
} from "./Button";

/** Public helper: Ripple tone for Button variant/status. Style class helpers live in `burne-ui/internal`. */
export { buttonRippleTone } from "./buttonStyles";
