import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import styles from "./page.module.css";

export default function Home() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className={styles.intro}>
                    <h1>VibeCards</h1>
                    <p className={styles.subtitle}>
                        AI-powered flashcards for learning. Generate
                        personalized study decks from any topic.
                    </p>
                </div>

                <div className={styles.authSection}>
                    <SignedOut>
                        <div className={styles.ctas}>
                            <Link href="/sign-in" className={styles.primary}>
                                Sign In
                            </Link>
                            <Link href="/sign-up" className={styles.secondary}>
                                Sign Up
                            </Link>
                        </div>
                    </SignedOut>
                    <SignedIn>
                        <div className={styles.signedIn}>
                            <UserButton afterSignOutUrl="/" />
                            <Link href="/dashboard" className={styles.primary}>
                                Go to Dashboard
                            </Link>
                        </div>
                    </SignedIn>
                </div>

                <div className={styles.features}>
                    <div className={styles.feature}>
                        <h3>AI-Powered</h3>
                        <p>
                            Generate flashcards automatically from any topic or
                            notes
                        </p>
                    </div>
                    <div className={styles.feature}>
                        <h3>Personalized</h3>
                        <p>
                            Your decks are saved and organized for easy access
                        </p>
                    </div>
                    <div className={styles.feature}>
                        <h3>Simple</h3>
                        <p>Clean, minimal interface focused on learning</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
