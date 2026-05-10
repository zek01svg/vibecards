import { env } from "@/lib/env";
import { Resend } from "resend";

import { logger } from "./logger";

const mailer = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  if (!mailer) {
    if (env.NODE_ENV === "development" || env.NODE_ENV === "test") {
      logger.warn(
        "Resend API key not set, skipping email send in non-production environment",
        { to, subject },
      );
      return { id: "mock-email" };
    }

    throw new Error("Resend API key is required in production");
  }

  try {
    const { data } = await mailer.emails.send({
      from: "VibeCards <vibecards@resend.dev>",
      to: [to],
      subject,
      html,
    });

    logger.info("Email sent successfully", { data, to, subject });

    return data;
  } catch (error) {
    logger.error("Failed to send email", { error, to, subject });
    throw error;
  }
}
