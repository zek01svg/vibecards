import styles from "@/app/page.module.css";
import authenticate from "@/utils/authenticate";

import { RedirectButton } from "./RedirectButton";

export default async function LandingPageButton() {
    const authResult = await authenticate();
    const isLoggedIn = authResult !== "Unauthorized";

    if (!isLoggedIn) {
        return (
            <div className={styles.ctas}>
                <RedirectButton href="/sign-in" className={styles.primary}>
                    Sign In
                </RedirectButton>
                <RedirectButton href="/sign-up" className={styles.secondary}>
                    Sign Up
                </RedirectButton>
            </div>
        );
    }

    return (
        <div className={styles.ctas}>
            <RedirectButton href="/dashboard" className={styles.primary}>
                Dashboard
            </RedirectButton>
        </div>
    );
}
