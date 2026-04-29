import { Link } from "@tanstack/react-router";

import { Button } from "../ui/button";

export function NavButtons() {
  return (
    <>
      <Link to="/dashboard">
        <Button variant="ghost" className="text-sm font-medium">
          Generate
        </Button>
      </Link>
      <Link to="/my-decks">
        <Button variant="ghost" className="text-sm font-medium">
          My Decks
        </Button>
      </Link>
    </>
  );
}
