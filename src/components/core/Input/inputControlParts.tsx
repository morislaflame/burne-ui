import type { ChangeEvent, MouseEvent, MutableRefObject, Ref } from "react";
import { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { IoFolderOpen } from "react-icons/io5";

import { joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";
import { Text } from "@/components/core/Text";
import { useOptionalButtonGroupLayout, useOptionalButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupContext";
import { useFormControlProps } from "@/components/composite/Form/useFormControlProps";
import { FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS } from "@/components/core/utils/fieldControlMobileNoZoom";
import { mergeMotionSlotMaps, useMotionPart } from "@/components/core/utils/slotMotion";
import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";

import {
  resolveInputMotionDefaults,
  resolveInputMotionParams,
  useInputShellAnimations,
} from "./inputAnimations";
import { assignInputFiles, inputSizeFromButtonSize } from "./inputAPI";
import {
  AffixSlot,
  FileGlyph,
  FileRemoveButton,
  InputFileRow,
  PasswordVisibilityAffix,
} from "./inputAffixParts";
import {
  InputMotionProvider,
  useInputClassNames,
  useOptionalInputFieldContext,
  useOptionalInputMotionScope,
} from "./inputContext";
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
import type { InputControlProps, InputPartMotion, PickedFileEntry } from "./inputTypes";

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
      motion,
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
    const slotClassNames = useInputClassNames();
    const layoutCtx = useOptionalButtonGroupLayout();
    const groupCtx = useOptionalButtonGroupSegment();
    const genId = useId();
    const id = idProp ?? fieldCtx?.inputId ?? genId;
    const status = statusProp ?? fieldCtx?.status ?? "default";
    const size =
      sizeProp ??
      fieldCtx?.size ??
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
    const pointerInsideRef = useRef(false);

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

    const parentScope = useOptionalInputMotionScope();
    const motionDefaults = useMemo(
      () => resolveInputMotionDefaults({ isGloss, blocked, groupSegment }),
      [blocked, groupSegment, isGloss],
    );
    const motionParams = useMemo(
      () =>
        resolveInputMotionParams({
          blocked,
          isGloss,
          groupSegment,
          pointerInside: pointerInsideRef,
        }),
      [blocked, groupSegment, isGloss],
    );
    const mergedMotion = mergeMotionSlotMaps(
      parentScope?.getRootMotion(),
      motion ? { shell: motion } : undefined,
    );

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

    const commitRemoveFile = useCallback(
      (file: File) => {
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
      },
      [onChange],
    );

    return (
      <InputMotionProvider motion={mergedMotion} defaults={motionDefaults} params={motionParams}>
        <InputControlSurface
          variant={variant}
          status={status}
          size={size}
          inputType={inputType}
          blocked={blocked}
          groupSegment={groupSegment}
          className={className}
          slotClassNames={slotClassNames}
          shellRef={shellRef}
          pointerInsideRef={pointerInsideRef}
          shellPartMotion={motion}
          onPointerDown={onPointerDown}
          showAffixes={!isFile}
          prefix={prefix}
          suffix={suffix}
          isPassword={isPassword}
          passwordVisible={passwordVisible}
          onTogglePassword={() => setPasswordVisible((v) => !v)}
          disabled={disabled}
          isFile={isFile}
          fileEntries={fileEntries}
          pickedFilesLength={pickedFiles.length}
          placeholder={placeholder}
          commitRemoveFile={commitRemoveFile}
          setInputRef={setInputRef}
          id={id}
          resolvedName={resolvedName}
          resolvedDisabled={resolvedDisabled}
          resolvedReadOnly={resolvedReadOnly}
          handleFileChange={handleFileChange}
          resolvedOnBlur={resolvedOnBlur}
          required={required}
          ariaInvalid={formBinding["aria-invalid"] ?? (status === "danger" ? true : undefined)}
          ariaDescribedBy={ariaDescribedBy}
          resolvedValue={resolvedValue}
          resolvedOnChange={resolvedOnChange}
          rest={rest}
        />
      </InputMotionProvider>
    );
  },
);

InputControl.displayName = "InputControl";

function InputTextControl({
  setInputRef,
  id,
  resolvedName,
  isPassword,
  passwordVisible,
  inputTypeRest,
  resolvedDisabled,
  resolvedReadOnly,
  placeholder,
  resolvedValue,
  resolvedOnChange,
  resolvedOnBlur,
  required,
  ariaInvalid,
  ariaDescribedBy,
  size,
  slotControlClass,
  rest,
}: {
  setInputRef: (node: HTMLInputElement | null) => void;
  id: string;
  resolvedName: InputControlProps["name"];
  isPassword: boolean;
  passwordVisible: boolean;
  inputTypeRest: "text" | "number" | "password" | "file";
  resolvedDisabled?: boolean;
  resolvedReadOnly?: boolean;
  placeholder?: string;
  resolvedValue: unknown;
  resolvedOnChange: InputControlProps["onChange"];
  resolvedOnBlur: InputControlProps["onBlur"];
  required: boolean;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
  size: NonNullable<InputControlProps["size"]>;
  slotControlClass?: string;
  rest: Omit<
    InputControlProps,
    | "variant"
    | "status"
    | "size"
    | "inputType"
    | "placeholder"
    | "prefix"
    | "suffix"
    | "id"
    | "disabled"
    | "readOnly"
    | "className"
    | "groupSegment"
    | "onPointerDown"
    | "onChange"
    | "onBlur"
    | "aria-describedby"
    | "name"
    | "value"
    | "motion"
  >;
}) {
  const { setRef, pointerHandlers } = useMotionPart<HTMLInputElement>({
    scope: useOptionalInputMotionScope(),
    slot: "control",
    forwardedRef: setInputRef as Ref<HTMLInputElement>,
    pointerPhases: true,
  });

  return (
    <input
      ref={setRef}
      id={id}
      name={resolvedName}
      type={isPassword ? (passwordVisible ? "text" : "password") : inputTypeRest}
      disabled={resolvedDisabled}
      readOnly={resolvedReadOnly}
      placeholder={placeholder}
      value={resolvedValue as string | number | readonly string[] | undefined}
      onChange={resolvedOnChange}
      onBlur={resolvedOnBlur}
      aria-required={required || undefined}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedBy}
      className={cn(
        INPUT_CONTROL_BASE_CLASS,
        INPUT_CONTROL_PAD[size],
        slotControlClass,
        FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS,
      )}
      {...rest}
      {...pointerHandlers}
    />
  );
}

