import Typewriter from "../ui/typewriter-wrapper";

export function HeroSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight whitespace-nowrap sm:text-7xl lg:text-8xl">
        Master Any Topic in{" "}
        <span className="from-primary bg-linear-to-r to-purple-400 bg-clip-text text-transparent">
          <Typewriter
            options={{
              strings: ["Seconds", "Minutes", "Style"],
              autoStart: true,
              loop: true,
              wrapperClassName: "text-primary",
            }}
          />
        </span>
      </h1>

      <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed sm:text-xl">
        Transform your topics into comprehensive study decks instantly.
        <br />
        Powered by Google Gemini.
      </p>
    </div>
  );
}
