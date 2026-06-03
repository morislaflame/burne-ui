import {
  Children,
  forwardRef,
  isValidElement,
  useId,
  type FieldsetHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { cn } from "@/utils/cn";

import { joinFieldDescribedBy } from "./fieldA11y";

const FIELDSET_CLASS =
  "m-0 min-w-0 border-0 p-0 disabled:pointer-events-none disabled:opacity-55";

const FIELDSET_STACK_CLASS = "flex min-w-0 w-full flex-col gap-large";

const FIELDSET_GROUP_CLASS = "flex min-w-0 w-full flex-col gap-mid";

const FIELDSET_ACTIONS_CLASS = "flex min-w-0 w-full flex-wrap items-center gap-mid";

const LEGEND_CLASS = "m-0 block w-full max-w-full border-0 p-0";

const LEGEND_DISPLAY_NAMES = new Set([
  "FieldLegend",
  "OptionGroupLegend",
  "RadioGroup.Legend",
  "CheckboxGroup.Legend",
]);

function childDisplayName(child: ReactNode): string | undefined {
  if (!isValidElement(child)) return undefined;
  return (child.type as { displayName?: string }).displayName;
}

function isLegendChild(child: ReactNode): boolean {
  if (!isValidElement(child)) return false;
  if (child.type === "legend") return true;
  const displayName = childDisplayName(child);
  return displayName != null && LEGEND_DISPLAY_NAMES.has(displayName);
}

function isGroupChild(child: ReactNode): boolean {
  return childDisplayName(child) === "FieldSetGroup";
}

function isActionsChild(child: ReactNode): boolean {
  return childDisplayName(child) === "FieldSetActions";
}

function splitFieldSetChildren(children: ReactNode): { legend: ReactNode; body: ReactNode[] } {
  const nodes = Children.toArray(children);
  const legendIndex = nodes.findIndex(isLegendChild);

  if (legendIndex === -1) {
    return { legend: null, body: nodes };
  }

  return {
    legend: nodes[legendIndex],
    body: [...nodes.slice(0, legendIndex), ...nodes.slice(legendIndex + 1)],
  };
}

function partitionFieldSetBody(body: ReactNode[]) {
  const loose: ReactNode[] = [];
  const groups: ReactNode[] = [];
  let actions: ReactNode | null = null;

  for (const node of body) {
    if (isActionsChild(node)) {
      actions = node;
    } else if (isGroupChild(node)) {
      groups.push(node);
    } else {
      loose.push(node);
    }
  }

  return { loose, groups, actions };
}

function buildFieldSetStack(body: ReactNode[]): ReactNode[] {
  const { loose, groups, actions } = partitionFieldSetBody(body);
  const stack: ReactNode[] = [];

  if (groups.length > 0) {
    stack.push(...loose, ...groups);
  } else if (loose.length > 0) {
    stack.push(<FieldSetGroup key="field-set-group">{loose}</FieldSetGroup>);
  }

  if (actions != null) {
    stack.push(actions);
  }

  return stack;
}

export type FieldLegendProps = HTMLAttributes<HTMLLegendElement> & {
  children?: ReactNode;
};

export const FieldLegend = forwardRef<HTMLLegendElement, FieldLegendProps>(function FieldLegend(
  { className, children, ...rest },
  ref,
) {
  return (
    <legend ref={ref} className={cn(LEGEND_CLASS, className)} {...rest}>
      {children}
    </legend>
  );
});

FieldLegend.displayName = "FieldLegend";

export type FieldLegendHeaderProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

/** Обёртка для подписи и подсказки внутри `FieldLegend`. */
export function FieldLegendHeader({ children, className, ...rest }: FieldLegendHeaderProps) {
  return (
    <span className={cn("flex flex-col gap-xsmall", className)} {...rest}>
      {children}
    </span>
  );
}

export type FieldSetGroupProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

/** Основной контент fieldset: поля, списки опций, групповые ошибки. */
export const FieldSetGroup = forwardRef<HTMLDivElement, FieldSetGroupProps>(function FieldSetGroup(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn(FIELDSET_GROUP_CLASS, className)} {...rest}>
      {children}
    </div>
  );
});

FieldSetGroup.displayName = "FieldSetGroup";

export type FieldSetActionsProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

/** Кнопки и действия fieldset (submit, reset и т.д.). */
export const FieldSetActions = forwardRef<HTMLDivElement, FieldSetActionsProps>(
  function FieldSetActions({ className, children, ...rest }, ref) {
    return (
      <div ref={ref} className={cn(FIELDSET_ACTIONS_CLASS, className)} {...rest}>
        {children}
      </div>
    );
  },
);

FieldSetActions.displayName = "FieldSetActions";

export type FieldSetProps = Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "children"> & {
  children?: ReactNode;
  /** id подсказки для `aria-describedby`. */
  hintId?: string;
  /** id ошибки для `aria-describedby`. */
  errorId?: string;
  isRequired?: boolean;
};

const FieldSetRoot = forwardRef<HTMLFieldSetElement, FieldSetProps>(function FieldSetRoot(
  { children, className, hintId, errorId, isRequired, disabled, ...rest },
  ref,
) {
  const { legend, body } = splitFieldSetChildren(children);
  const stack = buildFieldSetStack(body);

  return (
    <fieldset
      ref={ref}
      disabled={disabled}
      aria-required={isRequired || undefined}
      aria-describedby={joinFieldDescribedBy(hintId, errorId)}
      className={cn(FIELDSET_CLASS, className)}
      {...rest}
    >
      {legend}
      {stack.length > 0 ? (
        <div className={cn(FIELDSET_STACK_CLASS, legend != null && "mt-large")}>{stack}</div>
      ) : null}
    </fieldset>
  );
});

export const FieldSet = Object.assign(FieldSetRoot, {
  Legend: FieldLegend,
  LegendHeader: FieldLegendHeader,
  Group: FieldSetGroup,
  Actions: FieldSetActions,
});

FieldSet.displayName = "FieldSet";

/** Стабильный id подсказки для fieldset (или переданный явно). */
export function useFieldSetHintId(providedId?: string) {
  const autoId = useId();
  return providedId ?? `${autoId}-hint`;
}

/** Стабильный id ошибки для fieldset (или переданный явно). */
export function useFieldSetErrorId(providedId?: string) {
  const autoId = useId();
  return providedId ?? `${autoId}-error`;
}
