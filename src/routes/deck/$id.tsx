import { createFileRoute } from "@tanstack/react-router";
import DeckPage from "@/app/(cards)/deck/[id]/page";

export const Route = createFileRoute("/deck/$id")({ component: DeckPage });
