import { env } from "@/lib/env";
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

    const { data, error } = await mailer.emails.send(message);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

// brand colors
const brandColors = {
    primary: "#7e22ce", // purple-600
    primaryLight: "#9333ea", // purple-500
    background: "#f3f4f6", // gray-100
    card: "#ffffff",
    text: "#111827", // gray-900
    textMuted: "#6b7280", // gray-500
    border: "#e5e7eb", // gray-200
};

// Common styles
const styles = {
    body: `margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: ${brandColors.background}; color: ${brandColors.text};`,

    container: `width: 100%; padding: 40px 0; background-color: ${brandColors.background};`,

    card: `max-width: 600px; margin: 0 auto; background-color: ${brandColors.card}; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); border: 1px solid ${brandColors.border};`,

    header: `padding: 40px 0; text-align: center; border-bottom: 1px solid ${brandColors.border}; background: linear-gradient(135deg, #f3e8ff 0%, #ffffff 100%);`,

    title: `margin: 0; color: ${brandColors.primary}; font-size: 32px; font-weight: 800; letter-spacing: -0.025em;`,

    content: `padding: 40px 30px; font-size: 16px; line-height: 1.6; color: ${brandColors.text};`,

    heading: `margin-top: 0; margin-bottom: 20px; color: ${brandColors.text}; font-size: 24px; font-weight: 700;`,

    paragraph: `margin-bottom: 24px; color: ${brandColors.textMuted};`,

    buttonContainer: `text-align: center; margin: 32px 0;`,

    otp: `display: inline-block; padding: 16px 36px; background-color: ${brandColors.background}; color: ${brandColors.primary}; font-size: 32px; font-weight: 700; border-radius: 12px; border: 2px dashed ${brandColors.primary}; letter-spacing: 0.2em;`,

    footer: `padding: 30px; background-color: ${brandColors.background}; border-top: 1px solid ${brandColors.border}; text-align: center; color: ${brandColors.textMuted}; font-size: 12px;`,
};

/**
 * Generates the HTML for the verification email
 * @param email - The verification email
 * @param otp - The verification OTP
 * @returns HTML string
 */
export function getVerificationOTPEmail(email: string, otp: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
</head>
<body style="${styles.body}">
    <div style="${styles.container}">
        <div style="${styles.card}">
            <div style="${styles.header}">
                <h1 style="${styles.title}">VibeCards</h1>
            </div>
            <div style="${styles.content}">
                <h2 style="${styles.heading}">Verify your email address</h2>
                <p style="${styles.paragraph}">
                    Welcome to VibeCards! matches We're excited to have you on board.
                    Please use the following code to verify your email address:
                </p>
                <div style="${styles.buttonContainer}">
                    <span style="${styles.otp}">${otp}</span>
                </div>
                <p style="${styles.paragraph}">
                    This code will expire in 5 minutes. If you didn't create an account with VibeCards, you can safely ignore this email.
                </p>
            </div>
            <div style="${styles.footer}">
                <p style="margin: 0 0 10px 0;">&copy; ${new Date().getFullYear()} VibeCards. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>`;
}

/**
 * Generates the HTML for the verification email
 * @param email - The verification email
 * @param otp - The verification OTP
 * @returns HTML string
 */
export function getSignInOTPEmail(email: string, otp: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
</head>
<body style="${styles.body}">
    <div style="${styles.container}">
        <div style="${styles.card}">
            <div style="${styles.header}">
                <h1 style="${styles.title}">VibeCards</h1>
            </div>
            <div style="${styles.content}">
                <h2 style="${styles.heading}">Sign in to VibeCards</h2>
                <p style="${styles.paragraph}">
                    Please use the following code to sign in to your account:
                </p>
                <div style="${styles.buttonContainer}">
                    <span style="${styles.otp}">${otp}</span>
                </div>
                <p style="${styles.paragraph}">
                    This code will expire in 5 minutes. If you didn't sign in to your account with VibeCards, you can safely ignore this email.
                </p>
            </div>
            <div style="${styles.footer}">
                <p style="margin: 0 0 10px 0;">&copy; ${new Date().getFullYear()} VibeCards. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>`;
}

/**
 * Generates the HTML for the password reset email
 * @param otp - The password reset OTP
 * @returns HTML string
 */
export function getPasswordResetOTPEmail(email: string, otp: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>
<body style="${styles.body}">
    <div style="${styles.container}">
        <div style="${styles.card}">
            <div style="${styles.header}">
                <h1 style="${styles.title}">VibeCards</h1>
            </div>
            <div style="${styles.content}">
                <h2 style="${styles.heading}">Reset your password</h2>
                <p style="${styles.paragraph}">
                    We received a request to reset the password for your VibeCards account associated with ${email}.
                </p>
                <div style="${styles.buttonContainer}">
                    <span style="${styles.otp}">${otp}</span>
                </div>
                <p style="${styles.paragraph}">
                    Use this code to complete the password reset process. This code will expire in 1 hour.
                </p>
                <p style="${styles.paragraph}">
                    If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
                </p>
            </div>
            <div style="${styles.footer}">
                <p style="margin: 0 0 10px 0;">&copy; ${new Date().getFullYear()} VibeCards. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>`;
}

export function generateWelcomeEmail(): string {
    return ``;
}

export function generateNotificationEmail(): string {
    return ``;
}
