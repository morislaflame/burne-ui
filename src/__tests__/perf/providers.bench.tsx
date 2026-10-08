/**
 * Э0.4 — cost of compound providers (mount / one-item update / hover).
 * Not part of `test:run` or CI. Run: `bun run bench:providers`.
 *
 * Reduced motion is on (setup.ts) so GSAP does not dominate Profiler time.
 * Absolute ms vary by machine; decide from update/mount and hover commits.
 */
import { Profiler, useLayoutEffect, useRef, type ReactElement } from "react";
import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Checkbox } from "@/components/core/Checkbox";
import { CheckboxGroup } from "@/components/composite/CheckboxGroup";
import { ListBox } from "@/components/core/ListBox";
import { Table } from "@/components/core/Table";
import { Toast, useToastContext } from "@/components/core/Toast";

import {
  hostPlatform,
  printReport,
  roundMs,
  statsFromSamples,
  sumHits,
  writeBaseline,
  type PhaseName,
  type ProfilerHit,
  type ProvidersBenchReport,
  type ScenarioReport,
} from "./harness";

const WARMUP = 1;
const ITERATIONS = 6;

type TableRow = { id: string; name: string; role: string };

function tableRows(count: number, nameSuffix: string): TableRow[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `r${index}`,
    name: `User ${index}${nameSuffix}`,
    role: "Dev",
  }));
}

