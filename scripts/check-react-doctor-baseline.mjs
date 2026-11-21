/**
 * Shipped code (`src/components`, `src/skins`) has zero React Doctor errors.
 * Recorded false positives are inline-suppressed and listed in
 * `docs/react-doctor-baseline.md`. A new error fails this check.
 *
 * Stories and playground are out of this gate (see `doctor.config.json`).
 *
 *   npx react-doctor@latest --json --no-score --json-out /tmp/rd.json
 *   node scripts/check-react-doctor-baseline.mjs /tmp/rd.json
 *
 * Not part of `npm run lint` — a full scan is a CI step.
 */
import fs from "node:fs";

const jsonPath = process.argv[2];
if (!jsonPath) {
  console.error("usage: node scripts/check-react-doctor-baseline.mjs <doctor.json>");
  process.exit(2);
}

const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const diagnostics = Array.isArray(report.diagnostics) ? report.diagnostics : [];

function shippedPath(filePath) {
  const file = String(filePath).replaceAll("\\", "/");
  const marker = "/burne-ui/";
  const rel = file.includes(marker)
    ? file.slice(file.lastIndexOf(marker) + marker.length)
    : file.replace(/^\.\//, "");
  if (rel.includes(".stories.")) return false;
  if (rel.startsWith("playground/") || rel.includes("/playground/")) return false;
  if (rel.startsWith("src/stories-utils/")) return false;
  return rel.startsWith("src/components/") || rel.startsWith("src/skins/");
}

const errors = diagnostics.filter(
  (item) => item.severity === "error" && shippedPath(item.filePath ?? ""),
);

if (errors.length > 0) {
  console.error(
    `react-doctor: ${errors.length} error(s) in src/components or src/skins. Baseline is 0.`,
  );
  for (const item of errors) {
    console.error(`  ${item.filePath}:${item.line} ${item.rule ?? ""}`);
  }
  console.error(
    "Fix the error, or record a false positive in docs/react-doctor-baseline.md and suppress that line.",
  );
  process.exit(1);
}

console.log("react-doctor baseline: 0 errors in src/components and src/skins");
