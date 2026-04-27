"use client";

import { useSearchParams } from "next/navigation";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuthActions } from "@/hooks/use-auth-actions";
import { otpSchema } from "@/lib/validations/otp";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { Spinner } from "../ui/spinner";

export function OTPForm({ ...props }: React.ComponentProps<typeof Card>) {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const type = searchParams.get("type") as
    | "sign-in"
    | "email-verification"
    | "forget-password"
    | null;

  const { verifySignInOTP, verifyEmail, resendOTP } = useAuthActions();

  const form = useForm({
    defaultValues: {
      otp: "",
    },
    onSubmit: async ({ value }) => {
      if (!email || !type) {
        toast.error("Invalid verification request");
        return;
      }

      try {
        if (type === "sign-in") {
          await verifySignInOTP(email, value.otp);
        } else {
          await verifyEmail(email, value.otp);
        }
        toast.success("Verified successfully");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Verification failed",
        );
      }
    },
  });

  const handleResend = async () => {
    if (!email || !type) {
      toast.error("Cannot resend code: missing email or type");
      return;
    }

    try {
      await resendOTP(email, type);
      toast.success("Code resent successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to resend OTP",
      );
    }
  };

  return (
    <Card {...props} className="border-border/50 overflow-hidden shadow-xl">
      <CardHeader className="pb-2 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Verify Identity
        </CardTitle>
        <CardDescription>
          We sent a 6-digit code to{" "}
          <span className="text-foreground font-medium">
            {email || "your email"}
          </span>
          .
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
            <form.Field
              name="otp"
              validators={{
                onChange: ({ value }) => {
                  const result = otpSchema.shape.otp.safeParse(value);
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
                  className="flex flex-col items-center"
                >
                  <FieldLabel htmlFor="otp" className="sr-only">
                    Verification code
                  </FieldLabel>
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <InputOTP
                      maxLength={6}
                      id="otp"
                      value={field.state.value}
                      onChange={(value) => field.handleChange(value)}
                      onBlur={field.handleBlur}
                      containerClassName="justify-center"
                      className="gap-3"
                    >
                      <InputOTPGroup className="gap-2.5">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="border-border/50 bg-background/50 focus-within:ring-primary/20 data-[active=true]:border-primary/50 data-[active=true]:ring-primary/20 h-12 w-10 rounded-xl text-lg font-bold shadow-sm transition-all focus-within:ring-2 data-[active=true]:ring-2"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 ? (
                    <FieldError className="mt-3">
                      {field.state.meta.errors.join(", ")}
                    </FieldError>
                  ) : (
                    <FieldDescription className="mt-3">
                      Enter the 6-digit code sent to your email.
                    </FieldDescription>
                  )}
                </Field>
              )}
            </form.Field>

            <div className="space-y-4">
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
                        Verifying...
                      </>
                    ) : (
                      "Verify Code"
                    )}
                  </Button>
                )}
              </form.Subscribe>

              <p className="text-muted-foreground text-center text-sm">
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-primary font-semibold underline-offset-4 hover:underline"
                >
                  Resend
                </button>
              </p>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
