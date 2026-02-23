import styles from "./email.module.css";

export function PasswordResetOTPEmail({
  otp,
  email,
}: {
  otp: string;
  email: string;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>VibeCards</div>
        <h1 className={styles.heading}>Reset Your Access</h1>
        <p className={styles.text}>
          We received a request to reset the password for your VibeCards account
          associated with <strong>{email}</strong>. Use the code below to set
          things right.
        </p>
        <div className={styles.otpContainer}>
          <div className={styles.otp}>{otp}</div>
        </div>
        <p className={styles.text}>
          This code will expire in 1 hour. If you didn&apos;t request this, you
          can safely ignore this email—your current password will stay exactly
          as it is.
        </p>
        <div className={styles.footer}>
          <p className={styles.footerText}>
            We&apos;re committed to your security. No selling out, ever.
          </p>
          <p>&copy; {new Date().getFullYear()} VibeCards. Built with trust.</p>
        </div>
      </div>
    </div>
  );
}
