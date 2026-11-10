/**
 * Flat ESLint 9 for the kit (Э0.3).
 *
 * Plugins: typescript-eslint, react-hooks, jsx-a11y, react (`jsx-key` /
 * `no-array-index-key`). React Compiler rules from react-hooks v7 are off —
 * the kit writes refs during render in motion, that is a later pass.
 *
 * Pointer-handler vs `{...rest}` order cannot be expressed here — that stays a
 * guard-script when we add it, not an ESLint rule.
 *
 * jsx-a11y starts as warnings so legacy stories/demos do not fail CI. Baseline
 * debt is frozen with `--max-warnings 37` in `package.json`. Do not raise the
 * budget. Lower it when a warning class is cleaned up.
 */
import js from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

const sourceFiles = ["**/*.{js,mjs,cjs,ts,tsx}"];

/** Keep recommended options, but freeze a11y debt as warnings (Э0.3). */
function asWarn(rules = {}) {
  return Object.fromEntries(
    Object.entries(rules).map(([name, value]) => {
      if (value === "off" || value === 0) return [name, value];
      if (Array.isArray(value)) {
        const [, ...options] = value;
        return [name, options.length ? ["warn", ...options] : "warn"];
      }
      return [name, "warn"];
    }),
  );
}

export default tseslint.config(
  {
    name: "burne-ui/ignores",
    ignores: [
      "dist/**",
      "coverage/**",
      "storybook-static/**",
      "playground/dist/**",
      "node_modules/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    name: "burne-ui/language",
    files: sourceFiles,
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    name: "burne-ui/react",
    files: sourceFiles,
    ...react.configs.flat.recommended,
    ...react.configs.flat["jsx-runtime"],
    settings: { react: { version: "detect" } },
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      globals: { ...globals.browser },
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat["jsx-runtime"].rules,
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      "react/no-array-index-key": "warn",
    },
  },
  {
    name: "burne-ui/react-hooks",
    files: sourceFiles,
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    name: "burne-ui/storybook-render",
    files: ["**/*.stories.{ts,tsx}", "src/stories-utils/**/*.{ts,tsx}"],
    rules: {
      // Storybook `render()` is a component; rules-of-hooks does not treat it as one.
      "react-hooks/rules-of-hooks": "off",
      "react/display-name": "off",
    },
  },
  {
    name: "burne-ui/jsx-a11y",
    files: sourceFiles,
    ...jsxA11y.flatConfigs.recommended,
    languageOptions: {
      ...jsxA11y.flatConfigs.recommended.languageOptions,
      globals: { ...globals.browser },
    },
    rules: asWarn(jsxA11y.flatConfigs.recommended.rules),
  },
  {
    name: "burne-ui/node",
    files: [
      "scripts/**/*.{js,mjs,cjs}",
      "cli/**/*.{js,mjs}",
      "*.config.{js,ts,mjs,cjs}",
      "eslint.config.js",
      "vitest.config.ts",
    ],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
);
