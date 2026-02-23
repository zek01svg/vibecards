"use client";

import Link from "next/link";
import GoogleLoginButton from "@/components/auth/google-login-button";
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
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthActions } from "@/hooks/use-auth-actions";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { GalleryVerticalEnd } from "lucide-react";
import { z } from "zod";

import { Spinner } from "../ui/spinner";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { sendSignInOTP } = useAuthActions();

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      await sendSignInOTP(value.email);
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-border/50 overflow-hidden shadow-xl">
        <CardHeader className="flex flex-col items-center gap-2 pb-2 text-center">
          <div className="bg-primary/10 text-primary mb-2 flex size-10 items-center justify-center rounded-xl">
            <GalleryVerticalEnd className="size-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Enter your email to receive a login code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            noValidate
            className="space-y-6"
          >
            <FieldGroup>
              <form.Field name="email">
                {(field) => (
                  <Field
                    data-invalid={
                      !field.state.meta.isValid && field.state.meta.isTouched
                    }
                  >
                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={
                        !field.state.meta.isValid && field.state.meta.isTouched
                      }
                      className="bg-background/50 focus:bg-background transition-colors"
                    />
                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <FieldError>
                          {field.state.meta.errors.join(", ")}
                        </FieldError>
                      )}
                  </Field>
                )}
              </form.Field>

              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <Button
                    type="submit"
                    className="shadow-primary/20 w-full font-bold shadow-lg transition-all active:scale-[0.98]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner />
                        Sending Code...
                      </>
                    ) : (
                      "Login with Email"
                    )}
                  </Button>
                )}
              </form.Subscribe>

              <Field>
                <FieldSeparator>Or continue with</FieldSeparator>
                <div className="grid grid-cols-1 gap-4">
                  <GoogleLoginButton />
                </div>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="text-primary font-semibold underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </div>

      <p className="text-muted-foreground px-8 text-center text-xs leading-relaxed">
        By clicking continue, you agree to our{" "}
        <Link
          href="/terms"
          className="hover:text-primary underline underline-offset-4"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="hover:text-primary underline underline-offset-4"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
