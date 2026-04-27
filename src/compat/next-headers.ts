import { getRequestHeaders } from "@tanstack/start-server-core";

export async function headers() {
  const requestHeaders = getRequestHeaders();
  return new Headers(requestHeaders as unknown as HeadersInit);
}
