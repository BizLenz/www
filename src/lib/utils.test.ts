import { describe, it, expect } from "bun:test";
import { cn, isError, getErrorMessage } from "./utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("deduplicates tailwind classes (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("returns empty string with no inputs", () => {
    expect(cn()).toBe("");
  });
});

describe("isError", () => {
  it("returns true for Error instances", () => {
    expect(isError(new Error("fail"))).toBe(true);
  });

  it("returns true for objects with a message property", () => {
    expect(isError({ message: "oops" })).toBe(true);
  });

  it("returns false for null", () => {
    expect(isError(null)).toBe(false);
  });

  it("returns false for strings", () => {
    expect(isError("error string")).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isError(undefined)).toBe(false);
  });

  it("returns false for plain objects without message", () => {
    expect(isError({ code: 500 })).toBe(false);
  });
});

describe("getErrorMessage", () => {
  it("extracts message from Error", () => {
    expect(getErrorMessage(new Error("boom"))).toBe("boom");
  });

  it("returns string errors directly", () => {
    expect(getErrorMessage("something broke")).toBe("something broke");
  });

  it("returns fallback for Error with empty message", () => {
    expect(getErrorMessage(new Error(""))).toBe("An unknown error occurred.");
  });

  it("returns fallback for null", () => {
    expect(getErrorMessage(null)).toBe(
      "An unexpected error occurred. Please try again.",
    );
  });

  it("returns fallback for undefined", () => {
    expect(getErrorMessage(undefined)).toBe(
      "An unexpected error occurred. Please try again.",
    );
  });

  it("returns fallback for numbers", () => {
    expect(getErrorMessage(42)).toBe(
      "An unexpected error occurred. Please try again.",
    );
  });
});
