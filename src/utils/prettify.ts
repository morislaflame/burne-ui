/**
 * Flattens a type alias for IDE hover / quick-info.
 * `classNames?: BadgeClassNames` shows the alias name;
 * `classNames?: Prettify<BadgeClassNames>` expands to `{ root?: string; text?: string; … }`.
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};
