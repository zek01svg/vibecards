"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import styles from "./header.module.css";

export function Header() {
    const { isSignedIn } = useUser();

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>✨</span>
                    <span className={styles.logoText}>VibeCards</span>
                </Link>

                <nav className={styles.nav}>
                    {isSignedIn ? (
                        <>
                            <Link href="/dashboard" className={styles.navLink}>
                                Dashboard
                            </Link>
                            <div className={styles.userSection}>
                                <UserButton
                                    afterSignOutUrl="/"
                                    appearance={{
                                        elements: {
                                            avatarBox: styles.userAvatar,
                                        },
                                    }}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <Link href="/sign-in" className={styles.navLink}>
                                Sign In
                            </Link>
                            <Link href="/sign-up" className={styles.navButton}>
                                Get Started
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
