export function toggleOptionListSelection(
  current: string[],
  itemValue: string,
  multiple: boolean,
): string[] {
  if (multiple) {
    const next = [...current];
    const index = next.indexOf(itemValue);
    if (index >= 0) next.splice(index, 1);
    else next.push(itemValue);
    return next;
  }

  return current.includes(itemValue) ? [] : [itemValue];
}
