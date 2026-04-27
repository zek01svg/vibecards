export async function generateDeckAction(data: {
  topic: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  cardCount: string;
}) {
  const response = await fetch("/api/decks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return (await response.json()) as {
    success: boolean;
    deckId?: string;
    error?: string;
    details?: string[];
  };
}
