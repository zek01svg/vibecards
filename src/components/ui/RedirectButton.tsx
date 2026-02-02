"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface RedirectButtonProps extends React.ComponentProps<typeof Button> {
    href: string;
    children: React.ReactNode;
    loadingText?: string;
}

export function RedirectButton({
    href,
    children,
    className,
    variant,
    loadingText = "Redirecting",
    ...props
}: RedirectButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleClick = (e: React.MouseEvent) => {
        setIsLoading(true);
    };

    return (
        <Button
            className={cn(className)}
            variant={variant}
            disabled={isLoading}
            asChild={!isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    {loadingText}
                    <Spinner className="ml-2" />
                </>
            ) : (
                <Link href={href} onClick={handleClick}>
                    {children}
                </Link>
            )}
        </Button>
    );
}
