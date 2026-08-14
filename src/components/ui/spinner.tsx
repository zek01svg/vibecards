import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <output
      aria-label="Loading"
      className="inline-flex items-center justify-center"
    >
      <Loader2Icon
        className={cn("size-4 animate-spin", className)}
        {...props}
      />
    </output>
  );
}

export { Spinner };