function InputControlSurface({
  variant,
  status,
  size,
  inputType,
  blocked,
  groupSegment,
  className,
  slotClassNames,
  shellRef,
  pointerInsideRef,
  shellPartMotion,
  onPointerDown,
  showAffixes,
  prefix,
  suffix,
  isPassword,
  passwordVisible,
  onTogglePassword,
  disabled,
  isFile,
  fileEntries,
  pickedFilesLength,
  placeholder,
  commitRemoveFile,
  setInputRef,
  id,
  resolvedName,
  resolvedDisabled,
  resolvedReadOnly,
  handleFileChange,
  resolvedOnBlur,
  required,
  ariaInvalid,
  ariaDescribedBy,
  resolvedValue,
  resolvedOnChange,
  rest,
}: {
  variant: NonNullable<InputControlProps["variant"]>;
  status: NonNullable<InputControlProps["status"]>;
  size: NonNullable<InputControlProps["size"]>;
  inputType: NonNullable<InputControlProps["inputType"]>;
  blocked: boolean;
  groupSegment: InputControlProps["groupSegment"];
  className: string;
  slotClassNames: ReturnType<typeof useInputClassNames>;
  shellRef: React.RefObject<HTMLDivElement | null>;
  pointerInsideRef: MutableRefObject<boolean>;
  shellPartMotion?: InputPartMotion;
  onPointerDown?: InputControlProps["onPointerDown"];
  showAffixes: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  isPassword: boolean;
  passwordVisible: boolean;
  onTogglePassword: () => void;
  disabled?: boolean;
  isFile: boolean;
  fileEntries: PickedFileEntry[];
  pickedFilesLength: number;
  placeholder?: string;
  commitRemoveFile: (file: File) => void;
  setInputRef: (node: HTMLInputElement | null) => void;
  id: string;
  resolvedName: InputControlProps["name"];
  resolvedDisabled?: boolean;
  resolvedReadOnly?: boolean;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  resolvedOnBlur: InputControlProps["onBlur"];
  required: boolean;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
  resolvedValue: unknown;
  resolvedOnChange: InputControlProps["onChange"];
  rest: Omit<
    InputControlProps,
    | "variant"
    | "status"
    | "size"
    | "inputType"
    | "placeholder"
    | "prefix"
    | "suffix"
    | "id"
    | "disabled"
    | "readOnly"
    | "className"
    | "groupSegment"
    | "onPointerDown"
    | "onChange"
    | "onBlur"
    | "aria-describedby"
    | "name"
    | "value"
    | "motion"
  >;
}) {
  const {
    playFileRowLeave,
    bindShellRef,
    shellPointerDown,
    shellPointerUp,
    shellPointerEnter,
    shellPointerLeave,
    shellFocusCapture,
    shellBlurCapture,
    shellHoverMotionClass,
    glossDisabledAttr,
  } = useInputShellAnimations({
    shellRef,
    blocked,
    variant,
    groupSegment,
    motion: shellPartMotion,
    pointerInsideRef,
    onPointerDown,
  });

  const removePickedFile = useCallback(
    (file: File, rowEl: HTMLElement | null) => {
      if (blocked) return;
      if (!rowEl || prefersReducedMotion()) {
        commitRemoveFile(file);
        return;
      }
      void playFileRowLeave(rowEl).then(() => commitRemoveFile(file));
    },
    [blocked, commitRemoveFile, playFileRowLeave],
  );

  const onFileRowRemoveClick =
    (file: File) => (e: MouseEvent<HTMLButtonElement>) => {
      const row = e.currentTarget.closest("[data-file-row]");
      removePickedFile(file, row instanceof HTMLElement ? row : null);
    };

  const multipleFiles = pickedFilesLength > 1;
  const fileListEmpty = isFile && pickedFilesLength === 0;
  const isGloss = variant === "gloss";

  const shellSurface = inputShellSurfaceClass({ variant, status });
  const shellFileEmptySurface = fileListEmpty
    ? cn(shellSurface, !isGloss && "border-2 border-dashed")
    : null;

  return (
    <div
      ref={bindShellRef}
      data-slot="input-shell"
      role="presentation"
      onPointerDown={shellPointerDown}
      onPointerUp={shellPointerUp}
      onPointerEnter={shellPointerEnter}
      onPointerLeave={shellPointerLeave}
      onFocusCapture={shellFocusCapture}
      onBlurCapture={shellBlurCapture}
      {...glossDisabledAttr}
      className={inputShellClass({
        variant,
        status,
        blocked,
        groupSegment,
        fileListEmpty,
        size,
        shellSurface,
        shellFileEmptySurface,
        shellHoverMotionClass,
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
              <InputFileRow
                key={`${file.name}-${file.size}-${file.lastModified}`}
                className={cn(INPUT_FILE_ROW_CLASS, slotClassNames.fileRow)}
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
                <Text as="span" variant="base" className={INPUT_FILE_NAME_CLASS}>
                  {file.name}
                </Text>
                {!blocked ? (
                  <FileRemoveButton onRemove={onFileRowRemoveClick(file)} />
                ) : null}
              </InputFileRow>
            ))
          ) : (
            <InputFileRow
              className={cn(INPUT_FILE_ROW_SINGLE_CLASS, slotClassNames.fileRow)}
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
              <Text as="span" variant="base" className={INPUT_FILE_NAME_CLASS}>
                {fileEntries[0]!.file.name}
              </Text>
              {!blocked ? (
                <FileRemoveButton
                  onRemove={onFileRowRemoveClick(fileEntries[0]!.file)}
                />
              ) : null}
            </InputFileRow>
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
            aria-invalid={ariaInvalid}
            aria-describedby={ariaDescribedBy}
            className={INPUT_FILE_INPUT_CLASS}
            {...rest}
          />
        </div>
      ) : (
        <InputTextControl
          setInputRef={setInputRef}
          id={id}
          resolvedName={resolvedName}
          isPassword={isPassword}
          passwordVisible={passwordVisible}
          inputTypeRest={inputType}
          resolvedDisabled={resolvedDisabled}
          resolvedReadOnly={resolvedReadOnly}
          placeholder={placeholder}
          resolvedValue={resolvedValue}
          resolvedOnChange={resolvedOnChange}
          resolvedOnBlur={resolvedOnBlur}
          required={required}
          ariaInvalid={ariaInvalid}
          ariaDescribedBy={ariaDescribedBy}
          size={size}
          slotControlClass={slotClassNames.control}
          rest={rest}
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
          onToggle={onTogglePassword}
        />
      ) : null}
    </div>
  );
}
