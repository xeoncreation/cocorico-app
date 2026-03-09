import Replicate from "replicate";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { applyRateLimit, getRateLimitIdentifier, getClientIP } from "@/lib/rate-limiter";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // Authentication check
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Rate limiting (AI Detection tier - 15 requests per hour)
    const ip = getClientIP(req.headers);
    const identifier = getRateLimitIdentifier(user.id, ip);
    const rateLimitResponse = await applyRateLimit(identifier, 'aiDetection');
    
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const form = await req.formData();
    const file = form.get("image") as unknown as File | null;
    if (!file) return NextResponse.json({ error: "No image provided" }, { status: 400 });

    const buf = Buffer.from(await (file as any).arrayBuffer());
    const base64 = buf.toString("base64");

    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) {
      // Dev fallback
      return NextResponse.json({ ingredients: ["tomate", "cebolla", "huevo"] });
    }

    const replicate = new Replicate({ auth: token });

    const output: any = await replicate.run("ultralytics/yolov8:latest", {
      input: { image: `data:image/jpeg;base64,${base64}` },
    });

    const labels: string[] = output?.[0]?.predictions?.map((p: any) => p?.label) ?? [];
    return NextResponse.json({ ingredients: labels });
  } catch (e: any) {
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ ingredients: ["tomate", "queso"], error: e?.message }, { status: 200 });
    }
    return NextResponse.json({ error: e?.message || "Live vision error" }, { status: 500 });
  }
}
