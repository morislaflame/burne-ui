export function popoverLabelId(popoverId: string): string {
  return `${popoverId}-label`;
}

export function popoverHintId(popoverId: string): string {
  return `${popoverId}-hint`;
}

export function resolvePopoverDescribedBy({
  contentRole,
  labelConnected,
  hintConnected,
  labelId,
  hintId,
}: {
  contentRole?: "dialog";
  labelConnected: boolean;
  hintConnected: boolean;
  labelId: string;
  hintId: string;
}): string | undefined {
  if (contentRole !== "dialog") return undefined;
  if (labelConnected && hintConnected) return `${labelId} ${hintId}`;
  if (hintConnected) return hintId;
  return undefined;
}

export function resolvePopoverLabelledBy({
  contentRole,
  labelConnected,
  labelId,
}: {
  contentRole?: "dialog";
  labelConnected: boolean;
  labelId: string;
}): string | undefined {
  if (contentRole === "dialog" && labelConnected) return labelId;
  return undefined;
}
