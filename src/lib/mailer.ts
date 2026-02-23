import { env } from "@/lib/env";
import logger from "@/lib/pino";
import { Resend } from "resend";

const mailer = new Resend(env.RESEND_API_KEY);

/**
 * Sends an email using Resend.
 * @param to - The recipient's email address.
 * @param subject - The subject line of the email.
 * @param htmlContent - The HTML body of the email.
 */
export async function sendEmail({
  to,
  subject,
  htmlContent,
}: {
  to: string;
  subject: string;
  htmlContent: string;
}) {
  if (!mailer) {
    throw new Error(
      "Resend email client is not initialized. Check the Resend API key.",
    );
  }

  const message = {
    from: "Vibecards <vibecards@resend.dev>",
    to: [to],
    subject: subject,
    html: htmlContent,
  };

  logger.info({ to, subject }, "Sending email");

  const { data, error } = await mailer.emails.send(message);

  if (error) {
    logger.error({ to, subject, err: error }, "Failed to send email");
    throw new Error(error.message);
  }

  logger.info({ to, emailId: data?.id }, "Email sent successfully");

  return data;
}
