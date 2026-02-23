import { env } from "@/lib/env";
import pino from "pino";

const logger = pino(
  pino.transport({
    targets: [
      {
        target: "pino-pretty",
        options: {
          colorize: env.NODE_ENV === "development",
        },
        level: "info",
      },
    ],
  }),
);

export default logger;
