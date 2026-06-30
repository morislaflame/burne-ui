export function toggleButtonRole({
  inGroup,
  isSingleGroup,
}: {
  inGroup: boolean;
  isSingleGroup: boolean;
}) {
  return inGroup && isSingleGroup ? ("radio" as const) : undefined;
}

export function toggleButtonAriaPressed({
  inGroup,
  isSingleGroup,
  pressed,
}: {
  inGroup: boolean;
  isSingleGroup: boolean;
  pressed: boolean;
}) {
  return !inGroup || !isSingleGroup ? pressed : undefined;
}

export function toggleButtonAriaChecked({
  inGroup,
  isSingleGroup,
  pressed,
}: {
  inGroup: boolean;
  isSingleGroup: boolean;
  pressed: boolean;
}) {
  return inGroup && isSingleGroup ? pressed : undefined;
}
