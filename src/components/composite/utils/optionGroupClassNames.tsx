import { createContext, useContext, useMemo, type ReactNode } from "react";

/** Shared slot shape for `RadioGroup` / `CheckboxGroup` — mirrors `Field.Set`. */
export type OptionGroupClassNames = {
  root?: string;
  legend?: string;
  legendHeader?: string;
  hint?: string;
  error?: string;
  list?: string;
  group?: string;
  actions?: string;
};

export type OptionGroupClassNamesProviderProps<T extends OptionGroupClassNames> = {
  classNames?: T;
  children: ReactNode;
};

/** Creates an isolated classNames context (Provider + hook) for one option-group component. */
export function createOptionGroupClassNamesContext<T extends OptionGroupClassNames>() {
  const Context = createContext<T>({} as T);

  function Provider({ classNames, children }: OptionGroupClassNamesProviderProps<T>) {
    const parent = useContext(Context);
    const merged = useMemo(() => ({ ...parent, ...classNames }) as T, [classNames, parent]);

    return <Context.Provider value={merged}>{children}</Context.Provider>;
  }

  function useClassNames(): T {
    return useContext(Context);
  }

  return { Context, Provider, useClassNames };
}
