"use client";

import dynamic from "next/dynamic";

/**
 * Dynamic import of typewriter-effect to avoid server-side rendering issues.
 */
const Typewriter = dynamic(() => import("typewriter-effect"), {
  ssr: false,
});

export default Typewriter;
