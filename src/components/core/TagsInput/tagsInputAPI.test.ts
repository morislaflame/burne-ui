import { describe, expect, it } from "vitest";

import { tagsFromFormValue, tagsInputAppend, tagsInputPieces, tagsInputRemove, tagsInputRemoveLast } from "./tagsInputAPI";

describe("tagsInputAPI", () => {
  it("keeps the tail and commits finished pieces", () => {
    expect(tagsInputPieces("design")).toEqual({ committed: [], rest: "design" });
    expect(tagsInputPieces("design, react")).toEqual({ committed: ["design"], rest: "react" });
    expect(tagsInputPieces("design,")).toEqual({ committed: ["design"], rest: "" });
    expect(tagsInputPieces("a\nb, c")).toEqual({ committed: ["a", "b"], rest: "c" });
  });

  it("skips blanks and duplicates and stops at max", () => {
    expect(tagsInputAppend(["design"], [" design ", "", "react", "design"])).toEqual(["design", "react"]);
    expect(tagsInputAppend(["design"], ["react", "vue"], 2)).toEqual(["design", "react"]);
  });

  it("removes one chip or the last chip", () => {
    expect(tagsInputRemove(["design", "react"], "design")).toEqual(["react"]);
    expect(tagsInputRemoveLast(["design", "react"])).toEqual(["design"]);
    expect(tagsInputRemoveLast([])).toEqual([]);
  });

  it("reads a form value as a list", () => {
    expect(tagsFromFormValue(["design", 1, "react"])).toEqual(["design", "react"]);
    expect(tagsFromFormValue("design, react")).toEqual(["design", "react"]);
    expect(tagsFromFormValue(null)).toEqual([]);
  });
});
