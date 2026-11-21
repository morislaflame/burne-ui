import { describe, expect, it } from "vitest";

import { fileNameExtension, isImageFile } from "./inputAPI";

describe("fileNameExtension", () => {
  it("reads the last extension from names with spaces", () => {
    expect(fileNameExtension("my photo.jpg")).toBe("jpg");
    expect(fileNameExtension("Report 2024 .png")).toBe("png");
  });

  it("does not treat a name without a dot as an extension", () => {
    expect(fileNameExtension("my file")).toBe("");
    expect(fileNameExtension("README")).toBe("");
  });

  it("ignores a leading-only or trailing dot", () => {
    expect(fileNameExtension(".gitignore")).toBe("");
    expect(fileNameExtension("draft.")).toBe("");
  });

  it("uses the last segment of a path", () => {
    expect(fileNameExtension("C:\\Users\\Me\\My Documents\\shot.webp")).toBe("webp");
  });
});

describe("isImageFile", () => {
  it("trusts image MIME when present", () => {
    expect(isImageFile({ name: "a", type: "image/png" })).toBe(true);
    expect(isImageFile({ name: "a.jpg", type: "text/plain" })).toBe(false);
  });

  it("falls back to extension when MIME is empty", () => {
    expect(isImageFile({ name: "holiday photo.jpeg", type: "" })).toBe(true);
    expect(isImageFile({ name: "notes.txt", type: "" })).toBe(false);
    expect(isImageFile({ name: "my file", type: "" })).toBe(false);
  });
});
