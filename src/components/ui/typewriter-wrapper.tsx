"use client";

import dynamic from "next/dynamic";

const Typewriter = dynamic(() => import("typewriter-effect"), {
    ssr: false,
});

export default Typewriter;
