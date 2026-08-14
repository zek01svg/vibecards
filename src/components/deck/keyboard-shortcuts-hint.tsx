export function KeyboardShortcutsHint() {
  const chip = "rounded-[3px] border border-current px-1 font-mono text-[10px]";

  return (
    <>
      <span className="text-muted-foreground font-mono text-[10px] font-semibold tracking-[0.18em] uppercase">
        Shortcuts
      </span>
      <span className="flex items-center gap-1">
        <kbd className={chip}>Space</kbd> Flip
      </span>
      <span className="flex items-center gap-1">
        <kbd className={chip}>←</kbd>
        <kbd className={chip}>→</kbd> Nav
      </span>
      <span className="flex items-center gap-1">
        <kbd className={chip}>1</kbd> Got it
      </span>
      <span className="flex items-center gap-1">
        <kbd className={chip}>2</kbd> Missed
      </span>
    </>
  );
}
