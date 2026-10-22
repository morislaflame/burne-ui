import { layoutTargetClass } from "@/skins/resolveVariantVisual";
import { cn } from "@/utils/cn";

export const APP_SHELL_ROOT_CLASS = "flex min-h-dvh w-full min-w-0 flex-col bg-background";

export const APP_SHELL_BODY_CLASS = "flex min-h-0 w-full min-w-0 flex-1";

export const APP_SHELL_MAIN_CLASS = "min-h-0 min-w-0 flex-1";

export function appShellRootClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return cn(APP_SHELL_ROOT_CLASS, layoutTargetClass("appShell.root"), slotClass, className);
}

export function appShellBodyClass({ slotClass }: { slotClass?: string }): string {
  return cn(APP_SHELL_BODY_CLASS, slotClass);
}

export function appShellMainClass({ slotClass }: { slotClass?: string }): string {
  return cn(APP_SHELL_MAIN_CLASS, slotClass);
}
