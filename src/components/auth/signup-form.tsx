"use client";

import GoogleLoginButton from "@/components/auth/google-login-button";
import SignupButton from "@/components/auth/signup-button";
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
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthActions } from "@/hooks/use-auth-actions";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { handleSignUp } = useAuthActions();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: signupSchema,
    },
    onSubmit: async ({ value }) => {
      await handleSignUp(value.email, value.password, value.name);
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
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
          >
            <FieldGroup>
              <form.Field name="name">
                {(field) => (
                  <Field
                    data-invalid={
                      !field.state.meta.isValid && field.state.meta.isTouched
                    }
                  >
                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={
                        !field.state.meta.isValid && field.state.meta.isTouched
                      }
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

              <form.Field name="email">
                {(field) => (
                  <Field
                    data-invalid={
                      !field.state.meta.isValid && field.state.meta.isTouched
                    }
                  >
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={
                        !field.state.meta.isValid && field.state.meta.isTouched
                      }
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

              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <form.Field name="password">
                    {(field) => (
                      <Field
                        data-invalid={
                          !field.state.meta.isValid &&
                          field.state.meta.isTouched
                        }
                      >
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input
                          id="password"
                          type="password"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          aria-invalid={
                            !field.state.meta.isValid &&
                            field.state.meta.isTouched
                          }
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

                  <form.Field name="confirmPassword">
                    {(field) => (
                      <Field
                        data-invalid={
                          !field.state.meta.isValid &&
                          field.state.meta.isTouched
                        }
                      >
                        <FieldLabel htmlFor="confirm-password">
                          Confirm Password
                        </FieldLabel>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          aria-invalid={
                            !field.state.meta.isValid &&
                            field.state.meta.isTouched
                          }
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
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>

              <Field>
                <form.Subscribe selector={(state) => state.isSubmitting}>
                  {(isSubmitting) => (
                    <SignupButton isSubmitting={isSubmitting} />
                  )}
                </form.Subscribe>
              </Field>

              <Field>
                <FieldSeparator>Or</FieldSeparator>
                <GoogleLoginButton />
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
