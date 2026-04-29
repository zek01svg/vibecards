export async function toggleFavoriteAction(deckId: string, isFavorite: boolean) {
  const response = await fetch(`/api/decks/${deckId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isFavorite }),
  });

  return (await response.json()) as { success: boolean; error?: string };
}
