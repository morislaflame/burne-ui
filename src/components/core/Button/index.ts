export {
  ButtonRoot,
  ButtonContent,
  ButtonLabel,
  ButtonIcon,
  ButtonText,
  ButtonLoader,
  ButtonSuccess,
  ButtonError,
  type ButtonProps,
  type ButtonAsyncState,
  type ButtonSize,
  type ButtonVariant,
  type ButtonStatus,
  type ButtonClassNames,
  type ButtonContentProps,
  type ButtonLabelProps,
  type ButtonIconProps,
  type ButtonTextProps,
  type ButtonLoaderProps,
  type ButtonSuccessProps,
  type ButtonErrorProps,
} from "./Button";

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

export { buttonRippleTone } from "./buttonStyles";
export {
  buttonRootClass,
  buttonSpinnerClass,
  controlShellClass,
} from "./buttonStyles";
