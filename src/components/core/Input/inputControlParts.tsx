import type { ChangeEvent, MouseEvent } from "react";
import { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { IoFolderOpen } from "react-icons/io5";

import { joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";
import { Text } from "@/components/core/Text";
import { useOptionalButtonGroupLayout, useOptionalButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupContext";
import { useFormControlProps } from "@/components/composite/Form/useFormControlProps";
import { useOptionalFormBindingContext } from "@/components/composite/Form/formContext";
import { FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS } from "@/components/core/utils/fieldControlMobileNoZoom";
import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";

import { animateInputFileRowExit, useInputShellMotion } from "./inputAnimations";
import { assignInputFiles, inputSizeFromButtonSize } from "./inputAPI";
import { AffixSlot, FileGlyph, FileRemoveButton, PasswordVisibilityAffix } from "./inputAffixParts";
import { useInputClassNames, useOptionalInputFieldContext } from "./inputContext";
import {
  INPUT_CONTROL_BASE_CLASS,
  INPUT_CONTROL_PAD,
  INPUT_FILE_EMPTY_ICON_CLASS,
  INPUT_FILE_EMPTY_TEXT_CLASS,
  INPUT_FILE_INPUT_CLASS,
  INPUT_FILE_NAME_CLASS,
  INPUT_FILE_PREVIEW_CLASS,
  INPUT_FILE_ROW_CLASS,
  INPUT_FILE_ROW_SINGLE_CLASS,
  inputFileEmptyAreaClass,
  inputFileFilledAreaClass,
  inputShellClass,
  inputShellSurfaceClass,
} from "./inputStyles";
import type { InputControlProps, PickedFileEntry } from "./inputTypes";

import { cn } from "@/utils/cn";

export const InputControl = forwardRef<HTMLInputElement, InputControlProps>(
  function InputControl(
    {
      variant = "default",
      status: statusProp,
      size: sizeProp,
      inputType = "text",
      placeholder,
      prefix,
      suffix,
      id: idProp,
      disabled,
      readOnly,
      className = "",
      groupSegment: groupSegmentProp,
      onPointerDown,
      onChange,
      onBlur,
      "aria-describedby": ariaDescribedByProp,
      name,
      value,
      ...rest
    },
    ref,
  ) {
    const formBinding = useFormControlProps({
      name: typeof name === "string" ? name : undefined,
      value,
      onChange: onChange as ((event: unknown) => void) | undefined,
      onBlur: onBlur as ((event: unknown) => void) | undefined,
      disabled,
      readOnly,
      type: inputType,
    });

    const resolvedName = formBinding.name ?? name;
    const resolvedValue = formBinding.bound ? formBinding.value : value;
    const resolvedOnChange = formBinding.onChange;
    const resolvedOnBlur = formBinding.onBlur;
    const resolvedDisabled = formBinding.disabled ?? disabled;
    const resolvedReadOnly = formBinding.readOnly ?? readOnly;
    const resolvedRef = formBinding.ref;

    const fieldCtx = useOptionalInputFieldContext();
    const formCtx = useOptionalFormBindingContext();
    const slotClassNames = useInputClassNames();
    const layoutCtx = useOptionalButtonGroupLayout();
    const groupCtx = useOptionalButtonGroupSegment();
    const genId = useId();
    const id = idProp ?? fieldCtx?.inputId ?? genId;
    const status = statusProp ?? fieldCtx?.status ?? "default";
    const size =
      sizeProp ??
      fieldCtx?.size ??
      formCtx?.size ??
      inputSizeFromButtonSize(groupCtx?.buttonSize ?? "base");
    const required = fieldCtx?.required ?? false;
    const hintConnected = fieldCtx?.hintConnected ?? false;
    const errorConnected = fieldCtx?.errorConnected ?? false;
    const hintId = fieldCtx?.hintId;
    const errorId = fieldCtx?.errorId;
    const ariaDescribedBy =
      ariaDescribedByProp ??
      joinFieldDescribedBy(
        hintConnected ? hintId : undefined,
        errorConnected ? errorId : undefined,
      );
    const groupSegment = layoutCtx?.segmented
      ? undefined
      : (groupSegmentProp ?? groupCtx?.segment);
    const shellRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const setInputRef = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        resolvedRef(node);
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref, resolvedRef],
    );

    const blocked = Boolean(resolvedDisabled || resolvedReadOnly);
    const isGloss = variant === "gloss";

    const shellMotion = useInputShellMotion({
      shellRef,
      blocked,
      variant,
      groupSegment,
      onPointerDown,
    });

    const isFile = inputType === "file";
    const isPassword = inputType === "password";
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [pickedFiles, setPickedFiles] = useState<File[]>([]);

    useEffect(() => {
      if (!isPassword) setPasswordVisible(false);
    }, [isPassword]);

    const fileEntries: PickedFileEntry[] = useMemo(
      () =>
        pickedFiles.map((file) => ({
          file,
          previewUrl: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : null,
        })),
      [pickedFiles],
    );

    useEffect(() => {
      const urls = fileEntries
        .map((e) => e.previewUrl)
        .filter((u): u is string => u != null);
      return () => {
        for (const u of urls) URL.revokeObjectURL(u);
      };
    }, [fileEntries]);

    useEffect(() => {
      if (!isFile) return;
      const el = inputRef.current;
      const form = el?.form;
      if (!form) return;
      const onFormReset = () => setPickedFiles([]);
      form.addEventListener("reset", onFormReset);
      return () => form.removeEventListener("reset", onFormReset);
    }, [isFile]);

    const handleFileChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const list = e.target.files;
        setPickedFiles(list ? Array.from(list) : []);
        resolvedOnChange?.(e);
      },
      [resolvedOnChange],
    );

    const removePickedFile = useCallback(
      (file: File, rowEl: HTMLElement | null) => {
        if (blocked) return;

        const commit = () => {
          setPickedFiles((prev) => {
            const next = prev.filter((f) => f !== file);
            const input = inputRef.current;
            if (input) assignInputFiles(input, next);
            if (input) {
              onChange?.({
                target: input,
                currentTarget: input,
              } as ChangeEvent<HTMLInputElement>);
            }
            return next;
          });
        };

        if (!rowEl || prefersReducedMotion()) {
          commit();
          return;
        }

        void animateInputFileRowExit(rowEl).then(commit);
      },
      [blocked, onChange],
    );

    const onFileRowRemoveClick =
      (file: File) => (e: MouseEvent<HTMLButtonElement>) => {
        const row = e.currentTarget.closest("[data-file-row]");
        removePickedFile(file, row instanceof HTMLElement ? row : null);
      };

    const multipleFiles = pickedFiles.length > 1;
    const fileListEmpty = isFile && pickedFiles.length === 0;
    const showAffixes = !isFile;

    const shellSurface = inputShellSurfaceClass({ variant, status });
    const shellFileEmptySurface = fileListEmpty
      ? cn(shellSurface, !isGloss && "border-2 border-dashed")
      : null;

    return (
      <div
        ref={shellMotion.setShellRef}
        data-slot="input-shell"
        role="presentation"
        onPointerDown={shellMotion.shellPointerDown}
        onPointerEnter={shellMotion.shellPointerEnter}
        onPointerLeave={shellMotion.shellPointerLeave}
        onFocusCapture={shellMotion.shellFocusCapture}
        onBlurCapture={shellMotion.shellBlurCapture}
        {...shellMotion.glossDisabledAttr}
        className={inputShellClass({
          variant,
          status,
          blocked,
          groupSegment,
          fileListEmpty,
          size,
          shellSurface,
          shellFileEmptySurface,
          shellHoverMotionClass: shellMotion.shellHoverMotionClass,
          className,
          slotClass: slotClassNames.shell,
        })}
      >
        {showAffixes && prefix != null ? (
          <AffixSlot side="prefix" status={status} controlSize={size}>
            {prefix}
          </AffixSlot>
        ) : null}
        {isFile ? (
          <div
            className={
              fileListEmpty
                ? inputFileEmptyAreaClass(slotClassNames.fileArea)
                : inputFileFilledAreaClass({
                    multipleFiles,
                    slotClass: slotClassNames.fileArea,
                  })
            }
          >
            {fileListEmpty ? (
              <>
                <IoFolderOpen
                  className={cn(
                    INPUT_FILE_EMPTY_ICON_CLASS,
                    slotClassNames.fileEmpty,
                  )}
                  aria-hidden
                />
                <Text
                  as="span"
                  variant="base"
                  className={cn(
                    INPUT_FILE_EMPTY_TEXT_CLASS,
                    slotClassNames.fileEmpty,
                  )}
                >
                  {placeholder ?? "Select file"}
                </Text>
              </>
            ) : multipleFiles ? (
              fileEntries.map(({ file, previewUrl }) => (
                <div
                  key={`${file.name}-${file.size}-${file.lastModified}`}
                  data-file-row=""
                  className={cn(
                    INPUT_FILE_ROW_CLASS,
                    slotClassNames.fileRow,
                  )}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt=""
                      className={cn(
                        INPUT_FILE_PREVIEW_CLASS,
                        slotClassNames.filePreview,
                      )}
                    />
                  ) : (
                    <FileGlyph />
                  )}
                  <Text
                    as="span"
                    variant="base"
                    className={INPUT_FILE_NAME_CLASS}
                  >
                    {file.name}
                  </Text>
                  {!blocked ? (
                    <FileRemoveButton onRemove={onFileRowRemoveClick(file)} />
                  ) : null}
                </div>
              ))
            ) : (
              <div
                data-file-row=""
                className={cn(
                  INPUT_FILE_ROW_SINGLE_CLASS,
                  slotClassNames.fileRow,
                )}
              >
                {fileEntries[0]!.previewUrl ? (
                  <img
                    src={fileEntries[0]!.previewUrl}
                    alt=""
                    className={cn(
                      INPUT_FILE_PREVIEW_CLASS,
                      slotClassNames.filePreview,
                    )}
                  />
                ) : (
                  <FileGlyph />
                )}
                <Text
                  as="span"
                  variant="base"
                  className={INPUT_FILE_NAME_CLASS}
                >
                  {fileEntries[0]!.file.name}
                </Text>
                {!blocked ? (
                  <FileRemoveButton
                    onRemove={onFileRowRemoveClick(fileEntries[0]!.file)}
                  />
                ) : null}
              </div>
            )}
            <input
              ref={setInputRef}
              id={id}
              name={resolvedName}
              type="file"
              disabled={resolvedDisabled}
              readOnly={resolvedReadOnly}
              onChange={handleFileChange}
              onBlur={resolvedOnBlur}
              aria-required={required || undefined}
              aria-invalid={formBinding["aria-invalid"] ?? (status === "danger" ? true : undefined)}
              aria-describedby={ariaDescribedBy}
              className={INPUT_FILE_INPUT_CLASS}
              {...rest}
            />
          </div>
        ) : (
          <input
            ref={setInputRef}
            id={id}
            name={resolvedName}
            type={isPassword ? (passwordVisible ? "text" : "password") : inputType}
            disabled={resolvedDisabled}
            readOnly={resolvedReadOnly}
            placeholder={placeholder}
            value={resolvedValue as string | number | readonly string[] | undefined}
            onChange={resolvedOnChange}
            onBlur={resolvedOnBlur}
            aria-required={required || undefined}
            aria-invalid={formBinding["aria-invalid"] ?? (status === "danger" ? true : undefined)}
            aria-describedby={ariaDescribedBy}
            className={cn(
              INPUT_CONTROL_BASE_CLASS,
              INPUT_CONTROL_PAD[size],
              slotClassNames.control,
              FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS,
            )}
            {...rest}
          />
        )}
        {showAffixes && suffix != null ? (
          <AffixSlot side="suffix" status={status} controlSize={size}>
            {suffix}
          </AffixSlot>
        ) : null}
        {showAffixes && isPassword ? (
          <PasswordVisibilityAffix
            status={status}
            controlSize={size}
            visible={passwordVisible}
            disabled={disabled}
            onToggle={() => setPasswordVisible((v) => !v)}
          />
        ) : null}
      </div>
    );
  },
);

InputControl.displayName = "InputControl";

