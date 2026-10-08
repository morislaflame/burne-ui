import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type KeyboardEvent,
  type OlHTMLAttributes,
  type PointerEventHandler,
  type ReactNode,
  type Ref,
} from "react";

import { dataFlag } from "@/components/core/utils/dataContract";
import { focusKeyboard } from "@/components/core/utils/focusElement";
import { KitCheckmarkSharp } from "@/components/core/utils/kitIcons";
import { mergeRefs } from "@/components/core/utils/mergeRefs";

import { stepperKeyDelta, stepperCurrent } from "./stepperA11y";
import { useStepperSlotMotion, useStepperRootMotion } from "./stepperAnimations";
import { isStepperItem, stepperStepSelectable, stepperStepState } from "./stepperAPI";
import {
  StepperItemProvider,
  useStepperClassNames,
  useStepperContext,
  useStepperItemContext,
} from "./stepperContext";
import {
  stepperDescriptionClass,
  stepperIconClass,
  stepperIndicatorClass,
  stepperItemClass,
  stepperRootClass,
  stepperSeparatorClass,
  stepperTitleClass,
  stepperTriggerClass,
} from "./stepperStyles";
import type {
  StepperDescriptionProps,
  StepperIndicatorProps,
  StepperItemProps,
  StepperStep,
  StepperTitleProps,
} from "./stepperTypes";

function pointerProps<T extends HTMLElement>(props: {
  onPointerOver?: PointerEventHandler<T>;
  onPointerOut?: PointerEventHandler<T>;
  onPointerDown?: PointerEventHandler<T>;
  onPointerUp?: PointerEventHandler<T>;
}) {
  return props;
}

export const StepperIndicator = forwardRef<HTMLSpanElement, StepperIndicatorProps>(
  function StepperIndicator({ className, children, motion, ...rest }, ref) {
    const { orientation, size } = useStepperContext();
    const item = useStepperItemContext();
    const slotClass = useStepperClassNames().indicator;
    const { onPointerOver, onPointerOut, onPointerDown, onPointerUp, ...dom } = rest;
    const part = useStepperSlotMotion<HTMLSpanElement>({
      slot: "indicator",
      motion,
      forwardedRef: ref,
      ...pointerProps({ onPointerOver, onPointerOut, onPointerDown, onPointerUp }),
    });
    const mark = children ?? (
      item.state === "checked" ? (
        <span className={stepperIconClass(size)}>
          <KitCheckmarkSharp />
        </span>
      ) : (
        item.index + 1
      )
    );

    return (
      <span
        ref={part.setRef}
        {...dom}
        {...part.pointerHandlers}
        className={stepperIndicatorClass(orientation, size, slotClass, className)}
      >
        {mark}
      </span>
    );
  },
);
StepperIndicator.displayName = "StepperIndicator";

export const StepperTitle = forwardRef<HTMLSpanElement, StepperTitleProps>(
  function StepperTitle({ className, motion, ...rest }, ref) {
    const { orientation, size } = useStepperContext();
    const slotClass = useStepperClassNames().title;
    const { onPointerOver, onPointerOut, onPointerDown, onPointerUp, ...dom } = rest;
    const part = useStepperSlotMotion<HTMLSpanElement>({
      slot: "title",
      motion,
      forwardedRef: ref,
      ...pointerProps({ onPointerOver, onPointerOut, onPointerDown, onPointerUp }),
    });

    return (
      <span
        ref={part.setRef}
        {...dom}
        {...part.pointerHandlers}
        className={stepperTitleClass(orientation, size, slotClass, className)}
      />
    );
  },
);
StepperTitle.displayName = "StepperTitle";

export const StepperDescription = forwardRef<HTMLSpanElement, StepperDescriptionProps>(
  function StepperDescription({ className, motion, ...rest }, ref) {
    const { orientation } = useStepperContext();
    const slotClass = useStepperClassNames().description;
    const { onPointerOver, onPointerOut, onPointerDown, onPointerUp, ...dom } = rest;
    const part = useStepperSlotMotion<HTMLSpanElement>({
      slot: "description",
      motion,
      forwardedRef: ref,
      ...pointerProps({ onPointerOver, onPointerOut, onPointerDown, onPointerUp }),
    });

    return (
      <span
        ref={part.setRef}
        {...dom}
        {...part.pointerHandlers}
        className={stepperDescriptionClass(orientation, slotClass, className)}
      />
    );
  },
);
StepperDescription.displayName = "StepperDescription";

