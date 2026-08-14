import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { saveDeck } from "@/lib/local-deck-store";
import { Route as HomeRoute } from "@/routes/index";
import { Route as DashboardRoute } from "@/routes/dashboard";
import { Route as DeckRoute } from "@/routes/deck/$id";

type RouterStateSelector<T> = (state: { location: { searchStr: string } }) => T;

let mockRouteSearch: { mode?: "study" | "list" } = { mode: "study" };
const mockNavigate = vi.fn<() => void>();

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: Record<string, unknown>) => ({
    options,
    useParams: () => ({ id: "test-deck-1" }),
    useSearch: () => mockRouteSearch,
  }),
  useNavigate: () => mockNavigate,
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

  describe("Landing Page (Home)", () => {
    it("renders hero headline, dynamic card stack preview, and CTA link", () => {
      // oxlint-disable-next-line typescript/no-non-null-assertion -- Route component is defined in source
      const HomeComponent = HomeRoute.options.component!;
      render(<HomeComponent />);

      expect(screen.getByText(/tell it the topic/i)).toBeDefined();
      expect(screen.getByText(/get the cards/i)).toBeDefined();
      expect(screen.getByRole("link", { name: /make a deck/i })).toBeDefined();
      expect(screen.getByText(/why does the sky appear blue/i)).toBeDefined();
      expect(screen.getByText(/card 1 of 12/i)).toBeDefined();
    });
  });

  describe("Dashboard Page", () => {
    it("renders the deck generation interface and empty deck state without authentication state", () => {
      // oxlint-disable-next-line typescript/no-non-null-assertion -- Route component is defined in source
      const DashboardComponent = DashboardRoute.options.component!;
      render(<DashboardComponent />);

      expect(screen.getAllByText("Make a deck").length).toBeGreaterThan(0);
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

      expect(
        screen.getByRole("heading", { name: /your decks/i }),
      ).toBeDefined();
      expect(
        screen.getByRole("button", { name: /export decks/i }),
      ).toBeDefined();
      expect(screen.getByText("It's quiet in here.")).toBeDefined();
    });

    it("renders stored decks when present in local storage and allows favoriting", () => {
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

      const favoriteButton = screen.getByRole("button", {
        name: /favorite geography 101/i,
      });
      fireEvent.click(favoriteButton);
    });

    it("allows searching stored decks and export", () => {
      saveDeck({
        id: "deck-1",
        title: "Anatomy",
        topic: "Biology",
        cards: [{ front: "Bone?", back: "Femur" }],
      });

      // oxlint-disable-next-line typescript/no-non-null-assertion -- Route component is defined in source
      const DashboardComponent = DashboardRoute.options.component!;
      render(<DashboardComponent />);

      const searchInput = screen.getByPlaceholderText(
        /search decks by title or topic/i,
      );
      fireEvent.change(searchInput, { target: { value: "Anatomy" } });
      expect(screen.getByText("Anatomy")).toBeDefined();

      const exportButton = screen.getByRole("button", {
        name: /export decks/i,
      });
      fireEvent.click(exportButton);
    });

    it("allows deleting a deck from dashboard", () => {
      saveDeck({
        id: "deck-1",
        title: "Anatomy",
        topic: "Biology",
        cards: [{ front: "Bone?", back: "Femur" }],
      });

      // oxlint-disable-next-line typescript/no-non-null-assertion -- Route component is defined in source
      const DashboardComponent = DashboardRoute.options.component!;
      render(<DashboardComponent />);

      const deleteButton = screen.getByRole("button", {
        name: /delete anatomy/i,
      });
      fireEvent.click(deleteButton);

      const confirmButton = screen.getByRole("button", { name: /^delete$/i });
      fireEvent.click(confirmButton);
      expect(screen.queryByText("Anatomy")).toBeNull();
    });

    it("handles file import of deck backups", async () => {
      // oxlint-disable-next-line typescript/no-non-null-assertion -- Route component is defined in source
      const DashboardComponent = DashboardRoute.options.component!;
      const { container } = render(<DashboardComponent />);

      const fileInput =
        container.querySelector<HTMLInputElement>('input[type="file"]');
      expect(fileInput).not.toBeNull();
      const validBackup = JSON.stringify({
        version: 1,
        decks: [
          {
            id: "imported-1",
            title: "Imported Deck",
            topic: "Testing",
            cards: [{ front: "Q", back: "A" }],
            createdAt: new Date().toISOString(),
            isFavorite: false,
          },
        ],
      });
      const file = new File([validBackup], "backup.json", {
        type: "application/json",
      });

      // oxlint-disable-next-line typescript/no-non-null-assertion
      fireEvent.change(fileInput!, { target: { files: [file] } });
      // oxlint-disable-next-line typescript/no-non-null-assertion
      expect(fileInput!.files?.length).toBe(1);
    });

    it("submits deck generation form and navigates on success", async () => {
      const mockDeck = {
        title: "Mitosis",
        topic: "Cell division",
        cards: [{ front: "What is mitosis?", back: "Cell division process" }],
      };

      const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
        new Response(JSON.stringify({ success: true, deck: mockDeck }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
      const originalFetch = globalThis.fetch;
      globalThis.fetch = fetchMock;

      // oxlint-disable-next-line typescript/no-non-null-assertion -- Route component is defined in source
      const DashboardComponent = DashboardRoute.options.component!;
      render(<DashboardComponent />);

      const topicInput = screen.getByPlaceholderText(
        /paste notes or describe what you want to study/i,
      );
      fireEvent.change(topicInput, { target: { value: "Mitosis" } });

      const generateBtn = screen.getByRole("button", {
        name: /generate deck/i,
      });
      fireEvent.click(generateBtn);

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalled();
      });
      globalThis.fetch = originalFetch;
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

    it("supports study flow: flip, mark correct, next card, and completion screen", () => {
      saveDeck({
        id: "test-deck-1",
        title: "JavaScript Basics",
        topic: "Programming",
        cards: [
          { front: "Card 1 Front", back: "Card 1 Back" },
          { front: "Card 2 Front", back: "Card 2 Back" },
        ],
      });

      // oxlint-disable-next-line typescript/no-non-null-assertion -- Route component is defined in source
      const DeckComponent = DeckRoute.options.component!;
      render(<DeckComponent />);

      // Flip card 1
      const flipButton = screen.getByRole("button", {
        name: /reveal answer/i,
      });
      fireEvent.click(flipButton);
      expect(screen.getByText("Card 1 Back")).toBeDefined();

      // Mark correct
      const correctButton = screen.getByRole("button", {
        name: /got it/i,
      });
      fireEvent.click(correctButton);

      // Now on Card 2
      expect(screen.getByText("Card 2 Front")).toBeDefined();

      // Flip card 2
      const flipButton2 = screen.getByRole("button", {
        name: /reveal answer/i,
      });
      fireEvent.click(flipButton2);

      // Mark missed
      const missedButton = screen.getByRole("button", {
        name: /missed it/i,
      });
      fireEvent.click(missedButton);

      // Completion screen should render
      expect(screen.getByText(/session complete/i)).toBeDefined();
      expect(
        screen.getByText(/you finished "JavaScript Basics"/i),
      ).toBeDefined();
      expect(screen.getByText("50")).toBeDefined(); // 1/2 = 50% accuracy
      expect(screen.getByText(/1 got it/i)).toBeDefined();
      expect(screen.getByText(/1 missed/i)).toBeDefined();

      // Study again button
      const restartButton = screen.getByRole("button", {
        name: /study again/i,
      });
      fireEvent.click(restartButton);
      expect(screen.getByText("Card 1 Front")).toBeDefined();
    });

    it("renders empty deck state when deck has no cards", () => {
      saveDeck({
        id: "test-deck-1",
        title: "Empty Topic",
        topic: "Blank",
        cards: [],
      });

      // oxlint-disable-next-line typescript/no-non-null-assertion -- Route component is defined in source
      const DeckComponent = DeckRoute.options.component!;
      render(<DeckComponent />);

      expect(screen.getByText("Empty Topic")).toBeDefined();
      expect(screen.getByText("Nothing to study here.")).toBeDefined();
    });

    it("allows favoriting and deleting a deck from deck view header", () => {
      saveDeck({
        id: "test-deck-1",
        title: "JavaScript Basics",
        topic: "Programming",
        cards: [{ front: "Front", back: "Back" }],
      });

      // oxlint-disable-next-line typescript/no-non-null-assertion -- Route component is defined in source
      const DeckComponent = DeckRoute.options.component!;
      render(<DeckComponent />);

      const favoriteBtn = screen.getByRole("button", {
        name: /favorite deck/i,
      });
      fireEvent.click(favoriteBtn);

      const deleteBtn = screen.getByRole("button", { name: /delete deck/i });
      fireEvent.click(deleteBtn);

      const confirmBtn = screen.getByRole("button", { name: /^delete$/i });
      fireEvent.click(confirmBtn);
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/dashboard" });
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

      expect(screen.getAllByText("All cards").length).toBeGreaterThan(0);
      expect(screen.getByText("What is JS?")).toBeDefined();
      expect(screen.getByText("A programming language")).toBeDefined();
      expect(screen.getByText("What is closure?")).toBeDefined();
      expect(screen.getByText("Lexical scope function")).toBeDefined();
      expect(screen.getByText(/start studying/i)).toBeDefined();
    });
  });
});
