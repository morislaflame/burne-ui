import { spawnSync } from "node:child_process";

/** One `npm run lint` prints every guard. A failed step does not hide the rest. */
const steps = [
  ["node", ["scripts/sync-generated-tokens.mjs", "--check"]],
  ["tsc", ["-p", "tsconfig.json", "--noEmit"]],
  ["node", ["scripts/check-package-export-parity.mjs"]],
  ["node", ["scripts/check-component-subpath-exports.mjs"]],
  ["node", ["scripts/check-public-surface.mjs"]],
  ["node", ["scripts/check-motion-docs-parity.mjs"]],
  ["node", ["scripts/check-component-docs-heading-parity.mjs"]],
  ["node", ["scripts/check-peer-imports.mjs"]],
  ["node", ["scripts/check-release-peer.mjs"]],
  ["node", ["scripts/check-shadow-single-owner.mjs"]],
  ["node", ["scripts/check-color-single-owner.mjs"]],
  ["node", ["scripts/check-skin-slots.mjs"]],
  ["node", ["scripts/check-skin-forbidden-tokens.mjs"]],
  ["node", ["scripts/check-aria-invalid-coverage.mjs"]],
  ["node", ["scripts/check-data-state-coverage.mjs"]],
  ["node", ["scripts/check-important-free.mjs"]],
  ["node", ["scripts/check-raw-classes.mjs"]],
  ["node", ["scripts/check-logical-directions.mjs"]],
  ["node", ["scripts/check-classnames-docs-parity.mjs"]],
  ["node", ["scripts/check-md-imports.mjs"]],
  ["node", ["scripts/check-browser-floor.mjs"]],
  ["node", ["scripts/check-raw-gsap.mjs"]],
  ["node", ["scripts/check-skin-author-cli.mjs"]],
  ["node", ["scripts/check-burne-label-literals.mjs"]],
  ["node", ["scripts/check-pointer-order.mjs"]],
  ["node", ["scripts/check-forward-ref.mjs"]],
  ["eslint", [".", "--max-warnings", "37"]],
];

let failed = 0;

for (const [command, args] of steps) {
  const label = [command, ...args].join(" ");
  console.log(`\n── ${label}`);
  const result = spawnSync(command, args, { stdio: "inherit" });
  const code = result.status ?? 1;
  if (code === 0) {
    console.log(`✓ ${label}`);
  } else {
    failed += 1;
    console.error(`✗ ${label} (exit ${code})`);
  }
}

if (failed > 0) {
  console.error(`\nlint: ${failed} step(s) failed`);
  process.exit(1);
}

console.log("\nlint: all steps passed");
