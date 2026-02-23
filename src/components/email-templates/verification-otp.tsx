import styles from "./email.module.css";

export function VerificationOTPEmail({ otp }: { otp: string }) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>VibeCards</div>
        <h1 className={styles.heading}>Time to Lock in Your Vibe</h1>
        <p className={styles.text}>
          Welcome to the circle! We&apos;re stoked to have you here. To keep
          your notes safe and your study sessions flowing, we just need to
          verify it&apos;s really you.
        </p>
        <div className={styles.otpContainer}>
          <div className={styles.otp}>{otp}</div>
        </div>
        <p className={styles.text}>
          Drop this code in the app to get started. It&apos;ll vanish into the
          digital mist in 5 minutes, so don&apos;t wait too long.
        </p>
        <div className={styles.footer}>
          <p className={styles.footerText}>
            Didn&apos;t sign up for VibeCards? No stress. Just ignore this email
            and nothing will happen.
          </p>
          <p>&copy; {new Date().getFullYear()} VibeCards. Built with trust.</p>
        </div>
      </div>
    </div>
  );
}
