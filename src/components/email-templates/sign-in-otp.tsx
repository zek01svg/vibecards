import styles from "./email.module.css";

export function SignInOTPEmail({ otp }: { otp: string }) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>VibeCards</div>
        <h1 className={styles.heading}>Welcome Back to the Flow</h1>
        <p className={styles.text}>
          Ready to jump back into your study magic? Use the code below to sign
          in securely to your VibeCards account.
        </p>
        <div className={styles.otpContainer}>
          <div className={styles.otp}>{otp}</div>
        </div>
        <p className={styles.text}>
          This code is valid for 5 minutes. If you didn&apos;t request this,
          don&apos;t sweat it—your account is still safe. Just ignore this
          email.
        </p>
        <div className={styles.footer}>
          <p className={styles.footerText}>
            We value your privacy. Your data is your business.
          </p>
          <p>&copy; {new Date().getFullYear()} VibeCards. Stay vibey.</p>
        </div>
      </div>
    </div>
  );
}
