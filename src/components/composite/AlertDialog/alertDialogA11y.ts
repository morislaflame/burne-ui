export const ALERT_DIALOG_ROLE = "alertdialog" as const;

export const ALERT_DIALOG_TRIGGER_HASPOPUP = "dialog" as const;

export function alertDialogDescribedBy(
  hasDescription: boolean,
  descriptionId: string,
): string | undefined {
  return hasDescription ? descriptionId : undefined;
}

export function alertDialogTriggerA11y(open: boolean) {
  return {
    "aria-haspopup": ALERT_DIALOG_TRIGGER_HASPOPUP,
    "aria-expanded": open,
  } as const;
}

export function alertDialogOverlayA11yProps() {
  return { "aria-hidden": true as const };
}
