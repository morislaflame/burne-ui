/**
 * One liaison Geometry: torus surface + inner “glass” (side + lids).
 * Procedural assembly (merge in one index buffer), without external CSG.
 */
import { Geometry, type Renderer } from "ogl";

export type SolidTorusGeometryOpts = {
  majorRadius: number;
  tube: number;
  squashY: number;
  innerRadius: number;
  plugHalfZ: number;
  tubularSegments: number;
  radialSegments: number;
  plugRadialSegments: number;
};

function pushTriangle(
  indices: number[],
  a: number,
  b: number,
  c: number,
  flip: boolean,
) {
  if (flip) indices.push(a, c, b);
  else indices.push(a, b, c);
}

function addTorusShell(
  R: number,
  r: number,
  sq: number,
  nU: number,
  nV: number,
  pos: number[],
  nrm: number[],
  uv: number[],
  idx: number[],
  vBase: number,
): number {
  let vc = 0;
  for (let j = 0; j <= nV; j++) {
    const v = (j / nV) * Math.PI * 2;
    const cosV = Math.cos(v);
    const sinV = Math.sin(v);
    for (let i = 0; i <= nU; i++) {
      const u = (i / nU) * Math.PI * 2;
      const cosU = Math.cos(u);
      const sinU = Math.sin(u);
      const x = (R + r * cosV) * cosU;
      const y = (R + r * cosV) * sinU * sq;
      const z = r * sinV;
      const cx = R * cosU;
      const cy = R * sinU * sq;
      const cz = 0;
      let nx = x - cx;
      let ny = y - cy;
      let nz = z - cz;
      const len = Math.hypot(nx, ny, nz) || 1;
      nx /= len;
      ny /= len;
      nz /= len;
      pos.push(x, y, z);
      nrm.push(nx, ny, nz);
      uv.push(i / nU, j / nV);
      vc++;
    }
  }
  for (let j = 1; j <= nV; j++) {
    for (let i = 1; i <= nU; i++) {
      const a = vBase + (nU + 1) * (j - 1) + (i - 1);
      const b = vBase + (nU + 1) * (j - 1) + i;
      const c = vBase + (nU + 1) * j + i;
      const d = vBase + (nU + 1) * j + (i - 1);
      idx.push(a, b, d, b, c, d);
    }
  }
  return vc;
}

/** Cylinder along Z: two rings (z = ±halfZ), side, lids - rings are not duplicated. */
function addInnerPlug(
  ir: number,
  sq: number,
  halfZ: number,
  nSide: number,
  pos: number[],
  nrm: number[],
  uv: number[],
  idx: number[],
  vBase: number,
): number {
  const z0 = -halfZ;
  const z1 = halfZ;
  let added = 0;

  for (let i = 0; i <= nSide; i++) {
    const t = (i / nSide) * Math.PI * 2;
    const c = Math.cos(t);
    const s = Math.sin(t);
    pos.push(ir * c, ir * s * sq, z0);
    nrm.push(c, s, 0);
    uv.push(i / nSide, 0);
    added++;
  }
  for (let i = 0; i <= nSide; i++) {
    const t = (i / nSide) * Math.PI * 2;
    const c = Math.cos(t);
    const s = Math.sin(t);
    pos.push(ir * c, ir * s * sq, z1);
    nrm.push(c, s, 0);
    uv.push(i / nSide, 1);
    added++;
  }

  const ring0 = vBase;
  const ring1 = vBase + (nSide + 1);
  for (let i = 1; i <= nSide; i++) {
    const a = ring0 + i - 1;
    const b = ring0 + i;
    const c = ring1 + i;
    const d = ring1 + i - 1;
    idx.push(a, d, b, b, d, c);
  }

  const c0 = vBase + added;
  pos.push(0, 0, z0);
  nrm.push(0, 0, -1);
  uv.push(0.5, 0.5);
  added++;
  for (let i = 1; i <= nSide; i++) {
    pushTriangle(idx, c0, ring0 + i - 1, ring0 + i, false);
  }

  const c1 = vBase + added;
  pos.push(0, 0, z1);
  nrm.push(0, 0, 1);
  uv.push(0.5, 0.5);
  added++;
  for (let i = 1; i <= nSide; i++) {
    pushTriangle(idx, c1, ring1 + i, ring1 + i - 1, false);
  }

  return added;
}

export type PlugGeometryOpts = {
  innerRadius: number;
  squashY: number;
  plugHalfZ: number;
  plugRadialSegments: number;
};

export function createPlugGeometry(
  gl: Renderer["gl"],
  opts: PlugGeometryOpts,
): Geometry {
  const { innerRadius: ir, squashY: sq, plugHalfZ: hz, plugRadialSegments: nP } =
    opts;

  const pos: number[] = [];
  const nrm: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];

  addInnerPlug(ir, sq, hz, nP, pos, nrm, uv, idx, 0);

  return new Geometry(gl, {
    position: { size: 3, data: new Float32Array(pos) },
    normal: { size: 3, data: new Float32Array(nrm) },
    uv: { size: 2, data: new Float32Array(uv) },
    index: { data: new Uint16Array(idx) },
  });
}

export function createSolidTorusGeometry(
  gl: Renderer["gl"],
  opts: SolidTorusGeometryOpts,
): Geometry {
  const {
    majorRadius: R,
    tube: r,
    squashY: sq,
    innerRadius: ir,
    plugHalfZ: hz,
    tubularSegments: nU,
    radialSegments: nV,
    plugRadialSegments: nP,
  } = opts;

  const pos: number[] = [];
  const nrm: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];

  let vBase = 0;
  vBase += addTorusShell(R, r, sq, nU, nV, pos, nrm, uv, idx, vBase);
  addInnerPlug(ir, sq, hz, nP, pos, nrm, uv, idx, vBase);

  return new Geometry(gl, {
    position: { size: 3, data: new Float32Array(pos) },
    normal: { size: 3, data: new Float32Array(nrm) },
    uv: { size: 2, data: new Float32Array(uv) },
    index: { data: new Uint16Array(idx) },
  });
}
