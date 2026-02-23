import authenticate from "@/utils/authenticate";

import { RedirectButton } from "./redirect-button";

export default async function LandingPageButton() {
  const authResult = await authenticate();
  const isLoggedIn = authResult !== "Unauthorized";

  if (!isLoggedIn) {
    return (
      <div className="mt-2 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <RedirectButton
          href="/sign-in"
          className="bg-primary text-primary-foreground shadow-primary/20 rounded-full px-8 py-3 font-semibold shadow-lg transition-opacity hover:opacity-90"
        >
          Sign In
        </RedirectButton>
        <RedirectButton
          href="/sign-up"
          className="bg-secondary text-secondary-foreground border-border hover:bg-muted rounded-full border px-8 py-3 font-semibold shadow-sm transition-colors"
        >
          Sign Up
        </RedirectButton>
      </div>
    );
  }

  return (
    <div className="mt-2 flex items-center justify-center">
      <RedirectButton
        href="/dashboard"
        className="bg-primary text-primary-foreground shadow-primary/20 rounded-full px-8 py-3 font-semibold shadow-lg transition-opacity hover:opacity-90"
      >
        Dashboard
      </RedirectButton>
    </div>
  );
}
