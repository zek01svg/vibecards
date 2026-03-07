import { useRouter, useSearchParams } from "next/navigation";
import { useDeckSearch } from "@/hooks/use-deck-search";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
  useRouter: vi.fn(),
}));

describe("useDeckSearch", () => {
  const mockReplace = vi.fn();
  let mockSearchParams: URLSearchParams;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    (useRouter as any).mockReturnValue({ replace: mockReplace });
    (useSearchParams as any).mockReturnValue({
      get: (key: string) => mockSearchParams.get(key),
      toString: () => mockSearchParams.toString(),
    });
  });

  it("should initialize with default values when search params are empty", () => {
    const { result } = renderHook(() => useDeckSearch());
    expect(result.current.searchQuery).toBe("");
    expect(result.current.activeFilter).toBe("all");
  });

  it("should initialize with values from search params", () => {
    mockSearchParams.set("q", "science");
    mockSearchParams.set("filter", "recent");

    const { result } = renderHook(() => useDeckSearch());
    expect(result.current.searchQuery).toBe("science");
    expect(result.current.activeFilter).toBe("recent");
  });

  it("should update search and call router.replace", () => {
    const { result } = renderHook(() => useDeckSearch());
    act(() => {
      result.current.handleSearch({
        target: { value: "math" },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.searchQuery).toBe("math");
    expect(mockReplace).toHaveBeenCalledWith("/my-decks?q=math", {
      scroll: false,
    });
  });

  it("should update filter and call router.replace", () => {
    const { result } = renderHook(() => useDeckSearch());
    act(() => {
      result.current.handleFilter("favorites");
    });
    expect(result.current.activeFilter).toBe("favorites");
    expect(mockReplace).toHaveBeenCalledWith("/my-decks?filter=favorites", {
      scroll: false,
    });
  });

  it("should remove query param when search is cleared", () => {
    mockSearchParams.set("q", "science");
    mockSearchParams.set("filter", "recent");
    const { result } = renderHook(() => useDeckSearch());

    act(() => {
      result.current.handleSearch({
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.searchQuery).toBe("");
    expect(mockReplace).toHaveBeenCalledWith("/my-decks?filter=recent", {
      scroll: false,
    });
  });

  it("should remove filter param when filter is set to all", () => {
    mockSearchParams.set("q", "science");
    mockSearchParams.set("filter", "recent");
    const { result } = renderHook(() => useDeckSearch());

    act(() => {
      result.current.handleFilter("all");
    });
    expect(result.current.activeFilter).toBe("all");
    expect(mockReplace).toHaveBeenCalledWith("/my-decks?q=science", {
      scroll: false,
    });
  });
});
