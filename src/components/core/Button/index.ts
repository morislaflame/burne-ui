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
  ButtonSize,
  ButtonVariant,
  ButtonStatus,
  ButtonClassNames,
  ButtonMotion,
  ButtonPartMotion,
  ButtonContentProps,
  ButtonLabelProps,
  ButtonIconProps,
  ButtonTextProps,
  ButtonLoaderProps,
  ButtonSuccessProps,
  ButtonErrorProps,
} from "./Button";
 