import { NextRequest, NextResponse } from "next/server";

// Admin API route to create a question
// This route is protected and should only be accessible to admins
// Does not require authentication or checks
export async function POST(req: NextRequest) {
  const key = req.headers.get("x-api-key");

  if (key !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ message: "Success" });
}
