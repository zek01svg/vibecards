import { deleteDeckAction } from "@/app/(cards)/my-decks/delete-deck";
import { useDeleteDeck } from "@/hooks/use-delete-deck";
import { act, renderHook } from "@testing-library/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react", async () => {
  const actual: any = await vi.importActual("react");
  return {
    ...actual,
    useTransition: () => [false, (cb: any) => cb()],
  };
});

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/app/(cards)/my-decks/delete-deck", () => ({
  deleteDeckAction: vi.fn(),
}));

describe("useDeleteDeck", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show success toast on successful delete", async () => {
    (deleteDeckAction as any).mockResolvedValue({ success: true });

    const { result } = renderHook(() => useDeleteDeck());

    await act(async () => {
      await result.current.handleDeleteDeck("deck-123");
    });

    expect(deleteDeckAction).toHaveBeenCalledWith("deck-123");
    expect(toast.success).toHaveBeenCalledWith("Deck deleted successfully");
  });

  it("should show error toast with custom message on failed delete", async () => {
    (deleteDeckAction as any).mockResolvedValue({
      success: false,
      error: "Not authorized",
    });

    const { result } = renderHook(() => useDeleteDeck());

    await act(async () => {
      await result.current.handleDeleteDeck("deck-123");
    });

    expect(deleteDeckAction).toHaveBeenCalledWith("deck-123");
    expect(toast.error).toHaveBeenCalledWith("Not authorized");
  });

  it("should show default error toast on failed delete without message", async () => {
    (deleteDeckAction as any).mockResolvedValue({ success: false });

    const { result } = renderHook(() => useDeleteDeck());

    await act(async () => {
      await result.current.handleDeleteDeck("deck-123");
    });

    expect(deleteDeckAction).toHaveBeenCalledWith("deck-123");
    expect(toast.error).toHaveBeenCalledWith("Failed to delete deck");
  });

  it("should show error toast on thrown exception", async () => {
    (deleteDeckAction as any).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useDeleteDeck());

    await act(async () => {
      await result.current.handleDeleteDeck("deck-123");
    });

    expect(toast.error).toHaveBeenCalledWith("Error deleting deck");
  });
});
