import { Link } from "@tanstack/react-router";

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
            Creating Account...
            <Spinner className="ml-2" />
          </>
        ) : (
          <>Create Account</>
        )}
      </Button>
      <FieldDescription className="text-center">
        Already have an account? <Link to="/sign-in">Sign in</Link>
      </FieldDescription>
    </>
  );
}
