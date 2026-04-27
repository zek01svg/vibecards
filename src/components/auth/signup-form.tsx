
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
import { signupSchema } from "@/lib/validations/signup";
import { useForm } from "@tanstack/react-form";

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
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) => {
                    const result = signupSchema.shape.name.safeParse(value);
                    if (!result.success) {
                      return result.error.issues[0]?.message;
                    }
                  },
                }}
              >
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

              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    const result = signupSchema.shape.email.safeParse(value);
                    if (!result.success) {
                      return result.error.issues[0]?.message;
                    }
                  },
                }}
              >
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
                  <form.Field
                    name="password"
                    validators={{
                      onChange: ({ value }) => {
                        const result =
                          signupSchema.shape.password.safeParse(value);
                        if (!result.success) {
                          return result.error.issues[0]?.message;
                        }
                      },
                    }}
                  >
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

                  <form.Field
                    name="confirmPassword"
                    validators={{
                      onChangeListenTo: ["password"],
                      onChange: ({ value, fieldApi }) => {
                        const result =
                          signupSchema.shape.confirmPassword.safeParse(value);
                        if (!result.success) {
                          return result.error.issues[0]?.message;
                        }
                        if (value !== fieldApi.form.getFieldValue("password")) {
                          return "Passwords do not match";
                        }
                      },
                    }}
                  >
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
