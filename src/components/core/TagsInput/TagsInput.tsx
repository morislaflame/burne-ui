import { useMemo } from "react";

import { Field } from "@/components/core/Field";
import { FieldLabelContext } from "@/components/core/Label/labelContext";
import { dataFlag, dataVariantProps } from "@/components/core/utils/dataContract";
import { dataInvalidValue } from "@/components/core/utils/fieldInvalid";
import { useSkinVariant } from "@/skins/skinContext";
import { cn } from "@/utils/cn";

import {
  resolveTagsInputMotionDefaults,
  resolveTagsInputMotionParams,
} from "./tagsInputAnimations";
import {
  TagsInputClassNamesProvider,
  TagsInputMotionProvider,
  TagsInputProvider,
} from "./tagsInputContext";
import { TagsInputCompoundBody, TagsInputSimpleBody } from "./tagsInputParts";
import { TAGS_INPUT_ROOT_CLASS } from "./tagsInputStyles";
import type { TagsInputProps } from "./tagsInputTypes";
import { useTagsInputRootState } from "./useTagsInputRootState";

export function TagsInputRoot({
  children,
  className,
  classNames,
  label,
  hint,
  error,
  invalid,
  id,
  name,
  required,
  status,
  size = "base",
  disabled,
  readOnly,
  placeholder,
  values,
  defaultValues,
  onValuesChange,
  variant,
  max,
  motion,
  motionController,
  motionState,
  motionPayload,
  playInitialState,
  ...rest
}: TagsInputProps) {
  const resolvedVariant = useSkinVariant(variant);
  const state = useTagsInputRootState({
    children,
    label,
    hint,
    error,
    invalid,
    id,
    name,
    required,
    status,
    size,
    disabled,
    readOnly,
    placeholder,
    values,
    defaultValues,
    onValuesChange,
    variant: resolvedVariant,
    max,
  });

  const motionDefaults = useMemo(
    () =>
      resolveTagsInputMotionDefaults({
        variant: resolvedVariant,
        disabled: state.contextValue.disabled,
      }),
    [resolvedVariant, state.contextValue.disabled],
  );
  const motionParams = useMemo(
    () =>
      resolveTagsInputMotionParams({
        variant: resolvedVariant,
        disabled: state.contextValue.disabled,
      }),
    [resolvedVariant, state.contextValue.disabled],
  );

  return (
    <TagsInputProvider value={state.contextValue}>
      <TagsInputClassNamesProvider classNames={classNames}>
        <TagsInputMotionProvider
          motion={motion}
          defaults={motionDefaults}
          params={motionParams}
          controller={motionController}
          motionState={motionState}
          motionPayload={motionPayload}
          playInitialState={playInitialState}
        >
          <FieldLabelContext.Provider value={state.fieldLabel}>
            <Field
              size={size}
              className={cn(TAGS_INPUT_ROOT_CLASS, classNames?.root, className)}
              {...rest}
              {...dataVariantProps({
                size,
                variant: resolvedVariant,
                status: state.contextValue.status,
              })}
              data-invalid={dataInvalidValue(state.contextValue.isInvalid)}
              data-disabled={dataFlag(state.contextValue.disabled)}
              data-readonly={dataFlag(state.contextValue.readOnly)}
              data-required={dataFlag(state.contextValue.required)}
            >
              {state.isCompound ? <TagsInputCompoundBody>{children}</TagsInputCompoundBody> : <TagsInputSimpleBody />}
            </Field>
          </FieldLabelContext.Provider>
        </TagsInputMotionProvider>
      </TagsInputClassNamesProvider>
    </TagsInputProvider>
  );
}

TagsInputRoot.displayName = "TagsInput";
