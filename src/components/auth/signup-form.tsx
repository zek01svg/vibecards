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
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthActions } from "@/hooks/use-auth-actions";
import { signupSchema } from "@/lib/zod-schemas/signup";
import { toast } from "sonner";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const { handleSignUp, handleGoogleSignIn } = useAuthActions();

    return (
        <Card {...props}>
            <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                    Enter your information below to create your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setLoading(true);

                        setNameError("");
                        setEmailError("");
                        setPasswordError("");
                        setConfirmPasswordError("");

                        const result = signupSchema.safeParse({
                            name,
                            email,
                            password,
                            confirmPassword,
                        });

                        if (!result.success) {
                            setLoading(false);
                            const fieldErrors =
                                result.error.flatten().fieldErrors;
                            if (fieldErrors.name)
                                setNameError(fieldErrors.name[0]);
                            if (fieldErrors.email)
                                setEmailError(fieldErrors.email[0]);
                            if (fieldErrors.password)
                                setPasswordError(fieldErrors.password[0]);
                            if (fieldErrors.confirmPassword)
                                setConfirmPasswordError(
                                    fieldErrors.confirmPassword[0],
                                );

                            toast.error("Please check your input");
                            return;
                        }

                        try {
                            await handleSignUp(email, password, name);
                        } catch (error: any) {
                            toast.error(
                                error.message || "Something went wrong",
                            );
                        } finally {
                            setLoading(false);
                        }
                    }}
                >
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="name">Full Name</FieldLabel>
                            <Input
                                id="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <FieldError errors={[{ message: nameError }]} />
                        </Field>
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
                            <FieldDescription>
                                We&apos;ll use this to contact you. We will not
                                share your email with anyone else.
                            </FieldDescription>
                            <FieldError errors={[{ message: emailError }]} />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <FieldDescription>
                                Must be at least 8 characters long.
                            </FieldDescription>
                            <FieldError errors={[{ message: passwordError }]} />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="confirm-password">
                                Confirm Password
                            </FieldLabel>
                            <Input
                                id="confirm-password"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                            <FieldDescription>
                                Please confirm your password.
                            </FieldDescription>
                            <FieldError
                                errors={[{ message: confirmPasswordError }]}
                            />
                        </Field>
                        <FieldGroup>
                            <Field>
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Creating..." : "Create Account"}
                                </Button>
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={async () =>
                                        await handleGoogleSignIn()
                                    }
                                >
                                    Sign up with Google
                                </Button>
                                <FieldDescription className="px-6 text-center">
                                    Already have an account?{" "}
                                    <Link href="/sign-in">Sign in</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
