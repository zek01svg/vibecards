import Link from "next/link";

import { Button } from "../ui/button";
import { FieldDescription } from "../ui/field";
import { Spinner } from "../ui/spinner";

interface SignupButtonProps {
  isSubmitting: boolean;
}

export default function SignupButton({ isSubmitting }: SignupButtonProps) {
  return (
    <>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            &quot;Creating Account...&quot;
            <Spinner className="ml-2" />
          </>
        ) : (
          <>&quot;Create Account&quot;</>
        )}
      </Button>
      <FieldDescription className="text-center">
        Already have an account? <Link href="/sign-in">Sign in</Link>
      </FieldDescription>
    </>
  );
}
