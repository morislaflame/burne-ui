import { createContext, useContext, useMemo } from "react";

import type {
  ColorPickerClassNames,
  ColorPickerClassNamesProviderProps,
  ColorPickerContextValue,
} from "./colorPickerTypes";

const ColorPickerContext = createContext<ColorPickerContextValue | null>(null);
const ColorPickerClassNamesContext = createContext<ColorPickerClassNames>({});

export function ColorPickerProvider({
  value,
  children,
}: {
  value: ColorPickerContextValue;
  children: React.ReactNode;
}) {
  return (
    <ColorPickerContext.Provider value={value}>{children}</ColorPickerContext.Provider>
  );
}

export function ColorPickerClassNamesProvider({
  classNames,
  children,
}: ColorPickerClassNamesProviderProps) {
  const parent = useContext(ColorPickerClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <ColorPickerClassNamesContext.Provider value={merged}>
      {children}
    </ColorPickerClassNamesContext.Provider>
  );
}

export function useColorPicker(): ColorPickerContextValue {
  const ctx = useContext(ColorPickerContext);
  if (!ctx) {
    throw new Error("ColorPicker compound parts must be inside <ColorPicker>.");
  }
  return ctx;
}

export function useColorPickerClassNames(): ColorPickerClassNames {
  return useContext(ColorPickerClassNamesContext);
}
