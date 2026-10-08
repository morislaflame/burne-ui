import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type PhaseName = "mount" | "update" | "hover";

export type ProfilerHit = {
  phase: "mount" | "update" | "nested-update";
  actualDuration: number;
  baseDuration: number;
};

export type PhaseStats = {
  actualMs: number;
  baseMs: number;
  wallMs: number;
  profilerCommits: number;
};

export type ScenarioReport = {
  name: string;
  size: number;
  mount: PhaseStats;
  update: PhaseStats;
  hover: PhaseStats;
  updateOverMount: number;
};

export type ProvidersBenchReport = {
  recordedAt: string;
  runtime: string;
  platform: string;
  reducedMotion: true;
  iterations: number;
  warmup: number;
  scenarios: ScenarioReport[];
};

export function hostPlatform(): string {
  return `${process.platform} ${process.arch}`;
}

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export function sumHits(hits: ProfilerHit[]): { actual: number; base: number; commits: number } {
  return hits.reduce(
    (acc, hit) => ({
      actual: acc.actual + hit.actualDuration,
      base: acc.base + hit.baseDuration,
      commits: acc.commits + 1,
    }),
    { actual: 0, base: 0, commits: 0 });
}

export function statsFromSamples(
  actuals: number[],
  bases: number[],
  walls: number[],
  commits: number[]): PhaseStats {
  return {
    actualMs: roundMs(median(actuals)),
    baseMs: roundMs(median(bases)),
    wallMs: roundMs(median(walls)),
    profilerCommits: median(commits),
  };
}

export function roundMs(value: number): number {
  return Math.round(value * 100) / 100;
}

export function printReport(report: ProvidersBenchReport) {
  const rows = report.scenarios.map((scenario) => ({
    scenario: scenario.name,
    "mount actual": scenario.mount.actualMs,
    "update actual": scenario.update.actualMs,
    "hover actual": scenario.hover.actualMs,
    "update/mount": scenario.updateOverMount,
    "hover commits": scenario.hover.profilerCommits,
  }));
  console.table(rows);
}

export function writeBaseline(report: ProvidersBenchReport) {
  const dir = path.dirname(fileURLToPath(import.meta.url));
  const file = path.join(dir, "providers.baseline.json");
  writeFileSync(file, `${JSON.stringify(report, null, 2)}\n`);
  return file;
}
