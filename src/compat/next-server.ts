export type NextRequest = Request;
export const NextResponse = {
  next() { return new Response(null, { status: 200 }); },
  redirect(url: string | URL, status = 307) { return Response.redirect(typeof url === "string" ? url : url.toString(), status); }
};
