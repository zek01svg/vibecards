import { createFileRoute } from "@tanstack/react-router";
import MyDecksPage from "@/app/(cards)/my-decks/page";

export const Route = createFileRoute("/my-decks")({ component: MyDecksPage });
