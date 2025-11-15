import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const theme = url.searchParams.get("theme"); // "free" | "premium" | null
  
  if (theme !== "free" && theme !== "premium") {
    return new NextResponse("Use ?theme=free|premium", { status: 400 });
  }
  
  const res = new NextResponse("OK");
  res.cookies.set("force_theme", theme, { 
    path: "/", 
    httpOnly: false, 
    sameSite: "lax" 
  });
  
  return res;
}
