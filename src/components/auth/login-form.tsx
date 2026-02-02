"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthActions } from "@/hooks/use-auth-actions";
import { cn } from "@/lib/utils";

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const { sendSignInOTP, handleGoogleSignIn } = useAuthActions();

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setLoading(true);
                            sendSignInOTP(email);
                        }}
                    >
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Field>

                            <Field>
                                <Button type="submit">Login</Button>
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => handleGoogleSignIn()}
                                >
                                    Login with Google
                                </Button>
                                <FieldDescription className="text-center">
                                    Don&apos;t have an account?{" "}
                                    <Link href="/sign-up">Sign up</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