function TableTree({
  rows,
  selectedId,
}: {
  rows: TableRow[];
  selectedId: string;
}) {
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Team"
          selectionMode="single"
          selectedKeys={new Set([selectedId])}
        >
          <Table.Header>
            <Table.Column isRowHeader>Name</Table.Column>
            <Table.Column>Role</Table.Column>
          </Table.Header>
          <Table.Body items={rows}>
            {(row: TableRow) => (
              <Table.Row key={row.id} id={row.id}>
                <Table.Cell>{row.name}</Table.Cell>
                <Table.Cell>{row.role}</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}

function CheckboxGroupTree({
  count,
  checkedId,
}: {
  count: number;
  checkedId: number;
}) {
  return (
    <CheckboxGroup>
      <CheckboxGroup.Legend>Add-ons</CheckboxGroup.Legend>
      <CheckboxGroup.List>
        {Array.from({ length: count }, (_, index) => {
          const id = `v${index}`;
          return (
            <Checkbox
              key={id}
              value={id}
              label={`Item ${index}`}
              checked={index === checkedId}
            />
          );
        })}
      </CheckboxGroup.List>
    </CheckboxGroup>
  );
}

function ListBoxTree({ count, value }: { count: number; value: string }) {
  return (
    <ListBox aria-label="Items" value={value}>
      {Array.from({ length: count }, (_, index) => {
        const id = `v${index}`;
        return <ListBox.Item key={id} value={id} label={`Item ${index}`} />;
      })}
    </ListBox>
  );
}

function ToastSeeder({ count, titleSuffix }: { count: number; titleSuffix: string }) {
  const ctx = useToastContext();
  const idsRef = useRef<string[]>([]);

  useLayoutEffect(() => {
    while (idsRef.current.length < count) {
      const index = idsRef.current.length;
      idsRef.current.push(
        ctx.add({ title: `Toast ${index}${titleSuffix}`, timeout: 0 }));
    }
    const first = idsRef.current[0];
    if (first) ctx.update(first, { title: `Toast 0${titleSuffix}` });
  }, [count, ctx, titleSuffix]);

  return null;
}

function ToastTree({ count, titleSuffix }: { count: number; titleSuffix: string }) {
  return (
    <Toast.Provider>
      <ToastSeeder count={count} titleSuffix={titleSuffix} />
    </Toast.Provider>
  );
}

function wrap(id: string, tree: ReactElement, hits: ProfilerHit[]) {
  return (
    <Profiler
      id={id}
      onRender={(_id, phase, actualDuration, baseDuration) => {
        hits.push({ phase, actualDuration, baseDuration });
      }}
    >
      {tree}
    </Profiler>
  );
}

function takeSlice(hits: ProfilerHit[], from: number): ProfilerHit[] {
  return hits.slice(from);
}

type Scenario = {
  name: string;
  size: number;
  mountTree: () => ReactElement;
  updateTree: () => ReactElement;
  hoverTarget: (container: HTMLElement) => Element | null;
};

function measureScenario(scenario: Scenario): ScenarioReport {
  const mountActual: number[] = [];
  const mountBase: number[] = [];
  const mountWall: number[] = [];
  const mountCommits: number[] = [];
  const updateActual: number[] = [];
  const updateBase: number[] = [];
  const updateWall: number[] = [];
  const updateCommits: number[] = [];
  const hoverActual: number[] = [];
  const hoverBase: number[] = [];
  const hoverWall: number[] = [];
  const hoverCommits: number[] = [];

  const total = WARMUP + ITERATIONS;
  for (let i = 0; i < total; i++) {
    const hits: ProfilerHit[] = [];
    const mark = (phase: PhaseName) =>
      `burne-ui.providers.${scenario.name}.${phase}.${i}`;

    performance.mark(`${mark("mount")}-start`);
    const view = render(wrap(scenario.name, scenario.mountTree(), hits));
    performance.mark(`${mark("mount")}-end`);
    performance.measure(mark("mount"), `${mark("mount")}-start`, `${mark("mount")}-end`);
    const mountHits = takeSlice(hits, 0);
    const mountSum = sumHits(mountHits);
    const mountWallMs = performance.getEntriesByName(mark("mount"))[0]?.duration ?? 0;

    const afterMount = hits.length;
    performance.mark(`${mark("update")}-start`);
    view.rerender(wrap(scenario.name, scenario.updateTree(), hits));
    performance.mark(`${mark("update")}-end`);
    performance.measure(mark("update"), `${mark("update")}-start`, `${mark("update")}-end`);
    const updateSum = sumHits(takeSlice(hits, afterMount));
    const updateWallMs = performance.getEntriesByName(mark("update"))[0]?.duration ?? 0;

    const afterUpdate = hits.length;
    const target = scenario.hoverTarget(view.container);
    if (!target) {
      throw new Error(`${scenario.name}: hover target not found`);
    }
    performance.mark(`${mark("hover")}-start`);
    act(() => {
      fireEvent.pointerOver(target);
    });
    performance.mark(`${mark("hover")}-end`);
    performance.measure(mark("hover"), `${mark("hover")}-start`, `${mark("hover")}-end`);
    const hoverSum = sumHits(takeSlice(hits, afterUpdate));
    const hoverWallMs = performance.getEntriesByName(mark("hover"))[0]?.duration ?? 0;

    view.unmount();
    performance.clearMarks();
    performance.clearMeasures();

    if (i < WARMUP) continue;

    mountActual.push(mountSum.actual);
    mountBase.push(mountSum.base);
    mountWall.push(mountWallMs);
    mountCommits.push(mountSum.commits);
    updateActual.push(updateSum.actual);
    updateBase.push(updateSum.base);
    updateWall.push(updateWallMs);
    updateCommits.push(updateSum.commits);
    hoverActual.push(hoverSum.actual);
    hoverBase.push(hoverSum.base);
    hoverWall.push(hoverWallMs);
    hoverCommits.push(hoverSum.commits);
  }

  const mount = statsFromSamples(mountActual, mountBase, mountWall, mountCommits);
  const update = statsFromSamples(updateActual, updateBase, updateWall, updateCommits);
  const hover = statsFromSamples(hoverActual, hoverBase, hoverWall, hoverCommits);

  return {
    name: scenario.name,
    size: scenario.size,
    mount,
    update,
    hover,
    updateOverMount: mount.actualMs === 0 ? 0 : roundMs(update.actualMs / mount.actualMs),
  };
}

describe("Э0.4 provider cost", () => {
  it("measures Table 200, CheckboxGroup 100, ListBox 500, Toast 20", () => {
    const scenarios: Scenario[] = [
      {
        name: "table-200",
        size: 200,
        mountTree: () => <TableTree rows={tableRows(200, "")} selectedId="r0" />,
        updateTree: () => <TableTree rows={tableRows(200, " *")} selectedId="r1" />,
        hoverTarget: (container) => container.querySelector("tbody tr"),
      },
      {
        name: "checkbox-group-100",
        size: 100,
        mountTree: () => <CheckboxGroupTree count={100} checkedId={0} />,
        updateTree: () => <CheckboxGroupTree count={100} checkedId={1} />,
        hoverTarget: (container) => container.querySelector("label"),
      },
      {
        name: "listbox-500",
        size: 500,
        mountTree: () => <ListBoxTree count={500} value="v0" />,
        updateTree: () => <ListBoxTree count={500} value="v1" />,
        hoverTarget: (container) => container.querySelector("[role='option']"),
      },
      {
        name: "toast-stack-20",
        size: 20,
        mountTree: () => <ToastTree count={20} titleSuffix="" />,
        updateTree: () => <ToastTree count={20} titleSuffix=" *" />,
        hoverTarget: () =>
          document.querySelector('[role="region"][aria-label] [role="group"]'),
      },
    ];

    const report: ProvidersBenchReport = {
      recordedAt: new Date().toISOString(),
      runtime: "happy-dom",
      platform: hostPlatform(),
      reducedMotion: true,
      iterations: ITERATIONS,
      warmup: WARMUP,
      scenarios: scenarios.map(measureScenario),
    };

    printReport(report);
    writeBaseline(report);

    for (const scenario of report.scenarios) {
      expect(scenario.mount.actualMs, scenario.name).toBeGreaterThan(0);
    }
  });
});
