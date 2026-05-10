type DeckActionResult = {
  success: boolean;
  error?: string;
};

async function parseDeckActionResponse(response: Response) {
  const result = (await response.json().catch(() => ({}))) as DeckActionResult;

  if (!response.ok && !result.error) {
    return { success: false, error: "Deck request failed" };
  }

  return result;
}

export async function deleteDeckAction(deckId: string) {
  const response = await fetch(`/api/decks/${deckId}`, { method: "DELETE" });
  return parseDeckActionResponse(response);
}

export async function toggleFavoriteAction(
  deckId: string,
  isFavorite: boolean,
) {
  const response = await fetch(`/api/decks/${deckId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isFavorite }),
  });

  return parseDeckActionResponse(response);
}
