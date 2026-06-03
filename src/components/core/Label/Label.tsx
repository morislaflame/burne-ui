import type { HTMLAttributes, LabelHTMLAttributes, ReactNode } from "react";

import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

import { useOptionalFieldLabelContext } from "./fieldLabelContext";

const LABEL_WRAP = "inline-flex flex-wrap items-baseline gap-x-xsmall gap-y-0";

export type LabelProps = Omit<LabelHTMLAttributes<HTMLLabelElement>, "children"> & {
  children?: ReactNode;
  isRequired?: boolean;
};

function LabelContent({
  children,
  isRequired,
}: {
  children?: ReactNode;
  isRequired: boolean;
}) {
  return (
    <>
      <Text as="span" variant="base" className="font-medium">
        {children}
      </Text>
      {isRequired ? (
        <span className="text-danger" aria-hidden>
          *
        </span>
      ) : null}
    </>
  );
}

export function Label({
  children,
  className,
  isRequired: isRequiredProp,
  htmlFor: htmlForProp,
  id: idProp,
  ...rest
}: LabelProps) {
  const ctx = useOptionalFieldLabelContext();
  const htmlFor = htmlForProp ?? ctx?.controlId;
  const id = idProp ?? ctx?.labelId;
  const isRequired = isRequiredProp ?? ctx?.isRequired ?? false;

  if (htmlFor != null) {
    return (
      <label htmlFor={htmlFor} className={cn(LABEL_WRAP, className)} {...rest}>
        <LabelContent isRequired={isRequired}>{children}</LabelContent>
      </label>
    );
  }

  const spanRest = rest as HTMLAttributes<HTMLSpanElement>;

  return (
    <span id={id} className={cn(LABEL_WRAP, className)} {...spanRest}>
      <LabelContent isRequired={isRequired}>{children}</LabelContent>
    </span>
  );
}

/** Маркер для Switch: текст забирает корень, сам не рендерится. */
export function LabelSlot(_props: LabelProps) {
  return null;
}

LabelSlot.displayName = "Label";

export type LabelComponent = typeof Label & { Slot: typeof LabelSlot };

export const LabelWithSlot = Object.assign(Label, { Slot: LabelSlot }) as LabelComponent;