function StepperSeparator() {
  const { orientation, size } = useStepperContext();
  const slotClass = useStepperClassNames().separator;
  const part = useStepperSlotMotion<HTMLSpanElement>({ slot: "separator" });

  return (
    <span
      ref={part.setRef}
      aria-hidden
      {...part.pointerHandlers}
      className={stepperSeparatorClass(orientation, size, slotClass)}
    />
  );
}

export const StepperItem = forwardRef<HTMLLIElement, StepperItemProps>(
  function StepperItem(
    { value, title, description, className, children, motion, index = 0, isLast = false },
    ref,
  ) {
    const root = useStepperContext();
    const slotClass = useStepperClassNames().item;
    const state = stepperStepState(index, root.currentIndex);
    const selectable = stepperStepSelectable(index, root.currentIndex, root.linear);
    const tabStop = selectable && (index === root.currentIndex || (root.currentIndex < 0 && index === 0));
    const part = useStepperSlotMotion<HTMLLIElement>({
      slot: "item",
      motion,
      forwardedRef: ref,
    });
    function onStepKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
      const list = event.currentTarget.closest("ol");
      if (!list) return;
      const delta = stepperKeyDelta(event.key, root.orientation, getComputedStyle(list).direction === "rtl");
      if (delta == null) return;
      const buttons = [...list.querySelectorAll<HTMLButtonElement>("button:not(:disabled)")];
      const current = buttons.indexOf(event.currentTarget);
      if (current < 0) return;
      const next = delta === "start" ? 0 : delta === "end" ? buttons.length - 1 : current + delta;
      const button = buttons[next];
      if (!button || next === current) return;
      event.preventDefault();
      focusKeyboard(button);
      const nextValue = button.getAttribute("data-value");
      if (nextValue) root.select(nextValue);
    }

    const body = children ?? (
      <>
        <StepperIndicator />
        {title != null ? <StepperTitle>{title}</StepperTitle> : null}
        {description != null ? <StepperDescription>{description}</StepperDescription> : null}
      </>
    );

    return (
      <li
        ref={part.setRef}
        {...part.pointerHandlers}
        className={stepperItemClass(root.orientation, isLast, slotClass, className)}
        data-state={state}
      >
        <StepperItemProvider value={{ index, value, state, selectable, isLast }}>
          <button
            type="button"
            disabled={!selectable}
            tabIndex={selectable ? (tabStop ? 0 : -1) : undefined}
            data-value={value}
            data-disabled={dataFlag(!selectable)}
            aria-current={stepperCurrent(state === "active")}
            className={stepperTriggerClass(root.orientation)}
            onClick={() => root.select(value)}
            onKeyDown={onStepKeyDown}
          >
            {body}
          </button>
          {isLast ? null : <StepperSeparator />}
        </StepperItemProvider>
      </li>
    );
  },
);
StepperItem.displayName = "StepperItem";

function renderCompound(children: ReactNode) {
  const items = Children.toArray(children);
  const count = items.filter((child) => isStepperItem(child)).length;
  let index = 0;
  return items.map((child) => {
    if (!isValidElement<StepperItemProps>(child) || !isStepperItem(child)) return child;
    const current = index;
    index += 1;
    return cloneElement(child, {
      index: current,
      isLast: current === count - 1,
    });
  });
}

function renderSimple(steps: readonly StepperStep[]) {
  return steps.map((step, index) => (
    <StepperItem
      key={step.value}
      value={step.value}
      index={index}
      isLast={index === steps.length - 1}
      title={step.title}
      description={step.description}
    />
  ));
}

export const StepperList = forwardRef<
  HTMLOListElement,
  OlHTMLAttributes<HTMLOListElement> & {
    compound: boolean;
    steps?: readonly StepperStep[];
    children?: ReactNode;
  }
>(function StepperList({ compound, steps, children, className, ...rest }, ref) {
  const root = useStepperContext();
  const slotClass = useStepperClassNames().root;
  const { onPointerOver, onPointerOut, onPointerDown, onPointerUp, ...dom } = rest;
  const part = useStepperRootMotion({
    onPointerOver: onPointerOver as PointerEventHandler<HTMLOListElement>,
    onPointerOut: onPointerOut as PointerEventHandler<HTMLOListElement>,
    onPointerDown: onPointerDown as PointerEventHandler<HTMLOListElement>,
    onPointerUp: onPointerUp as PointerEventHandler<HTMLOListElement>,
  });
  const setRef = mergeRefs(ref, part.setRef);

  return (
    <ol
      ref={setRef as Ref<HTMLOListElement>}
      {...dom}
      {...part.pointerHandlers}
      className={stepperRootClass(root.orientation, slotClass, className)}
      data-orientation={root.orientation}
      data-size={root.size}
    >
      {compound ? renderCompound(children) : renderSimple(steps ?? [])}
    </ol>
  );
});
