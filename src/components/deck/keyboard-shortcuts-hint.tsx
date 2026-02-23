import { Keyboard } from "lucide-react";

export function KeyboardShortcutsHint() {
  return (
    <>
      <div className="flex items-center gap-1.5">
        <Keyboard className="h-3 w-3" /> Shortcuts:
      </div>
      <div className="flex items-center gap-1">
        <span className="rounded border border-current px-1">SPACE</span> Flip
      </div>
      <div className="flex items-center gap-1">
        <span className="rounded border border-current px-1">←</span>
        <span className="rounded border border-current px-1">→</span> Nav
      </div>
      <div className="flex items-center gap-1">
        <span className="rounded border border-current px-1">1</span> Correct
      </div>
      <div className="flex items-center gap-1">
        <span className="rounded border border-current px-1">2</span> Incorrect
      </div>
    </>
  );
}
