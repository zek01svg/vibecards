
import { useTransition } from "react";
import { deleteDeckAction } from "@/app/(cards)/my-decks/delete-deck";
import { toast } from "sonner";

/**
 * Custom hook for deleting a deck.
 * @returns {Object} An object containing the delete deck handler and pending state.
 */
export const useDeleteDeck = () => {
  const [isPending, startTransition] = useTransition();

  /**
   * Handles the delete deck action.
   * @param {string} deckId - The ID of the deck to delete.
   */
  const handleDeleteDeck = async (deckId: string) => {
    startTransition(async () => {
      try {
        const result = await deleteDeckAction(deckId);

        if (result.success) {
          toast.success("Deck deleted successfully");
        } else {
          toast.error(result.error || `Failed to delete deck`);
        }
      } catch (error) {
        toast.error(`Error deleting deck`);
      }
    });
  };

  return { handleDeleteDeck, isPending };
};
