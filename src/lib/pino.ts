import { env } from "@/lib/env";
import pino from "pino";

const transport =
  env.NODE_ENV === "development"
    ? pino.transport({
        target: "pino-pretty",
        options: {
          colorize: true,
        },
      })
    : undefined;

const logger = pino(
  {
    level: env.NODE_ENV === "development" ? "debug" : "info",
  },
  transport,
);

export default logger;
