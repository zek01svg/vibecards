import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useDeckSearch } from "@/hooks/use-deck-search";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", () => ({
  useNavigate:
    vi.fn<() => (options: { to: string; replace: boolean }) => void>(),
  useRouterState:
    vi.fn<(options?: { select?: RouterStateSelector<unknown> }) => unknown>(),
}));

type RouterStateSelector<T> = (state: { location: { searchStr: string } }) => T;

describe("useDeckSearch", () => {
  const mockNavigate =
    vi.fn<(options: { to: string; replace: boolean }) => void>();
  let mockSearchStr: string;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchStr = "";
    mockNavigate.mockImplementation(({ to }) => {
      const qIndex = to.indexOf("?");
      mockSearchStr = qIndex !== -1 ? to.slice(qIndex) : "";
    });
    vi.mocked(useNavigate).mockReturnValue(
      mockNavigate as unknown as ReturnType<typeof useNavigate>,
    );
    vi.mocked(useRouterState).mockImplementation(
      ((options?: { select?: RouterStateSelector<unknown> }) =>
        options?.select?.({ location: { searchStr: mockSearchStr } }) ??
        ({
          location: { searchStr: mockSearchStr },
        } as unknown)) as typeof useRouterState,
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
    const { result, rerender } = renderHook(() => useDeckSearch());
    act(() => {
      result.current.handleSearch({
        target: { value: "math" },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    rerender();
    expect(result.current.searchQuery).toBe("math");
    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/dashboard?q=math",
      replace: true,
    });
  });

  it("should update search query via setSearchQuery", () => {
    const { result, rerender } = renderHook(() => useDeckSearch());
    act(() => {
      result.current.setSearchQuery("biology");
    });
    rerender();
    expect(result.current.searchQuery).toBe("biology");
    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/dashboard?q=biology",
      replace: true,
    });
  });

  it("should update filter and call navigate with replace", () => {
    const { result, rerender } = renderHook(() => useDeckSearch());
    act(() => {
      result.current.handleFilter("favorites");
    });
    rerender();
    expect(result.current.activeFilter).toBe("favorites");
    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/dashboard?filter=favorites",
      replace: true,
    });
  });

  it("should remove query param when search is cleared", () => {
    mockSearchStr = "?q=science&filter=recent";
    const { result, rerender } = renderHook(() => useDeckSearch());

    act(() => {
      result.current.handleSearch({
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    rerender();
    expect(result.current.searchQuery).toBe("");
    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/dashboard?filter=recent",
      replace: true,
    });
  });

  it("should remove filter param when filter is set to all", () => {
    mockSearchStr = "?q=science&filter=recent";
    const { result, rerender } = renderHook(() => useDeckSearch());

    act(() => {
      result.current.handleFilter("all");
    });
    rerender();
    expect(result.current.activeFilter).toBe("all");
    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/dashboard?q=science",
      replace: true,
    });
  });

  it("should dynamically derive searchQuery and activeFilter when URL params change externally", () => {
    mockSearchStr = "?q=initial&filter=all";
    const { result, rerender } = renderHook(() => useDeckSearch());
    expect(result.current.searchQuery).toBe("initial");
    expect(result.current.activeFilter).toBe("all");

    mockSearchStr = "?q=updated&filter=favorites";
    rerender();
    expect(result.current.searchQuery).toBe("updated");
    expect(result.current.activeFilter).toBe("favorites");
  });
});
