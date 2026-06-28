import {
  Children,
  forwardRef,
  isValidElement,
  useId,
  type FieldsetHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import type { ComponentSize } from "@/components/core/utils/componentSize";
import { cn } from "@/utils/cn";

import { FieldSetSizeProvider, useFieldSetSize } from "./fieldSetContext";
import { FIELD_SET_SIZE_LAYOUT } from "./fieldSetSizeLayout";
import { joinFieldDescribedBy } from "./fieldA11y";

const FIELDSET_CLASS =
  "m-0 min-w-0 border-0 p-0 disabled:pointer-events-none disabled:opacity-55";

const FIELDSET_STACK_BASE_CLASS = "flex min-w-0 w-full flex-col";

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

export function FieldLegendHeader({ children, className, ...rest }: FieldLegendHeaderProps) {
  return (
    <span className={cn("flex flex-col w-fit", className)} {...rest}>
      {children}
    </span>
  );
}

export type FieldSetGroupProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export const FieldSetGroup = forwardRef<HTMLDivElement, FieldSetGroupProps>(function FieldSetGroup(
  { className, children, ...rest },
  ref,
) {
  const size = useFieldSetSize();
  const layout = FIELD_SET_SIZE_LAYOUT[size];

  return (
    <div ref={ref} className={cn("flex min-w-0 w-full flex-col", layout.groupGap, className)} {...rest}>
      {children}
    </div>
  );
});

FieldSetGroup.displayName = "FieldSetGroup";

export type FieldSetActionsProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export const FieldSetActions = forwardRef<HTMLDivElement, FieldSetActionsProps>(
  function FieldSetActions({ className, children, ...rest }, ref) {
    const size = useFieldSetSize();
    const layout = FIELD_SET_SIZE_LAYOUT[size];

    return (
      <div
        ref={ref}
        className={cn("flex flex-wrap w-fit items-center", layout.actionsGap, className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

FieldSetActions.displayName = "FieldSetActions";

export type FieldSetProps = Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "children"> & {
  children?: ReactNode;
  hintId?: string;
  errorId?: string;
  size?: ComponentSize;
};

export const FieldSetRoot = forwardRef<HTMLFieldSetElement, FieldSetProps>(function FieldSetRoot(
  { children, className, hintId, errorId, disabled, size = "base", ...rest },
  ref,
) {
  const { legend, body } = splitFieldSetChildren(children);
  const stack = buildFieldSetStack(body);
  const layout = FIELD_SET_SIZE_LAYOUT[size];

  return (
    <FieldSetSizeProvider size={size}>
      <fieldset
        ref={ref}
        disabled={disabled}
        aria-describedby={joinFieldDescribedBy(hintId, errorId)}
        className={cn(FIELDSET_CLASS, className)}
        {...rest}
      >
        {legend}
        {stack.length > 0 ? (
          <div
            className={cn(
              FIELDSET_STACK_BASE_CLASS,
              layout.stackGap,
              legend != null && layout.legendGap,
            )}
          >
            {stack}
          </div>
        ) : null}
      </fieldset>
    </FieldSetSizeProvider>
  );
});

FieldSetRoot.displayName = "FieldSet";

export function useFieldSetHintId(providedId?: string) {
  const autoId = useId();
  return providedId ?? `${autoId}-hint`;
}

export function useFieldSetErrorId(providedId?: string) {
  const autoId = useId();
  return providedId ?? `${autoId}-error`;
}

export type { ComponentSize as FieldSetSize } from "@/components/core/utils/componentSize";
