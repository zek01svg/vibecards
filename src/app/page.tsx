import LandingPageButton from "@/components/ui/LandingPageButton";

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
                    <LandingPageButton />
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
