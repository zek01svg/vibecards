import * as React from "react";
import { Link } from "@tanstack/react-router";

type Props = React.ComponentProps<typeof Link> & { href: string };

const NextLink = React.forwardRef<HTMLAnchorElement, Props>(function NextLink({ href, children, ...props }, ref) {
  return <Link ref={ref} to={href} {...props}>{children}</Link>;
});

export default NextLink;
