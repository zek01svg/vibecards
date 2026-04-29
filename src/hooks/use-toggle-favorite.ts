
import { useTransition } from "react";
import { toggleFavoriteAction } from "@/app/(cards)/my-decks/toggle-favorite";
import { toast } from "sonner";

/**
 * Custom hook for toggling a deck's favorite status.
 * @returns {Object} An object containing the toggle favorite handler and pending state.
 */
export const useToggleFavorite = () => {
  const [isPending, startTransition] = useTransition();

  /**
   * Handles the toggle favorite action.
   * @param {string} deckId - The ID of the deck to toggle.
   * @param {boolean} isFavorite - The new favorite status boolean.
   */
  const handleToggleFavorite = async (deckId: string, isFavorite: boolean) => {
    startTransition(async () => {
      try {
        const result = await toggleFavoriteAction(deckId, isFavorite);

        if (result.success) {
          toast.success(
            `Deck ${isFavorite ? "added to" : "removed from"} favorites`,
          );
        } else {
          toast.error(result.error || `Failed to toggle favorite status`);
        }
      } catch (error) {
        toast.error(`Error toggling favorite status`);
      }
    });
  };

  return { handleToggleFavorite, isPendingFavorite: isPending };
};
