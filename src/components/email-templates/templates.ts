// brand colors (matching globals.css OKLCH values)
const brandColors = {
  primary: "#0891b2", // cyan-600
  foreground: "#1e293b", // slate-800
  background: "#f8fafc", // slate-50
  card: "#ffffff",
  textMuted: "#64748b", // slate-500
  border: "#e2e8f0", // slate-200
  accent: "#ecfeff", // cyan-50
};

// Common styles
const styles = {
  container: `width: 100%; padding: 40px 0; background-color: ${brandColors.background}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;`,

  card: `max-width: 560px; margin: 0 auto; background-color: ${brandColors.card}; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); border: 1px solid ${brandColors.border}; padding: 48px 32px;`,

  logo: `font-size: 28px; font-weight: 900; color: ${brandColors.primary}; margin-bottom: 32px; text-align: center; letter-spacing: -0.025em;`,

  heading: `margin-top: 0; margin-bottom: 16px; color: ${brandColors.foreground}; font-size: 24px; font-weight: 800; text-align: center;`,

  text: `margin-bottom: 24px; color: ${brandColors.textMuted}; font-size: 16px; line-height: 1.6; text-align: center;`,

  otpContainer: `margin: 32px 0; text-align: center;`,

  otp: `display: inline-block; padding: 16px 36px; background-color: ${brandColors.accent}; color: ${brandColors.primary}; font-size: 32px; font-weight: 800; border-radius: 12px; border: 2px dashed ${brandColors.primary}; letter-spacing: 0.25em;`,

  footer: `padding-top: 32px; border-top: 1px solid ${brandColors.border}; text-align: center; color: ${brandColors.textMuted}; font-size: 13px; margin-top: 40px;`,

  footerText: `margin-bottom: 8px;`,
};
/**
 * Password reset OTP email template.
 * @param otp - The one-time password.
 * @param email - The user's email address.
 * @returns The password reset OTP email as an HTML string.
 */
export function getPasswordResetOTPEmail({
  otp,
  email,
}: {
  otp: string;
  email: string;
}) {
  return `
    <div style="${styles.container}">
      <div style="${styles.card}">
        <div style="${styles.logo}">VibeCards</div>
        <h1 style="${styles.heading}">Reset Your Access</h1>
        <p style="${styles.text}">
          We received a request to reset the password for your VibeCards account
          associated with <strong>${email}</strong>. Use the code below to set
          things right.
        </p>
        <div style="${styles.otpContainer}">
          <div style="${styles.otp}">${otp}</div>
        </div>
        <p style="${styles.text}">
          This code will expire in 1 hour. If you didn't request this, you
          can safely ignore this email—your current password will stay exactly
          as it is.
        </p>
        <div style="${styles.footer}">
          <p style="${styles.footerText}">
            We're committed to your security. No selling out, ever.
          </p>
          <p>&copy; ${new Date().getFullYear()} VibeCards. Built with trust.</p>
        </div>
      </div>
    </div>
  `;
}

export function getSignInOTPEmail({ otp }: { otp: string }) {
  return `
    <div style="${styles.container}">
      <div style="${styles.card}">
        <div style="${styles.logo}">VibeCards</div>
        <h1 style="${styles.heading}">Welcome Back to the Flow</h1>
        <p style="${styles.text}">
          Ready to jump back into your study magic? Use the code below to sign in
          securely to your VibeCards account.
        </p>
        <div style="${styles.otpContainer}">
          <div style="${styles.otp}">${otp}</div>
        </div>
        <p style="${styles.text}">
          This code is valid for 5 minutes. If you didn't request this,
          don't sweat it—your account is still safe. Just ignore this email.
        </p>
        <div style="${styles.footer}">
          <p style="${styles.footerText}">
            We value your privacy. Your data is your business.
          </p>
          <p>&copy; ${new Date().getFullYear()} VibeCards. Stay vibey.</p>
        </div>
      </div>
    </div>
  `;
}

export function getVerificationOTPEmail({ otp }: { otp: string }) {
  return `
    <div style="${styles.container}">
      <div style="${styles.card}">
        <div style="${styles.logo}">VibeCards</div>
        <h1 style="${styles.heading}">Time to Lock in Your Vibe</h1>
        <p style="${styles.text}">
          Welcome to the circle! We're stoked to have you here. To keep
          your notes safe and your study sessions flowing, we just need to
          verify it's really you.
        </p>
        <div style="${styles.otpContainer}">
          <div style="${styles.otp}">${otp}</div>
        </div>
        <p style="${styles.text}">
          Drop this code in the app to get started. It'll vanish into the
          digital mist in 5 minutes, so don't wait too long.
        </p>
        <div style="${styles.footer}">
          <p style="${styles.footerText}">
            Didn't sign up for VibeCards? No stress. Just ignore this email
            and nothing will happen.
          </p>
          <p>&copy; ${new Date().getFullYear()} VibeCards. Built with trust.</p>
        </div>
      </div>
    </div>
  `;
}
