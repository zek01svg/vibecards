import { describe, expect, it } from "vitest";

import { cn } from "../../../src/lib/utils";

describe("cn utility", () => {
  it("should merge tailwind classes correctly", () => {
    expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
  });

  it("should override classes with tailwind-merge", () => {
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });

  it("should merge clsx objects correctly", () => {
    expect(cn("px-2", { "py-4": true })).toBe("px-2 py-4");
    expect(cn("bg-red-500", { "bg-blue-500": true })).toBe("bg-blue-500");
  });

  it("should handle conditional truthy/falsy values", () => {
    expect(cn("flex", false && "items-center", true && "justify-center")).toBe(
      "flex justify-center",
    );
    expect(cn("flex", undefined, null, "text-sm")).toBe("flex text-sm");
  });
});
