import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

type Handler = (params: {
  request: NextRequest;
  userId: string;
  userRole: string;
}) => Promise<NextResponse>;

/**
 * Wraps a protected API route handler with session + role guards.
 */
export function requireAuth(handler: Handler, options?: { adminOnly?: boolean }) {
  return async (request: NextRequest) => {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userRole = session.user.role ?? "user";
    if (options?.adminOnly && userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return handler({ request, userId: session.user.id, userRole });
  };
}
