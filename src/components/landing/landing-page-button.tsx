import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";

export default function LandingPageButton() {
  return (
    <div className="mt-2 flex items-center justify-center">
      <Button className="bg-primary text-primary-foreground shadow-primary/20 rounded-full px-8 py-3 font-semibold shadow-lg transition-opacity hover:opacity-90">
        <Link to="/dashboard">Dashboard</Link>
      </Button>
    </div>
  );
}
