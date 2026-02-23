import Link from "next/link";

import { Button } from "./button";

export function NavButtons() {
  return (
    <>
      <Link href="/dashboard">
        <Button variant="ghost" className="text-sm font-medium">
          Generate
        </Button>
      </Link>
      <Link href="/my-decks">
        <Button variant="ghost" className="text-sm font-medium">
          My Decks
        </Button>
      </Link>
    </>
  );
}
