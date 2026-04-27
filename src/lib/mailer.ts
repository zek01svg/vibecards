import { env } from "@/lib/env";
import { Resend } from "resend";

import logger from "./pino";

const mailer = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  if (!mailer) {
    logger.warn({ to, subject }, "Resend API key not set, skipping email send");
    return { id: "mock-email" };
  }

  try {
    const { data } = await mailer.emails.send({
      from: "VibeCards <vibecards@resend.dev>",
      to: [to],
      subject,
      html,
    });

    logger.info({ data, to, subject }, "Email sent successfully");

    return data;
  } catch (error) {
    logger.error({ error, to, subject }, "Failed to send email");
    throw error;
  }
}
