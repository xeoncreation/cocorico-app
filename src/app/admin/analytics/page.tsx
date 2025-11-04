import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import AnalyticsClient from "./AnalyticsClient";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  
  // Solo admins pueden ver esta página
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect("/?auth=required");
  }

  // Métricas de uso de IA (últimos 7 días)
  const { data: aiMessages } = await supabase
    .from("messages")
    .select("created_at, role")
    .gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString())
    .order("created_at", { ascending: true });

  // Agrupar mensajes por día
  const aiUsageByDay = aiMessages?.reduce((acc: any, msg: any) => {
    const day = new Date(msg.created_at).toLocaleDateString("es-ES", { 
      month: "short", 
      day: "numeric" 
    });
    if (!acc[day]) acc[day] = { day, user: 0, assistant: 0, total: 0 };
    if (msg.role === "user") acc[day].user++;
    if (msg.role === "assistant") acc[day].assistant++;
    acc[day].total++;
    return acc;
  }, {});

  const aiChartData = Object.values(aiUsageByDay || {});

  // Métricas de eventos (stats table)
  const { data: events } = await supabase
    .from("stats")
    .select("event")
    .gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString());

  const eventCounts = events?.reduce((acc: any, e: any) => {
    acc[e.event] = (acc[e.event] || 0) + 1;
    return acc;
  }, {});

  const eventChartData = Object.entries(eventCounts || {}).map(([name, value]) => ({
    name,
    value: value as number,
  }));

  // Contadores totales
  const { count: totalUsers } = await supabase
    .from("user_profiles")
    .select("*", { count: "exact", head: true });

  const { count: totalRecipes } = await supabase
    .from("recipes")
    .select("*", { count: "exact", head: true });

  const { count: totalMessages } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true });

  return (
    <AnalyticsClient
      aiChartData={aiChartData as any}
      eventChartData={eventChartData as any}
      totalUsers={totalUsers || 0}
      totalRecipes={totalRecipes || 0}
      totalMessages={totalMessages || 0}
      totalEvents={events?.length || 0}
      eventTypes={Object.keys(eventCounts || {}).length}
    />
  );
}
