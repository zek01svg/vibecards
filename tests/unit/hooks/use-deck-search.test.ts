import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useDeckSearch } from "@/hooks/use-deck-search";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", () => ({
  useNavigate: vi.fn(),
  useRouterState: vi.fn(),
}));

describe("useDeckSearch", () => {
  const mockNavigate = vi.fn();
  let mockSearchStr: string;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchStr = "";
    (useNavigate as any).mockReturnValue(mockNavigate);
    (useRouterState as any).mockImplementation(({ select }: any) =>
      select({ location: { searchStr: mockSearchStr } }),
    );
  });

  it("should initialize with default values when search params are empty", () => {
    const { result } = renderHook(() => useDeckSearch());
    expect(result.current.searchQuery).toBe("");
    expect(result.current.activeFilter).toBe("all");
  });

  it("should initialize with values from search params", () => {
    mockSearchStr = "?q=science&filter=recent";

    const { result } = renderHook(() => useDeckSearch());
    expect(result.current.searchQuery).toBe("science");
    expect(result.current.activeFilter).toBe("recent");
  });

  it("should update search and call navigate with replace", () => {
    const { result } = renderHook(() => useDeckSearch());
    act(() => {
      result.current.handleSearch({
        target: { value: "math" },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.searchQuery).toBe("math");
    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/my-decks?q=math",
      replace: true,
    });
  });

  it("should update filter and call navigate with replace", () => {
    const { result } = renderHook(() => useDeckSearch());
    act(() => {
      result.current.handleFilter("favorites");
    });
    expect(result.current.activeFilter).toBe("favorites");
    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/my-decks?filter=favorites",
      replace: true,
    });
  });

  it("should remove query param when search is cleared", () => {
    mockSearchStr = "?q=science&filter=recent";
    const { result } = renderHook(() => useDeckSearch());

    act(() => {
      result.current.handleSearch({
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.searchQuery).toBe("");
    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/my-decks?filter=recent",
      replace: true,
    });
  });

  it("should remove filter param when filter is set to all", () => {
    mockSearchStr = "?q=science&filter=recent";
    const { result } = renderHook(() => useDeckSearch());

    act(() => {
      result.current.handleFilter("all");
    });
    expect(result.current.activeFilter).toBe("all");
    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/my-decks?q=science",
      replace: true,
    });
  });
});
