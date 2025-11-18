import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/gamification/xp
 * Increment user's XP and recalculate level.
 * Level formula: floor(xp / 100) + 1
 */
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { amount } = body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount. Must be a positive number." },
        { status: 400 }
      );
    }

    // Fetch current xp
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("xp")
      .eq("id", user.id)
      .single();

    if (fetchError) {
      console.error("[xp] Error fetching profile:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch profile" },
        { status: 500 }
      );
    }

    const currentXp = profile?.xp || 0;
    const newXp = currentXp + amount;
    const newLevel = Math.floor(newXp / 100) + 1;

    // Update xp and level
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ xp: newXp, level: newLevel })
      .eq("id", user.id);

    if (updateError) {
      console.error("[xp] Error updating profile:", updateError);
      return NextResponse.json(
        { error: "Failed to update XP" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      xp: newXp,
      level: newLevel,
      awarded: amount,
    });
  } catch (err) {
    console.error("[xp] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
