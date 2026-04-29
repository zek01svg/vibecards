export async function deleteDeckAction(deckId: string) {
  const response = await fetch(`/api/decks/${deckId}`, {
    method: "DELETE",
  });

  return (await response.json()) as { success: boolean; error?: string };
}
