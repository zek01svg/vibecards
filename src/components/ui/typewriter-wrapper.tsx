
import * as React from "react";

const TypewriterLazy = React.lazy(() => import("typewriter-effect"));

type TypewriterProps = React.ComponentProps<typeof TypewriterLazy>;

/**
 * Lazy-loaded typewriter-effect to avoid server-side rendering issues.
 */
export default function Typewriter(props: TypewriterProps) {
  return (
    <React.Suspense fallback={null}>
      <TypewriterLazy {...props} />
    </React.Suspense>
  );
}
