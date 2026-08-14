import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { saveDeck } from "@/lib/local-deck-store";
import { Route as DashboardRoute } from "@/routes/dashboard";
import { Route as DeckRoute } from "@/routes/deck/$id";

type RouterStateSelector<T> = (state: { location: { searchStr: string } }) => T;

let mockRouteSearch: { mode?: "study" | "list" } = { mode: "study" };

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: Record<string, unknown>) => ({
    options,
    useParams: () => ({ id: "test-deck-1" }),
    useSearch: () => mockRouteSearch,
  }),
  useNavigate: () => vi.fn<() => void>(),
  useRouterState: (options?: { select?: RouterStateSelector<unknown> }) => {
    const state = { location: { searchStr: "" } };
    return options?.select ? options.select(state) : state;
  },
  Link: ({
    children,
    to,
    ...props
  }: {
    children: React.ReactNode;
    to?: string;
  }) => (
    <a href={to ?? "#"} {...props}>
      {children}
    </a>
  ),
}));

describe("UI Route Integration Tests (No Authentication Required)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    mockRouteSearch = { mode: "study" };
  });

  afterEach(() => {
    cleanup();
  });

  describe("Dashboard Page", () => {
    it("renders the deck generation interface and empty deck state without authentication state", () => {
      // oxlint-disable-next-line typescript/no-non-null-assertion -- Route component is defined in source
      const DashboardComponent = DashboardRoute.options.component!;
      render(<DashboardComponent />);

      expect(screen.getByText("Generate a Deck")).toBeDefined();
      expect(
        screen.getByPlaceholderText(
          /paste notes or describe what you want to study/i,
        ),
      ).toBeDefined();
      expect(screen.getByLabelText(/difficulty/i)).toBeDefined();
      expect(screen.getByLabelText(/cards/i)).toBeDefined();
      expect(
        screen.getByRole("button", { name: /generate deck/i }),
      ).toBeDefined();

      expect(screen.getByRole("heading", { name: /my decks/i })).toBeDefined();
      expect(
        screen.getByRole("button", { name: /export decks/i }),
      ).toBeDefined();
      expect(screen.getByText("No Cards Available")).toBeDefined();
    });

    it("renders stored decks when present in local storage", () => {
      saveDeck({
        id: "deck-abc",
        title: "Geography 101",
        topic: "Capitals",
        cards: [{ front: "Capital of France?", back: "Paris" }],
      });

      // oxlint-disable-next-line typescript/no-non-null-assertion -- Route component is defined in source
      const DashboardComponent = DashboardRoute.options.component!;
      render(<DashboardComponent />);

      expect(screen.getByText("Geography 101")).toBeDefined();
      expect(screen.getByText("Capitals")).toBeDefined();
      expect(
        screen.getByPlaceholderText(/search decks by title or topic/i),
      ).toBeDefined();
    });
  });

  describe("Deck View Page", () => {
    it("renders 'Deck Not Found' empty state when requested deck ID does not exist", () => {
      // oxlint-disable-next-line typescript/no-non-null-assertion -- Route component is defined in source
      const DeckComponent = DeckRoute.options.component!;
      render(<DeckComponent />);

      expect(screen.getByText("Deck Not Found")).toBeDefined();
      expect(screen.getByText(/back to dashboard/i)).toBeDefined();
    });

    it("renders flashcard deck study view when deck exists in local storage", () => {
      saveDeck({
        id: "test-deck-1",
        title: "JavaScript Basics",
        topic: "Programming",
        cards: [
          { front: "What is JS?", back: "A programming language" },
          { front: "What is closure?", back: "Lexical scope function" },
        ],
      });

      // oxlint-disable-next-line typescript/no-non-null-assertion -- Route component is defined in source
      const DeckComponent = DeckRoute.options.component!;
      render(<DeckComponent />);

      expect(screen.getByText("JavaScript Basics")).toBeDefined();
      expect(screen.getByText("What is JS?")).toBeDefined();
      expect(screen.getByText(/card 1 of 2/i)).toBeDefined();
    });

    it("renders all flashcards in list view when mode is list", () => {
      mockRouteSearch = { mode: "list" };
      saveDeck({
        id: "test-deck-1",
        title: "JavaScript Basics",
        topic: "Programming",
        cards: [
          { front: "What is JS?", back: "A programming language" },
          { front: "What is closure?", back: "Lexical scope function" },
        ],
      });

      // oxlint-disable-next-line typescript/no-non-null-assertion -- Route component is defined in source
      const DeckComponent = DeckRoute.options.component!;
      render(<DeckComponent />);

      expect(screen.getByText("All Cards")).toBeDefined();
      expect(screen.getByText("What is JS?")).toBeDefined();
      expect(screen.getByText("A programming language")).toBeDefined();
      expect(screen.getByText("What is closure?")).toBeDefined();
      expect(screen.getByText("Lexical scope function")).toBeDefined();
      expect(screen.getByText(/start studying/i)).toBeDefined();
    });
  });
});
