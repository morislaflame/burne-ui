import { createContext, useContext } from "react";

import type { SwitchTrackContextValue } from "./switchTypes";

const SwitchTrackContext = createContext<SwitchTrackContextValue | null>(null);

export function SwitchTrackProvider({
  value,
  children,
}: {
  value: SwitchTrackContextValue;
  children: React.ReactNode;
}) {
  return (
    <SwitchTrackContext.Provider value={value}>{children}</SwitchTrackContext.Provider>
  );
}

export function useSwitchTrackContext(): SwitchTrackContextValue {
  const ctx = useContext(SwitchTrackContext);
  if (!ctx) {
    throw new Error(
      "Switch.Track, Switch.Fill, Switch.Thumb, Switch.Icon must be inside <Switch.Track>",
    );
  }
  return ctx;
}
