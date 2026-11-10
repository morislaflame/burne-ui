/**
 * Flattens a type alias for IDE hover / quick-info.
 * `classNames?: BadgeClassNames` shows the alias name;
 * `classNames?: Prettify<BadgeClassNames>` expands to `{ root?: string; text?: string; … }`.
 *
 * Single definition — public re-export from `burne-ui` (`src/index.ts`). Do not add
 * a second `Prettify` in `src/types/utils.ts` or a local `Expand` helper.
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};
 